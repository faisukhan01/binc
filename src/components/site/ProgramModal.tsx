"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  Route,
  X,
} from "lucide-react";
import { SITE, type Program } from "@/lib/site-data";

interface Props {
  program: Program | null;
  onClose: () => void;
}

export function ProgramModal({ program, onClose }: Props) {
  // Body scroll lock + Escape close
  useEffect(() => {
    if (!program) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [program, onClose]);

  function applyToProgram(p: Program) {
    // Notify the admission form to pre-select this program, then jump to it
    window.dispatchEvent(
      new CustomEvent("binc:select-program", { detail: { program: p.title } })
    );
    onClose();
    requestAnimationFrame(() => {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <AnimatePresence>
      {program && (
        <motion.div
          key="program-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/75 p-0 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${program.title} — ${program.full} program details`}
        >
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.65)] sm:rounded-[1.75rem]"
          >
            {/* Banner */}
            <div className="relative h-44 w-full overflow-hidden sm:h-52">
              <Image
                src={program.image}
                alt={`${program.full} at Bright International College`}
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/10" />
              <button
                onClick={onClose}
                aria-label="Close program details"
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-950"
              >
                <X className="size-5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
                <div>
                  <h3 className="font-display text-3xl font-black text-white drop-shadow sm:text-4xl">
                    {program.title}
                  </h3>
                  <p className="text-sm font-bold text-navy-100/95">{program.full}</p>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-green-950 shadow-lg backdrop-blur">
                    <Clock3 className="size-3.5 text-gold-600" />
                    {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-green-950 shadow-lg">
                    <CalendarDays className="size-3.5" />
                    Fall 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6 p-5 sm:p-7">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <p className="font-display text-base font-bold italic text-navy-800">
                  “{program.tagline}”
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {program.overview}
                </p>
              </motion.section>

              {/* Eligibility */}
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
              >
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-green-950">
                  <GraduationCap className="size-4 text-gold-600" /> Who can apply
                </h4>
                <ul className="mt-3 space-y-2">
                  {program.eligibility.map((e) => (
                    <li
                      key={e}
                      className="flex items-start gap-2.5 rounded-lg bg-paper px-3.5 py-2.5 text-sm font-semibold text-green-950 ring-1 ring-line"
                    >
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-600" />
                      {e}
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Curriculum journey */}
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-green-950">
                  <Route className="size-4 text-gold-600" /> Your {program.years}-year journey
                </h4>
                <ol className="relative mt-3 space-y-0 border-l-2 border-dashed border-line pl-5">
                  {program.curriculum.map((c, i) => (
                    <motion.li
                      key={c.year}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.24 + i * 0.06 }}
                      className="relative pb-3.5 last:pb-0"
                    >
                      <span className="absolute -left-[27px] top-0.5 grid size-5 place-items-center rounded-full bg-green-800 ring-4 ring-white">
                        <span className="size-1.5 rounded-full bg-white" />
                      </span>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
                        {c.year}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.focus}</p>
                    </motion.li>
                  ))}
                </ol>
              </motion.section>

              {/* Careers */}
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-green-950">
                  <BadgeCheck className="size-4 text-gold-600" /> Career pathways
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {program.careers.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs font-semibold text-green-900"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="grid gap-2.5 border-t border-border pt-5 sm:grid-cols-[1.4fr_1fr]"
              >
                <button
                  onClick={() => applyToProgram(program)}
                  className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-green-950 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-green-800"
                >
                  Apply for {program.title}
                  <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum! Please share the fee structure and eligibility for ${program.title} (${program.full}) — Fall 2026 admission.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-md border-2 border-welfare-600/60 px-5 py-3 text-sm font-bold text-welfare-700 transition-all hover:bg-welfare-600 hover:text-white"
                >
                  Ask on WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Top accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gold-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
