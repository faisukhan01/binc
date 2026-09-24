"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CircleCheck,
  CircleDashed,
  Loader2,
  Search,
  SearchX,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface TrackedApp {
  trackingCode: string;
  fullName: string;
  program: string;
  status: string;
  createdAt: string;
}

const STEPS = [
  { key: "PENDING", label: "Application Received", desc: "Your form is with the admissions office." },
  { key: "CONTACTED", label: "Team Contacted You", desc: "Admissions office has reached out via call/WhatsApp." },
  { key: "APPROVED", label: "Admission Confirmed", desc: "Congratulations — your seat is booked!" },
] as const;

function statusIndex(status: string) {
  const i = STEPS.findIndex((s) => s.key === status.toUpperCase());
  return i === -1 ? 0 : i;
}

export function StatusTracker() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedApp | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/admissions/track?code=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Tracking failed");
      setResult(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const current = result ? statusIndex(result.status) : -1;
  const rejected = result?.status.toUpperCase() === "REJECTED";

  return (
    <Reveal delay={0.05}>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-xl shadow-navy-900/8 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-navy-800 via-gold-400 to-navy-800" />

        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-gold-400 shadow-lg">
            <Search className="size-5.5" />
          </span>
          <div>
            <h3 className="font-display text-xl font-black text-navy-950 sm:text-2xl">
              Track Your Application
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Already applied? Enter your tracking code (e.g.{" "}
              <span className="font-mono font-bold text-navy-900">BINC-F26-XXXX</span>) to see
              live status.
            </p>
          </div>
        </div>

        <form onSubmit={track} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="BINC-F26-XXXX"
            aria-label="Application tracking code"
            className="h-12 flex-1 rounded-xl border-navy-100 bg-navy-50/50 font-mono text-base font-bold uppercase tracking-wider placeholder:text-muted-foreground/60"
            maxLength={13}
          />
          <Button
            type="submit"
            disabled={loading || !code.trim()}
            className="h-12 min-w-[130px] rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 font-extrabold text-white shadow-lg shadow-navy-900/25 transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-4.5" />}
            {loading ? "Checking…" : "Track"}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-red/25 bg-red-50 p-4 text-sm"
            >
              <SearchX className="mt-0.5 size-5 shrink-0 text-brand-red" />
              <div>
                <p className="font-bold text-brand-red">{error}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Double-check the code from your confirmation screen, or WhatsApp us at{" "}
                  {SITE.whatsapp}.
                </p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="res"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Applicant summary */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy-950 p-4 sm:p-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-navy-100/60">
                    Applicant
                  </p>
                  <p className="mt-0.5 font-display text-lg font-black text-white">
                    {result.fullName}
                  </p>
                  <p className="text-xs font-semibold text-gold-400">{result.program}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-navy-100/60">
                    Tracking Code
                  </p>
                  <p className="mt-0.5 font-mono text-base font-black tracking-wider text-gold-400">
                    {result.trackingCode}
                  </p>
                  <button
                    onClick={() => window.print()}
                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-navy-100/70 hover:text-white transition-colors"
                  >
                    <Printer className="size-3.5" /> Print status
                  </button>
                </div>
              </div>

              {/* Status timeline */}
              <ol className="mt-6 space-y-0">
                {STEPS.map((step, i) => {
                  const done = !rejected && i <= current;
                  const isCurrent = !rejected && i === current;
                  const last = i === STEPS.length - 1;
                  return (
                    <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                      {!last && (
                        <span
                          className={cn(
                            "absolute left-[17px] top-9 h-[calc(100%-2rem)] w-0.5 rounded-full",
                            done && !last ? "bg-welfare-500" : "bg-border"
                          )}
                          aria-hidden
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 transition-colors",
                          done
                            ? "border-welfare-500 bg-welfare-500 text-white"
                            : "border-border bg-white text-muted-foreground",
                          isCurrent && "animate-pulse-ring"
                        )}
                      >
                        {done ? (
                          <CircleCheck className="size-5" />
                        ) : (
                          <CircleDashed className="size-5" />
                        )}
                      </span>
                      <div className="pt-1">
                        <p
                          className={cn(
                            "flex items-center gap-2 text-sm font-extrabold",
                            done ? "text-navy-950" : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="rounded-full bg-gold-400/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-gold-600">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {rejected && isCurrent
                            ? "Unfortunately this application was not approved. Contact admissions for guidance."
                            : step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {result.status.toUpperCase() === "APPROVED" && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-5 flex items-center gap-3 rounded-2xl bg-welfare-500/10 p-4 text-sm font-bold text-welfare-700"
                >
                  <BadgeCheck className="size-6 shrink-0 text-welfare-500" />
                  Welcome to the Bright family! Our team will share your fee schedule and
                  orientation details on WhatsApp.
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
