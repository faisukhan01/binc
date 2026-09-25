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
          index="04"
          align="left"
          kicker={isUr ? UR.process.kicker : "How to Apply"}
          title={
            isUr ? (
              <>
                {UR.process.titleA} <span className="text-green-700">{UR.process.titleB}</span> {UR.process.titleC}
              </>
            ) : (
              <>
                Admission in <em className="not-italic text-green-700">4 easy steps</em>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.process.subtitle
              : "From online application to your welcome kit — the whole journey is simple, guided and fast."
          }
        />

        {/* Steps — numbered editorial columns with hairline tops */}
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[s.icon as keyof typeof STEP_ICONS];
            return (
              <Reveal key={s.step} delay={0.08 * i}>
                <li className="group relative border-t-2 border-line pt-5 transition-colors duration-300 hover:border-gold-500">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl font-medium text-gold-600">
                      {String(s.step).padStart(2, "0")}
                    </span>
                    <Icon className="size-5 text-green-800/50 transition-colors group-hover:text-green-800" aria-hidden />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-green-950">
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
          <div className="mt-12">
            <a
              href="#apply"
              className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-md bg-green-950 px-8 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-green-800"
            >
              {isUr ? UR.process.cta : "Start Step 1 — Apply Online"}
              <span aria-hidden className="rtl-mirror transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>

        {/* Fees & payment — quiet two-column ledger */}
        <Reveal delay={0.2}>
          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-2">
            {/* Included */}
            <div className="bg-white p-6 sm:p-9">
              <p className="kicker-caps text-gold-600">
                {isUr ? UR.fees.kicker : "Fees & Payments"}
              </p>
              <h3 className="mt-2.5 font-display text-2xl font-semibold text-green-950">
                {isUr ? UR.fees.titleA + " " + UR.fees.titleB : "Everything included in your tuition"}
              </h3>
              <ul className="mt-7 divide-y divide-line border-t border-line">
                {includes.map((inc, i) => {
                  const Icon = INCLUDE_ICONS[i % INCLUDE_ICONS.length];
                  return (
                    <li key={inc.label} className="flex items-start gap-4 py-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-paper text-green-800 ring-1 ring-line">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-bold text-green-950">{inc.label}</p>
                        <p className="text-sm text-muted-foreground">{inc.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Payment options — dark ledger panel */}
            <div className="bg-green-950 p-6 sm:p-9">
              <p className="kicker-caps text-gold-400">
                {isUr ? UR.fees.panelKicker : "Simple & Transparent"}
              </p>
              <h3 className="mt-2.5 font-display text-2xl font-semibold text-white">
                {isUr ? UR.fees.subtitle : "Flexible ways to pay — and study free if you qualify"}
              </h3>
              <ul className="mt-7 divide-y divide-white/10 border-t border-white/10">
                {payments.map((pay, i) => {
                  const Icon = PAYMENT_ICONS[i % PAYMENT_ICONS.length];
                  return (
                    <li key={pay.title} className="flex items-start gap-4 py-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-white/15 bg-white/5 text-gold-400">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-bold text-white">{pay.title}</p>
                        <p className="text-sm text-white/65">{pay.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <a
                href={`https://wa.me/${SITE.whatsappIntl}`}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-md bg-gold-500 px-6 py-3 text-base font-bold text-green-950 transition-colors hover:bg-gold-400"
              >
                <PhoneCall className="size-5" />
                {isUr ? UR.fees.feeSchedule : "Get Your Fee Schedule on WhatsApp"}
              </a>
              <p className="mt-3.5 text-center text-xs leading-relaxed text-white/55">
                {isUr ? UR.fees.panelBody : "Exact fee amounts are shared by the admissions office for the current session — including installment options and your welfare eligibility."}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
