import {
  ArrowRight,
  CheckCircle2,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const principles = [
  {
    number: "01",
    icon: EyeOff,
    title: "Anonymous and opt-in",
    description:
      "Students choose whether to participate in periodic wellbeing check-ins. The dashboard is designed around aggregate signals rather than personal identity.",
    accent: "teal",
  },
  {
    number: "02",
    icon: LockKeyhole,
    title: "Pseudonymous by design",
    description:
      "The review workflow uses pseudonymous identifiers so counselors can review patterns without exposing unnecessary identifying information.",
    accent: "blue",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "Conservative and documented",
    description:
      "Signals are generated only when a documented threshold rule is reached. The system does not infer a diagnosis from a student's responses.",
    accent: "amber",
  },
  {
    number: "04",
    icon: UserRoundCheck,
    title: "A counselor stays in control",
    description:
      "Every flagged pattern is routed to a human counselor for review. The system does not automatically make decisions about students.",
    accent: "green",
  },
];

const boundaries = [
  "No diagnostic labels",
  "No self-harm content",
  "No automated student contact or action",
  "No replacement of counselor judgment",
];

const signalSteps = [
  {
    step: "01",
    title: "Opt in",
    description: "Student voluntarily completes a check-in.",
    icon: HeartHandshake,
  },
  {
    step: "02",
    title: "Aggregate",
    description: "Responses contribute to campus-level trends.",
    icon: EyeOff,
  },
  {
    step: "03",
    title: "Threshold",
    description: "A conservative documented rule identifies a pattern.",
    icon: FileCheck2,
  },
  {
    step: "04",
    title: "Human review",
    description: "An authorized counselor decides what happens next.",
    icon: UserRoundCheck,
  },
];

function accentClasses(accent: string) {
  switch (accent) {
    case "blue":
      return {
        icon:
          "border-blue-300/15 bg-blue-300/10 text-blue-300",
        glow: "bg-blue-400/10",
      };

    case "amber":
      return {
        icon:
          "border-amber-300/15 bg-amber-300/10 text-amber-200",
        glow: "bg-amber-400/10",
      };

    case "green":
      return {
        icon:
          "border-green-300/15 bg-green-300/10 text-green-300",
        glow: "bg-green-400/10",
      };

    default:
      return {
        icon:
          "border-teal-300/15 bg-teal-300/10 text-teal-200",
        glow: "bg-teal-400/10",
      };
  }
}

export default function PrivacySafety() {
  return (
    <div className="relative space-y-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-400/5 blur-3xl" />
        <div className="absolute left-0 top-[38rem] h-80 w-80 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      {/* -------------------------------------------------
          HERO
      -------------------------------------------------- */}
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-9"
      >
        <div className="absolute inset-0 surface-grid opacity-20" />

        <div className="absolute right-[-5rem] top-[-5rem] h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200">
                <ShieldCheck size={13} />
                Privacy-first design
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                Synthetic demo data
              </span>
            </div>

            <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Trust is part of
              <span className="gradient-text">
                {" "}
                the product.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Campus wellbeing signals should help counseling
              teams see patterns earlier without turning a
              student's private experience into an automated
              judgment.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200">
                <EyeOff
                  size={15}
                  className="text-teal-300"
                />
                No identity-first analytics
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200">
                <UserRoundCheck
                  size={15}
                  className="text-amber-300"
                />
                Human-led review
              </div>
            </div>
          </div>

          {/* Privacy visual */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-8 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-teal-300/15 bg-slate-900/70 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Protection status
                </span>

                <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-200">
                  <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.65)]" />
                  Active
                </span>
              </div>

              <div className="mt-7 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-teal-300/20 bg-teal-300/5 shadow-[0_0_70px_rgba(45,212,191,0.10)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-950/70">
                    <LockKeyhole
                      size={34}
                      className="text-teal-200"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white/[0.035] px-3 py-2.5">
                  <span className="text-xs text-slate-300">
                    Identity exposure
                  </span>

                  <span className="text-xs font-semibold text-teal-200">
                    Minimized
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.035] px-3 py-2.5">
                  <span className="text-xs text-slate-300">
                    Data mode
                  </span>

                  <span className="text-xs font-semibold text-white">
                    Aggregate
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.035] px-3 py-2.5">
                  <span className="text-xs text-slate-300">
                    Final decision
                  </span>

                  <span className="text-xs font-semibold text-amber-200">
                    Human
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* -------------------------------------------------
          PRINCIPLES
      -------------------------------------------------- */}
      <section>
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200">
            Design principles
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Four rules shape the experience
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Privacy and human oversight are built into the
            workflow rather than added as an afterthought.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((item, index) => {
            const Icon = item.icon;
            const colors = accentClasses(item.accent);

            return (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.4,
                }}
                whileHover={{
                  y: -3,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-5 shadow-lg backdrop-blur-xl"
              >
                <div
                  className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${colors.glow}`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors.icon}`}
                    >
                      <Icon size={20} />
                    </div>

                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------
          SIGNAL FLOW
      -------------------------------------------------- */}
      <section className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-xl backdrop-blur-xl sm:p-7">
        <div className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200">
            Signal flow
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            From check-in to human review
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            The system is designed to surface patterns without
            turning automated output into a decision about a
            student.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {signalSteps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                    {item.step}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/5">
                    <Icon
                      size={16}
                      className="text-teal-300"
                    />
                  </div>
                </div>

                <h3 className="mt-5 text-sm font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {item.description}
                </p>

                {index < signalSteps.length - 1 && (
                  <ArrowRight
                    size={15}
                    className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-slate-950 text-slate-500 md:block"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------
          HARD BOUNDARIES
      -------------------------------------------------- */}
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-red-300/10 bg-red-300/[0.025] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-300/15 bg-red-300/5">
            <XCircle
              size={20}
              className="text-red-300"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            Hard boundaries
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            The prototype deliberately avoids several
            high-risk behaviors.
          </p>

          <div className="mt-5 space-y-3">
            {boundaries.map((boundary) => (
              <div
                key={boundary}
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] p-3"
              >
                <XCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-300"
                />

                <span className="text-xs font-medium text-slate-200">
                  {boundary}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-teal-300/10 bg-teal-300/[0.025] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/5">
            <CheckCircle2
              size={20}
              className="text-teal-300"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            What the dashboard is designed to do
          </h2>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold text-white">
                Surface campus-level trends
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                Aggregate check-ins can reveal broad changes
                across academic periods without displaying
                individual student histories.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold text-white">
                Highlight conservative patterns
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                A documented threshold can identify patterns
                that may deserve additional human attention.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold text-white">
                Keep people in control
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                A counselor remains responsible for deciding
                whether a signal requires follow-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------
          SYNTHETIC DATA NOTICE
      -------------------------------------------------- */}
      <section className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.035] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/10">
            <FileCheck2
              size={20}
              className="text-amber-200"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Synthetic demonstration environment
              </h2>

              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-amber-200">
                Demo only
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              This prototype uses synthetic demonstration
              data. It should not be used to make decisions
              about real students without appropriate privacy,
              security, governance, consent, and professional
              oversight.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}