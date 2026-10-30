"""
Application configuration.

All values are safe defaults for a local hackathon demo using synthetic
data only. Nothing here handles real student data.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
CHECKINS_CSV = DATA_DIR / "synthetic_checkins.csv"

# CORS - allow the local Vite dev server by default.
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

# --- Flagging rule thresholds (see docs/flagging_rule.md for rationale) ---
# A pseudonymous ID is flagged for human counselor review only if ALL of
# the following hold over a rolling window. This is intentionally
# conservative: it favors under-flagging over false positives, because
# every flag creates work for a human counselor and any contact with a
# student is sensitive.
FLAG_WINDOW_DAYS = 14          # rolling window considered
FLAG_MIN_CHECKINS = 3          # need at least this many check-ins in window
FLAG_MOOD_THRESHOLD = 2        # mood score (1-5) at or below this counts as "low"
FLAG_WORKLOAD_THRESHOLD = 4    # workload score (1-5) at or above this counts as "high"
FLAG_CONSECUTIVE_LOW_MOOD = 3  # N consecutive low-mood check-ins triggers a flag
FLAG_LOW_MOOD_RATIO = 0.6      # OR >=60% of check-ins in window are low-mood AND high-workload

APP_TITLE = "Campus Wellbeing Trend & Referral Dashboard API"
APP_VERSION = "1.0.0"
