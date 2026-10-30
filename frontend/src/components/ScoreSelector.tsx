import { motion } from "framer-motion";

type ScoreSelectorProps = {
  label?: string;
  helper?: string;
  value: number | null;
  onChange: (value: number) => void;
  scaleLabels: Record<number, string> | readonly string[];
  accent?: "clover" | "amber" | "dusk";
};

type ScoreColor = {
  border: string;
  bg: string;
  selected: string;
  text: string;
  glow: string;
};

const moodColors: ScoreColor[] = [
  {
    border: "border-red-400/70",
    bg: "bg-red-500/20",
    selected: "bg-red-500 text-white border-red-400",
    text: "text-red-200",
    glow: "shadow-red-500/20",
  },
  {
    border: "border-orange-400/70",
    bg: "bg-orange-500/20",
    selected: "bg-orange-500 text-white border-orange-400",
    text: "text-orange-200",
    glow: "shadow-orange-500/20",
  },
  {
    border: "border-yellow-400/70",
    bg: "bg-yellow-500/20",
    selected: "bg-yellow-500 text-white border-yellow-400",
    text: "text-yellow-100",
    glow: "shadow-yellow-500/20",
  },
  {
    border: "border-green-400/70",
    bg: "bg-green-500/20",
    selected: "bg-green-500 text-white border-green-400",
    text: "text-green-200",
    glow: "shadow-green-500/20",
  },
  {
    border: "border-blue-400/70",
    bg: "bg-blue-500/20",
    selected: "bg-blue-500 text-white border-blue-400",
    text: "text-blue-200",
    glow: "shadow-blue-500/20",
  },
];

const workloadColors: ScoreColor[] = [
  {
    border: "border-blue-400/70",
    bg: "bg-blue-500/20",
    selected: "bg-blue-500 text-white border-blue-400",
    text: "text-blue-200",
    glow: "shadow-blue-500/20",
  },
  {
    border: "border-green-400/70",
    bg: "bg-green-500/20",
    selected: "bg-green-500 text-white border-green-400",
    text: "text-green-200",
    glow: "shadow-green-500/20",
  },
  {
    border: "border-yellow-400/70",
    bg: "bg-yellow-500/20",
    selected: "bg-yellow-500 text-white border-yellow-400",
    text: "text-yellow-100",
    glow: "shadow-yellow-500/20",
  },
  {
    border: "border-orange-400/70",
    bg: "bg-orange-500/20",
    selected: "bg-orange-500 text-white border-orange-400",
    text: "text-orange-200",
    glow: "shadow-orange-500/20",
  },
  {
    border: "border-red-400/70",
    bg: "bg-red-500/20",
    selected: "bg-red-500 text-white border-red-400",
    text: "text-red-200",
    glow: "shadow-red-500/20",
  },
];

const neutralColors = moodColors;

/* -------------------------------------------------------
   DETERMINE COLOR SCALE
------------------------------------------------------- */

function getScoreColors(label?: string): ScoreColor[] {
  const normalizedLabel =
    typeof label === "string"
      ? label.toLowerCase()
      : "";

  if (normalizedLabel.includes("workload")) {
    return workloadColors;
  }

  if (
    normalizedLabel.includes("mood") ||
    normalizedLabel.includes("sleep")
  ) {
    return moodColors;
  }

  return neutralColors;
}

/* -------------------------------------------------------
   SCORE LABEL HELPER
------------------------------------------------------- */

function getScaleLabel(
  scaleLabels: Record<number, string> | readonly string[],
  score: number
): string {
  if (Array.isArray(scaleLabels)) {
    return scaleLabels[score - 1] ?? "";
  }

  return scaleLabels[score] ?? "";
}

/* -------------------------------------------------------
   SCORE SELECTOR
------------------------------------------------------- */

export default function ScoreSelector({
  label = "",
  helper = "",
  value,
  onChange,
  scaleLabels,
}: ScoreSelectorProps) {
  const colors = getScoreColors(label);

  const scores = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="space-y-1">

        <div className="text-sm font-semibold text-white">
          {label || "Score"}
        </div>

        {helper && (
          <p className="text-xs leading-5 text-slate-300">
            {helper}
          </p>
        )}

      </div>

      {/* SCORE OPTIONS */}
      <div className="grid grid-cols-5 gap-2">

        {scores.map((score) => {
          const scaleLabel = getScaleLabel(
            scaleLabels,
            score
          );

          const selected = value === score;

          const color =
            colors[score - 1] ??
            colors[colors.length - 1];

          return (
            <motion.button
              key={`${label || "score"}-${score}`}
              type="button"
              whileHover={{
                y: -3,
                scale: 1.025,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => onChange(score)}
              className={[
                "relative flex min-h-[82px] flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-clover-300/60 focus:ring-offset-2 focus:ring-offset-dusk-950",

                selected
                  ? `${color.selected} ${color.glow} shadow-lg`
                  : `${color.border} ${color.bg} ${color.text} hover:brightness-125`,
              ].join(" ")}
              aria-pressed={selected}
              aria-label={`${label || "Score"} ${score}: ${scaleLabel}`}
            >

              {/* NUMBER */}
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",

                  selected
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-white",
                ].join(" ")}
              >
                {score}
              </span>

              {/* LABEL */}
              <span
                className={[
                  "mt-2 text-[10px] font-semibold leading-tight sm:text-[11px]",

                  selected
                    ? "text-white"
                    : color.text,
                ].join(" ")}
              >
                {scaleLabel}
              </span>

              {/* SELECTED BORDER */}
              {selected && (
                <motion.span
                  layoutId={`selected-score-${label || "score"}`}
                  className="absolute inset-0 rounded-2xl border-2 border-white/40"
                />
              )}

            </motion.button>
          );
        })}

      </div>

      {/* SCALE FOOTER */}
      <div className="flex items-center justify-between px-1 text-[10px] font-medium text-slate-400">
        <span>1</span>
        <span>5</span>
      </div>

    </div>
  );
}