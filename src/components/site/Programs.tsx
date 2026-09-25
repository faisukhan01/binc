"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, Info } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";
import { ProgramModal } from "./ProgramModal";

export function Programs() {
  const [active, setActive] = useState<Program | null>(null);
  const { isUr } = useT();

  return (
    <section id="programs" className="bg-navy-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker={isUr ? UR.programs.kicker : "Programs Offered"}
          title={
            isUr ? (
              <>
                {UR.programs.titleA} <span className="text-green-700">{UR.programs.titleB}</span> {UR.programs.titleC}
              </>
            ) : (
              <>
                Choose your <span className="text-green-700">professional degree</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.programs.subtitle
              : "Three career-focused programs, expert faculty and modern facilities — pick the path that builds your brighter future."
          }
        />

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.id} delay={0.1 * i} className="h-full">
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/15"
              >
                {/* Photograph */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={`${p.full} — ${p.title} program at Bright International College`}
                    width={1600}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
                  {/* Duration badge */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold text-navy-900 shadow-sm">
                    <Clock3 className="size-3.5 text-gold-600" />
                    {isUr ? UR.programs.durations[p.duration as keyof typeof UR.programs.durations] ?? p.duration : p.duration}
                  </span>
                  {/* Title over photo */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-3xl font-semibold text-white">{p.title}</h3>
                    <p className="text-sm font-semibold text-navy-100/95">{p.full}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-base font-medium italic text-navy-800">
                    “{isUr ? UR.programs.taglines[p.id as keyof typeof UR.programs.taglines] : p.tagline}”
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {(isUr ? UR.programs.points[p.id as keyof typeof UR.programs.points] : p.points).map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-600" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-5 mt-4 flex flex-wrap gap-1.5">
                    {(isUr ? UR.programs.careers[p.id as keyof typeof UR.programs.careers] : p.careers).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-[1.3fr_1fr] gap-2">
                    <a
                      href="#apply"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-navy-800"
                    >
                      {isUr ? (
                        <>
                          {p.title} {UR.programs.applyFor}
                        </>
                      ) : (
                        <>Apply for {p.title}</>
                      )}
                      <ArrowRight className="size-4 rtl-mirror" />
                    </a>
                    <button
                      onClick={() => setActive(p)}
                      aria-haspopup="dialog"
                      className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-3 text-sm font-bold text-navy-900 transition-colors duration-200 hover:border-gold-500 hover:text-navy-950"
                    >
                      <Info className="size-4 text-gold-600" />
                      {isUr ? UR.programs.details : "Details"}
                    </button>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>

      <ProgramModal program={active} onClose={() => setActive(null)} />
    </section>
  );
}
