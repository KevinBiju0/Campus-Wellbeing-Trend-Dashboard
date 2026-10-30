# Architecture

## Overview

```
┌────────────────┐        HTTP/JSON        ┌──────────────────────┐
│  React (Vite)   │ ───────────────────────▶│  FastAPI backend      │
│  frontend       │◀─────────────────────── │  (Python + Pandas)    │
└────────────────┘                          └───────────┬───────────┘
                                                          │
                                             ┌────────────▼────────────┐
                                             │ In-memory DataFrame,     │
                                             │ seeded from              │
                                             │ synthetic_checkins.csv   │
                                             └──────────────────────────┘
```

## Frontend

- **Stack:** React + TypeScript (TSX), Vite, Tailwind CSS, Recharts, Lucide React, React Router.
- **Structure:**
  - `pages/` — one component per route: `CheckIn`, `Dashboard`, `CounselorReview`, `PrivacySafety`.
  - `components/` — shared, presentational pieces (`Layout`, `GlassCard`, `StatCard`, `ScoreSelector`, `TrendChart`, `FlagCard`).
  - `services/api.ts` — the only place that talks to the backend; all pages call through this thin wrapper around `fetch`.
  - `hooks/useAsync.ts` — small hook to load async data with loading/error state and a `refresh()` escape hatch.
  - `types/index.ts` — TypeScript interfaces mirrored from the backend's Pydantic models.
- In development, Vite proxies `/api/*` to `http://localhost:8000` (see `vite.config.ts`), so the frontend never needs to know the backend's port in code.

## Backend

- **Stack:** FastAPI + Pandas, no database (prototype-scale, in-memory).
- **Structure:**
  - `main.py` — app wiring, CORS, router registration.
  - `api/` — thin HTTP routers: `checkins.py`, `dashboard.py`, `flags.py`. Routers validate input (via Pydantic) and delegate logic to `core/`.
  - `core/` — the actual business logic:
    - `aggregation.py` — turns raw check-ins into weekly trend points and summary metrics (group-level only).
    - `flagging.py` — the documented, conservative rule engine (see `docs/flagging_rule.md`).
    - `config.py` — thresholds and settings, all in one place and commented.
  - `models/schemas.py` — Pydantic request/response models. This is also where the "no PII" validation on `pseudonym_id` lives.
  - `utils/data_store.py` — a small in-process store: a Pandas DataFrame of check-ins (seeded from CSV, appended to at runtime) plus a dict of `FlagRecord`s.
  - `utils/synthetic_data_generator.py` — generates `data/synthetic_checkins.csv`. Re-run it any time to get a fresh demo dataset.
  - `data/synthetic_checkins.csv` — the synthetic seed dataset used for the demo.

## Why in-memory instead of a real database?

This is a hackathon prototype built to be read, run, and judged quickly.
Pandas in memory keeps the aggregation and rule logic easy to follow in a
single sitting. The `core/` and `models/` layers are written so that
swapping the storage layer (e.g. for Postgres) would only mean rewriting
`utils/data_store.py` — the routers and business logic would not change.

## Data flow for a single check-in

1. Student submits mood/workload/optional tag under a pseudonym on the **Check-in** page.
2. `POST /api/checkins` validates the payload, appends it to the in-memory DataFrame.
3. The flagging rule (`core/flagging.py`) is re-evaluated **for that pseudonym only**.
4. If a rule trips, a `FlagRecord` is created (or the existing pending one for that pseudonym is reused) and appears in the **Counselor review** queue.
5. The **Trends** dashboard re-aggregates on next load — it only ever shows cohort-level numbers, never anything keyed to one pseudonym.

## Deployment notes

- Frontend: any static host (Vercel, Netlify, GitHub Pages) after `npm run build`; point it at the deployed backend URL via a reverse proxy or by setting `ALLOWED_ORIGINS` on the backend.
- Backend: any Python host that can run `uvicorn main:app` (Render, Railway, Fly.io, a VM). Set `ALLOWED_ORIGINS` to the deployed frontend's origin.
