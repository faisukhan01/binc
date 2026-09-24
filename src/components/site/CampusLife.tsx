"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const HIGHLIGHTS = ["Modern Campus", "Student Societies", "Seminars & Events", "Safe Environment"];

export function CampusLife() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="campus" className="relative overflow-hidden bg-navy-950 py-20 sm:py-28">
      <SectionHeading
        dark
        kicker="Campus Life"
        title={
          <>
            Life at <span className="text-gradient-gold">Bright</span>
          </>
        }
        subtitle="A welcoming campus in the heart of Lahore where learning extends beyond classrooms."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <motion.div
            whileHover={{ scale: 0.995 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl"
          >
            {/* Video bg */}
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src="/videos/campus.mp4"
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Campus walkthrough video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-navy-950/40" />

              {/* Center play chip */}
              <div className="absolute inset-0 grid place-items-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="grid size-20 place-items-center rounded-full glass-dark border border-white/25 shadow-2xl"
                >
                  <Play className="size-8 fill-white text-white" />
                </motion.div>
              </div>

              {/* Bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                    57 Sector A, GECHS Township — Lahore
                  </h3>
                  <p className="mt-1 text-sm text-navy-100/85">
                    Near Pindi Stop · easily accessible from across the city
                  </p>
                </div>
                <a
                  href="#contact"
                  className="inline-flex w-fit min-h-[46px] items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-navy-950 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Visit Campus
                </a>
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Highlights */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h} delay={0.08 * i}>
              <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-center text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/12">
                <span className="size-2 shrink-0 rounded-full bg-gold-400" />
                {h}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
