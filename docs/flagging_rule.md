# Flagging Rule

This document is the single source of truth for how and why a pseudonym
gets routed to human counselor review. The implementation lives in
`backend/core/flagging.py` and the thresholds in `backend/core/config.py`
— both are intentionally written to read the same as this document.

## Design goals

1. **Conservative** — prefer under-flagging to false alarms. Every flag
   costs a counselor's time and touches (pseudonymously) a real student's
   data; flags should be rare and meaningful.
2. **Transparent** — a counselor (or judge, or auditor) can read the rule
   in plain English and understand exactly why any given flag fired.
3. **Non-diagnostic** — the rule only describes a numeric pattern. It
   never infers a cause or a clinical state.
4. **Always human-routed** — tripping the rule creates an entry in a
   review queue. It never triggers an automated message or action.

## Inputs

For a given pseudonym, only its own check-ins within a rolling
**14-day window** (`FLAG_WINDOW_DAYS`) are considered:

- `mood`: 1 (very low) – 5 (very good)
- `workload`: 1 (very light) – 5 (overwhelming)

A pseudonym needs **at least 3 check-ins** (`FLAG_MIN_CHECKINS`) in the
window before the rule evaluates it at all — a single bad day should never
be enough to flag someone.

## The two rules

A pseudonym is flagged if **either** rule below is true. Each flag records
which rule(s) fired and the numbers behind them.

### Rule A — Consecutive low mood

> Flag if the **3 most recent check-ins in a row** (`FLAG_CONSECUTIVE_LOW_MOOD`)
> all have `mood ≤ 2` (`FLAG_MOOD_THRESHOLD`).

This catches a sustained dip that shows up in the student's own most
recent check-ins, regardless of how their workload looks.

### Rule B — Sustained low mood + high workload

> Flag if **60% or more** (`FLAG_LOW_MOOD_RATIO`) of the check-ins in the
> 14-day window have `mood ≤ 2` **and** `workload ≥ 4` (`FLAG_WORKLOAD_THRESHOLD`)
> **at the same time**.

This catches a pattern where low mood and heavy workload are showing up
together repeatedly — a more specific and, we believe, more actionable
signal than either alone.

## Worked example

Pseudonym `anon-cedar-7` has these check-ins in the last 14 days:

| mood | workload |
|------|----------|
| 4    | 2        |
| 1    | 5        |
| 2    | 4        |
| 1    | 5        |
| 2    | 4        |

- Rule A: the last 3 check-ins are `mood = 2, 1, 2` — all ≤ 2 → **fires**.
- Rule B: 4 of 5 check-ins (80%) have `mood ≤ 2` and `workload ≥ 4` → **fires**.

Both reasons are attached to the resulting flag, in this exact language,
so the counselor sees precisely why it appeared.

## Deliberately excluded, on purpose

- **A single low-mood check-in** never flags anyone — everyone has bad
  days.
- **Free-text sentiment analysis** — the system does not collect free
  text at all, specifically to avoid inferring beyond the numbers a
  student explicitly chose.
- **Cross-referencing multiple pseudonyms** to guess identity — flags are
  evaluated strictly per-pseudonym, on that pseudonym's own history only.
- **Any self-harm keyword detection** — this system does not scan for or
  generate self-harm related content in any form; it only reasons over
  1–5 numeric scores.

## Tuning

The thresholds live in one place, `backend/core/config.py`, each with an
inline comment. A campus team adopting this would tune them with input
from their counseling staff — the values shipped here are reasonable
hackathon defaults, not a clinically validated standard.

## Resolution

Every flag lands in the Counselor review queue with status
`pending_review`. A human counselor can mark it `reviewed` or `dismissed`,
optionally with an internal note. The system never changes a flag's
status on its own, and never re-contacts a student based on a flag.
