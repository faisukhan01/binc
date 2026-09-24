"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HandHeart, PhoneCall, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./Reveal";

const SUPPORT_ITEMS = [
  "100% free admission for eligible welfare workers",
  "Welfare & fee-support guidance for every student",
  "Program and eligibility counselling",
  "Step-by-step admission process assistance",
];

export function Welfare() {
  return (
    <section id="welfare" className="relative overflow-hidden py-20 sm:py-28">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-welfare-900 via-welfare-700 to-welfare-900" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent 0 40px, rgba(255,255,255,.35) 40px 41px)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-welfare-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-96 rounded-full bg-gold-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          kicker="Social Welfare Workers"
          title={
            <>
              Education support that{" "}
              <span className="text-gradient-gold">changes lives</span>
            </>
          }
          subtitle="Special admission support for eligible welfare workers and their families — because talent deserves opportunity."
        />

        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left card */}
          <Reveal>
            <div className="h-full rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-md sm:p-9">
              <div className="flex items-center gap-4">
                <motion.span
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-600/30"
                >
                  <HandHeart className="size-7 text-navy-950" />
                </motion.span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Education Support Program
                </h3>
              </div>
              <p className="mt-5 text-base leading-relaxed text-white/85">
                Registered welfare workers (PWWF) and eligible applicants can study{" "}
                <strong className="text-gold-300">completely free of admission charges</strong>.
                Our admissions office verifies eligibility and walks you through every step.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {SUPPORT_ITEMS.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 text-sm font-medium text-white"
                  >
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-gold-400" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right card */}
          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-welfare-500 via-gold-400 to-welfare-500" />
              <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.3em] text-welfare-700">
                Special Welfare Offer
              </p>
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", damping: 14 }}
                className="mt-3 text-center font-display text-5xl sm:text-6xl font-black leading-none text-gradient-navy-red"
              >
                100%
                <span className="block text-3xl sm:text-4xl mt-1 text-brand-red">
                  ADMISSION FREE
                </span>
              </motion.p>
              <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
                For eligible welfare workers. Contact admissions for eligibility
                check and verification.
              </p>

              <div className="mt-5 rounded-2xl bg-navy-950 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy-100/70">
                  Welfare Helpline
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 font-display text-2xl sm:text-3xl font-black text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <PhoneCall className="size-6" />
                  {SITE.whatsapp}
                </a>
              </div>

              <a
                href="#apply"
                className="mt-4 flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-welfare-500 to-welfare-700 px-6 py-3.5 text-base font-extrabold text-white shadow-lg shadow-welfare-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Sparkles className="size-5" />
                Check My Eligibility
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
