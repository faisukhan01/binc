"use client";

import { motion } from "framer-motion";
import { ClipboardEdit, FileCheck, GraduationCap, PhoneCall } from "lucide-react";
import { ADMISSION_STEPS } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./Reveal";

const ICONS = {
  ClipboardEdit,
  PhoneCall,
  FileCheck,
  GraduationCap,
} as const;

export function Process() {
  return (
    <section id="process" className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="How to Apply"
          title={
            <>
              Admission in <span className="text-gradient-navy-red">4 easy steps</span>
            </>
          }
          subtitle="From online application to your welcome kit — the whole journey is simple, guided and fast."
        />

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connector line (desktop) */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-navy-100 via-gold-400 to-navy-100 lg:block"
            aria-hidden
          />
          {ADMISSION_STEPS.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            return (
              <Reveal key={s.step} delay={0.1 * i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative">
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.1, type: "spring", damping: 12 }}
                      className="relative z-10 grid size-24 place-items-center rounded-[1.75rem] bg-gradient-to-br from-navy-800 to-navy-950 shadow-xl shadow-navy-900/25"
                    >
                      <Icon className="size-10 text-gold-400" />
                    </motion.span>
                    <span className="absolute -right-2 -top-2 z-20 grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-red to-brand-redlight font-display text-lg font-black text-white shadow-lg ring-4 ring-white">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 text-center">
            <a
              href="#apply"
              className="group inline-flex min-h-[54px] items-center gap-2.5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-navy-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Start Step 1 — Apply Online
              <span className="grid size-6 place-items-center rounded-full bg-gold-400 text-navy-950 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
