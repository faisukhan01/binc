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

/**
 * Welfare — a single dignified dark band.
 * The message (free education for welfare workers) deserves gravitas,
 * not a sales card. Editorial hairlines + gold accents only.
 */
export function Welfare() {
  const { isUr } = useT();
  const items = isUr ? UR.welfare.items : SUPPORT_ITEMS;

  return (
    <section id="welfare" className="relative overflow-hidden bg-green-950 py-20 sm:py-28">
      {/* Quiet architectural texture — faint vertical rules */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 119px, rgba(255,255,255,.6) 119px 120px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          index="03"
          align="left"
          kicker={isUr ? UR.welfare.kicker : "Social Welfare Workers"}
          title={
            isUr ? (
              <>
                {UR.welfare.titleA} <span className="text-gold-400">{UR.welfare.titleB}</span>
              </>
            ) : (
              <>
                Education support that{" "}
                <em className="not-italic text-gold-400">changes lives</em>
              </>
            )
          }
        />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Left — narrative + commitments as hairline rows */}
          <div>
            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {isUr ? (
                  <>
                    {UR.welfare.cardBodyA} <strong className="text-gold-300">{UR.welfare.cardBodyStrong}</strong>
                    {UR.welfare.cardBodyB}
                  </>
                ) : (
                  <>
                    Registered welfare workers (PWWF) and eligible applicants can study{" "}
                    <strong className="text-gold-300">completely free of admission charges</strong>.
                    Our admissions office verifies eligibility and walks you through every step —
                    because talent deserves opportunity.
                  </>
                )}
              </p>
            </Reveal>

            <ul className="mt-8 divide-y divide-white/12 border-y border-white/12">
              {items.map((item, i) => (
                <Reveal key={item} delay={0.05 * i}>
                  <li className="flex items-center gap-3.5 py-4 text-[15px] font-medium text-white">
                    <CheckCircle2 className="size-5 shrink-0 text-gold-400" />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <a
                href="#apply"
                className="mt-8 inline-flex min-h-[52px] items-center gap-2.5 rounded-md border border-gold-500/60 px-7 py-3.5 text-base font-bold text-gold-400 transition-colors duration-200 hover:bg-gold-500 hover:text-green-950"
              >
                <HandHeart className="size-5" />
                {isUr ? UR.welfare.checkEligibility : "Check My Eligibility"}
              </a>
            </Reveal>
          </div>

          {/* Right — the offer, set like a certificate */}
          <Reveal delay={0.12}>
            <div className="relative h-full rounded-lg border border-gold-500/35 bg-white/[0.04] p-8 text-center sm:p-10">
              <p className="kicker-caps text-white/60">
                {isUr ? UR.welfare.offerKicker : "Special Welfare Offer"}
              </p>

              <p className="mt-6 font-display text-[5.5rem] font-medium leading-none text-gold-400 sm:text-[7rem]">
                100%
              </p>
              <p className="kicker-caps mt-3 text-gold-300">
                {isUr ? UR.welfare.admissionFree : "Admission Free"}
              </p>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/70">
                {isUr ? UR.welfare.offerBody : "For eligible welfare workers and their families. Contact admissions for verification and eligibility."}
              </p>

              <div className="mt-8 border-t border-white/12 pt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  {isUr ? UR.welfare.helpline : "Welfare Helpline"}
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rtl-ltr mt-2 inline-flex items-center justify-center gap-2.5 font-display text-3xl font-medium text-white transition-colors hover:text-gold-400 sm:text-4xl"
                >
                  <PhoneCall className="size-6 text-gold-400" />
                  {SITE.whatsapp}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
