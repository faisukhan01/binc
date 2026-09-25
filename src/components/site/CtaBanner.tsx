"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlarmClock, ArrowRight, RadioTower, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { SITE } from "@/lib/site-data";

interface Remaining {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function diff(deadline: string): Remaining | null {
  // End-of-day local time on the deadline date
  const end = new Date(`${deadline}T23:59:59`).getTime();
  if (Number.isNaN(end)) return null;
  const ms = end - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    mins: Math.floor((ms % 3_600_000) / 60_000),
    secs: Math.floor((ms % 60_000) / 1000),
  };
}

export function CtaBanner() {
  const [total, setTotal] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admissions")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.ok && typeof d.total === "number") setTotal(d.total);
      })
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.ok && typeof d.settings?.admissionDeadline === "string") {
          setDeadline(d.settings.admissionDeadline || null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const update = () => setRemaining(diff(deadline ?? ""));
    // First update on the next tick; then every second + when tab becomes visible
    const initial = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [deadline]);

  const closeLabel = deadline
    ? new Date(`${deadline}T12:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section aria-label="Admissions call to action" className="relative bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-850 to-navy-700 px-6 py-12 text-center shadow-2xl shadow-navy-900/30 sm:px-12 sm:py-16">
            {/* decorative */}
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent 0 26px, rgba(255,255,255,.4) 26px 27px)",
              }}
            />
            <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-brand-red/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-gold-400/20 blur-3xl" />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-gold-300"
            >
              <Sparkles className="size-3.5" />
              Fall 2026 Intake
            </motion.p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-3xl font-black leading-tight text-white sm:text-5xl">
              Your seat is waiting. <span className="text-gradient-gold">Claim it.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy-100/85 sm:text-base">
              Applications for Fall 2026 are open with limited seats per program.
              Apply online today — or WhatsApp us for instant guidance.
            </p>

            {/* Live applications counter */}
            {total !== null && total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="relative mx-auto mt-5 inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-welfare-500 opacity-80" />
                  <span className="relative inline-flex size-2 rounded-full bg-welfare-500" />
                </span>
                <span className="text-xs font-bold text-gold-300 sm:text-sm">
                  <RadioTower className="mr-1.5 inline size-3.5" />
                  Live · {total} application{total === 1 ? "" : "s"} already received for Fall
                  2026
                </span>
              </motion.div>
            )}

            {/* Deadline countdown (staff-configured, hidden when unset/past) */}
            <AnimatePresence>
              {remaining && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative mx-auto mt-6 max-w-md"
                  role="timer"
                  aria-label={`Applications close on ${closeLabel}. ${remaining.days} days, ${remaining.hours} hours, ${remaining.mins} minutes and ${remaining.secs} seconds remaining.`}
                >
                  <p className="mb-3 flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/70">
                    <AlarmClock className="size-3.5 text-gold-400" />
                    Applications close {closeLabel}
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {(
                      [
                        { label: "Days", v: remaining.days },
                        { label: "Hours", v: remaining.hours },
                        { label: "Mins", v: remaining.mins },
                        { label: "Secs", v: remaining.secs },
                      ] as const
                    ).map((u) => (
                      <div
                        key={u.label}
                        className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] px-1 py-3 backdrop-blur-sm"
                      >
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-red via-gold-400 to-brand-red opacity-80" />
                        <p
                          key={u.v}
                          className="font-display text-2xl font-black tabular-nums leading-none text-white sm:text-3xl"
                        >
                          {String(u.v).padStart(2, "0")}
                        </p>
                        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/90">
                          {u.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#apply"
                className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-red to-brand-redlight px-8 py-3.5 text-base font-extrabold text-white shadow-xl shadow-brand-red/40 transition-all hover:-translate-y-1"
              >
                Apply Online
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" />
              </a>
              <a
                href={`https://wa.me/${SITE.whatsappIntl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] items-center rounded-2xl border border-white/25 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-950"
              >
                WhatsApp {SITE.whatsapp}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
