"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { GALLERY, SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

export function CampusLife() {
  const { isUr } = useT();

  return (
    <section id="campus" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          align="left"
          kicker={isUr ? UR.campus.kicker : "Campus Life"}
          title={
            isUr ? (
              <>
                {UR.campus.titleA} <span className="text-green-700">{UR.campus.titleB}</span>
              </>
            ) : (
              <>
                Life at <em className="not-italic text-green-700">Bright</em>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.campus.subtitle
              : "A welcoming campus in the heart of Lahore — where learning goes beyond the classroom."
          }
        />

        {/* Campus film banner */}
        <Reveal>
          <div className="relative overflow-hidden rounded-lg shadow-xl shadow-green-950/15">
            <video
              className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
              src="/videos/campus.mp4"
              poster="/images/real/campus-building.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Film of campus life at Bright International College, Lahore"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="kicker-caps text-gold-400">
                {isUr ? UR.campus.kicker : "Campus Life"}
              </p>
              <p className="mt-1.5 max-w-xl font-display text-xl font-medium leading-snug text-white sm:text-2xl">
                {isUr
                  ? UR.campus.subtitle
                  : "Learning beyond the classroom — labs, lawns, seminars and a family that grows together."}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Highlights strip */}
        <Reveal>
          <ul className="mb-8 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {(isUr ? UR.campus.highlights : ["Modern Campus", "Student Societies", "Seminars & Events", "Safe Environment"]).map(
              (h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm font-semibold text-green-950">
                  <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
                  {h}
                </li>
              )
            )}
          </ul>
        </Reveal>

        {/* Photo grid — unified treatment: edge-to-edge frames, caption overlay on hover */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={0.05 * (i % 4)}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-green-950">
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={900}
                  height={675}
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]"
                />
                {/* Unified warm grade + caption veil */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-3 top-3 rounded-md bg-green-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400 backdrop-blur-sm">
                  {g.tag}
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-3.5 text-[13px] font-semibold leading-snug text-white sm:p-4">
                  {isUr ? UR.gallery.captions[i] : g.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Visit note */}
        <Reveal delay={0.15}>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-sm font-semibold text-green-950">
            <MapPin className="size-4.5 text-gold-600" />
            {isUr ? UR.campus.addressNote : SITE.address}
            <a
              href="#contact"
              className="ml-2 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-green-700"
            >
              {isUr ? UR.campus.visit : "Plan your visit"}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
