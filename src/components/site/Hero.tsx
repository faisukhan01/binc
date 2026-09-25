"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

const HEADLINE = ["Build", "a", "Brighter", "Future."];

const STATS = [
  { value: "1200+", label: "Students & Alumni" },
  { value: "3", label: "Professional Degrees" },
  { value: "100%", label: "Welfare Support" },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUr } = useT();
  const headline = isUr ? [...UR.hero.headline] : HEADLINE;
  const statLabels = isUr ? UR.hero.stats : STATS.map((s) => s.label);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay blocked — poster remains */
    });
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[92svh] flex-col overflow-hidden bg-navy-950 lg:min-h-[100svh]"
      aria-label="Hero — Admissions Open Fall 2026"
    >
      {/* Video background — kept clear and visible */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Legibility scrims only — left column gradient + gentle bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-navy-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/85 via-navy-950/35 to-transparent" />

      {/* Content */}
      <div className="relative flex w-full flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:pb-32">
          <div className="max-w-3xl">
            {/* Term line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-4 sm:mb-8"
            >
              <span className="h-px w-10 bg-gold-400" aria-hidden />
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold-400 sm:text-xs">
                {isUr ? UR.hero.pill : "Admissions Open · Fall 2026 · Limited Seats"}
              </p>
            </motion.div>

            {/* Headline */}
            <h1
              className={`font-display text-white ${isUr ? "text-[11.5vw] leading-[1.6] sm:text-6xl md:text-7xl lg:text-[5rem]" : "text-[13vw] leading-[1.04] sm:text-6xl md:text-7xl lg:text-[5.2rem]"} font-medium`}
            >
              {headline.map((word, i) => (
                <span key={word} className={`inline-block overflow-hidden align-bottom ${isUr ? "pb-4" : "pb-1"}`}>
                  <motion.span
                    className={`inline-block ${(isUr ? i < UR.hero.goldWordCount : word === "Brighter") ? "text-gold-400" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.13,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                    {i < headline.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-navy-100/95 sm:mt-6 sm:text-lg lg:text-xl"
            >
              {isUr ? (
                <>
                  <span className="font-semibold text-white">{UR.hero.subStrong}</span>
                  {UR.hero.subAfter}
                </>
              ) : (
                <>
                  Choose a professional degree at{" "}
                  <span className="font-semibold text-white">
                    Bright International College
                  </span>{" "}
                  — Pharm-D, Doctor of Physical Therapy and BS Computer Science — with
                  expert faculty, modern labs and a campus that feels like family.
                </>
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-3.5 sm:mt-10"
            >
              <a
                href="#apply"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-lg bg-brand-red px-8 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-redlight"
              >
                {isUr ? UR.hero.apply : "Apply Online Now"}
                <span aria-hidden className="rtl-mirror">→</span>
              </a>
              <a
                href="#programs"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-lg border border-white/40 bg-white/5 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-navy-950"
              >
                {isUr ? UR.hero.explore : "Explore Programs"}
              </a>
              <a
                href="/prospectus/binc-prospectus-2026.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label={isUr ? UR.hero.prospectusAria : "Download the official BINC prospectus PDF for Fall 2026"}
                className="inline-flex min-h-[52px] items-center gap-2 px-4 py-3.5 text-sm font-bold text-white/85 underline-offset-8 transition-colors hover:text-gold-400 hover:underline"
              >
                <Download className="size-4" />
                {isUr ? UR.hero.prospectus : "Prospectus 2026 (PDF)"}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats strip — hairline separated, no card chrome */}
      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6"
      >
        <div className="grid max-w-2xl grid-cols-3 border-t border-white/20">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1 py-5 ${i > 0 ? "border-l border-white/15 pl-5 sm:pl-8" : "pr-5"}`}
            >
              <dd className="font-display text-2xl font-semibold text-white sm:text-4xl">
                {s.value}
              </dd>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-100/70 sm:text-xs">
                {statLabels[i]}
              </dt>
            </div>
          ))}
        </div>
      </motion.dl>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll down to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-white/60 transition-colors hover:text-white lg:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{isUr ? UR.hero.scroll : "Scroll"}</span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="size-1.5 rounded-full bg-white animate-scroll-dot" />
        </span>
        <ArrowDown className="size-3.5" />
      </motion.a>
    </section>
  );
}
