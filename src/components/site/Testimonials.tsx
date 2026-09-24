"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-data";
import { SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

interface LiveTestimonial {
  id: string;
  name: string;
  program: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
  pinned: boolean;
  createdAt: string;
}

interface DisplayItem {
  id: string;
  name: string;
  program: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
  verified: boolean;
  live: boolean;
}

/** Gradient per name so initials avatars stay visually varied but deterministic */
const AVATAR_TONES = [
  "from-navy-700 to-navy-950",
  "from-brand-red to-red-800",
  "from-welfare-600 to-welfare-800",
  "from-gold-500 to-gold-700",
  "from-navy-500 to-brand-red",
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function toneFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [live, setLive] = useState<LiveTestimonial[] | null>(null);

  const load = useCallback(() => {
    fetch("/api/testimonials")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => setLive(d.testimonials ?? []))
      .catch(() => setLive([]));
  }, []);

  useEffect(() => {
    load();
    // Live refresh when staff publish/delete from the console on this page
    window.addEventListener("binc:testimonials-changed", load);
    return () => window.removeEventListener("binc:testimonials-changed", load);
  }, [load]);

  // Staff-published testimonials take priority; curated fallback keeps the section full
  const items: DisplayItem[] = useMemo(() => {
    if (live && live.length > 0) {
      return live.map((t) => ({
        id: t.id,
        name: t.name,
        program: t.program,
        quote: t.quote,
        rating: t.rating,
        photoUrl: t.photoUrl,
        verified: true,
        live: true,
      }));
    }
    return TESTIMONIALS.map((t, i) => ({
      id: `curated-${i}`,
      name: t.name,
      program: t.program,
      quote: t.quote,
      rating: t.rating,
      photoUrl: null,
      verified: false,
      live: false,
    }));
  }, [live]);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  // Clamp during render (list may shrink when staff delete from the console)
  const activeIndex = Math.min(index, items.length - 1);
  const item = items[activeIndex];

  return (
    <section
      aria-label="Student testimonials"
      className="relative overflow-hidden bg-navy-50/60 py-20 sm:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 60% at 50% 100%, rgba(20,64,143,0.07), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          kicker="Student Voices"
          title={
            <>
              Stories from our <span className="text-gradient-navy-red">Bright family</span>
            </>
          }
        />

        <div className="relative">
          <Quote
            className="absolute -top-6 left-1/2 size-20 -translate-x-1/2 text-navy-100"
            aria-hidden
          />
          <div className="relative min-h-[300px] sm:min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl border border-border bg-white p-8 text-center shadow-xl shadow-navy-900/8 sm:p-10"
              >
                <div className="flex justify-center gap-1" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <blockquote className="mx-auto mt-5 max-w-2xl font-display text-lg leading-relaxed text-navy-900 sm:text-xl">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-center gap-3.5">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={`Photo of ${item.name}`}
                      className="size-12 rounded-full object-cover ring-2 ring-gold-400/60"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-sm font-black text-white shadow-md ring-2 ring-white",
                        toneFor(item.name)
                      )}
                    >
                      {initials(item.name)}
                    </span>
                  )}
                  <span className="text-left">
                    <span className="flex items-center gap-1.5 font-bold text-navy-950">
                      {item.name}
                      {item.verified && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-welfare-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-welfare-700 ring-1 ring-welfare-500/30"
                          title="Published by the admissions office"
                        >
                          <BadgeCheck className="size-3" /> Verified
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-brand-red">
                      {item.program}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="grid size-11 place-items-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-all hover:bg-navy-950 hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Testimonial selector">
              {items.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === activeIndex
                      ? "w-8 bg-gradient-to-r from-brand-red to-gold-500"
                      : "w-2.5 bg-navy-200 hover:bg-navy-300"
                  )}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="grid size-11 place-items-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-all hover:bg-navy-950 hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
