from __future__ import annotations

import logging
from typing import Any

from supabase import AsyncClient, acreate_client

from app.config import settings

logger = logging.getLogger(__name__)

_client: AsyncClient | None = None


async def get_supabase() -> AsyncClient | None:
    """Return the shared Supabase client, or None if not configured."""
    global _client
    if not settings.supabase_url or not settings.supabase_service_key:
        return None
    if _client is None:
        _client = await acreate_client(settings.supabase_url, settings.supabase_service_key)
    return _client


async def save_analysis(
    user_id: str,
    contract_type: str,
    input_length: int,
    attention_score: int,
    score_label: str,
    summary: str,
    key_points: list[str],
    red_flags: list[dict[str, Any]],
) -> str | None:
    """
    Persist a completed analysis to Supabase.
    Returns the new row's UUID, or None if Supabase is not configured / on error.
    """
    client = await get_supabase()
    if client is None:
        logger.debug("Supabase not configured — skipping save_analysis")
        return None

    try:
        result = (
            await client.table("analyses")
            .insert(
                {
                    "user_id": user_id,
                    "contract_type": contract_type,
                    "input_length": input_length,
                    "attention_score": attention_score,
                    "score_label": score_label,
                    "summary": summary,
                    "key_points": key_points,
                    "red_flags": red_flags,
                }
            )
            .execute()
        )
        row = result.data[0] if result.data else {}
        analysis_id: str = row.get("id", "")
        logger.info("Saved analysis %s for user %s", analysis_id, user_id)
        return analysis_id
    except Exception as exc:
        logger.error("Failed to save analysis to Supabase: %s", exc)
        return None


async def get_user_analyses(user_id: str, limit: int = 20) -> list[dict[str, Any]]:
    """
    Fetch the most recent analyses for a given user.
    Returns an empty list if Supabase is not configured or on error.
    """
    client = await get_supabase()
    if client is None:
        return []

    try:
        result = (
            await client.table("analyses")
            .select("id, created_at, contract_type, attention_score, score_label, summary, key_points, red_flags")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception as exc:
        logger.error("Failed to fetch analyses from Supabase: %s", exc)
        return []


async def increment_usage(user_id: str) -> int:
    """
    Upsert the monthly usage counter for a user.
    Returns the updated count, or -1 on error.
    """
    client = await get_supabase()
    if client is None:
        return -1

    try:
        # Try to increment an existing row
        result = (
            await client.rpc(
                "increment_usage",
                {"p_user_id": user_id},
            ).execute()
        )
        return int(result.data or 0)
    except Exception as exc:
        logger.error("Failed to increment usage for user %s: %s", user_id, exc)
        return -1
