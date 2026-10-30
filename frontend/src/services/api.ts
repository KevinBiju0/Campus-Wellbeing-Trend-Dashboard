import type {
  CheckInPayload,
  WeeklyTrendPoint,
  SummaryMetrics,
  FlagRecord,
  AcademicWeekPoint,
  MoodDistribution,
  ParticipationPoint,
} from "../types";

// In dev, Vite proxies /api to the FastAPI backend (see vite.config.ts).
const BASE_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  submitCheckIn: (payload: CheckInPayload) =>
    request<{ status: string; id: number }>("/checkins", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTrends: () => request<WeeklyTrendPoint[]>("/dashboard/trends"),

  getSummary: () => request<SummaryMetrics>("/dashboard/summary"),

  getAcademicWeeks: () =>
    request<AcademicWeekPoint[]>("/dashboard/academic-weeks"),

  getMoodDistribution: () =>
    request<MoodDistribution[]>("/dashboard/mood-distribution"),

  getParticipation: () =>
    request<ParticipationPoint[]>("/dashboard/participation"),

  recomputeFlags: () =>
    request<{ new_flags: number; total_flags: number }>("/flags/recompute", {
      method: "POST",
    }),

  getFlags: () => request<FlagRecord[]>("/flags"),

  reviewFlag: (
    flagId: number,
    status: "reviewed" | "dismissed",
    counselor_note?: string
  ) =>
    request<FlagRecord>(`/flags/${flagId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, counselor_note }),
    }),
};
