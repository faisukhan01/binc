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

/** Scroll-triggered reveal wrapper (fade + rise). */
export function Reveal({ children, delay = 0, y = 36, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
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
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  dark = false,
  align = "center",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`mb-12 sm:mb-16 ${
        align === "center" ? "text-center mx-auto" : "text-start"
      } max-w-2xl`}
    >
      <p
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.25em] ${
          dark
            ? "bg-white/10 text-gold-400 border border-white/15"
            : "bg-navy-50 text-green-700 border border-navy-100"
        }`}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {kicker}
      </p>
      <h2
        className={`mt-4 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3.5 text-base sm:text-lg leading-relaxed ${
            dark ? "text-navy-100/85" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
