"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

const HEADLINE = ["Build", "a", "Brighter", "Future."];

const STATS = [
  { icon: Users, value: "1200+", label: "Students & Alumni" },
  { icon: GraduationCap, value: "3", label: "Professional Degrees" },
  { icon: ShieldCheck, value: "100%", label: "Welfare Support" },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { isUr } = useT();
  const headline = isUr ? [...UR.hero.headline] : HEADLINE;
  const statLabels = isUr ? UR.hero.stats : STATS.map((s) => s.label);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

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
      ref={sectionRef}
      className="relative min-h-[92svh] lg:min-h-[100svh] flex flex-col overflow-hidden bg-navy-950"
      aria-label="Hero — Admissions Open Fall 2026"
    >
      {/* Video background */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10 scale-[1.08]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/videos/hero.mp4"
          poster="/videos/hero-poster.jpg"
          autoPlay
          loop
          muted={muted}
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/85 via-navy-950/60 to-navy-950/95" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/35 to-brand-red/25" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, #ffd65a 0, transparent 34%), radial-gradient(circle at 80% 70%, #c71920 0, transparent 40%)",
        }}
      />
      {/* Animated grain lines */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 46px, rgba(255,255,255,.6) 46px 47px)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative flex-1 flex items-center w-full"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-14 pb-28 lg:py-24">
          <div className="max-w-3xl">
            {/* Term pill */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full glass-dark border border-white/15 pl-2 pr-4 py-1.5 mb-6 sm:mb-8"
            >
              <span className="rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-3 py-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-navy-950">
                Fall 2026
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">
                {isUr ? UR.hero.pill : "Admissions Open — Limited Seats"}
              </span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-redlight opacity-80" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-redlight" />
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              className={`font-display text-white font-black ${isUr ? "text-[11.5vw] leading-[1.6] sm:text-6xl md:text-7xl lg:text-[5rem]" : "text-[13.5vw] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.4rem] tracking-tight"}`}
            >
              {headline.map((word, i) => (
                <span key={word} className={`inline-block overflow-hidden align-bottom ${isUr ? "pb-4" : "pb-1"}`}>
                  <motion.span
                    className={`inline-block ${
                      (isUr ? i < UR.hero.goldWordCount : word === "Brighter") ? "text-gradient-gold pr-2" : ""
                    }`}
                    initial={{ y: "110%", rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{
                      delay: 0.25 + i * 0.14,
                      duration: 0.85,
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-navy-100/95"
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#apply"
                className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-red to-brand-redlight px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-red/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-red/50 active:translate-y-0"
              >
                {isUr ? UR.hero.apply : "Apply Online Now"}
                <span className="grid size-6 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1 rtl-mirror">
                  →
                </span>
              </a>
              <a
                href="#programs"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-navy-900"
              >
                {isUr ? UR.hero.explore : "Explore Programs"}
              </a>
              <a
                href="/prospectus/binc-prospectus-2026.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label={isUr ? UR.hero.prospectusAria : "Download the official BINC prospectus PDF for Fall 2026"}
                className="group inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-gold-400/40 bg-gold-400/10 px-5 py-3.5 text-sm font-bold text-gold-300 backdrop-blur-md transition-all duration-300 hover:bg-gold-400 hover:text-navy-950"
              >
                <Download className="size-4.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                {isUr ? UR.hero.prospectus : "Prospectus 2026"}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsappIntl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl px-5 py-3.5 text-base font-bold text-white/90 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                <span className="grid size-9 place-items-center rounded-full bg-welfare-500 animate-pulse-ring">
                  <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden>
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
                  </svg>
                </span>
                {SITE.whatsapp}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.dl
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.8 }}
              className="mt-10 sm:mt-14 grid max-w-xl grid-cols-3 divide-x divide-white/15 rounded-2xl glass-dark border border-white/12"
            >
              {STATS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 px-2 py-4 sm:py-5 text-center">
                  <s.icon className="size-4 sm:size-5 text-gold-400" aria-hidden />
                  <dd className="font-display text-xl sm:text-3xl font-extrabold text-white leading-none">
                    {s.value}
                  </dd>
                  <dt className="text-[10px] sm:text-xs font-medium text-navy-100/80 leading-tight">
                    {statLabels[i]}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll down to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{isUr ? UR.hero.scroll : "Scroll"}</span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <span className="size-1.5 rounded-full bg-white animate-scroll-dot" />
        </span>
        <ArrowDown className="size-3.5" />
      </motion.a>

      {/* Bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-950/90 to-transparent" />
    </section>
  );
}
