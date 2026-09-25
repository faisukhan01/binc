"use client";

import { GraduationCap, Gift, Hourglass } from "lucide-react";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

const ITEMS = [
  { icon: GraduationCap, text: "Admissions Open — Fall 2026" },
  { icon: Gift, text: "100% Admission Free for Welfare Workers" },
  { icon: Hourglass, text: "Limited Seats — Apply Today" },
  { icon: GraduationCap, text: "Pharm-D · DPT · BSCS" },
];

export function MarqueeStrip() {
  const { isUr } = useT();
  const texts = isUr ? UR.marquee : ITEMS.map((i) => i.text);
  const row = ITEMS.map((item, i) => ({ ...item, text: texts[i] }));
  const loop = [...row, ...row, ...row];
  return (
    <div
      className="relative z-10 overflow-hidden bg-navy-950 py-3.5"
      aria-label="Announcements"
    >
      <div className="marquee-track flex w-max animate-marquee items-center gap-10 pr-10">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10" aria-hidden={half === 1}>
            {loop.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-2.5 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] text-navy-100/90"
              >
                <item.icon className="size-4 text-gold-400" aria-hidden />
                {item.text}
                <span className="ml-6 size-1 rounded-full bg-gold-500/70" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-navy-950 to-transparent" />
    </div>
  );
}
