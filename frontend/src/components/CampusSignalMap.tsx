import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  HeartHandshake,
  Home,
  Users,
} from "lucide-react";

import type { SummaryMetrics } from "../types";

const zones = [
  {
    label: "Academics",
    icon: BookOpen,
    angle: -90,
    tone: "teal",
  },
  {
    label: "Student life",
    icon: Users,
    angle: -18,
    tone: "amber",
  },
  {
    label: "Residential",
    icon: Home,
    angle: 54,
    tone: "teal",
  },
  {
    label: "Wellbeing",
    icon: HeartHandshake,
    angle: 126,
    tone: "amber",
  },
  {
    label: "Community",
    icon: Users,
    angle: 198,
    tone: "teal",
  },
];

export default function CampusSignalMap({
  summary,
}: {
  summary?: SummaryMetrics;
}) {
  const mood = summary?.avg_mood_last_7d ?? 3;
  const workload = summary?.avg_workload_last_7d ?? 3;

  const pulse = Math.round(
    ((mood / 5) * 0.55 + (1 - workload / 5) * 0.45) * 100
  );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative overflow-hidden rounded-3xl border border-dusk-300/10 bg-dusk-950/65 p-5 sm:p-7 signal-glow surface-grid"
    >
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-clover-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">

        {/* INFORMATION */}
        <div className="max-w-sm shrink-0">

          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-clover-400">
            <Activity size={14} />
            Campus signal field
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white">
            A pulse, not a profile.
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-200">
            Synthetic aggregate zones show where campus wellbeing signals are
            moving. They are illustrative, not geographic and never identify
            individuals.
          </p>

          {/* PRINCIPLE BADGES */}
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium">

            <span className="rounded-full border border-clover-400/15 bg-clover-400/10 px-3 py-1.5 text-clover-300">
              Aggregate only
            </span>

            <span className="rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1.5 text-amber-300">
              Human-led
            </span>

          </div>
        </div>

        {/* SIGNAL FIELD */}
        <div className="relative mx-auto h-[300px] w-full max-w-[520px]">

          {/* OUTER RING */}
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-clover-400/10" />

          {/* ANIMATED INNER RING */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-clover-400/15"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* CENTER PULSE */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-clover-400/25 bg-dusk-900/90 shadow-[0_0_45px_rgba(66,214,197,.14)]">

              <div>
                <div className="text-2xl font-semibold text-white">
                  {pulse}
                </div>

                <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-300">
                  pulse
                </div>
              </div>

            </div>
          </div>

          {/* ZONES */}
          {zones.map((zone, index) => {
            const x =
              50 +
              Math.cos((zone.angle * Math.PI) / 180) * 38;

            const y =
              50 +
              Math.sin((zone.angle * Math.PI) / 180) * 37;

            const Icon = zone.icon;

            const active = index % 2 === 0;

            return (
              <motion.div
                key={zone.label}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                }}
                whileHover={{
                  y: -4,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-2 backdrop-blur-md ${
                    active
                      ? "border-clover-400/20 bg-clover-400/8"
                      : "border-amber-400/20 bg-amber-400/8"
                  }`}
                >

                  {/* ICON */}
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                      active
                        ? "bg-clover-400/12 text-clover-300"
                        : "bg-amber-400/12 text-amber-300"
                    }`}
                  >
                    <Icon size={14} />
                  </span>

                  {/* LABEL */}
                  <div>
                    <div className="whitespace-nowrap text-[10px] font-semibold text-white">
                      {zone.label}
                    </div>

                    <div className="whitespace-nowrap text-[9px] font-medium text-slate-300">
                      aggregate zone
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}