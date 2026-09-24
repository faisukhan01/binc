"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/** Compact EN ⇄ UR switcher. Shows the OTHER language as the action label. */
export function LangToggle({ dark = false, className }: { dark?: boolean; className?: string }) {
  const lang = useLang((s) => s.lang);
  const toggle = useLang((s) => s.toggle);
  const next = lang === "ur" ? "English" : "اردو";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "ur" ? "Switch to English" : "اردو میں تبدیل کریں"}
      className={cn(
        "inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition-all",
        dark
          ? "border border-white/25 bg-white/10 text-white hover:bg-white hover:text-navy-950"
          : "border border-navy-850/20 bg-white/70 text-navy-850 hover:border-gold-500/60 hover:bg-navy-50",
        className
      )}
    >
      <Languages className="size-3.5" aria-hidden />
      <span className={lang === "ur" ? "font-sans" : ""}>{next}</span>
    </button>
  );
}
