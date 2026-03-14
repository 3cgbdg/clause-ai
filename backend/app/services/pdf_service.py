from __future__ import annotations

import asyncio
import logging

import pdfplumber

logger = logging.getLogger(__name__)

MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_PDF_PAGES = 50
MIN_EXTRACTED_CHARS = 100


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract plain text from a PDF file.

    Raises ValueError for oversized files, scanned PDFs, or corrupt files.
    Runs synchronously — call via asyncio.to_thread() in async contexts.
    """
    if len(file_bytes) > MAX_PDF_SIZE_BYTES:
        raise ValueError("This PDF is too large (max 10 MB). Try a smaller file.")

    try:
        import io

        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = pdf.pages[:MAX_PDF_PAGES]
            text_parts: list[str] = []

            for page in pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text.strip())

            full_text = "\n\n".join(text_parts)

    except Exception as exc:
        logger.exception("PDF extraction failed: %s", exc)
        raise ValueError(
            "This PDF couldn't be read. Try pasting the contract text directly."
        ) from exc

    # Normalize whitespace
    full_text = " ".join(full_text.split())

    if len(full_text) < MIN_EXTRACTED_CHARS:
        raise ValueError(
            "This PDF appears to be scanned or image-based. "
            "Please paste the contract text manually."
        )

    return full_text


async def extract_text_from_pdf_async(file_bytes: bytes) -> str:
    """Async wrapper — runs pdfplumber in a thread pool to avoid blocking."""
    return await asyncio.to_thread(extract_text_from_pdf, file_bytes)
