import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Flag {
  flag_id: number;
  pseudonym: string;
  reason: string;
  status: "pending_review" | "reviewed" | "dismissed";
  created_at?: string;
  rule_name?: string;
  evidence?: string;
  details?: string;
  checkin_count?: number;
}

interface FlagCardProps {
  flag: Flag;
  onReview: (
    flagId: number,
    status: "reviewed" | "dismissed",
    note?: string
  ) => Promise<void>;
}

export default function FlagCard({
  flag,
  onReview,
}: FlagCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const isPending =
    flag.status === "pending_review";

  const isReviewed =
    flag.status === "reviewed";

  const isDismissed =
    flag.status === "dismissed";

  const handleReview = async (
    status: "reviewed" | "dismissed"
  ) => {
    setSaving(true);

    try {
      await onReview(
        flag.flag_id,
        status,
        note.trim() || undefined
      );
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = flag.created_at
    ? new Date(flag.created_at).toLocaleString()
    : "Date unavailable";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      whileHover={{
        y: -2,
      }}
    >
      <Card
        solid
        className={[
          "relative overflow-hidden border bg-slate-950/55 shadow-xl backdrop-blur-xl",
          isPending
            ? "border-amber-300/15"
            : isReviewed
              ? "border-teal-300/15"
              : "border-white/10",
        ].join(" ")}
      >
        {/* Status rail */}
        <div
          className={[
            "absolute inset-y-0 left-0 w-1",
            isPending
              ? "bg-amber-400"
              : isReviewed
                ? "bg-teal-400"
                : "bg-slate-500",
          ].join(" ")}
        />

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/5">
                    <UserRound
                      size={17}
                      className="text-teal-300"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Pseudonymous ID
                    </p>

                    <p className="text-sm font-bold text-white">
                      {flag.pseudonym}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="border border-white/10 bg-white/5 text-slate-200"
                >
                  Pseudonymous
                </Badge>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Signal
                </p>

                <h3 className="mt-1 text-base font-semibold text-white">
                  {flag.reason}
                </h3>
              </div>
            </div>

            {/* Status */}
            <div className="shrink-0">
              {isPending && (
                <Badge
                  variant="warning"
                  className="border border-amber-300/20 bg-amber-300/10 text-amber-200"
                >
                  <AlertTriangle
                    size={12}
                    className="mr-1.5"
                  />
                  Review recommended
                </Badge>
              )}

              {isReviewed && (
                <Badge
                  variant="success"
                  className="border border-teal-300/20 bg-teal-300/10 text-teal-200"
                >
                  <Check
                    size={12}
                    className="mr-1.5"
                  />
                  Reviewed
                </Badge>
              )}

              {isDismissed && (
                <Badge
                  variant="secondary"
                  className="border border-white/10 bg-white/5 text-slate-300"
                >
                  <X
                    size={12}
                    className="mr-1.5"
                  />
                  Dismissed
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock3 size={13} />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Detected
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-white">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <FileText size={13} />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Rule
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-white">
                {flag.rule_name || "Documented threshold"}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <UserRound size={13} />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Check-ins
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-white">
                {flag.checkin_count ?? "—"}
              </p>
            </div>
          </div>

          {/* Review signal button */}
          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setExpanded((current) => !current)
              }
              className="w-full justify-between border-white/10 bg-white/[0.035] text-white hover:bg-white/[0.07] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-teal-300"
                />

                {expanded
                  ? "Hide review signal"
                  : "Review signal"}
              </span>

              {expanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>
          </div>

          {/* Expanded evidence */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -5,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  {/* Evidence */}
                  <div className="rounded-2xl border border-teal-300/10 bg-teal-300/[0.035] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                      Signal evidence
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-200">
                      {flag.evidence ||
                        flag.details ||
                        "The documented threshold rule detected a repeated pattern that requires human review."}
                    </p>
                  </div>

                  {/* Rule */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                      Why this was flagged
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {flag.rule_name ||
                        "A conservative, documented threshold was reached across pseudonymous check-in signals."}
                    </p>
                  </div>

                  {/* Human review protocol */}
                  <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-amber-300"
                      />

                      <div>
                        <p className="text-xs font-semibold text-white">
                          Human judgment required
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-300">
                          This signal is not a diagnosis and
                          should not be interpreted as one.
                          Counselors decide whether any
                          follow-up is appropriate.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Counselor note */}
                  {isPending && (
                    <div>
                      <label
                        htmlFor={`note-${flag.flag_id}`}
                        className="mb-2 block text-xs font-semibold text-white"
                      >
                        Counselor note
                        <span className="ml-1 font-normal text-slate-400">
                          optional
                        </span>
                      </label>

                      <textarea
                        id={`note-${flag.flag_id}`}
                        value={note}
                        onChange={(event) =>
                          setNote(event.target.value)
                        }
                        placeholder="Add a private review note..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-teal-300/40 focus:outline-none focus:ring-2 focus:ring-teal-300/10"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          {isPending && (
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() =>
                  handleReview("dismissed")
                }
                className="gap-2 border-white/10 bg-white/[0.035] text-slate-200 hover:bg-white/[0.08] hover:text-white"
              >
                <X size={15} />
                Dismiss signal
              </Button>

              <Button
                type="button"
                disabled={saving}
                onClick={() =>
                  handleReview("reviewed")
                }
                className="gap-2 bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/10 hover:bg-teal-300"
              >
                <Check size={15} />

                {saving
                  ? "Saving..."
                  : "Mark reviewed"}
              </Button>
            </div>
          )}

          {/* Completed status */}
          {!isPending && (
            <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-4">
              {isReviewed ? (
                <>
                  <Check
                    size={15}
                    className="text-teal-300"
                  />

                  <p className="text-xs text-slate-300">
                    Human review has been recorded for this
                    signal.
                  </p>
                </>
              ) : (
                <>
                  <X
                    size={15}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-300">
                    This signal has been dismissed from the
                    active review queue.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}