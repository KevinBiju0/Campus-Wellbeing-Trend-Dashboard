"""
Pydantic data models shared across the API.

Important design choice: the system never collects student names, emails,
or roll numbers. A "pseudonym_id" is a self-chosen or randomly issued
opaque token that lets the SAME anonymous student be recognised across
check-ins, without identifying who they are. See docs/privacy_and_safety.md.
"""
from datetime import date, datetime
from enum import IntEnum
from typing import Optional, List

from pydantic import BaseModel, Field, field_validator


class MoodScore(IntEnum):
    VERY_LOW = 1
    LOW = 2
    NEUTRAL = 3
    GOOD = 4
    VERY_GOOD = 5


class WorkloadScore(IntEnum):
    VERY_LIGHT = 1
    LIGHT = 2
    MODERATE = 3
    HEAVY = 4
    OVERWHELMING = 5


class SleepQuality(IntEnum):
    VERY_POOR = 1
    POOR = 2
    FAIR = 3
    GOOD = 4
    EXCELLENT = 5


class CheckInCreate(BaseModel):
    """Payload submitted by a student during an anonymous check-in."""

    pseudonym_id: str = Field(
        ...,
        min_length=4,
        max_length=64,
        description="Opaque, student-chosen pseudonymous token. Never a real name/ID.",
    )
    mood: int = Field(..., ge=1, le=5, description="Self-reported mood, 1 (very low) - 5 (very good)")
    workload: int = Field(..., ge=1, le=5, description="Self-reported workload, 1 (very light) - 5 (overwhelming)")
    sleep_quality: int = Field(
        default=3, ge=1, le=5,
        description="Self-reported sleep quality, 1 (very poor) - 5 (excellent)"
    )
    academic_week: Optional[int] = Field(
        default=None, ge=1, le=16,
        description="Current academic week (1-16). Optional."
    )
    note_tag: Optional[str] = Field(
        default=None,
        max_length=32,
        description="Optional short, pre-set tag e.g. 'exams', 'sleep', 'social'. Free-text notes are NOT collected.",
    )

    @field_validator("pseudonym_id")
    @classmethod
    def no_obvious_pii(cls, v: str) -> str:
        v = v.strip()
        if "@" in v:
            raise ValueError("pseudonym_id must not look like an email address")
        return v


class CheckInRecord(CheckInCreate):
    """A stored check-in, with a server-assigned timestamp."""

    id: int
    timestamp: datetime


class WeeklyTrendPoint(BaseModel):
    week_label: str
    week_start: date
    avg_mood: float
    avg_workload: float
    avg_sleep: float
    checkin_count: int


class AcademicWeekPoint(BaseModel):
    academic_week: int
    avg_mood: float
    avg_workload: float
    avg_sleep: float
    checkin_count: int


class MoodDistribution(BaseModel):
    score: int
    label: str
    count: int
    percentage: float


class SummaryMetrics(BaseModel):
    total_checkins: int
    unique_pseudonyms: int
    avg_mood_last_7d: Optional[float]
    avg_workload_last_7d: Optional[float]
    avg_sleep_last_7d: Optional[float]
    pct_low_mood_last_7d: Optional[float]
    active_flags: int
    checkins_this_week: int
    participation_rate: Optional[float]


class FlagReason(BaseModel):
    rule: str
    detail: str


class FlagRecord(BaseModel):
    """
    A conservative, rule-based flag for human counselor review.

    IMPORTANT: A flag is NEVER a diagnosis and NEVER contains self-harm
    related content. It only says "this pseudonymous pattern crossed a
    documented threshold and a human should take a look."
    """

    flag_id: int
    pseudonym_id: str
    created_at: datetime
    reasons: List[FlagReason]
    checkins_considered: int
    status: str = "pending_review"  # pending_review | reviewed | dismissed
    counselor_note: Optional[str] = None
    reviewed_at: Optional[datetime] = None


class FlagReviewUpdate(BaseModel):
    status: str = Field(..., pattern="^(reviewed|dismissed)$")
    counselor_note: Optional[str] = Field(default=None, max_length=500)
