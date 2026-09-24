"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock3, Hourglass, Sparkles, X } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

const SPARKS = [
  { left: "6%", top: "12%", size: 14, delay: 0 },
  { left: "88%", top: "18%", size: 18, delay: 0.4 },
  { left: "78%", top: "70%", size: 12, delay: 0.9 },
  { left: "12%", top: "76%", size: 16, delay: 1.3 },
  { left: "50%", top: "6%", size: 12, delay: 1.7 },
  { left: "30%", top: "86%", size: 10, delay: 2.1 },
];

export function AdmissionPopup() {
  const [open, setOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { isUr } = useT();

  // Deadline awareness — staff-configured countdown from /api/settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const dl = d?.settings?.admissionDeadline;
        if (!dl) return;
        const ms = new Date(`${dl}T23:59:59`).getTime() - Date.now();
        if (ms > 0) setDaysLeft(Math.ceil(ms / 86_400_000));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    try {
      if (!sessionStorage.getItem("binc-popup-shown")) {
        timer = setTimeout(() => {
          setOpen(true);
          sessionStorage.setItem("binc-popup-shown", "1");
        }, 1600);
      }
    } catch {
      timer = setTimeout(() => setOpen(true), 1600);
    }
    // ESC to close
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Admissions Open Fall 2026 announcement"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 60, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]"
          >
            {/* Header band */}
            <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-navy-700 px-6 pb-8 pt-9 text-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent 0 22px, rgba(255,255,255,.25) 22px 23px)",
                }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 12 }}
                className="relative mx-auto mb-4 grid size-20 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl shadow-gold-600/40"
              >
                <Sparkles className="size-9 text-navy-950" />
              </motion.div>
              <p className="relative text-[11px] font-extrabold uppercase tracking-[0.35em] text-gold-400">
                {isUr ? UR.popup.kicker : "Bright International College"}
              </p>
              <h3 className="relative mt-2 font-display text-4xl font-black text-white sm:text-5xl">
                {isUr ? UR.popup.titleA : "Admissions"}
                <span className="block text-gradient-gold">{isUr ? UR.popup.titleB : "OPEN — Fall 26"}</span>
              </h3>
              {daysLeft !== null && (
                <p className="relative mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-red/90 px-3.5 py-1 text-[11px] font-extrabold text-white shadow-lg">
                  <Hourglass className="size-3.5" />
                  {(isUr ? UR.popup.daysLeft : "Only {n} days left to apply!").replace("{n}", String(daysLeft))}
                </p>
              )}
              {/* sparkles */}
              {SPARKS.map((s, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute animate-sparkle"
                  style={{
                    left: s.left,
                    top: s.top,
                    width: s.size,
                    height: s.size,
                    animationDelay: `${s.delay}s`,
                  }}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="fill-gold-400">
                    <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
                  </svg>
                </span>
              ))}
            </div>

            {/* Body */}
            <div className="relative px-6 pb-7 pt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-xl bg-navy-50 px-3.5 py-3">
                  <CalendarDays className="size-5 shrink-0 text-navy-700" />
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {isUr ? UR.popup.sessionLabel : "Session Starts"}
                    </p>
                    <p className="text-sm font-extrabold text-navy-900">{isUr ? UR.popup.sessionValue : "September 2026"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 px-3.5 py-3">
                  <Clock3 className="size-5 shrink-0 text-brand-red" />
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {isUr ? UR.popup.seatsLabel : "Limited Seats"}
                    </p>
                    <p className="text-sm font-extrabold text-brand-red">{isUr ? UR.popup.seatsValue : "First Come Basis"}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
                {isUr ? UR.popup.body : "Pharm-D · DPT · BSCS — apply online in under 2 minutes and our admissions team will call you back the same day."}
              </p>

              <div className="mt-5 grid gap-2.5">
                <a
                  href="#apply"
                  onClick={() => setOpen(false)}
                  className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-red to-brand-redlight px-6 py-3.5 text-base font-extrabold text-white shadow-lg shadow-brand-red/40 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {isUr ? UR.popup.apply : "Apply Online Now"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl-mirror">→</span>
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-welfare-500 px-6 py-3 text-base font-bold text-white transition-all hover:bg-welfare-700"
                >
                  Ask on WhatsApp — {SITE.whatsapp}
                </a>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full text-center text-xs font-semibold text-muted-foreground hover:text-navy-900 transition-colors"
              >
                {isUr ? UR.popup.later : "Maybe later — continue browsing"}
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label={isUr ? UR.popup.close : "Close announcement"}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-950"
            >
              <X className="size-5" />
            </button>

            {/* Top shimmer line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-red via-gold-400 to-brand-red" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
