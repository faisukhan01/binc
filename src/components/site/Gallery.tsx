"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { GALLERY } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./Reveal";

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null;

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) => (i === null ? null : (i + dir + GALLERY.length) % GALLERY.length));
    },
    []
  );

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <section id="gallery" className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Campus Gallery"
          title={
            <>
              Life at <span className="text-gradient-navy-red">Bright</span>
            </>
          }
          subtitle="Labs, library, campus and celebrations — take a look around before you visit us."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.src}
              delay={0.06 * i}
              className={i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}
            >
              <motion.button
                onClick={() => setOpenIndex(i)}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className={`group relative block w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-navy-900/5 focus-visible:outline-gold-500 ${
                  i === 0 || i === 5 ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"
                }`}
                aria-label={`Open photo: ${g.caption}`}
              >
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>

                {/* gradient + caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-3 top-3 rounded-full bg-navy-950/60 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400 backdrop-blur-sm">
                  {g.tag}
                </span>
                <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-left">
                  <span className="text-xs font-bold leading-snug text-white sm:text-sm">
                    {g.caption}
                  </span>
                  <motion.span
                    variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-950 shadow-lg"
                  >
                    <Expand className="size-4" />
                  </motion.span>
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/92 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${GALLERY[openIndex].caption}`}
            onClick={() => setOpenIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand-red"
            >
              <X className="size-5" />
            </button>

            {/* Prev / Next */}
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-400 hover:text-navy-950"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-400 hover:text-navy-950"
            >
              <ChevronRight className="size-6" />
            </button>

            <motion.figure
              key={GALLERY[openIndex].src}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                <Image
                  src={GALLERY[openIndex].src}
                  alt={GALLERY[openIndex].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-4 flex flex-col items-center gap-1 text-center">
                <p className="font-display text-lg font-extrabold text-white">
                  {GALLERY[openIndex].caption}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
                  {openIndex + 1} / {GALLERY.length} · {GALLERY[openIndex].tag}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
