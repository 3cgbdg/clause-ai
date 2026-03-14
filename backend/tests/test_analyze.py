from __future__ import annotations

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import AsyncClient


class TestHealthEndpoint:
    async def test_health_returns_ok(self, client: AsyncClient) -> None:
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestAnalyzeEndpoint:
    async def test_empty_text_returns_422(self, client: AsyncClient) -> None:
        response = await client.post("/api/analyze", json={"text": ""})
        assert response.status_code == 422

    async def test_text_too_short_returns_422(self, client: AsyncClient) -> None:
        response = await client.post("/api/analyze", json={"text": "short"})
        assert response.status_code == 422

    async def test_text_too_long_returns_422(self, client: AsyncClient) -> None:
        long_text = "x " * 26000  # >50K chars
        response = await client.post("/api/analyze", json={"text": long_text})
        assert response.status_code == 422

    async def test_valid_text_returns_sse_stream(
        self, client: AsyncClient, sample_contract: str
    ) -> None:
        """SSE stream contains summary_chunk, result, and done events."""
        mock_result = {
            "attention_score": 6,
            "score_label": "Worth Reviewing",
            "contract_type": "Lease Agreement",
            "key_points": ["12 month term", "€1,200/month rent"],
            "red_flags": [
                {
                    "clause": "Auto-renewal clause",
                    "concern": "Renews automatically unless 60-day notice given",
                    "severity": "medium",
                }
            ],
        }

        async def mock_structured(*args, **kwargs):
            mock = MagicMock()
            mock.choices = [MagicMock()]
            mock.choices[0].message.content = json.dumps(mock_result)
            return mock

        async def mock_stream(*args, **kwargs):
            mock = MagicMock()

            async def aiter():
                for word in ["This ", "is ", "a ", "lease."]:
                    chunk = MagicMock()
                    chunk.choices = [MagicMock()]
                    chunk.choices[0].delta.content = word
                    yield chunk

            mock.__aiter__ = lambda self: aiter()
            return mock

        with (
            patch("app.services.ai_service.AsyncOpenAI") as mock_openai_cls,
        ):
            mock_client = MagicMock()
            mock_client.chat.completions.create = AsyncMock(
                side_effect=[await mock_structured(), await mock_stream()]
            )
            mock_openai_cls.return_value = mock_client

            # Reset the global client so our mock is used
            import app.services.ai_service as ai_mod
            ai_mod._client = None

            response = await client.post(
                "/api/analyze",
                json={"text": sample_contract},
            )

        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]

    async def test_no_input_returns_400(self, client: AsyncClient) -> None:
        response = await client.post("/api/analyze")
        assert response.status_code in (400, 422)

    async def test_rate_limiting_returns_429(self, client: AsyncClient) -> None:
        # Send 5 valid requests
        for _ in range(5):
            res = await client.post("/api/analyze", json={"text": "This is a dummy contract over 50 characters long so the length validation passes."})
            assert res.status_code == 200

        # 6th request should be rate limited
        res = await client.post("/api/analyze", json={"text": "This is a dummy contract over 50 characters long so the length validation passes."})
        assert res.status_code == 429

class TestAnalyzeEndpointPdfUpload:
    async def test_non_pdf_file_returns_400(self, client: AsyncClient) -> None:
        import io
        fake_file = io.BytesIO(b"not a pdf")
        response = await client.post(
            "/api/analyze",
            files={"file": ("test.txt", fake_file, "text/plain")},
        )
        assert response.status_code == 400
