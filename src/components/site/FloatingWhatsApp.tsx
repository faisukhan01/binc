"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { SITE } from "@/lib/site-data";

export function FloatingWhatsApp() {
  const [showTop, setShowTop] = useState(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setBanner(true), 4200);
    const hide = setTimeout(() => setBanner(false), 13000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-[55] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat bubble */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="relative max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3 shadow-2xl border border-border"
          >
            <button
              onClick={() => setBanner(false)}
              aria-label="Dismiss chat hint"
              className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full bg-navy-950 text-white"
            >
              <X className="size-3.5" />
            </button>
            <p className="text-xs font-bold text-navy-950">Need admission info? 👋</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Chat with us on WhatsApp — instant replies!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2.5">
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid size-11 place-items-center rounded-full bg-navy-950 text-white shadow-xl transition-transform hover:-translate-y-1"
            >
              <ArrowUp className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.a
          href={`https://wa.me/${SITE.whatsappIntl}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="grid size-14 place-items-center rounded-full bg-welfare-500 shadow-2xl shadow-welfare-500/40 animate-pulse-ring"
        >
          <svg viewBox="0 0 24 24" className="size-7 fill-white" aria-hidden>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
