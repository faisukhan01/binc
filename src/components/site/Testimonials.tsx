"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-data";
import { SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  const item = TESTIMONIALS[index];

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
          <div className="relative min-h-[280px] sm:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
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
                <figcaption className="mt-6">
                  <p className="font-bold text-navy-950">{item.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-red">{item.program}</p>
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
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === index
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
