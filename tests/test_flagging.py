"""
Unit tests for the conservative flagging rule engine.

Run from the `backend/` directory with:
    pytest ../tests/test_flagging.py
or from repo root with the path adjusted / PYTHONPATH set to `backend/`.
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone

import pandas as pd
import pytest

# Make the backend package importable when running tests from repo root.
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from core.flagging import evaluate_pseudonym, run_flagging_pass  # noqa: E402


def make_df(rows):
    """rows: list of (pseudonym, mood, workload, days_ago)"""
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    data = []
    for i, (pseudonym, mood, workload, days_ago) in enumerate(rows):
        data.append(
            {
                "id": i + 1,
                "pseudonym_id": pseudonym,
                "mood": mood,
                "workload": workload,
                "note_tag": "",
                "timestamp": now - timedelta(days=days_ago),
            }
        )
    return pd.DataFrame(data)


def test_no_flag_with_too_few_checkins():
    df = make_df([("anon-a", 1, 5, 1), ("anon-a", 1, 5, 2)])  # only 2 check-ins
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    assert reasons == []


def test_no_flag_for_single_bad_day():
    df = make_df(
        [
            ("anon-a", 1, 5, 1),   # one bad day
            ("anon-a", 4, 2, 3),
            ("anon-a", 5, 1, 5),
            ("anon-a", 4, 2, 7),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    assert reasons == []


def test_flags_on_consecutive_low_mood():
    df = make_df(
        [
            ("anon-a", 2, 3, 1),
            ("anon-a", 1, 3, 3),
            ("anon-a", 2, 3, 5),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    rules = {r["rule"] for r in reasons}
    assert "consecutive_low_mood" in rules


def test_flags_on_sustained_low_mood_high_workload():
    df = make_df(
        [
            ("anon-a", 1, 5, 1),
            ("anon-a", 2, 4, 3),
            ("anon-a", 1, 5, 5),
            ("anon-a", 4, 2, 6),  # one good day mixed in
            ("anon-a", 2, 4, 8),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    rules = {r["rule"] for r in reasons}
    assert "sustained_low_mood_high_workload" in rules


def test_good_mood_never_flags():
    df = make_df(
        [
            ("anon-a", 5, 5, 1),
            ("anon-a", 4, 5, 3),
            ("anon-a", 5, 4, 5),
            ("anon-a", 4, 5, 7),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    assert reasons == []


def test_window_excludes_old_checkins():
    # Bad pattern, but all outside the 14-day window.
    df = make_df(
        [
            ("anon-a", 1, 5, 20),
            ("anon-a", 1, 5, 22),
            ("anon-a", 1, 5, 24),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    assert reasons == []


def test_run_flagging_pass_only_returns_flagged_pseudonyms():
    df = make_df(
        [
            ("anon-a", 1, 5, 1),
            ("anon-a", 1, 5, 3),
            ("anon-a", 1, 5, 5),
            ("anon-b", 5, 1, 1),
            ("anon-b", 4, 2, 3),
            ("anon-b", 5, 1, 5),
        ]
    )
    result = run_flagging_pass(df)
    assert "anon-a" in result
    assert "anon-b" not in result


def test_no_diagnostic_or_self_harm_language_in_reasons():
    """
    A structural safety check: whatever the rule engine produces, it
    must never contain diagnostic or self-harm related wording.
    """
    df = make_df(
        [
            ("anon-a", 1, 5, 1),
            ("anon-a", 1, 5, 3),
            ("anon-a", 1, 5, 5),
        ]
    )
    now = pd.Timestamp.utcnow().tz_localize(None)
    reasons = evaluate_pseudonym(df, "anon-a", now)
    forbidden_terms = [
        "depress", "anxiety disorder", "suicid", "self-harm", "self harm",
        "diagnos", "disorder", "clinical",
    ]
    combined_text = " ".join(r["detail"].lower() for r in reasons)
    for term in forbidden_terms:
        assert term not in combined_text


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))
