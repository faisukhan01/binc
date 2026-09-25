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
    <section id="campus" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker={isUr ? UR.campus.kicker : "Campus Life"}
          title={
            isUr ? (
              <>
                {UR.campus.titleA} <span className="text-green-700">{UR.campus.titleB}</span>
              </>
            ) : (
              <>
                Life at <span className="text-green-700">Bright</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.campus.subtitle
              : "A welcoming campus in the heart of Lahore — where learning goes beyond the classroom."
          }
        />

        {/* Highlights strip */}
        <Reveal>
          <ul className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {(isUr ? UR.campus.highlights : ["Modern Campus", "Student Societies", "Seminars & Events", "Safe Environment"]).map(
              (h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm font-semibold text-navy-800">
                  <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
                  {h}
                </li>
              )
            )}
          </ul>
        </Reveal>

        {/* Campus film banner — Pakistani courtyard b-roll */}
        <Reveal>
          <div className="relative mb-10 overflow-hidden rounded-xl shadow-xl shadow-navy-900/15">
            <video
              className="aspect-[21/9] w-full object-cover sm:aspect-[16/7]"
              src="/videos/campus-life.mp4"
              poster="/images/real/pk-campus.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Film of campus life at Bright International College, Lahore"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400 sm:text-[11px]">
                {isUr ? UR.campus.kicker : "Campus Life"}
              </p>
              <p className="mt-1.5 max-w-xl font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
                {isUr
                  ? UR.campus.subtitle
                  : "Learning beyond the classroom — arches, green lawns and a family that grows together."}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Photo grid — real campus photography */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={0.05 * (i % 4)} className="h-full">
              <figure className="group h-full overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/12">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-navy-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-400 backdrop-blur-sm">
                    {g.tag}
                  </span>
                </div>
                <figcaption className="px-4 py-3 text-[13px] font-semibold leading-snug text-navy-800">
                  {isUr ? UR.gallery.captions[i] : g.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Visit note */}
        <Reveal delay={0.15}>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-sm font-semibold text-navy-800">
            <MapPin className="size-4.5 text-green-700" />
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
