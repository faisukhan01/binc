"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock3, Hourglass, X } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

export function AdmissionPopup() {
  const [open, setOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  /** Staff-configurable behaviour from /api/settings (defaults = enabled, branded copy) */
  const [enabled, setEnabled] = useState(true);
  const [customTitle, setCustomTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const { isUr } = useT();

  // Staff settings — deadline countdown, popup on/off, custom copy overrides
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const s = d?.settings ?? {};
        if (s.popupEnabled === "off") setEnabled(false);
        if (s.popupTitle) setCustomTitle(String(s.popupTitle));
        if (s.popupMessage) setCustomMessage(String(s.popupMessage));
        const dl = s.admissionDeadline;
        if (!dl) return;
        const ms = new Date(`${dl}T23:59:59`).getTime() - Date.now();
        if (ms > 0) setDaysLeft(Math.ceil(ms / 86_400_000));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    try {
      if (!sessionStorage.getItem("binc-popup-shown")) {
        timer = setTimeout(() => {
          setOpen(true);
          sessionStorage.setItem("binc-popup-shown", "1");
        }, 1600);
      }
    } catch {
      timer = setTimeout(() => setOpen(true), 1600);
    }
    // ESC to close
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Admissions Open Fall 2026 announcement"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Header band */}
            <div className="relative bg-navy-950 px-6 pb-7 pt-8 text-center">
              <Image
                src="/images/logo.jpg"
                alt=""
                width={180}
                height={72}
                className="mx-auto mb-4 h-16 w-auto rounded-lg bg-white object-contain px-2.5 py-2 ring-1 ring-gold-500/50"
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-gold-400">
                {isUr ? UR.popup.kicker : "Bright International College"}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
                {isUr ? UR.popup.titleA : "Admissions"}
                <span className="mt-0.5 block text-gold-400">
                  {customTitle || (isUr ? UR.popup.titleB : "OPEN — Fall 26")}
                </span>
              </h3>
              {daysLeft !== null && (
                <p className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-bold text-gold-300">
                  <Hourglass className="size-3.5" />
                  {(isUr ? UR.popup.daysLeft : "Only {n} days left to apply!").replace("{n}", String(daysLeft))}
                </p>
              )}
              {/* gold crest line */}
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gold-500" aria-hidden />
            </div>

            {/* Body */}
            <div className="px-6 pb-7 pt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-navy-50/60 px-3.5 py-3">
                  <CalendarDays className="size-5 shrink-0 text-navy-700" />
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {isUr ? UR.popup.sessionLabel : "Session Starts"}
                    </p>
                    <p className="text-sm font-bold text-navy-900">{isUr ? UR.popup.sessionValue : "September 2026"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border border-brand-red/15 bg-brand-red/[0.05] px-3.5 py-3">
                  <Clock3 className="size-5 shrink-0 text-brand-red" />
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {isUr ? UR.popup.seatsLabel : "Limited Seats"}
                    </p>
                    <p className="text-sm font-bold text-brand-red">{isUr ? UR.popup.seatsValue : "First Come Basis"}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
                {customMessage ||
                  (isUr
                    ? UR.popup.body
                    : "Pharm-D · DPT · BSCS — apply online in under 2 minutes and our admissions team will call you back the same day.")}
              </p>

              <div className="mt-5 grid gap-2.5">
                <a
                  href="#apply"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-green-800 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-green-700"
                >
                  {isUr ? UR.popup.apply : "Apply Online Now"}
                  <span aria-hidden className="rtl-mirror">→</span>
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-welfare-700 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-welfare-500"
                >
                  {isUr ? UR.popup.whatsapp : "Ask on WhatsApp"} — {SITE.whatsapp}
                </a>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-navy-900"
              >
                {isUr ? UR.popup.later : "Maybe later — continue browsing"}
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label={isUr ? UR.popup.close : "Close announcement"}
              className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
