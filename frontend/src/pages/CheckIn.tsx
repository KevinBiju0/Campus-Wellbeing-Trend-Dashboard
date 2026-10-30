import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Sprout,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  LockKeyhole,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import ScoreSelector from "@/components/ScoreSelector";
import { api } from "@/services/api";

import {
  NOTE_TAGS,
  MOOD_LABELS,
  WORKLOAD_LABELS,
  SLEEP_LABELS,
  TAG_LABELS,
} from "@/types";

/* -------------------------------------------------------
   RANDOM PSEUDONYM
------------------------------------------------------- */

function randomPseudonym() {
  const animals = [
    "otter",
    "falcon",
    "heron",
    "birch",
    "wren",
    "maple",
    "quartz",
    "ember",
  ];

  const animal =
    animals[Math.floor(Math.random() * animals.length)];

  const num =
    Math.floor(Math.random() * 900) + 100;

  return `anon-${animal}-${num}`;
}

/* -------------------------------------------------------
   FORM VALIDATION
------------------------------------------------------- */

const checkInSchema = z.object({
  pseudonym_id: z
    .string()
    .min(
      4,
      "Pseudonym must be at least 4 characters long"
    ),

  mood: z
    .number({
      required_error: "Please select your mood rating",
    })
    .min(1)
    .max(5),

  workload: z
    .number({
      required_error:
        "Please select your workload rating",
    })
    .min(1)
    .max(5),

  sleep_quality: z
    .number()
    .min(1)
    .max(5),

  note_tag: z
    .string()
    .optional(),
});

type CheckInFormValues =
  z.infer<typeof checkInSchema>;

/* -------------------------------------------------------
   ANIMATION VARIANTS
------------------------------------------------------- */

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

/* -------------------------------------------------------
   CHECK-IN PAGE
------------------------------------------------------- */

export default function CheckIn() {
  const [
    submittedPseudonym,
    setSubmittedPseudonym,
  ] = useState<string | null>(null);

  const [
    apiError,
    setApiError,
  ] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),

    defaultValues: {
      pseudonym_id: randomPseudonym(),
      mood: undefined,
      workload: undefined,
      sleep_quality: 3,
      note_tag: undefined,
    },
  });

  const selectedTag = watch("note_tag");

  /* -------------------------------------------------------
     SUBMIT
  ------------------------------------------------------- */

  const onSubmit = async (
    data: CheckInFormValues
  ) => {
    setApiError(null);

    try {
      await api.submitCheckIn({
        pseudonym_id:
          data.pseudonym_id.trim(),

        mood: data.mood,

        workload: data.workload,

        sleep_quality:
          data.sleep_quality,

        note_tag:
          data.note_tag || undefined,
      });

      setSubmittedPseudonym(
        data.pseudonym_id.trim()
      );
    } catch (e) {
      setApiError(
        e instanceof Error
          ? e.message
          : "Could not submit check-in"
      );
    }
  };

  /* -------------------------------------------------------
     RESET
  ------------------------------------------------------- */

  const handleReset = () => {
    setSubmittedPseudonym(null);
    setApiError(null);

    reset({
      pseudonym_id: randomPseudonym(),
      mood: undefined,
      workload: undefined,
      sleep_quality: 3,
      note_tag: undefined,
    });
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-2xl space-y-6"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-dusk-300/10 bg-dusk-950/70 p-6 shadow-glass backdrop-blur-xl"
      >

        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-clover-400/15 blur-3xl"
          animate={{
            x: [0, 18, 0],
            y: [0, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl"
          animate={{
            x: [0, -12, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative">

          <div className="mb-2 flex items-center gap-2">
            <Badge
              variant="success"
              className="gap-1.5 px-3 py-1 font-medium"
            >
              <Sprout size={15} />
              Anonymous Check-in
            </Badge>
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            How has the past few days felt?
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-200">
            This takes about 15 seconds. It's opt-in,
            anonymous, and only ever feeds an aggregate
            trend chart plus a conservative, documented
            pattern check — never a diagnosis.
          </p>

          {/* Privacy badges */}
          <div className="mt-4 flex flex-wrap gap-2">

            {[
              {
                icon: LockKeyhole,
                text: "Pseudonymous",
              },
              {
                icon: ShieldCheck,
                text: "Opt-in",
              },
              {
                icon: Sparkles,
                text: "15 seconds",
              },
            ].map(
              ({ icon: Icon, text }) => (
                <motion.div
                  key={text}
                  whileHover={{
                    y: -2,
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-dusk-300/20 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-slate-200"
                >
                  <Icon
                    size={13}
                    className="text-clover-300"
                  />

                  {text}
                </motion.div>
              )
            )}

          </div>
        </div>
      </motion.div>

      {/* =====================================================
          SUCCESS / FORM
      ===================================================== */}

      <AnimatePresence mode="wait">

        {/* ===================================================
            SUCCESS
        =================================================== */}

        {submittedPseudonym ? (
          <motion.div
            key="success"
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -12,
              scale: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
          >
            <Card
              solid
              className="overflow-hidden p-8 text-center shadow-glass-lg"
            >

              <motion.div
                initial={{
                  scale: 0,
                  rotate: -15,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                  delay: 0.1,
                }}
              >
                <CheckCircle2
                  className="mx-auto text-clover-500"
                  size={54}
                />
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
              >
                <CardTitle className="mt-4 text-2xl">
                  Thanks for checking in
                </CardTitle>

                <CardDescription className="mt-2 text-sm text-slate-300">
                  Your response was recorded anonymously
                  under{" "}

                  <Badge
                    variant="secondary"
                    className="font-semibold"
                  >
                    {submittedPseudonym}
                  </Badge>
                </CardDescription>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >
                <Button
                  onClick={handleReset}
                  variant="clover"
                  className="mt-5 gap-2"
                >
                  <RefreshCw size={16} />
                  Submit another check-in
                </Button>
              </motion.div>

            </Card>
          </motion.div>
        ) : (

          /* =================================================
             FORM
          ================================================= */

          <motion.div
            key="form"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <Card
              solid
              className="overflow-hidden shadow-glass-lg"
            >

              {/* FORM HEADER */}
              <CardHeader className="border-b border-dusk-300/15 pb-5">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <CardTitle className="text-xl text-white">
                      Check-in Form
                    </CardTitle>

                    <CardDescription className="mt-1 text-slate-300">
                      Submit anonymous wellbeing indicators
                      for campus aggregate trends.
                    </CardDescription>
                  </div>

                  <motion.div
                    animate={{
                      rotate: [0, 4, -4, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="hidden rounded-2xl bg-clover-500/10 p-3 text-clover-300 sm:block"
                  >
                    <Sprout size={21} />
                  </motion.div>

                </div>
              </CardHeader>

              {/* FORM CONTENT */}
              <CardContent className="pt-6">

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-7"
                >

                  {/* =================================================
                      PSEUDONYM
                  ================================================= */}

                  <motion.div
                    variants={itemVariants}
                    className="space-y-2"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <Label
                        htmlFor="pseudonym_id"
                        className="text-slate-100"
                      >
                        Your pseudonym token
                      </Label>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto gap-1.5 p-0 text-xs text-slate-300 hover:text-white"
                        onClick={() =>
                          setValue(
                            "pseudonym_id",
                            randomPseudonym()
                          )
                        }
                      >
                        <RefreshCw size={12} />
                        Generate random
                      </Button>

                    </div>

                    <Input
                      id="pseudonym_id"
                      {...register("pseudonym_id")}
                      placeholder="e.g. anon-otter-482"
                      className="transition-all duration-300 focus:scale-[1.005]"
                    />

                    <p className="text-[11px] text-slate-300">
                      A made-up token, not your name. Reuse
                      the same one next time so trends can
                      follow anonymously.
                    </p>

                    <AnimatePresence>

                      {errors.pseudonym_id && (
                        <motion.p
                          initial={{
                            opacity: 0,
                            y: -4,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-coral-300"
                        >
                          <AlertCircle size={13} />
                          {errors.pseudonym_id.message}
                        </motion.p>
                      )}

                    </AnimatePresence>

                  </motion.div>

                  {/* =================================================
                      MOOD
                  ================================================= */}

                  <motion.div variants={itemVariants}>

                    <Controller
                      name="mood"
                      control={control}
                      render={({ field }) => (
                        <div>

                          <ScoreSelector
                            label="Mood Score *"
                            helper="How would you rate your overall mood recently?"
                            value={field.value ?? null}
                            onChange={field.onChange}
                            scaleLabels={MOOD_LABELS}
                            accent="clover"
                          />

                          {errors.mood && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-coral-300">
                              <AlertCircle size={13} />
                              {errors.mood.message}
                            </p>
                          )}

                        </div>
                      )}
                    />

                  </motion.div>

                  {/* =================================================
                      WORKLOAD
                  ================================================= */}

                  <motion.div variants={itemVariants}>

                    <Controller
                      name="workload"
                      control={control}
                      render={({ field }) => (
                        <div>

                          <ScoreSelector
                            label="Workload Score *"
                            helper="How heavy has your academic/personal workload felt?"
                            value={field.value ?? null}
                            onChange={field.onChange}
                            scaleLabels={WORKLOAD_LABELS}
                            accent="amber"
                          />

                          {errors.workload && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-coral-300">
                              <AlertCircle size={13} />
                              {errors.workload.message}
                            </p>
                          )}

                        </div>
                      )}
                    />

                  </motion.div>

                  {/* =================================================
                      SLEEP
                  ================================================= */}

                  <motion.div variants={itemVariants}>

                    <Controller
                      name="sleep_quality"
                      control={control}
                      render={({ field }) => (
                        <ScoreSelector
                          label="Sleep Quality"
                          helper="How well have you been sleeping lately?"
                          value={field.value ?? null}
                          onChange={field.onChange}
                          scaleLabels={SLEEP_LABELS}
                          accent="dusk"
                        />
                      )}
                    />

                  </motion.div>

                  {/* =================================================
                      PRIMARY FACTOR
                  ================================================= */}

                  <motion.div
                    variants={itemVariants}
                    className="space-y-2"
                  >

                    <Label className="block text-sm font-medium text-slate-100">

                      Primary factor{" "}

                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>

                    </Label>

                    <div className="flex flex-wrap gap-2">

                      {NOTE_TAGS.map(
                        (t, index) => {
                          const selected =
                            selectedTag === t;

                          return (
                            <motion.button
                              key={t}
                              type="button"
                              initial={{
                                opacity: 0,
                                scale: 0.92,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay:
                                  index * 0.035,
                              }}
                              whileHover={{
                                y: -2,
                                scale: 1.025,
                              }}
                              whileTap={{
                                scale: 0.96,
                              }}
                              onClick={() =>
                                setValue(
                                  "note_tag",
                                  selected
                                    ? undefined
                                    : t
                                )
                              }
                              className={[
                                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",

                                selected
                                  ? "border-dusk-400 bg-dusk-700 text-white shadow-md"
                                  : "border-dusk-300/30 bg-white/[0.05] text-slate-200 hover:border-dusk-300 hover:bg-white/[0.09]",
                              ].join(" ")}
                            >
                              {TAG_LABELS[t]}
                            </motion.button>
                          );
                        }
                      )}

                    </div>
                  </motion.div>

                  {/* =================================================
                      API ERROR
                  ================================================= */}

                  <AnimatePresence>

                    {apiError && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          height: 0,
                        }}
                      >
                        <Alert variant="destructive">
                          <AlertCircle size={16} />

                          <AlertDescription>
                            {apiError}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                  </AnimatePresence>

                  {/* =================================================
                      SUBMIT BUTTON
                  ================================================= */}

                  <motion.div variants={itemVariants}>

                    <Button
                      type="submit"
                      variant="clover"
                      size="lg"
                      disabled={isSubmitting}
                      className="group relative w-full gap-2 overflow-hidden font-semibold shadow-md"
                    >

                      <motion.span
                        className="pointer-events-none absolute inset-0 bg-white/10"
                        initial={{
                          x: "-100%",
                        }}
                        animate={
                          isSubmitting
                            ? { x: "100%" }
                            : { x: "-100%" }
                        }
                        transition={{
                          duration: 1.1,
                          repeat: isSubmitting
                            ? Infinity
                            : 0,
                          ease: "linear",
                        }}
                      />

                      {isSubmitting ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <Sparkles
                          size={17}
                          className="transition-transform duration-300 group-hover:rotate-12"
                        />
                      )}

                      <span className="relative">
                        {isSubmitting
                          ? "Submitting..."
                          : "Submit check-in"}
                      </span>

                    </Button>

                  </motion.div>

                  {/* =================================================
                      PRIVACY FOOTER
                  ================================================= */}

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start gap-2.5 border-t border-dusk-300/15 pt-4 text-xs text-slate-300"
                  >

                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-clover-300"
                    />

                    <span>
                      No names, emails, or free-text notes
                      are collected. See the Privacy & safety
                      page for full details.
                    </span>

                  </motion.div>

                </form>

              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}