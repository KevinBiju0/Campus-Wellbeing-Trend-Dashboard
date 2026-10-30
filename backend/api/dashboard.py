from fastapi import APIRouter

from utils.data_store import store
from core.aggregation import (
    weekly_trends,
    summary_metrics,
    academic_week_trends,
    mood_distribution,
    participation_trend,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/trends")
def get_trends():
    """Aggregate, group-level weekly mood/workload trends. No individual data."""
    return weekly_trends(store.checkins)


@router.get("/summary")
def get_summary():
    """Top-line aggregate metrics for the dashboard header cards."""
    active_flags = sum(1 for f in store.flags.values() if f.status == "pending_review")
    return summary_metrics(store.checkins, active_flags)


@router.get("/academic-weeks")
def get_academic_week_trends():
    """Aggregate trends grouped by academic week number."""
    return academic_week_trends(store.checkins)


@router.get("/mood-distribution")
def get_mood_distribution():
    """Distribution of mood scores across all check-ins."""
    return mood_distribution(store.checkins)


@router.get("/participation")
def get_participation():
    """Weekly participation trend: unique pseudonyms and total check-ins."""
    return participation_trend(store.checkins)
