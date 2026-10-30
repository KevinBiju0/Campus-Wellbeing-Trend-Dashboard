import { useMemo, useState } from "react";
import {
  RefreshCcw,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  CheckCircle,
  Users,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import FlagCard from "@/components/FlagCard";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/services/api";

type FilterTab =
  | "pending_review"
  | "reviewed"
  | "dismissed"
  | "all";

export default function CounselorReview() {
  const flags = useAsync(() => api.getFlags(), []);

  const [tab, setTab] =
    useState<FilterTab>("pending_review");

  const [recomputing, setRecomputing] =
    useState(false);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const handleRecompute = async () => {
    setRecomputing(true);

    try {
      await api.recomputeFlags();
      await flags.refresh();
      setDialogOpen(false);
    } finally {
      setRecomputing(false);
    }
  };

  const handleReview = async (
    flagId: number,
    status: "reviewed" | "dismissed",
    note?: string
  ) => {
    await api.reviewFlag(
      flagId,
      status,
      note
    );

    await flags.refresh();
  };

  const filtered = useMemo(() => {
    if (!flags.data) return [];

    if (tab === "all") {
      return flags.data;
    }

    return flags.data.filter(
      (flag) => flag.status === tab
    );
  }, [flags.data, tab]);

  const counts = useMemo(() => {
    const base = {
      pending_review: 0,
      reviewed: 0,
      dismissed: 0,
    };

    flags.data?.forEach((flag) => {
      base[flag.status] =
        (base[flag.status] ?? 0) + 1;
    });

    return base;
  }, [flags.data]);

  return (
    <div className="relative space-y-7">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-400/5 blur-3xl" />
        <div className="absolute left-0 top-72 h-64 w-64 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      {/* -------------------------------------------------
          HEADER
      -------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
        <div className="absolute inset-0 surface-grid opacity-20" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                <ShieldCheck size={13} />
                Human review workspace
              </span>

              {counts.pending_review > 0 && (
                <Badge
                  variant="warning"
                  className="border border-amber-300/20 bg-amber-300/10 text-amber-200"
                >
                  {counts.pending_review} pending
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Counselor review queue
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Review conservative wellbeing signals using
              pseudonymous data. Every signal requires human
              judgment and is never treated as a diagnosis.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                <Users size={14} className="text-teal-300" />
                Pseudonymous
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                <ClipboardCheck size={14} className="text-amber-300" />
                Rule-based
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                <ShieldCheck size={14} className="text-teal-300" />
                Human-led
              </div>
            </div>
          </div>

          {/* Recompute */}
          <div className="shrink-0">
            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="w-full gap-2 border border-teal-300/20 bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/10 transition-all hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto"
                >
                  <RefreshCcw size={15} />
                  Recompute flags
                </Button>
              </DialogTrigger>

              <DialogContent className="border-white/10 bg-slate-950 text-white shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <SlidersHorizontal
                      size={20}
                      className="text-teal-300"
                    />
                    Recompute rule flags
                  </DialogTitle>

                  <DialogDescription className="text-slate-300">
                    This evaluates the documented flagging
                    rules against pseudonymous check-in
                    history and adds any newly detected
                    patterns to the pending review queue.
                  </DialogDescription>
                </DialogHeader>

                <div className="rounded-xl border border-amber-300/15 bg-amber-300/5 p-4">
                  <p className="text-xs leading-5 text-slate-200">
                    This action does not create a diagnosis or
                    automatically contact students. Results are
                    only presented for authorized human review.
                  </p>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDialogOpen(false)
                    }
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="default"
                    onClick={handleRecompute}
                    disabled={recomputing}
                    className="gap-2 bg-teal-400 text-slate-950 hover:bg-teal-300"
                  >
                    {recomputing ? (
                      <RefreshCcw
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle size={15} />
                    )}

                    {recomputing
                      ? "Recomputing..."
                      : "Confirm recompute"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------
          STATUS SUMMARY
      -------------------------------------------------- */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Pending
            </span>

            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(253,224,71,0.45)]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-white">
            {counts.pending_review}
          </p>

          <p className="mt-1 text-xs text-slate-300">
            Awaiting counselor review
          </p>
        </div>

        <div className="rounded-2xl border border-teal-300/15 bg-teal-300/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Reviewed
            </span>

            <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-white">
            {counts.reviewed}
          </p>

          <p className="mt-1 text-xs text-slate-300">
            Human decisions recorded
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Total signals
            </span>

            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>

          <p className="mt-2 text-2xl font-bold text-white">
            {flags.data?.length ?? 0}
          </p>

          <p className="mt-1 text-xs text-slate-300">
            Across the review queue
          </p>
        </div>
      </section>

      {/* -------------------------------------------------
          PRIVACY NOTICE
      -------------------------------------------------- */}
      <Alert
        variant="info"
        className="border-teal-300/15 bg-teal-300/5 text-white"
      >
        <Info
          size={16}
          className="text-teal-300"
        />

        <AlertDescription className="text-xs leading-5 text-slate-200">
          Access to this queue should be restricted to
          authorized counseling staff in a real deployment.
          This prototype has no login wall. See{" "}
          <span className="font-semibold text-white">
            docs/privacy_and_safety.md
          </span>{" "}
          for how this would be secured in production.
        </AlertDescription>
      </Alert>

      {/* -------------------------------------------------
          FILTER TABS
      -------------------------------------------------- */}
      <section>
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
            Review status
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Select a queue to focus the counselor workflow.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) =>
            setTab(value as FilterTab)
          }
        >
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50 p-1.5">
            <TabsTrigger
              value="pending_review"
              className="gap-1.5 whitespace-nowrap text-slate-300 data-[state=active]:bg-amber-300/10 data-[state=active]:text-amber-200"
            >
              Pending

              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px]"
              >
                {counts.pending_review}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="reviewed"
              className="gap-1.5 whitespace-nowrap text-slate-300 data-[state=active]:bg-teal-300/10 data-[state=active]:text-teal-200"
            >
              Reviewed

              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px]"
              >
                {counts.reviewed}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="dismissed"
              className="gap-1.5 whitespace-nowrap text-slate-300 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              Dismissed

              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px]"
              >
                {counts.dismissed}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="all"
              className="whitespace-nowrap text-slate-300 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              All ({flags.data?.length ?? 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* -------------------------------------------------
          LOADING / ERROR
      -------------------------------------------------- */}
      {flags.loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center">
          <RefreshCcw
            size={22}
            className="mx-auto mb-3 animate-spin text-teal-300"
          />

          <p className="text-sm font-medium text-white">
            Loading review signals...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing the counselor workspace.
          </p>
        </div>
      )}

      {flags.error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-center">
          <ShieldAlert
            size={24}
            className="mx-auto mb-2 text-red-300"
          />

          <p className="text-sm font-semibold text-white">
            Unable to load review signals
          </p>

          <p className="mt-1 text-xs text-red-200">
            {flags.error}
          </p>
        </div>
      )}

      {/* -------------------------------------------------
          EMPTY STATE
      -------------------------------------------------- */}
      {flags.data &&
        filtered.length === 0 &&
        !flags.loading && (
          <Card
            solid
            className="overflow-hidden border border-white/10 bg-slate-950/45 p-10 text-center shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-300/15 bg-teal-300/5">
              <ShieldAlert
                className="text-teal-300"
                size={30}
              />
            </div>

            <p className="mt-4 text-base font-semibold text-white">
              No signals in this view
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-300">
              Try recomputing the documented rules or submit
              additional check-ins to evaluate new patterns.
            </p>
          </Card>
        )}

      {/* -------------------------------------------------
          FLAG LIST
      -------------------------------------------------- */}
      <div className="space-y-4">
        {filtered.map((flag) => (
          <FlagCard
            key={flag.flag_id}
            flag={flag}
            onReview={handleReview}
          />
        ))}
      </div>

      {/* -------------------------------------------------
          FOOTER SAFETY NOTE
      -------------------------------------------------- */}
      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <ShieldCheck
          size={17}
          className="mt-0.5 shrink-0 text-teal-300"
        />

        <div>
          <p className="text-xs font-semibold text-white">
            Human judgment remains the final step
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-300">
            These signals are conservative pattern indicators
            only. They do not diagnose, label, or make decisions
            about students automatically.
          </p>
        </div>
      </div>
    </div>
  );
}