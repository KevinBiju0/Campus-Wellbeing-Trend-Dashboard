"""
Simple in-process data store for the hackathon prototype.

For a real deployment this would be a proper database. Here, synthetic
check-ins are loaded from CSV at startup into a pandas DataFrame kept in
memory, and new check-ins (from the demo UI) are appended to that same
in-memory frame. Flags are (re)computed on demand from the current data,
and their review status is tracked in a small in-memory dict.

Nothing here stores names, emails, or any identifying information -
only pseudonymous IDs chosen by the (synthetic or demo) student.
"""
from __future__ import annotations

import itertools
from datetime import datetime, timezone
from typing import Dict, List

import pandas as pd

from core.config import CHECKINS_CSV
from models.schemas import FlagRecord

_id_counter = itertools.count(1)
_flag_id_counter = itertools.count(1)


def _load_initial_dataframe() -> pd.DataFrame:
    df = pd.read_csv(CHECKINS_CSV, parse_dates=["timestamp"])
    if not df.empty:
        # Continue the id counter after the max existing id.
        max_id = int(df["id"].max())
        for _ in range(max_id):
            next(_id_counter)
        # Ensure sleep_quality and academic_week columns exist
        if "sleep_quality" not in df.columns:
            df["sleep_quality"] = 3
        if "academic_week" not in df.columns:
            df["academic_week"] = None
    return df


class DataStore:
    def __init__(self) -> None:
        self.checkins: pd.DataFrame = _load_initial_dataframe()
        # flag_id -> FlagRecord, keyed so review status persists across recompute
        self.flags: Dict[int, FlagRecord] = {}
        # pseudonym_id -> flag_id, to avoid duplicate open flags for the same person
        self._open_flag_by_pseudonym: Dict[str, int] = {}

    def add_checkin(
        self,
        pseudonym_id: str,
        mood: int,
        workload: int,
        sleep_quality: int = 3,
        academic_week: int | None = None,
        note_tag: str | None = None,
    ) -> dict:
        new_id = next(_id_counter)
        row = {
            "id": new_id,
            "pseudonym_id": pseudonym_id,
            "mood": mood,
            "workload": workload,
            "sleep_quality": sleep_quality,
            "academic_week": academic_week,
            "note_tag": note_tag or "",
            "timestamp": datetime.now(timezone.utc).replace(tzinfo=None),
        }
        self.checkins = pd.concat([self.checkins, pd.DataFrame([row])], ignore_index=True)
        return row

    def register_flag(self, pseudonym_id: str, reasons: List[dict], checkins_considered: int) -> FlagRecord:
        """Create a new flag, or return the existing pending one for this pseudonym."""
        existing_id = self._open_flag_by_pseudonym.get(pseudonym_id)
        if existing_id is not None and self.flags[existing_id].status == "pending_review":
            return self.flags[existing_id]

        flag_id = next(_flag_id_counter)
        record = FlagRecord(
            flag_id=flag_id,
            pseudonym_id=pseudonym_id,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
            reasons=reasons,
            checkins_considered=checkins_considered,
            status="pending_review",
        )
        self.flags[flag_id] = record
        self._open_flag_by_pseudonym[pseudonym_id] = flag_id
        return record

    def list_flags(self) -> List[FlagRecord]:
        return sorted(self.flags.values(), key=lambda f: f.created_at, reverse=True)

    def update_flag(self, flag_id: int, status: str, counselor_note: str | None) -> FlagRecord | None:
        record = self.flags.get(flag_id)
        if record is None:
            return None
        record.status = status
        record.counselor_note = counselor_note
        record.reviewed_at = datetime.now(timezone.utc).replace(tzinfo=None)
        self.flags[flag_id] = record
        return record


# Single shared instance for the lifetime of the process (prototype-scale).
store = DataStore()
