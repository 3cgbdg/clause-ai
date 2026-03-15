import logging
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.rate_limit import limiter
from app.services.supabase_service import get_user_analyses

logger = logging.getLogger(__name__)
router = APIRouter()


class HistoryItem(BaseModel):
    id: str
    created_at: str
    contract_type: Optional[str] = None
    attention_score: int
    score_label: str
    summary: Optional[str] = None
    key_points: list[str] = []
    red_flags: list[dict[str, Any]] = []


@router.get("/history", response_model=list[HistoryItem])
@limiter.limit("30/minute")
async def get_history(request: Request, user_id: str) -> list[HistoryItem]:
    """
    Return the authenticated user's analysis history.
    The frontend passes the Clerk user_id as a query param.
    In production, validate this against the Clerk JWT — for MVP we trust the client.
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    rows = await get_user_analyses(user_id)
    return [HistoryItem(**row) for row in rows]
