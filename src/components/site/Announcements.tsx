"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ImageIcon, Megaphone, Pin, X } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

interface Announcement {
  id: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  imageUrl?: string | null;
  createdAt: string;
}

const TAG_STYLES: Record<string, { chip: string; dot: string }> = {
  Notice: { chip: "bg-navy-50 text-navy-800 ring-navy-200/60", dot: "bg-navy-700" },
  Event: { chip: "bg-gold-400/15 text-gold-600 ring-gold-400/40", dot: "bg-gold-500" },
  Deadline: { chip: "bg-brand-red/10 text-brand-red ring-brand-red/30", dot: "bg-brand-red" },
  Result: { chip: "bg-welfare-500/12 text-welfare-700 ring-welfare-500/30", dot: "bg-welfare-500" },
};

/** "just now" / "2d ago" / "3w ago" — compact relative time for notice cards */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const FRESH_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export function Announcements() {
  const [items, setItems] = useState<Announcement[] | null>(null);
  // Skeleton appears only if the fetch is still pending after 350ms (avoids flicker on fast loads)
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [viewing, setViewing] = useState<{ url: string; title: string } | null>(null);

  // Escape closes the image lightbox
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(true), 350);
    return () => clearTimeout(t);
  }, []);

  const load = useCallback(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => setItems(d.announcements ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    load();
    // Live refresh when staff publish/edit/delete from the console on this page
    window.addEventListener("binc:announcements-changed", load);
    return () => window.removeEventListener("binc:announcements-changed", load);
  }, [load]);

  // Section stays completely hidden until staff publish something
  if (!items && !showSkeleton) return null;
  if (items && items.length === 0) return null;

  return (
    <section id="news" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 85% 10%, rgba(199,25,32,.06), transparent), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(217,166,46,.08), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Notice Board"
          title={
            <>
              Latest <span className="text-gradient-navy-red">updates &amp; events</span>
            </>
          }
          subtitle="Announcements from the admissions office — deadlines, events and results, straight from campus."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {!items
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  aria-hidden
                  role="presentation"
                  className="rounded-2xl border border-border bg-white p-5 shadow-md shadow-navy-900/6"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-20 animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140}ms` }} />
                  </div>
                  <span className="mt-4 block h-5 w-3/4 animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140 + 80}ms` }} />
                  <div className="mt-3 space-y-2">
                    <span className="block h-3.5 w-full animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140 + 160}ms` }} />
                    <span className="block h-3.5 w-5/6 animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140 + 240}ms` }} />
                    <span className="block h-3.5 w-2/3 animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140 + 320}ms` }} />
                  </div>
                  <span className="mt-5 block h-3 w-32 animate-pulse rounded-full bg-navy-100" style={{ animationDelay: `${i * 140 + 400}ms` }} />
                </div>
              ))
            : items.map((a, i) => {
            const tag = TAG_STYLES[a.tag] ?? TAG_STYLES.Notice;
            const fresh = Date.now() - new Date(a.createdAt).getTime() < FRESH_MS;
            return (
              <Reveal key={a.id} delay={0.06 * i} className="h-full">
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="card-shine group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-md shadow-navy-900/6 transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/15"
                >
                  {a.pinned && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-400/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gold-600 ring-1 ring-gold-400/40">
                      <Pin className="size-3" /> Pinned
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ring-1 ${tag.chip}`}
                    >
                      <span className={`size-1.5 rounded-full ${tag.dot}`} />
                      {a.tag}
                    </span>
                    {fresh && !a.pinned && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm shadow-brand-red/30">
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                        </span>
                        New
                      </span>
                    )}
                  </div>

                  {a.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setViewing({ url: a.imageUrl!, title: a.title })}
                      aria-label={`View image: ${a.title}`}
                      className="group/img relative mt-3.5 block w-full overflow-hidden rounded-xl ring-1 ring-navy-100 focus-visible:ring-2 focus-visible:ring-gold-500"
                    >
                      <img
                        src={a.imageUrl}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.04]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-navy-900 opacity-0 shadow-md backdrop-blur transition-opacity duration-300 group-hover/img:opacity-100">
                        <ImageIcon className="size-3 text-brand-red" /> View
                      </span>
                    </button>
                  )}

                  <h3 className="mt-3.5 font-display text-lg font-black leading-snug text-navy-950 transition-colors group-hover:text-brand-red">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {a.body}
                  </p>

                  <p className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    <CalendarDays className="size-3.5 text-navy-400" />
                    {new Date(a.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <span className="text-navy-400/70">·</span>
                    <span className="normal-case tracking-normal">{relativeTime(a.createdAt)}</span>
                  </p>
                </motion.article>
              </Reveal>
            );
            })}
        </div>

        {items && (
          <Reveal delay={0.15}>
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs font-semibold text-muted-foreground">
              <Megaphone className="size-4 text-brand-red" />
              Posted by the Bright International College admissions office
            </p>
          </Reveal>
        )}
      </div>

      {/* Image lightbox */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            key="ann-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-md"
            onClick={() => setViewing(null)}
            role="dialog"
            aria-modal="true"
            aria-label={viewing.title}
          >
            <motion.figure
              initial={{ scale: 0.9, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <img
                src={viewing.url}
                alt={viewing.title}
                className="max-h-[76vh] w-full bg-navy-50 object-contain"
              />
              <figcaption className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                <span className="truncate text-sm font-extrabold text-navy-900">{viewing.title}</span>
                <button
                  onClick={() => setViewing(null)}
                  aria-label="Close image view"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-800 transition-colors hover:bg-brand-red hover:text-white"
                >
                  <X className="size-4.5" />
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
