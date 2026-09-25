"use client";

import Image from "next/image";
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

export function About() {
  const { isUr } = useT();
  const features = isUr
    ? FEATURES.map((f, i) => ({ ...f, title: UR.about.features[i].title, desc: UR.about.features[i].desc }))
    : FEATURES;

  return (
    <section id="about" className="bg-paper py-20 sm:py-28">
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
              <div className="relative overflow-hidden rounded-lg shadow-xl shadow-green-950/15">
                <Image
                  src="/images/real/campus-building.jpg"
                  alt="Modern college campus building with students walking between classes"
                  width={1600}
                  height={1200}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              {/* Single quiet badge */}
              <div className="absolute -bottom-6 right-4 rounded-lg border border-line bg-white px-5 py-3.5 shadow-xl shadow-green-950/10 sm:right-8">
                <p className="font-display text-xl font-semibold leading-none text-green-950">
                  100% <span className="text-green-700">{isUr ? UR.about.badgeFree : "Free"}</span>
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
              index="01"
              kicker={isUr ? UR.about.kicker : "Why Bright International College"}
              title={
                isUr ? (
                  <>
                    {UR.about.titleA} <span className="text-green-700">{UR.about.titleB}</span>
                  </>
                ) : (
                  <>
                    Where ambition meets <em className="not-italic text-green-700">opportunity</em>
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
            <ul className="-mt-6 mb-0 divide-y divide-line border-y border-line sm:-mt-4">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={0.06 * i}>
                  <li className="group flex items-start gap-4 py-4">
                    <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md bg-white text-green-800 ring-1 ring-line transition-colors duration-300 group-hover:bg-green-950 group-hover:text-gold-400 group-hover:ring-green-950">
                      <f.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-green-950">
                        {f.title}
                      </h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <p className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-green-950">
                <HeartHandshake className="size-5 text-green-700" />
                {isUr ? UR.about.welfareLine : "Proudly serving education under the welfare foundation (PWWF)."}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
