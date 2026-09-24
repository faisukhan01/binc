"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Phone, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE, NAV_LINKS } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const { isUr } = useT();
  const links = isUr ? UR.nav.links : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — highlight the nav link of the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.35;
        let current = `#${ids[0]}`;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= mid) current = `#${id}`;
        }
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
          current = `#${ids[ids.length - 1]}`;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-navy-950 text-white/90 text-[11px] sm:text-xs">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9 gap-3">
          <p className="flex items-center gap-2 min-w-0">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-400" />
            </span>
            <span className="truncate font-medium tracking-wide">
              {isUr ? UR.topbar : "ADMISSIONS OPEN — FALL 2026 · Limited Seats"}
            </span>
          </p>
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <Phone className="size-3.5" /> {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-gold-400 transition-colors"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-nav shadow-[0_8px_30px_-10px_rgba(7,29,73,0.28)]"
            : "bg-white/70 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4">
          <nav
            className="flex items-center justify-between gap-4 py-2.5"
            aria-label="Main navigation"
          >
            {/* Brand */}
            <a href="#home" className="flex items-center gap-3 group min-w-0">
              <span className="relative shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt={`${SITE.name} logo`}
                  width={54}
                  height={54}
                  priority
                  className="size-11 sm:size-[54px] object-contain rounded-full ring-2 ring-navy-850/10 group-hover:ring-gold-500/60 transition-all duration-500 bg-white"
                />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-gold-400/0 via-gold-400/40 to-brand-red/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10" />
              </span>
              <span className="leading-tight min-w-0">
                <span className="block font-display font-extrabold text-navy-850 text-base sm:text-lg tracking-tight truncate">
                  BRIGHT <span className="text-brand-red">INTERNATIONAL</span> COLLEGE
                </span>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-gold-600">
                  {isUr ? SITE.taglineUr : "Excellence in Education"}
                </span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={l.href === active ? "true" : undefined}
                  className={cn(
                    "relative rounded-lg px-2 py-2 text-[13px] font-semibold transition-colors group xl:px-2.5 xl:text-sm",
                    l.href === active
                      ? "text-navy-950 bg-navy-50"
                      : "text-navy-850/80 hover:text-navy-950 hover:bg-navy-50/70",
                    (l.href === "#campus" || l.href === "#gallery") && "hidden xl:block"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-red to-gold-500 transition-transform duration-300",
                      l.href === active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <LangToggle />
              <a
                href="#apply"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-redlight px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
              >
                <Sparkles className="size-4" />
                {isUr ? UR.nav.applyNow : "Apply Now"}
              </a>
              <Button
                variant="outline"
                size="icon"
                aria-label={isUr ? UR.nav.menuOpen : "Open menu"}
                onClick={() => setOpen(true)}
                className="lg:hidden size-11 border-navy-850/20 text-navy-850 hover:bg-navy-50"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-navy-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[70] w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/logo.jpg"
                    alt="BINC logo"
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-contain"
                  />
                  <span className="font-display font-extrabold text-navy-850 text-sm">
                    Bright International College
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="size-11"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    aria-current={l.href === active ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors",
                      l.href === active
                        ? "bg-navy-50 text-navy-950"
                        : "text-navy-850 hover:bg-navy-50 active:bg-navy-100"
                    )}
                  >
                    {l.label}
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        l.href === active ? "bg-brand-red" : "bg-gold-500"
                      )}
                    />
                  </motion.a>
                ))}
              </nav>

              <div className="p-4 border-t border-border space-y-3">
                <a
                  href="#apply"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-redlight px-5 py-3.5 text-base font-bold text-white min-h-[48px]"
                >
                  <Sparkles className="size-5" /> {isUr ? UR.nav.drawerApply : "Apply Now — Fall 2026"}
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-xl bg-welfare-500 px-5 py-3.5 text-base font-bold text-white min-h-[48px]"
                >
                  WhatsApp: {SITE.whatsapp}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
