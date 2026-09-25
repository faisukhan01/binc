"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ImageIcon, Pin, X, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  imageUrl?: string | null;
  createdAt: string;
}

const TAG_DOTS: Record<string, string> = {
  Notice: "bg-green-700",
  Event: "bg-gold-500",
  Deadline: "bg-brand-red",
  Result: "bg-welfare-500",
};

/** "just now" / "2d ago" — compact relative time for notice cards */
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

/**
 * NoticeBoard — a compact editorial band directly under the hero.
 * A slim labelled strip with horizontally scrollable notice cards.
 * Hidden entirely until staff publish something.
 */
export function Announcements() {
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [viewing, setViewing] = useState<{ url: string; title: string } | null>(null);

  // Escape closes the image lightbox
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

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
  if (!items || items.length === 0) return null;

  return (
    <section id="news" aria-label="Notice board" className="border-y border-line bg-parchment">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9">
        <div className="flex items-center gap-4">
          <p className="flex shrink-0 items-center gap-2.5">
            <Megaphone className="size-4 text-gold-600" aria-hidden />
            <span className="kicker-caps text-green-950">Notice Board</span>
          </p>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <p className="hidden shrink-0 text-xs font-medium text-muted-foreground sm:block">
            Announcements from the admissions office
          </p>
        </div>

        {/* Horizontal scroll row */}
        <div
          className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:thin]"
          role="list"
        >
          {items.map((a) => (
            <motion.article
              key={a.id}
              role="listitem"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-[300px] shrink-0 snap-start rounded-lg border border-line bg-white p-4.5 shadow-sm sm:w-[340px]"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${TAG_DOTS[a.tag] ?? TAG_DOTS.Notice}`} aria-hidden />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-800">
                  {a.tag}
                </span>
                {a.pinned && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                    <Pin className="size-3" /> Pinned
                  </span>
                )}
              </div>

              {a.imageUrl && (
                <button
                  type="button"
                  onClick={() => setViewing({ url: a.imageUrl!, title: a.title })}
                  aria-label={`View image: ${a.title}`}
                  className="relative mt-3 block w-full overflow-hidden rounded-md ring-1 ring-line"
                >
                  <img
                    src={a.imageUrl}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/8] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-950 shadow-sm">
                    <ImageIcon className="size-3 text-gold-600" /> View
                  </span>
                </button>
              )}

              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-green-950">
                {a.title}
              </h3>
              <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                {a.body}
              </p>

              <p className="mt-3.5 flex items-center gap-1.5 border-t border-line pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                <CalendarDays className="size-3.5" />
                {new Date(a.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                <span className="normal-case tracking-normal">· {relativeTime(a.createdAt)}</span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Image lightbox */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            key="ann-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-green-950/85 p-4 backdrop-blur-md"
            onClick={() => setViewing(null)}
            role="dialog"
            aria-modal="true"
            aria-label={viewing.title}
          >
            <motion.figure
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <img
                src={viewing.url}
                alt={viewing.title}
                className="max-h-[76vh] w-full bg-parchment object-contain"
              />
              <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                <span className="truncate text-sm font-bold text-green-950">{viewing.title}</span>
                <button
                  onClick={() => setViewing(null)}
                  aria-label="Close image view"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-parchment text-green-950 transition-colors hover:bg-green-950 hover:text-white"
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
