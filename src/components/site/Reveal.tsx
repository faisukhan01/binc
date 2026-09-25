"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered reveal wrapper (fade + gentle rise). */
export function Reveal({ children, delay = 0, y = 24, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  dark?: boolean;
  align?: "center" | "left";
  /** Editorial index e.g. "01" — set as a large ghost numeral beside the kicker */
  index?: string;
}

/**
 * Editorial section heading — small-caps kicker over a hairline rule,
 * oversized serif title. No pills, no chips, no chrome.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  dark = false,
  align = "center",
  index,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`mb-12 sm:mb-16 ${
        align === "center" ? "text-center mx-auto" : "text-start"
      } max-w-3xl`}
    >
      {/* Kicker row — hairline rule + small caps (+ optional ghost index) */}
      <div
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : "justify-start"}`}
      >
        {index && (
          <span
            aria-hidden
            className={`font-display text-sm font-semibold tracking-[0.2em] ${
              dark ? "text-gold-400/80" : "text-gold-600"
            }`}
          >
            {index}
          </span>
        )}
        <span aria-hidden className={`h-px w-10 ${dark ? "bg-white/30" : "bg-gold-500/70"}`} />
        <p className={`kicker-caps ${dark ? "text-gold-400" : "text-gold-600"}`}>{kicker}</p>
        <span
          aria-hidden
          className={`hidden h-px w-24 sm:block ${dark ? "bg-white/15" : "bg-line"}`}
        />
      </div>

      <h2
        className={`mt-5 font-display text-[2rem] sm:text-4xl lg:text-[2.9rem] font-semibold leading-[1.08] ${
          dark ? "text-white" : "text-green-950"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? "text-navy-100/80" : "text-muted-foreground"
          } ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
