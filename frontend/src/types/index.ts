/* ── Check-in ─────────────────────────────────────────────── */

export interface CheckInPayload {
  pseudonym_id: string;
  mood: number;
  workload: number;
  sleep_quality: number;
  academic_week?: number;
  note_tag?: string;
}

/* ── Dashboard ────────────────────────────────────────────── */

export interface WeeklyTrendPoint {
  week_label: string;
  week_start: string;
  avg_mood: number;
  avg_workload: number;
  avg_sleep: number;
  checkin_count: number;
}

export interface AcademicWeekPoint {
  academic_week: number;
  avg_mood: number;
  avg_workload: number;
  avg_sleep: number;
  checkin_count: number;
}

export interface MoodDistribution {
  score: number;
  label: string;
  count: number;
  percentage: number;
}

export interface ParticipationPoint {
  week_label: string;
  week_start: string;
  unique_participants: number;
  total_checkins: number;
}

export interface SummaryMetrics {
  total_checkins: number;
  unique_pseudonyms: number;
  avg_mood_last_7d: number | null;
  avg_workload_last_7d: number | null;
  avg_sleep_last_7d: number | null;
  pct_low_mood_last_7d: number | null;
  active_flags: number;
  checkins_this_week: number;
  participation_rate: number | null;
}

/* ── Flags ────────────────────────────────────────────────── */

export interface FlagReason {
  rule: string;
  detail: string;
}

export interface FlagRecord {
  flag_id: number;
  pseudonym_id: string;
  created_at: string;
  reasons: FlagReason[];
  checkins_considered: number;
  status: "pending_review" | "reviewed" | "dismissed";
  counselor_note?: string | null;
  reviewed_at?: string | null;
}

/* ── Constants ────────────────────────────────────────────── */

export const NOTE_TAGS = [
  "exams",
  "assignments",
  "sleep",
  "social",
  "family",
  "sports",
  "part_time_job",
] as const;

export const MOOD_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Very good",
};

export const WORKLOAD_LABELS: Record<number, string> = {
  1: "Very light",
  2: "Light",
  3: "Moderate",
  4: "Heavy",
  5: "Overwhelming",
};

export const SLEEP_LABELS: Record<number, string> = {
  1: "Very poor",
  2: "Poor",
  3: "Fair",
  4: "Good",
  5: "Excellent",
};

export const TAG_LABELS: Record<string, string> = {
  exams: "Exams",
  assignments: "Assignments",
  sleep: "Sleep",
  social: "Social",
  family: "Family",
  sports: "Sports",
  part_time_job: "Part-time job",
};
