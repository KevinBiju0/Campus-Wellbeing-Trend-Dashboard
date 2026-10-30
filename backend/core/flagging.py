"""
Conservative, transparent, rule-based flagging engine.

WHAT THIS DOES:
    Looks only at pseudonymous mood/workload numbers over a rolling window
    and checks them against two documented, human-readable rules (below).
    If a pseudonym trips a rule, a flag is created that routes to the
    counselor review queue. A counselor - a human - decides what, if
    anything, happens next.

WHAT THIS NEVER DOES:
    - It never assigns a diagnosis or clinical label.
    - It never generates or displays self-harm related content.
    - It never claims to know why a student feels a certain way.
    - It never contacts a student directly or automatically.

See docs/flagging_rule.md for the full rationale and worked examples.
"""
from __future__ import annotations

from datetime import timedelta
from typing import List

import pandas as pd

from core.config import (
    FLAG_WINDOW_DAYS,
    FLAG_MIN_CHECKINS,
    FLAG_MOOD_THRESHOLD,
    FLAG_WORKLOAD_THRESHOLD,
    FLAG_CONSECUTIVE_LOW_MOOD,
    FLAG_LOW_MOOD_RATIO,
)


def _consecutive_low_mood_streak(mood_series: pd.Series) -> int:
    """Longest streak (most recent first) of mood <= threshold."""
    streak = 0
    for value in reversed(mood_series.tolist()):
        if value <= FLAG_MOOD_THRESHOLD:
            streak += 1
        else:
            break
    return streak


def evaluate_pseudonym(df: pd.DataFrame, pseudonym_id: str, now: pd.Timestamp) -> List[dict]:
    """
    Evaluate ONE pseudonym's recent check-ins against the two documented
    rules. Returns a list of reason dicts (empty list = no flag).
    """
    window_start = now - timedelta(days=FLAG_WINDOW_DAYS)
    person_df = df[
        (df["pseudonym_id"] == pseudonym_id) & (df["timestamp"] >= window_start)
    ].sort_values("timestamp")

    if len(person_df) < FLAG_MIN_CHECKINS:
        return []

    reasons: List[dict] = []

    # Rule A: N or more consecutive low-mood check-ins (most recent check-ins).
    streak = _consecutive_low_mood_streak(person_df["mood"])
    if streak >= FLAG_CONSECUTIVE_LOW_MOOD:
        reasons.append(
            {
                "rule": "consecutive_low_mood",
                "detail": (
                    f"{streak} consecutive check-ins with mood <= {FLAG_MOOD_THRESHOLD} "
                    f"(scale 1-5) within the last {FLAG_WINDOW_DAYS} days."
                ),
            }
        )

    # Rule B: high proportion of check-ins that are BOTH low mood AND high workload.
    both_mask = (person_df["mood"] <= FLAG_MOOD_THRESHOLD) & (
        person_df["workload"] >= FLAG_WORKLOAD_THRESHOLD
    )
    ratio = both_mask.mean() if len(person_df) else 0.0
    if ratio >= FLAG_LOW_MOOD_RATIO:
        reasons.append(
            {
                "rule": "sustained_low_mood_high_workload",
                "detail": (
                    f"{ratio:.0%} of the last {len(person_df)} check-ins "
                    f"(within {FLAG_WINDOW_DAYS} days) combined mood <= {FLAG_MOOD_THRESHOLD} "
                    f"with workload >= {FLAG_WORKLOAD_THRESHOLD}."
                ),
            }
        )

    return reasons


def run_flagging_pass(df: pd.DataFrame) -> dict:
    """
    Evaluate every pseudonym present in the data. Returns a dict of
    pseudonym_id -> (reasons, checkins_considered) for those that trip
    at least one rule. Callers are responsible for turning these into
    FlagRecords and routing them to the human review queue.
    """
    if df.empty:
        return {}

    now = pd.Timestamp.utcnow().tz_localize(None)
    results: dict = {}
    for pseudonym_id in df["pseudonym_id"].unique():
        reasons = evaluate_pseudonym(df, pseudonym_id, now)
        if reasons:
            window_start = now - timedelta(days=FLAG_WINDOW_DAYS)
            considered = df[
                (df["pseudonym_id"] == pseudonym_id) & (df["timestamp"] >= window_start)
            ].shape[0]
            results[pseudonym_id] = (reasons, considered)
    return results
