from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.rate_limit import limiter
from app.routers import analyze, health
from app.services.ai_service import get_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize shared resources on startup."""
    logger.info("Starting ClauseAI backend...")
    get_client()  # warm up the OpenAI client
    yield
    logger.info("Shutting down ClauseAI backend...")


app = FastAPI(
    title="ClauseAI API",
    description="Contract analysis API — informational summaries, not legal advice.",
    version="0.1.0",
    lifespan=lifespan,
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — allow only the configured frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Routers
app.include_router(health.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
