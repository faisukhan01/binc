"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { BookOpenCheck, FlaskConical, HeartHandshake, Rocket, Users2 } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Quality Education",
    desc: "Focused academic learning with continuous student support and mentoring.",
  },
  {
    icon: FlaskConical,
    title: "Practical Learning",
    desc: "Modern labs, hands-on training and real-world professional exposure.",
  },
  {
    icon: Users2,
    title: "Expert Guidance",
    desc: "Experienced educators and industry professionals guiding every step.",
  },
  {
    icon: Rocket,
    title: "Bright Future",
    desc: "Career-focused skills that open doors to jobs, practice and higher study.",
  },
];

function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function About() {
  const { isUr } = useT();
  const features = isUr
    ? FEATURES.map((f, i) => ({ ...f, title: UR.about.features[i].title, desc: UR.about.features[i].desc }))
    : FEATURES;
  const counterLabels = isUr ? UR.about.counters : ["Students & Alumni", "Expert Faculty", "Degree Programs"];

  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual side — clean framed photograph */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Gold offset frame accent */}
              <div
                aria-hidden
                className="absolute -left-4 -top-4 hidden h-full w-full rounded-lg border border-gold-500/60 sm:block"
              />
              <div className="relative overflow-hidden rounded-lg shadow-2xl shadow-navy-900/20">
                <Image
                  src="/images/real/campus-building.jpg"
                  alt="Bright International College campus — modern academic building"
                  width={2000}
                  height={1333}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              {/* Single quiet badge */}
              <div className="absolute -bottom-6 right-4 rounded-lg border border-border bg-white px-5 py-3.5 shadow-xl shadow-navy-900/15 sm:right-8">
                <p className="font-display text-xl font-semibold leading-none text-navy-900">
                  100% <span className="text-brand-red">{isUr ? UR.about.badgeFree : "Free"}</span>
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {isUr ? UR.about.badgeWelfare : "Welfare Worker Admissions"}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              kicker={isUr ? UR.about.kicker : "Why Bright International College"}
              title={
                isUr ? (
                  <>
                    {UR.about.titleA} <span className="text-brand-red">{UR.about.titleB}</span>
                  </>
                ) : (
                  <>
                    Where ambition meets <span className="text-brand-red">opportunity</span>
                  </>
                )
              }
              subtitle={
                isUr
                  ? UR.about.subtitle
                  : "Bright International College is committed to career-focused education — blending strong academics, practical training and personal mentorship so every student graduates confident and career-ready."
              }
            />

            {/* Feature list — hairline rows instead of cards */}
            <ul className="mt-2 divide-y divide-border border-y border-border">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={0.06 * i}>
                  <li className="group flex items-start gap-4 py-4">
                    <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-navy-900 group-hover:text-gold-400">
                      <f.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-navy-900">
                        {f.title}
                      </h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            {/* Counters */}
            <Reveal delay={0.15}>
              <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-lg bg-navy-950 py-5 sm:py-6">
                {[
                  { to: 1200, suffix: "+", label: counterLabels[0] },
                  { to: 25, suffix: "+", label: counterLabels[1] },
                  { to: 3, suffix: "", label: counterLabels[2] },
                ].map((c) => (
                  <div key={c.label} className="px-3 text-center">
                    <p className="font-display text-2xl font-semibold text-gold-400 sm:text-4xl">
                      <Counter to={c.to} suffix={c.suffix} />
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-100/70 sm:text-xs">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-navy-900">
                <HeartHandshake className="size-5 text-brand-red" />
                {isUr ? UR.about.welfareLine : "Proudly serving education under the welfare foundation (PWWF)."}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
