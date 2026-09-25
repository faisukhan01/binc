"use client";

import {
  BadgeCheck,
  BookOpen,
  CalendarRange,
  ClipboardEdit,
  FileCheck,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  PhoneCall,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { ADMISSION_STEPS, FEE_INFO, SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

const STEP_ICONS = { ClipboardEdit, PhoneCall, FileCheck, GraduationCap } as const;
const INCLUDE_ICONS = [FlaskConical, BookOpen, Stethoscope, BadgeCheck] as const;
const PAYMENT_ICONS = [CalendarRange, Wallet, HeartHandshake] as const;

export function Admissions() {
  const { isUr } = useT();
  const steps = isUr
    ? ADMISSION_STEPS.map((s, i) => ({ ...s, title: UR.process.steps[i].title, desc: UR.process.steps[i].desc }))
    : ADMISSION_STEPS;
  const includes = isUr ? UR.fees.includes : FEE_INFO.includes;
  const payments = isUr ? UR.fees.payment : FEE_INFO.payment;

  return (
    <section id="admissions" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker={isUr ? UR.process.kicker : "How to Apply"}
          title={
            isUr ? (
              <>
                {UR.process.titleA} <span className="text-green-700">{UR.process.titleB}</span> {UR.process.titleC}
              </>
            ) : (
              <>
                Admission in <span className="text-green-700">4 easy steps</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.process.subtitle
              : "From online application to your welcome kit — the whole journey is simple, guided and fast."
          }
        />

        {/* Steps — numbered editorial row */}
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[s.icon as keyof typeof STEP_ICONS];
            return (
              <Reveal key={s.step} delay={0.08 * i}>
                <li className="relative border-t-2 border-navy-100 pt-5 transition-colors duration-300 hover:border-gold-500">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl font-semibold text-gold-500">
                      {String(s.step).padStart(2, "0")}
                    </span>
                    <Icon className="size-5 text-navy-400" aria-hidden />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <a
              href="#apply"
              className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-lg bg-navy-950 px-8 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-navy-800"
            >
              {isUr ? UR.process.cta : "Start Step 1 — Apply Online"}
              <span aria-hidden className="rtl-mirror transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>

        {/* Fees & payment — quiet two-column band */}
        <Reveal delay={0.2}>
          <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
            {/* Included */}
            <div className="bg-white p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
                {isUr ? UR.fees.kicker : "Fees & Payments"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-navy-900">
                {isUr ? UR.fees.titleA + " " + UR.fees.titleB : "Everything included in your tuition"}
              </h3>
              <ul className="mt-6 space-y-4">
                {includes.map((inc, i) => {
                  const Icon = INCLUDE_ICONS[i % INCLUDE_ICONS.length];
                  return (
                    <li key={inc.label} className="flex items-start gap-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-bold text-navy-900">{inc.label}</p>
                        <p className="text-sm text-muted-foreground">{inc.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Payment options */}
            <div className="bg-navy-950 p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-400">
                {isUr ? UR.fees.panelKicker : "Simple & Transparent"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                {isUr ? UR.fees.subtitle : "Flexible ways to pay — and study free if you qualify"}
              </h3>
              <ul className="mt-6 space-y-4">
                {payments.map((pay, i) => {
                  const Icon = PAYMENT_ICONS[i % PAYMENT_ICONS.length];
                  return (
                    <li key={pay.title} className="flex items-start gap-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/5 text-gold-400">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-bold text-white">{pay.title}</p>
                        <p className="text-sm text-navy-100/75">{pay.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <a
                href={`https://wa.me/${SITE.whatsappIntl}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-lg bg-welfare-700 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-welfare-500"
              >
                <PhoneCall className="size-5" />
                {isUr ? UR.fees.feeSchedule : "Get Your Fee Schedule on WhatsApp"}
              </a>
              <p className="mt-3 text-center text-xs leading-relaxed text-navy-100/60">
                {isUr ? UR.fees.panelBody : "Exact fee amounts are shared by the admissions office for the current session — including installment options and your welfare eligibility."}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
