from __future__ import annotations

from pydantic import BaseModel, Field


class AnalyzeTextRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=50,
        max_length=50000,
        description="Contract text to analyze",
    )


class RedFlag(BaseModel):
    clause: str
    concern: str
    severity: str  # "low" | "medium" | "high"


class AnalysisResult(BaseModel):
    attention_score: int = Field(..., ge=1, le=10)
    score_label: str  # "Looks Standard" | "Worth Reviewing" | "Needs Attention"
    contract_type: str
    key_points: list[str]
    red_flags: list[RedFlag]
