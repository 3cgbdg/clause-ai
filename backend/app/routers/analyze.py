import logging
from collections.abc import AsyncGenerator
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from slowapi.util import get_remote_address

from app.models.schemas import AnalyzeTextRequest
from app.rate_limit import limiter
from app.services.ai_service import analyze_contract_stream
from app.services.pdf_service import extract_text_from_pdf_async
from app.services.supabase_service import save_analysis

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze")
@limiter.limit("5/minute")
async def analyze_contract(
    request: Request,
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
) -> StreamingResponse:
    """
    Analyze a contract via text paste or PDF upload.
    Returns a Server-Sent Events stream with:
      - summary_chunk events (streamed summary tokens)
      - result event (structured JSON: score, key points, red flags)
      - done event (signals completion)
      - error event (on failure)
    """
    contract_text: str
    # Optional Clerk user ID sent by the frontend for saving history
    user_id: str = request.headers.get("X-User-Id", "")

    if file is not None:
        content_type = file.content_type or ""
        if "pdf" not in content_type.lower():
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        file_bytes = await file.read()
        try:
            contract_text = await extract_text_from_pdf_async(file_bytes)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    elif text is not None:
        contract_text = text.strip()
    else:
        try:
            body = await request.json()
            contract_text = body.get("text", "").strip()
        except Exception:
            raise HTTPException(
                status_code=400, detail="Provide either 'text' (JSON body) or 'file' (PDF upload)."
            )

    try:
        validated = AnalyzeTextRequest(text=contract_text)
        contract_text = validated.text
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    async def _stream_and_save() -> AsyncGenerator[str, None]:
        """Pass through the SSE stream and persist the result when done."""
        import json
        collected_summary = ""
        collected_result: dict = {}

        async for chunk in analyze_contract_stream(contract_text):
            yield chunk
            # Parse the SSE payload to extract data for saving
            if chunk.startswith("data: "):
                try:
                    event = json.loads(chunk[6:])
                    if event.get("section") == "summary_chunk":
                        collected_summary += event.get("data", "")
                    elif event.get("section") == "result":
                        collected_result = event.get("data", {})
                    elif event.get("section") == "done" and user_id and collected_result:
                        await save_analysis(
                            user_id=user_id,
                            contract_type=collected_result.get("contract_type", "Contract"),
                            input_length=len(contract_text),
                            attention_score=collected_result.get("attention_score", 5),
                            score_label=collected_result.get("score_label", ""),
                            summary=collected_summary,
                            key_points=collected_result.get("key_points", []),
                            red_flags=[
                                {"clause": rf.get("clause", ""), "concern": rf.get("concern", ""), "severity": rf.get("severity", "low")}
                                for rf in collected_result.get("red_flags", [])
                            ],
                        )
                except Exception:
                    pass  # Never break the stream due to a save error

    return StreamingResponse(
        _stream_and_save(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
