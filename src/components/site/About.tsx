"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Award, BookOpenCheck, FlaskConical, HeartHandshake, Rocket, Users2 } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

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
  return (
    <section id="about" className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 size-[420px] rounded-full bg-navy-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 size-[380px] rounded-full bg-gold-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual side */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-navy-900/25"
              >
                <Image
                  src="/images/program-bscs.png"
                  alt="BSCS program poster — Bright International College"
                  width={1024}
                  height={1536}
                  className="h-auto w-full object-cover"
                />
              </motion.div>

              {/* Floating badge — top */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 top-8 sm:-right-6 rounded-2xl glass-nav border border-white/60 px-4 py-3 shadow-xl shadow-navy-900/20 sm:-right-8"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950">
                    <Award className="size-5.5 text-gold-400" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-xl font-black text-navy-900">Est. Lahore</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Registered Foundation
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — bottom */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -left-3 bottom-10 sm:-left-8 rounded-2xl bg-gradient-to-br from-brand-red to-brand-redlight px-5 py-4 text-white shadow-xl shadow-brand-red/40"
              >
                <p className="font-display text-2xl font-black leading-none">
                  100% <span className="text-gold-300">Free</span>
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/90">
                  Welfare Worker Admissions
                </p>
              </motion.div>
            </div>
          </Reveal>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              kicker="Why Bright International College"
              title={
                <>
                  Where ambition meets <span className="text-gradient-navy-red">opportunity</span>
                </>
              }
              subtitle="Bright International College is committed to career-focused education — blending strong academics, practical training and personal mentorship so every student graduates confident and career-ready."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={0.08 * i}>
                  <div className="group h-full rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-xl hover:shadow-navy-900/10">
                    <span className="grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-800 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-navy-800 group-hover:to-navy-950 group-hover:text-gold-400 group-hover:shadow-lg">
                      <f.icon className="size-6" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-extrabold text-navy-900">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Counters */}
            <Reveal delay={0.2}>
              <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-navy-950 p-5 sm:p-6">
                {[
                  { to: 1200, suffix: "+", label: "Students & Alumni" },
                  { to: 25, suffix: "+", label: "Expert Faculty" },
                  { to: 3, suffix: "", label: "Degree Programs" },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <p className="font-display text-2xl sm:text-4xl font-black text-gold-400">
                      <Counter to={c.to} suffix={c.suffix} />
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-navy-100/75">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-navy-900">
                <HeartHandshake className="size-5 text-brand-red" />
                Proudly serving education under the welfare foundation (PWWF).
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
