import logging
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from slowapi.util import get_remote_address

from app.models.schemas import AnalyzeTextRequest
from app.rate_limit import limiter
from app.services.ai_service import analyze_contract_stream
from app.services.pdf_service import extract_text_from_pdf_async

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

    if file is not None:
        # PDF upload path
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
        # Try JSON body fallback
        try:
            body = await request.json()
            contract_text = body.get("text", "").strip()
        except Exception:
            raise HTTPException(
                status_code=400, detail="Provide either 'text' (JSON body) or 'file' (PDF upload)."
            )

    # Validate via Pydantic model
    try:
        validated = AnalyzeTextRequest(text=contract_text)
        contract_text = validated.text
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return StreamingResponse(
        analyze_contract_stream(contract_text),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable Nginx buffering for SSE
        },
    )
