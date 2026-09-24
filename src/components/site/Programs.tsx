"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, Info } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./Reveal";
import { ProgramModal } from "./ProgramModal";

export function Programs() {
  const [active, setActive] = useState<Program | null>(null);

  return (
    <section id="programs" className="relative bg-navy-50/60 py-20 sm:py-28 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(20,64,143,0.08), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Programs Offered"
          title={
            <>
              Choose your <span className="text-gradient-navy-red">professional degree</span>
            </>
          }
          subtitle="Three career-focused programs, expert faculty and modern facilities — pick the path that builds your brighter future."
        />

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.id} delay={0.1 * i} className="h-full">
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group card-shine flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-lg shadow-navy-900/8 transition-shadow duration-300 hover:shadow-2xl hover:shadow-navy-900/20"
              >
                {/* Poster */}
                <div className="relative overflow-hidden">
                  <Image
                    src={p.image}
                    alt={`${p.full} — ${p.title} program at Bright International College`}
                    width={1024}
                    height={1536}
                    className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
                  {/* Duration badge */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-navy-900 shadow-lg backdrop-blur">
                    <Clock3 className="size-3.5 text-brand-red" />
                    {p.duration}
                  </span>
                  {/* Bottom overlay title */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-3xl font-black text-white drop-shadow-md">
                      {p.title}
                    </h3>
                    <p className="text-sm font-semibold text-navy-100/95">{p.full}</p>
                  </div>
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${p.accent}`} />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-base font-bold italic text-navy-800">
                    “{p.tagline}”
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-welfare-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 mb-5 flex flex-wrap gap-1.5">
                    {p.careers.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-bold text-navy-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-[1.3fr_1fr] gap-2">
                    <a
                      href="#apply"
                      className="group/btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-redlight"
                    >
                      Apply for {p.title}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </a>
                    <button
                      onClick={() => setActive(p)}
                      aria-haspopup="dialog"
                      className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-navy-100 bg-white px-3 py-3 text-sm font-extrabold text-navy-800 transition-all duration-300 hover:border-gold-400 hover:bg-gold-300/15 hover:text-navy-950"
                    >
                      <Info className="size-4 text-brand-red" />
                      Details
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
