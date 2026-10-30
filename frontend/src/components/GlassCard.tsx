import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  solid?: boolean;
  hover?: boolean;
  delay?: number;
  hoverLift?: number;
}

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

export default function GlassCard({
  children,
  className = "",
  solid = false,
  hover = false,
  delay = 0,
  hoverLift = 4,
}: GlassCardProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hover
          ? {
              y: -hoverLift,
              scale: 1.008,
              transition: {
                duration: 0.22,
                ease: "easeOut",
              },
            }
          : undefined
      }
      whileTap={
        hover
          ? {
              scale: 0.997,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      className="relative"
    >
      {hover && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-r from-clover-400/0 via-clover-400/10 to-teal-400/0 opacity-0 blur-sm"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}

      <Card
        solid={solid}
        hover={hover}
        className={`relative overflow-hidden ${className}`}
      >
        {hover && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-clover-400/40 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileHover={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
        )}

        {children}
      </Card>
    </motion.div>
  );
}
