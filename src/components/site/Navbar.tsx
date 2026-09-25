"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      <div className="bg-navy-950 text-white/85">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 text-[11px] sm:text-xs">
          <p className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex size-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold-400" />
            </span>
            <span className="truncate font-medium uppercase tracking-[0.14em]">
              {isUr ? UR.topbar : "Admissions Open — Fall 2026 · Limited Seats"}
            </span>
          </p>
          <div className="hidden shrink-0 items-center gap-6 md:flex">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 transition-colors hover:text-gold-400"
            >
              <Phone className="size-3.5" /> <span className="rtl-ltr">{SITE.phone}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-400">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white transition-shadow duration-300",
          scrolled ? "border-border shadow-[0_6px_24px_-16px_rgba(6,13,28,0.35)]" : "border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4">
          <nav
            className="flex items-center justify-between gap-3 py-3"
            aria-label="Main navigation"
          >
            {/* Brand — logo only, original mark, larger */}
            <a href="#home" className="flex min-w-0 items-center" aria-label="Bright International College — home">
              <Image
                src="/images/logo.jpg"
                alt={`${SITE.name} logo`}
                width={220}
                height={88}
                priority
                className="h-16 w-auto object-contain sm:h-20"
              />
            </a>

            {/* Desktop links */}
            <div className="hidden items-center gap-0.5 lg:flex xl:gap-1.5">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={l.href === active ? "true" : undefined}
                  className={cn(
                    "group relative rounded-md px-2.5 py-2 text-[13.5px] font-semibold transition-colors xl:text-sm",
                    l.href === active
                      ? "text-navy-950"
                      : "text-navy-800/75 hover:text-navy-950"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 bottom-0.5 h-[2px] origin-left rounded-full bg-gold-500 transition-transform duration-300",
                      l.href === active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <LangToggle />
              <a
                href="#apply"
                className="hidden min-h-[44px] items-center rounded-lg bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-green-700 sm:inline-flex"
              >
                {isUr ? UR.nav.applyNow : "Apply Now"}
              </a>
              <Button
                variant="outline"
                size="icon"
                aria-label={isUr ? UR.nav.menuOpen : "Open menu"}
                onClick={() => setOpen(true)}
                className="size-11 border-navy-200 text-navy-900 hover:bg-navy-50 lg:hidden"
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
              className="fixed inset-0 z-[60] bg-navy-950/55 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[85vw] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <Image
                  src="/images/logo.jpg"
                  alt="Bright International College logo"
                  width={180}
                  height={72}
                  className="h-11 w-auto object-contain"
                />
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

              <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04 }}
                    aria-current={l.href === active ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-semibold transition-colors",
                      l.href === active
                        ? "bg-navy-50 text-navy-950"
                        : "text-navy-800 hover:bg-navy-50"
                    )}
                  >
                    {l.label}
                    <span
                      className={cn(
                        "h-[2px] w-5 rounded-full",
                        l.href === active ? "bg-gold-500" : "bg-navy-100"
                      )}
                    />
                  </motion.a>
                ))}
              </nav>

              <div className="space-y-2.5 border-t border-border p-4">
                <a
                  href="#apply"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-lg bg-green-800 px-5 py-3.5 text-base font-bold text-white"
                >
                  {isUr ? UR.nav.drawerApply : "Apply Now — Fall 2026"}
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[48px] items-center justify-center rounded-lg bg-welfare-700 px-5 py-3.5 text-base font-bold text-white"
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
