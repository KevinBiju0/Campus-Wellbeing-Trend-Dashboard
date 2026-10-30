"""
Integration tests for FastAPI backend endpoints.
"""
import sys
from pathlib import Path

from fastapi.testclient import TestClient
import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from main import app  # noqa: E402

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_submit_checkin():
    payload = {
        "pseudonym_id": "anon-pytest-101",
        "mood": 2,
        "workload": 4,
        "sleep_quality": 2,
        "note_tag": "exams",
    }
    response = client.post("/api/checkins", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "recorded"
    assert "id" in data


def test_get_trends():
    response = client.get("/api/dashboard/trends")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_academic_weeks():
    response = client.get("/api/dashboard/academic-weeks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_mood_distribution():
    response = client.get("/api/dashboard/mood-distribution")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5


def test_get_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_checkins" in data
    assert "active_flags" in data


def test_flags_flow():
    # 1. Get flags list
    res = client.get("/api/flags")
    assert res.status_code == 200
    flags = res.json()
    assert isinstance(flags, list)

    # 2. Recompute flags
    res_recompute = client.post("/api/flags/recompute")
    assert res_recompute.status_code == 200

    # 3. If flags exist, review the first flag
    res_updated_flags = client.get("/api/flags")
    updated_flags = res_updated_flags.json()
    if updated_flags:
        flag_id = updated_flags[0]["flag_id"]
        review_payload = {"status": "reviewed", "counselor_note": "Reviewed in automated test."}
        review_res = client.patch(f"/api/flags/{flag_id}", json=review_payload)
        assert review_res.status_code == 200
        assert review_res.json()["status"] == "reviewed"
