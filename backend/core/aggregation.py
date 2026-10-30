"""
Aggregation helpers that turn raw (pseudonymous) check-ins into the
group-level trend data shown on the public dashboard. Every function
here operates on aggregates only - nothing keyed to a single pseudonym
is exposed by these functions.
"""
from __future__ import annotations

from datetime import timedelta
from typing import List

import pandas as pd

from models.schemas import (
    WeeklyTrendPoint,
    SummaryMetrics,
    AcademicWeekPoint,
    MoodDistribution,
)

MOOD_LABELS = {1: "Very Low", 2: "Low", 3: "Neutral", 4: "Good", 5: "Very Good"}


def weekly_trends(df: pd.DataFrame) -> List[WeeklyTrendPoint]:
    if df.empty:
        return []

    work = df.copy()
    work["week_start"] = work["timestamp"].dt.to_period("W-MON").dt.start_time

    agg_dict = {
        "mood": "mean",
        "workload": "mean",
        "id": "count",
    }

    # Handle sleep_quality column if it exists
    if "sleep_quality" in work.columns:
        agg_dict["sleep_quality"] = "mean"

    grouped = (
        work.groupby("week_start")
        .agg(**{
            "avg_mood": ("mood", "mean"),
            "avg_workload": ("workload", "mean"),
            "avg_sleep": ("sleep_quality", "mean") if "sleep_quality" in work.columns else ("mood", lambda x: 3.0),
            "checkin_count": ("id", "count"),
        })
        .reset_index()
        .sort_values("week_start")
    )

    points: List[WeeklyTrendPoint] = []
    for i, row in enumerate(grouped.itertuples(), start=1):
        points.append(
            WeeklyTrendPoint(
                week_label=f"Week {i}",
                week_start=row.week_start.date(),
                avg_mood=round(float(row.avg_mood), 2),
                avg_workload=round(float(row.avg_workload), 2),
                avg_sleep=round(float(row.avg_sleep), 2),
                checkin_count=int(row.checkin_count),
            )
        )
    return points


def academic_week_trends(df: pd.DataFrame) -> List[AcademicWeekPoint]:
    """Aggregate trends grouped by academic week number."""
    if df.empty or "academic_week" not in df.columns:
        return []

    work = df.dropna(subset=["academic_week"]).copy()
    if work.empty:
        return []

    grouped = (
        work.groupby("academic_week")
        .agg(
            avg_mood=("mood", "mean"),
            avg_workload=("workload", "mean"),
            avg_sleep=("sleep_quality", "mean") if "sleep_quality" in work.columns else ("mood", lambda x: 3.0),
            checkin_count=("id", "count"),
        )
        .reset_index()
        .sort_values("academic_week")
    )

    points: List[AcademicWeekPoint] = []
    for row in grouped.itertuples():
        points.append(
            AcademicWeekPoint(
                academic_week=int(row.academic_week),
                avg_mood=round(float(row.avg_mood), 2),
                avg_workload=round(float(row.avg_workload), 2),
                avg_sleep=round(float(row.avg_sleep), 2),
                checkin_count=int(row.checkin_count),
            )
        )
    return points


def mood_distribution(df: pd.DataFrame) -> List[MoodDistribution]:
    """Distribution of mood scores across all check-ins."""
    if df.empty:
        return []

    total = len(df)
    dist = []
    for score in range(1, 6):
        count = int((df["mood"] == score).sum())
        dist.append(
            MoodDistribution(
                score=score,
                label=MOOD_LABELS[score],
                count=count,
                percentage=round(count / total * 100, 1),
            )
        )
    return dist


def participation_trend(df: pd.DataFrame) -> list[dict]:
    """Weekly count of unique pseudonyms who submitted check-ins."""
    if df.empty:
        return []

    work = df.copy()
    work["week_start"] = work["timestamp"].dt.to_period("W-MON").dt.start_time

    grouped = (
        work.groupby("week_start")
        .agg(unique_participants=("pseudonym_id", "nunique"), total_checkins=("id", "count"))
        .reset_index()
        .sort_values("week_start")
    )

    result = []
    for i, row in enumerate(grouped.itertuples(), start=1):
        result.append({
            "week_label": f"Week {i}",
            "week_start": row.week_start.date().isoformat(),
            "unique_participants": int(row.unique_participants),
            "total_checkins": int(row.total_checkins),
        })
    return result


def summary_metrics(df: pd.DataFrame, active_flags: int) -> SummaryMetrics:
    if df.empty:
        return SummaryMetrics(
            total_checkins=0,
            unique_pseudonyms=0,
            avg_mood_last_7d=None,
            avg_workload_last_7d=None,
            avg_sleep_last_7d=None,
            pct_low_mood_last_7d=None,
            active_flags=active_flags,
            checkins_this_week=0,
            participation_rate=None,
        )

    now = pd.Timestamp.utcnow().tz_localize(None)
    last_7 = df[df["timestamp"] >= now - timedelta(days=7)]

    avg_mood = round(float(last_7["mood"].mean()), 2) if not last_7.empty else None
    avg_workload = round(float(last_7["workload"].mean()), 2) if not last_7.empty else None
    avg_sleep = None
    if not last_7.empty and "sleep_quality" in last_7.columns:
        avg_sleep = round(float(last_7["sleep_quality"].mean()), 2)
    pct_low = (
        round(float((last_7["mood"] <= 2).mean()) * 100, 1) if not last_7.empty else None
    )

    checkins_this_week = int(len(last_7))

    # Participation rate: what % of known pseudonyms checked in last 7 days
    total_pseudonyms = int(df["pseudonym_id"].nunique())
    recent_pseudonyms = int(last_7["pseudonym_id"].nunique()) if not last_7.empty else 0
    participation_rate = round(recent_pseudonyms / total_pseudonyms * 100, 1) if total_pseudonyms > 0 else None

    return SummaryMetrics(
        total_checkins=int(len(df)),
        unique_pseudonyms=int(df["pseudonym_id"].nunique()),
        avg_mood_last_7d=avg_mood,
        avg_workload_last_7d=avg_workload,
        avg_sleep_last_7d=avg_sleep,
        pct_low_mood_last_7d=pct_low,
        active_flags=active_flags,
        checkins_this_week=checkins_this_week,
        participation_rate=participation_rate,
    )
