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
                {UR.campus.titleA} <span className="text-brand-red">{UR.campus.titleB}</span>
              </>
            ) : (
              <>
                Life at <span className="text-brand-red">Bright</span>
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
            <MapPin className="size-4.5 text-brand-red" />
            {isUr ? UR.campus.addressNote : SITE.address}
            <a
              href="#contact"
              className="ml-2 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-brand-red"
            >
              {isUr ? UR.campus.visit : "Plan your visit"}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
