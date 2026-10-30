"""
Generates backend/data/synthetic_checkins.csv - entirely fabricated data
for demo purposes. No real student data is used anywhere in this project.

Run with:
    python -m utils.synthetic_data_generator

Story baked into the data (for the demo narrative):
  - 10 weeks, semester-style, check-ins roughly every 2-3 days per student.
  - A mid-semester stress spike around week 7 (mood dips, workload rises)
    for most of the cohort - visible on the aggregate trend chart.
  - A small handful of pseudonyms show a SUSTAINED individual pattern
    (not just the mid-sem blip) so the flagging rule has something real
    to catch in the counselor review demo.
  - Sleep quality (1-5) correlates inversely with workload.
  - Academic week (1-16) mapped from the semester timeline.
"""
import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd

random.seed(42)

NUM_STUDENTS = 40
WEEKS = 10
SEMESTER_START = datetime.utcnow() - timedelta(weeks=WEEKS)

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "synthetic_checkins.csv"

TAGS = ["exams", "assignments", "sleep", "social", "family", "sports", "part_time_job", ""]


def make_pseudonym(i: int) -> str:
    animals = [
        "owl", "comet", "lynx", "sparrow", "otter", "falcon", "maple", "cedar",
        "willow", "heron", "badger", "raven", "ember", "quartz", "birch", "wren",
    ]
    return f"anon-{animals[i % len(animals)]}-{i}"


# A few students (by index) deliberately given a sustained low-mood/
# high-workload pattern so the flagging rule has genuine positives to
# surface in the counselor review demo.
AT_RISK_INDICES = {7, 2, 19}
AT_RISK_PSEUDONYMS = {make_pseudonym(i) for i in AT_RISK_INDICES}


def sample_mood_workload_sleep(week_index: int, pseudonym: str) -> tuple[int, int, int]:
    """
    Returns (mood, workload, sleep_quality) all on a 1-5 scale.
    Baseline drifts worse around week 7 (index 6) for everyone (mid-sem
    crunch), and AT_RISK pseudonyms stay bad for several weeks in a row.
    Sleep quality correlates inversely with workload, with some noise.
    """
    mid_sem_dip = 1 if week_index in (5, 6, 7) else 0

    if pseudonym in AT_RISK_PSEUDONYMS and week_index >= 4:
        # Sustained pattern from week 5 onward.
        mood = random.choice([1, 1, 2, 2])
        workload = random.choice([4, 5, 5])
        sleep = random.choice([1, 1, 2, 2])
    else:
        base_mood = 4 - mid_sem_dip
        base_workload = 2 + mid_sem_dip
        mood = min(5, max(1, base_mood + random.randint(-1, 1)))
        workload = min(5, max(1, base_workload + random.randint(-1, 1)))
        # Sleep inversely correlates with workload
        base_sleep = 6 - workload + random.randint(-1, 1)
        sleep = min(5, max(1, base_sleep))

    return mood, workload, sleep


def generate() -> pd.DataFrame:
    rows = []
    checkin_id = 1
    for student_idx in range(1, NUM_STUDENTS + 1):
        pseudonym = make_pseudonym(student_idx)
        for week_index in range(WEEKS):
            # 2-3 check-ins per week, spaced out.
            num_checkins_this_week = random.choice([1, 2, 2, 3])
            for _ in range(num_checkins_this_week):
                day_offset = week_index * 7 + random.randint(0, 6)
                hour_offset = random.randint(8, 21)
                timestamp = SEMESTER_START + timedelta(days=day_offset, hours=hour_offset)
                mood, workload, sleep = sample_mood_workload_sleep(week_index, pseudonym)
                # Academic week is offset from semester start (1-indexed)
                academic_week = min(16, week_index + 1 + random.choice([0, 0, 1]))
                rows.append(
                    {
                        "id": checkin_id,
                        "pseudonym_id": pseudonym,
                        "mood": mood,
                        "workload": workload,
                        "sleep_quality": sleep,
                        "academic_week": academic_week,
                        "note_tag": random.choice(TAGS),
                        "timestamp": timestamp.isoformat(),
                    }
                )
                checkin_id += 1

    df = pd.DataFrame(rows).sort_values("timestamp").reset_index(drop=True)
    df["id"] = range(1, len(df) + 1)
    return df


if __name__ == "__main__":
    df = generate()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Wrote {len(df)} synthetic check-ins to {OUTPUT_PATH}")
