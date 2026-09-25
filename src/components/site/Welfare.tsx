"use client";

import { CheckCircle2, HandHeart, PhoneCall } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

const SUPPORT_ITEMS = [
  "100% free admission for eligible welfare workers",
  "Welfare & fee-support guidance for every student",
  "Program and eligibility counselling",
  "Step-by-step admission process assistance",
];

export function Welfare() {
  const { isUr } = useT();
  const items = isUr ? UR.welfare.items : SUPPORT_ITEMS;

  return (
    <section id="welfare" className="relative overflow-hidden bg-navy-950 py-20 sm:py-28">
      {/* Quiet architectural texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 79px, rgba(255,255,255,.5) 79px 80px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          kicker={isUr ? UR.welfare.kicker : "Social Welfare Workers"}
          title={
            isUr ? (
              <>
                {UR.welfare.titleA} <span className="text-gold-400">{UR.welfare.titleB}</span>
              </>
            ) : (
              <>
                Education support that{" "}
                <span className="text-gold-400">changes lives</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.welfare.subtitle
              : "Special admission support for eligible welfare workers and their families — because talent deserves opportunity."
          }
        />

        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left card */}
          <Reveal>
            <div className="h-full rounded-xl border border-white/12 bg-white/[0.05] p-6 sm:p-9">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-gold-500">
                  <HandHeart className="size-7 text-navy-950" />
                </span>
                <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  {isUr ? UR.welfare.cardTitle : "Education Support Program"}
                </h3>
              </div>
              <p className="mt-5 text-base leading-relaxed text-navy-100/90">
                {isUr ? (
                  <>
                    {UR.welfare.cardBodyA} <strong className="text-gold-300">{UR.welfare.cardBodyStrong}</strong>
                    {UR.welfare.cardBodyB}
                  </>
                ) : (
                  <>
                    Registered welfare workers (PWWF) and eligible applicants can study{" "}
                    <strong className="text-gold-300">completely free of admission charges</strong>.
                    Our admissions office verifies eligibility and walks you through every step.
                  </>
                )}
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm font-medium text-white"
                  >
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-gold-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right card */}
          <Reveal delay={0.12}>
            <div className="relative flex h-full flex-col rounded-xl border border-gold-500/30 bg-white p-6 shadow-2xl shadow-navy-950/60 sm:p-8">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-navy-700">
                {isUr ? UR.welfare.offerKicker : "Special Welfare Offer"}
              </p>
              <p className="mt-3 text-center font-display text-6xl font-semibold leading-none text-navy-950">
                100%
                <span className="mt-1 block text-2xl font-semibold text-brand-red sm:text-3xl">
                  {isUr ? UR.welfare.admissionFree : "ADMISSION FREE"}
                </span>
              </p>
              <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
                {isUr ? UR.welfare.offerBody : "For eligible welfare workers. Contact admissions for eligibility check and verification."}
              </p>

              <div className="mt-5 rounded-lg bg-navy-950 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy-100/70">
                  {isUr ? UR.welfare.helpline : "Welfare Helpline"}
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rtl-ltr mt-1 flex items-center justify-center gap-2 font-display text-2xl font-semibold text-gold-400 transition-colors hover:text-gold-300 sm:text-3xl"
                >
                  <PhoneCall className="size-6" />
                  {SITE.whatsapp}
                </a>
              </div>

              <a
                href="#apply"
                className="mt-4 flex min-h-[50px] flex-1 items-center justify-center rounded-lg bg-brand-red px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-redlight"
              >
                {isUr ? UR.welfare.checkEligibility : "Check My Eligibility"}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
