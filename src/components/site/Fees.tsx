"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  CalendarRange,
  FlaskConical,
  HeartHandshake,
  Info,
  ShieldCheck,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { FEE_INFO, PROGRAMS, SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

const INCLUDE_ICONS = { FlaskConical, BookOpen, Stethoscope, BadgeCheck } as const;
const PAYMENT_ICONS = { CalendarRange, Wallet, HeartHandshake } as const;

export function Fees() {
  const { isUr } = useT();
  const includes = isUr
    ? FEE_INFO.includes.map((f, i) => ({ ...f, label: UR.fees.includes[i].label, desc: UR.fees.includes[i].desc }))
    : FEE_INFO.includes;
  const payments = isUr
    ? FEE_INFO.payment.map((p, i) => ({ ...p, title: UR.fees.payment[i].title, desc: UR.fees.payment[i].desc }))
    : FEE_INFO.payment;
  return (
    <section id="fees" className="relative overflow-hidden bg-navy-50 py-20 sm:py-28">
      {/* decorative dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#c7d4ec 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker={isUr ? UR.fees.kicker : "Fees & Payments"}
          title={
            isUr ? (
              <>
                {UR.fees.titleA} <span className="text-gradient-navy-red">{UR.fees.titleB}</span>
              </>
            ) : (
              <>
                Transparent fees, <span className="text-gradient-navy-red">flexible plans</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.fees.subtitle
              : "No hidden charges. Get the exact fee schedule for your program directly from our admissions office — instantly on WhatsApp."
          }
        />

        {/* What your fee includes */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {includes.map((f, i) => {
            const Icon = INCLUDE_ICONS[f.icon as keyof typeof INCLUDE_ICONS];
            return (
              <Reveal key={f.label} delay={0.07 * i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card-shine h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-800 ring-1 ring-navy-100">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold text-navy-900">
                    {f.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Payment options + program CTA row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {payments.map((p, i) => {
            const Icon = PAYMENT_ICONS[p.icon as keyof typeof PAYMENT_ICONS];
            const highlight = p.icon === "HeartHandshake";
            return (
              <Reveal key={p.title} delay={0.1 * i}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`card-shine flex h-full items-start gap-4 rounded-2xl p-6 shadow-md ${
                    highlight
                      ? "bg-gradient-to-br from-welfare-700 to-welfare-900 text-white shadow-welfare-900/30"
                      : "border border-navy-100 bg-white text-navy-900"
                  }`}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                      highlight ? "bg-white/12 text-gold-300" : "bg-navy-50 text-brand-red ring-1 ring-navy-100"
                    }`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold">{p.title}</h3>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        highlight ? "text-white/85" : "text-muted-foreground"
                      }`}
                    >
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Get exact fee schedule — per program WhatsApp CTA */}
        <Reveal delay={0.15}>
          <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 shadow-2xl shadow-navy-900/30">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-gold-400">
                  <Info className="size-3.5" />
                  {isUr ? UR.fees.panelKicker : "Exact Fee Schedule"}
                </p>
                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-black text-white">
                  {isUr ? (
                    <>
                      {UR.fees.panelTitleA} <span className="text-gradient-gold">{UR.fees.panelTitleB}</span> {UR.fees.panelTitleC}
                    </>
                  ) : (
                    <>
                      Get your program&apos;s fee schedule in <span className="text-gradient-gold">under a minute</span>
                    </>
                  )}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy-100/80 sm:text-base">
                  {isUr ? UR.fees.panelBody : "Fee amounts vary by session and university affiliation, so our admissions team shares the current official schedule personally — including installment options and any welfare support you qualify for."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-100/75">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-4.5 text-gold-400" /> {isUr ? UR.fees.chipOfficial : "Official & current rates"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="size-4.5 text-gold-400" /> {isUr ? UR.fees.chipInstallment : "Installment eligibility check"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {PROGRAMS.map((p) => (
                  <a
                    key={p.id}
                    href={`https://wa.me/${SITE.whatsappIntl}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum! Please share the fee structure for ${p.title} (${p.full}) — Fall 2026 admission.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex min-h-[52px] items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-white/12"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-welfare-500/20 text-welfare-500">
                        <svg viewBox="0 0 24 24" className="size-4.5 fill-current" aria-hidden>
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
                        </svg>
                      </span>
                      <span>
                        {isUr ? `${p.title} ${UR.fees.feeSchedule}` : `${p.title} fee schedule`}
                        <span className="block text-[11px] font-medium text-navy-100/60">
                          {p.duration} · {p.full}
                        </span>
                      </span>
                    </span>
                    <span className="text-gold-400 transition-transform duration-300 group-hover:translate-x-1 rtl-mirror">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
