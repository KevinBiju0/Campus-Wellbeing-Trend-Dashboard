from fastapi import APIRouter, HTTPException

from models.schemas import CheckInCreate
from utils.data_store import store
from core.flagging import run_flagging_pass

router = APIRouter(prefix="/api/checkins", tags=["checkins"])


@router.post("", status_code=201)
def create_checkin(payload: CheckInCreate):
    """
    Record one anonymous, opt-in check-in. No name, email, or roll number
    is ever accepted - only a self-chosen pseudonym and numeric scores.
    """
    try:
        row = store.add_checkin(
            pseudonym_id=payload.pseudonym_id,
            mood=payload.mood,
            workload=payload.workload,
            sleep_quality=payload.sleep_quality,
            academic_week=payload.academic_week,
            note_tag=payload.note_tag,
        )
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=400, detail=str(exc))

    # Re-run the conservative flagging rule for this pseudonym only.
    flagged = run_flagging_pass(store.checkins)
    if payload.pseudonym_id in flagged:
        reasons, considered = flagged[payload.pseudonym_id]
        store.register_flag(payload.pseudonym_id, reasons, considered)

    return {"status": "recorded", "id": row["id"]}


@router.get("/count")
def checkin_count():
    return {"total_checkins": int(len(store.checkins))}
