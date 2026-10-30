import { motion } from "framer-motion";
import {
  Users,
  Smile,
  Layers,
  Flag,
  RefreshCcw,
  Calendar,
  BarChart2,
  Info,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import StatCard from "@/components/StatCard";
import TrendChart from "@/components/TrendChart";
import AcademicWeekChart from "@/components/AcademicWeekChart";
import MoodDistributionChart from "@/components/MoodDistributionChart";
import CampusSignalMap from "@/components/CampusSignalMap";

import { useAsync } from "@/hooks/useAsync";
import { api } from "@/services/api";

export default function Dashboard() {
  const trends = useAsync(() => api.getTrends(), []);
  const summary = useAsync(() => api.getSummary(), []);
  const academicWeeks = useAsync(() => api.getAcademicWeeks(), []);
  const moodDistribution = useAsync(() => api.getMoodDistribution(), []);

  const refreshAll = () => {
    trends.refresh();
    summary.refresh();
    academicWeeks.refresh();
    moodDistribution.refresh();
  };

  const pulse = summary.data
    ? Math.round(
        (
          ((summary.data.avg_mood_last_7d ?? 3) / 5) * 0.55 +
          (1 - (summary.data.avg_workload_last_7d ?? 3) / 5) * 0.45
        ) * 100
      )
    : null;

  return (
    <div className="space-y-6 pb-10">

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-dusk-300/10 bg-dusk-950/70 p-6 sm:p-8 surface-grid signal-glow"
      >
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-clover-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="success" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Campus pulse
              </Badge>

              <Badge variant="outline">
                Synthetic demo
              </Badge>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-clover-400">
              Campus wellbeing intelligence
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              See the signal.
              <br />
              <span className="gradient-text">
                Support the campus.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200">
              A privacy-first view of anonymous, aggregate check-ins—built to
              surface patterns early while keeping human counselors in control.
            </p>
          </div>

          {/* CURRENT PULSE */}
          <div className="flex items-center gap-3 rounded-2xl border border-dusk-300/10 bg-white/[.03] px-4 py-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clover-400/10 text-clover-300">
              <ActivityIcon pulse={pulse} />
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                Current pulse
              </div>

              <div className="text-2xl font-semibold text-white">
                {pulse ?? "—"}

                <span className="ml-1 text-xs font-medium text-slate-300">
                  / 100
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* SUMMARY CARDS */}
      {summary.data && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total check-ins"
            value={summary.data.total_checkins.toLocaleString()}
            hint={`${summary.data.unique_pseudonyms} pseudonymous contributors`}
            icon={Layers}
            accent="dusk"
          />

          <StatCard
            label="Avg mood · 7d"
            value={summary.data.avg_mood_last_7d?.toFixed(2) ?? "—"}
            hint="1 very low · 5 very good"
            icon={Smile}
            accent="clover"
          />

          <StatCard
            label="Low mood share"
            value={
              summary.data.pct_low_mood_last_7d != null
                ? `${summary.data.pct_low_mood_last_7d}%`
                : "—"
            }
            hint="Check-ins at mood ≤ 2"
            icon={Users}
            accent="amber"
          />

          <StatCard
            label="Pending review"
            value={summary.data.active_flags.toString()}
            hint="Routed to human review"
            icon={Flag}
            accent="coral"
          />

        </div>
      )}

      {/* CAMPUS SIGNAL MAP */}
      <CampusSignalMap summary={summary.data ?? undefined} />

      {/* TREND HEADER */}
      <div className="flex items-center justify-between gap-3">

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[.18em] text-clover-400">
            Trend intelligence
          </div>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Where the campus signal is moving
          </h2>
        </div>

        <Button
          onClick={refreshAll}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCcw size={14} />
          Refresh
        </Button>

      </div>

      {/* WEEKLY TREND */}
      <Card solid className="p-6">

        <CardHeader className="mb-4 flex flex-row items-center justify-between p-0">

          <div>
            <CardTitle>
              Weekly mood & workload timeline
            </CardTitle>

            <CardDescription className="mt-1 text-slate-300">
              Aggregate movement across the current semester window.
            </CardDescription>
          </div>

          <ShieldCheck
            size={18}
            className="text-clover-300"
          />

        </CardHeader>

        <CardContent className="p-0">

          {trends.loading && (
            <p className="py-16 text-center text-sm text-slate-300">
              Loading trends…
            </p>
          )}

          {trends.error && (
            <p className="py-16 text-center text-sm text-coral-300">
              {trends.error}
            </p>
          )}

          {trends.data &&
            trends.data.length > 0 && (
              <TrendChart data={trends.data} />
            )}

        </CardContent>
      </Card>

      {/* ACADEMIC WEEK + MOOD DISTRIBUTION */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ACADEMIC WEEK */}
        <Card solid className="p-6">

          <CardHeader className="mb-4 flex flex-row items-center gap-3 p-0">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-clover-400/10 text-clover-300">
              <Calendar size={18} />
            </div>

            <div>
              <CardTitle className="text-lg">
                Academic week patterns
              </CardTitle>

              <CardDescription className="text-slate-300">
                Where workload and mood move across W1–W16.
              </CardDescription>
            </div>

          </CardHeader>

          <CardContent className="p-0">

            {academicWeeks.data && (
              <AcademicWeekChart data={academicWeeks.data} />
            )}

          </CardContent>

        </Card>

        {/* MOOD DISTRIBUTION */}
        <Card solid className="p-6">

          <CardHeader className="mb-4 flex flex-row items-center gap-3 p-0">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <BarChart2 size={18} />
            </div>

            <div>
              <CardTitle className="text-lg">
                Mood distribution
              </CardTitle>

              <CardDescription className="text-slate-300">
                Aggregate response mix across mood ratings.
              </CardDescription>
            </div>

          </CardHeader>

          <CardContent className="p-0">

            {moodDistribution.data && (
              <MoodDistributionChart data={moodDistribution.data} />
            )}

          </CardContent>

        </Card>

      </div>

      {/* PRIVACY / INTERPRETATION NOTICE */}
      <Alert variant="info" className="p-5">

        <Info size={18} />

        <AlertDescription className="text-sm leading-relaxed text-slate-200">
          Patterns are intentionally presented at an aggregate level.
          A spike is a planning signal—not a diagnosis—and any documented
          individual pattern is routed to a human counselor for review.
        </AlertDescription>

      </Alert>

    </div>
  );
}

/* -------------------------------------------------------
   ACTIVITY / PULSE INDICATOR
------------------------------------------------------- */

function ActivityIcon({
  pulse,
}: {
  pulse: number | null;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.08, 1],
        opacity: [0.75, 1, 0.75],
      }}
      transition={{
        duration: 2.6,
        repeat: Infinity,
      }}
      className="h-3 w-3 rounded-full bg-clover-300 shadow-[0_0_18px_rgba(66,214,197,.7)]"
      aria-label={`Pulse ${pulse ?? "unavailable"}`}
    />
  );
}