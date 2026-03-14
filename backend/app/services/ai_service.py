from __future__ import annotations

import asyncio
import json
import logging
from asyncio import Task
from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from app.config import settings
from app.models.schemas import AnalysisResult, RedFlag
from app.prompts.analyze import STRUCTURED_PROMPT, SUMMARY_PROMPT, SYSTEM_MESSAGE

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    """Return the shared OpenAI client, creating it if needed."""
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def _fetch_structured(text: str) -> AnalysisResult:
    """Call 1 — non-streamed, returns structured JSON result."""
    client = get_client()
    response = await asyncio.wait_for(
        client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.1,
            max_tokens=800,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {
                    "role": "user",
                    "content": STRUCTURED_PROMPT.format(contract_text=text),
                },
            ],
        ),
        timeout=30,
    )
    raw = response.choices[0].message.content or "{}"
    data = json.loads(raw)

    return AnalysisResult(
        attention_score=data.get("attention_score", 5),
        score_label=data.get("score_label", "Worth Reviewing"),
        contract_type=data.get("contract_type", "Contract"),
        key_points=data.get("key_points", []),
        red_flags=[RedFlag(**rf) for rf in data.get("red_flags", [])],
    )


async def _stream_summary(text: str) -> AsyncGenerator[str, None]:
    """Call 2 — streamed, yields plain-text summary tokens."""
    client = get_client()
    stream = await asyncio.wait_for(
        client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.1,
            max_tokens=300,
            stream=True,
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {
                    "role": "user",
                    "content": SUMMARY_PROMPT.format(contract_text=text),
                },
            ],
        ),
        timeout=30,
    )
    async for chunk in stream:
        token = chunk.choices[0].delta.content
        if token:
            yield token


async def analyze_contract_stream(text: str) -> AsyncGenerator[str, None]:
    """
    Main SSE generator. Runs two OpenAI calls concurrently:
    - Streams summary tokens as they arrive (perceived speed).
    - Emits structured result when Call 1 completes.
    - Emits 'done' to close the stream.
    """

    def _sse(section: str, data: object) -> str:
        return f"data: {json.dumps({'section': section, 'data': data})}\n\n"

    structured_task: Task[AnalysisResult] = asyncio.create_task(_fetch_structured(text))

    try:
        # Stream summary tokens from Call 2
        async for token in _stream_summary(text):
            yield _sse("summary_chunk", token)

        # Await structured result from Call 1 (usually done by now)
        result = await structured_task
        yield _sse("result", result.model_dump())

    except TimeoutError:
        logger.error("OpenAI timeout during contract analysis")
        structured_task.cancel()
        yield _sse("error", {"message": "Analysis is taking longer than expected. Please try again."})
        return
    except Exception as exc:
        logger.exception("OpenAI error during contract analysis: %s", exc)
        structured_task.cancel()
        yield _sse(
            "error",
            {"message": "We couldn't analyze this contract right now. Please try again in a moment."},
        )
        return

    yield _sse("done", {})
