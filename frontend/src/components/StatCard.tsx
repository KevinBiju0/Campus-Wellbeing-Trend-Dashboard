import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "dusk" | "clover" | "amber" | "coral";
  delay?: number;
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  dusk: "bg-dusk-500/15 text-dusk-700 border border-dusk-500/20",
  clover: "bg-clover-500/15 text-clover-600 border border-clover-500/20",
  amber: "bg-amber-500/15 text-amber-600 border border-amber-500/20",
  coral: "bg-coral-500/15 text-coral-600 border border-coral-500/20",
};

const numberVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "dusk",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.995 }}
      className="group"
    >
      <Card
        hover
        solid
        className="relative overflow-hidden p-5 flex flex-col justify-between gap-3"
      >
        {/* Subtle animated top highlight */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clover-400/40 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
        />

        {/* Ambient hover glow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-clover-400/10 blur-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1, scale: 1.25 }}
          transition={{ duration: 0.35 }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <p className="text-xs font-medium text-dusk-700/70 tracking-wide uppercase">
            {label}
          </p>

          <motion.div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${accentClasses[accent]}`}
            whileHover={{
              scale: 1.1,
              rotate: -4,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 18,
            }}
          >
            <Icon size={17} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.p
            className="font-display text-3xl font-bold text-dusk-900 tracking-tight"
            variants={numberVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: delay + 0.12,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {value}
          </motion.p>

          {hint && (
            <motion.p
              className="text-xs text-dusk-700/60 mt-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay + 0.22,
                duration: 0.3,
              }}
            >
              {hint}
            </motion.p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
