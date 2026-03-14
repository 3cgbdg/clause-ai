from __future__ import annotations

import pytest

from app.services.pdf_service import extract_text_from_pdf


class TestPdfService:
    def test_oversized_file_raises_value_error(self) -> None:
        big_bytes = b"x" * (11 * 1024 * 1024)  # 11 MB
        with pytest.raises(ValueError, match="too large"):
            extract_text_from_pdf(big_bytes)

    def test_corrupt_bytes_raises_value_error(self) -> None:
        with pytest.raises(ValueError, match="couldn't be read"):
            extract_text_from_pdf(b"not a valid pdf at all")

    def test_empty_bytes_raises_value_error(self) -> None:
        with pytest.raises(ValueError):
            extract_text_from_pdf(b"")
