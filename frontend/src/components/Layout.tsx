import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  HeartHandshake,
  LineChart,
  ShieldCheck,
  ClipboardList,
  Sprout,
  Info,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    to: "/",
    label: "Check in",
    icon: Sprout,
    end: true,
    badge: "Opt-in",
    description: "Submit an anonymous wellbeing check-in",
  },
  {
    to: "/dashboard",
    label: "Trends",
    icon: LineChart,
    description: "Explore aggregate campus trends",
  },
  {
    to: "/counselor",
    label: "Counselor review",
    icon: ClipboardList,
    description: "Review patterns requiring human attention",
  },
  {
    to: "/privacy",
    label: "Privacy & safety",
    icon: ShieldCheck,
    description: "Learn how privacy and safety are protected",
  },
];

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

export default function Layout() {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Ambient background motion */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed -left-32 top-20 h-72 w-72 rounded-full bg-clover-400/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 24, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed -right-24 bottom-10 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
          animate={{
            x: [0, -24, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
          <aside className="glass-nav md:w-64 md:min-h-screen md:sticky md:top-0 md:h-screen text-sand-50 px-4 py-5 md:px-5 md:py-6 flex flex-col justify-between z-20 shadow-xl">
            <div>
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex items-center gap-3 mb-6 md:mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.06, rotate: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative w-10 h-10 rounded-2xl bg-clover-500 flex items-center justify-center shrink-0 shadow-md"
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <HeartHandshake
                    size={20}
                    className="relative text-white"
                  />
                </motion.div>

                <div className="leading-tight">
                  <p className="font-display font-semibold text-base text-white tracking-tight">
                    Campus Wellbeing
                  </p>
                  <p className="text-[11px] text-dusk-200/80 font-medium">
                    Trend & referral dashboard
                  </p>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav
                aria-label="Main navigation"
                className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0"
              >
                {navItems.map(
                  ({ to, label, icon: Icon, end, badge, description }, index) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.08 + index * 0.06,
                        ease: "easeOut",
                      }}
                      className="shrink-0"
                    >
                      <NavLink
                        to={to}
                        end={end}
                        className="relative block group"
                      >
                        {({ isActive }) => (
                          <motion.div
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.985 }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 28,
                            }}
                            className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                              isActive
                                ? "text-white"
                                : "text-dusk-100/75 hover:text-white"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="active-nav"
                                className="absolute inset-0 rounded-xl bg-white/15 shadow-sm border border-white/10"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}

                            <span className="relative z-10 flex items-center gap-2.5">
                              <motion.span
                                animate={
                                  isActive
                                    ? { scale: [1, 1.12, 1] }
                                    : { scale: 1 }
                                }
                                transition={{ duration: 0.35 }}
                              >
                                <Icon size={18} strokeWidth={2} />
                              </motion.span>
                              <span>{label}</span>
                            </span>

                            {badge && (
                              <Badge
                                variant="success"
                                className={`relative z-10 text-[10px] px-1.5 py-0 border-none transition-all ${
                                  isActive
                                    ? "bg-clover-500/35 text-clover-100"
                                    : "bg-white/10 text-dusk-200"
                                }`}
                              >
                                {badge}
                              </Badge>
                            )}

                            {/* Small hover glow */}
                            <span className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                            {/* Tooltip on mobile/compact use */}
                            <span className="sr-only">{description}</span>
                          </motion.div>
                        )}
                      </NavLink>
                    </motion.div>
                  ),
                )}
              </nav>

              {/* Privacy mini-card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.45 }}
                className="hidden md:block mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 rounded-lg bg-clover-500/15 p-1.5">
                    <LockKeyhole
                      size={14}
                      className="text-clover-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Privacy first
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-dusk-200/65">
                      Anonymous check-ins, aggregate trends and human review.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer / demo mode */}
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="border-t border-white/10 pt-4 mt-6"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="group cursor-help inline-flex items-center gap-2 text-[11px] text-dusk-200/70 hover:text-white transition-colors">
                      <span className="rounded-md bg-white/5 p-1.5 group-hover:bg-white/10 transition-colors">
                        <Info size={13} className="text-dusk-300" />
                      </span>
                      <span>Synthetic demo mode</span>
                      <Sparkles
                        size={11}
                        className="text-clover-300/70"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    Synthetic demo data only. No diagnosis or self-harm content
                    is ever generated by this system.
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </div>
          </aside>

          {/* Main content */}
          <main className="relative flex-1 w-full min-w-0">
            {/* Top progress/accent line */}
            <motion.div
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-px origin-left bg-gradient-to-r from-clover-400/0 via-clover-400/50 to-teal-400/0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
              {/* Mobile page indicator */}
              <div className="mb-4 flex items-center justify-between md:hidden">
                <div className="flex items-center gap-2 text-xs font-medium text-dusk-600">
                  <Sprout size={14} className="text-clover-600" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={location.pathname}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {navItems.find((item) =>
                        item.end
                          ? location.pathname === item.to
                          : location.pathname.startsWith(item.to),
                      )?.label ?? "Campus Wellbeing"}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-clover-600/10 bg-white/55 px-2.5 py-1 text-[10px] text-dusk-600 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-clover-500 animate-pulse" />
                  Anonymous mode
                </span>
              </div>

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
