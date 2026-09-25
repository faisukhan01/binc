"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Clock3, Info } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";
import { ProgramModal } from "./ProgramModal";
import { cn } from "@/lib/utils";

/**
 * Programs — magazine-style alternating rows.
 * Each degree gets a full-width editorial spread: photograph on one side,
 * numbered serif content on the other, separated by hairlines.
 */
export function Programs() {
  const [active, setActive] = useState<Program | null>(null);
  const { isUr } = useT();

  return (
    <section id="programs" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          align="left"
          kicker={isUr ? UR.programs.kicker : "Programs Offered"}
          title={
            isUr ? (
              <>
                {UR.programs.titleA} <span className="text-green-700">{UR.programs.titleB}</span> {UR.programs.titleC}
              </>
            ) : (
              <>
                Choose your <em className="not-italic text-green-700">professional degree</em>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.programs.subtitle
              : "Three career-focused programs, expert faculty and modern facilities — pick the path that builds your brighter future."
          }
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="divide-y divide-line border-y border-line">
          {PROGRAMS.map((p, i) => {
            const flip = i % 2 === 1; // alternate image side
            const points = isUr ? UR.programs.points[p.id as keyof typeof UR.programs.points] : p.points;
            const careers = isUr ? UR.programs.careers[p.id as keyof typeof UR.programs.careers] : p.careers;
            const duration = isUr
              ? UR.programs.durations[p.duration as keyof typeof UR.programs.durations] ?? p.duration
              : p.duration;

            return (
              <Reveal key={p.id}>
                <article
                  className={`grid items-stretch gap-0 py-10 lg:grid-cols-12 lg:gap-14 lg:py-14 ${
                    flip ? "" : ""
                  }`}
                  aria-label={`${p.full} — ${p.title}`}
                >
                  {/* Photograph */}
                  <div className={cn("relative", flip ? "lg:order-2 lg:col-span-5" : "lg:order-1 lg:col-span-5")}>
                    <div className="group relative overflow-hidden rounded-lg">
                      <Image
                        src={p.image}
                        alt={`${p.full} — ${p.title} program at Bright International College`}
                        width={1400}
                        height={1050}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out lg:group-hover:scale-[1.03]"
                      />
                      {/* Unified warm duotone so all photography reads as one family */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/45 via-transparent to-green-950/10" />
                      {/* Duration chip */}
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold text-green-950 shadow-sm backdrop-blur">
                        <Clock3 className="size-3.5 text-gold-600" />
                        {duration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={cn("flex flex-col pt-7 lg:pt-0", flip ? "lg:order-1 lg:col-span-7" : "lg:order-2 lg:col-span-7")}>
                    <div className="flex items-baseline gap-5">
                      <span aria-hidden className="font-display text-5xl font-medium leading-none text-line select-none lg:text-6xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-4xl font-semibold leading-none text-green-950 sm:text-5xl">
                          {p.title}
                        </h3>
                        <p className="kicker-caps mt-2.5 text-gold-600">{p.full}</p>
                      </div>
                    </div>

                    <p className="mt-6 font-display text-xl italic leading-snug text-green-800 sm:text-2xl">
                      “{isUr ? UR.programs.taglines[p.id as keyof typeof UR.programs.taglines] : p.tagline}”
                    </p>

                    <ul className="mt-6 divide-y divide-line border-y border-line">
                      {points.map((pt) => (
                        <li key={pt} className="flex items-center gap-3 py-3 text-[15px] font-medium text-green-900">
                          <BadgeCheck className="size-4.5 shrink-0 text-gold-600" />
                          {pt}
                        </li>
                      ))}
                    </ul>

                    {/* Careers — quiet small-caps row */}
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-bold uppercase tracking-[0.14em] text-green-800">
                        {isUr ? "المیدان: " : "Careers: "}
                      </span>
                      {careers.join(" · ")}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <a
                        href="#apply"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-md bg-green-950 px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-green-800"
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
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-green-950/25 bg-white px-6 py-3 text-sm font-bold text-green-950 transition-colors duration-200 hover:border-gold-500 hover:bg-parchment"
                      >
                        <Info className="size-4 text-gold-600" />
                        {isUr ? UR.programs.details : "Full Curriculum & Eligibility"}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <ProgramModal program={active} onClose={() => setActive(null)} />
    </section>
  );
}
