from fastapi import APIRouter, HTTPException

from models.schemas import FlagReviewUpdate
from utils.data_store import store
from core.flagging import run_flagging_pass

router = APIRouter(prefix="/api/flags", tags=["flags"])


@router.post("/recompute")
def recompute_flags():
    """
    Re-run the documented rule across all current (synthetic) data and
    create any new flags. Idempotent: a pseudonym already pending review
    is not duplicated. Every flag still requires a human counselor
    decision - this endpoint never resolves a flag by itself.
    """
    flagged = run_flagging_pass(store.checkins)
    created = 0
    for pseudonym_id, (reasons, considered) in flagged.items():
        before = len(store.flags)
        store.register_flag(pseudonym_id, reasons, considered)
        if len(store.flags) > before:
            created += 1
    return {"new_flags": created, "total_flags": len(store.flags)}


@router.get("")
def list_flags():
    """The human counselor review queue. Pseudonymous IDs only - never a real identity."""
    return store.list_flags()


@router.patch("/{flag_id}")
def review_flag(flag_id: int, update: FlagReviewUpdate):
    """A human counselor records their decision on a flag."""
    record = store.update_flag(flag_id, update.status, update.counselor_note)
    if record is None:
        raise HTTPException(status_code=404, detail="Flag not found")
    return record
