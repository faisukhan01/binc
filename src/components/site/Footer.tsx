"use client";

import Image from "next/image";
import { Facebook, Instagram, LockKeyhole, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NAV_LINKS, PROGRAMS, SITE } from "@/lib/site-data";
import { UR } from "@/lib/i18n";
import { useT } from "@/lib/lang";

export function Footer() {
  const year = new Date().getFullYear();
  const { isUr } = useT();
  const openAdmin = () => window.dispatchEvent(new Event("binc:open-admin"));

  return (
    <footer className="mt-auto bg-navy-950 text-navy-100">
      {/* Slim gold crest line */}
      <div className="h-[3px] bg-gold-500" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3.5">
              <Image
                src="/images/logo.jpg"
                alt="Bright International College logo"
                width={56}
                height={56}
                className="size-14 rounded-full bg-white object-contain"
              />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-white">
                  BRIGHT INTERNATIONAL COLLEGE
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400">
                  Excellence in Education
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-100/70">
              {isUr
                ? UR.footer.blurb
                : "A career-focused college in Lahore offering Pharm-D, DPT and BSCS programs — with dedicated welfare support making education accessible to everyone."}
            </p>
            <div className="mt-6 flex gap-2.5">
              {[
                { href: SITE.socials.facebook, icon: Facebook, label: "Facebook" },
                { href: SITE.socials.instagram, icon: Instagram, label: "Instagram" },
                { href: SITE.socials.youtube, icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${SITE.name} on ${s.label}`}
                  className="grid size-10 place-items-center rounded-lg border border-white/12 text-navy-100/85 transition-colors hover:border-gold-400/60 hover:text-gold-400"
                >
                  <s.icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
              {isUr ? UR.footer.quickLinks : "Quick Links"}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-navy-100/70 transition-colors hover:text-gold-400"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/prospectus/binc-prospectus-2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold-400/95 transition-colors hover:text-gold-300"
                >
                  {isUr ? UR.footer.prospectus : "Prospectus 2026 (PDF)"}
                </a>
              </li>
            </ul>
          </nav>

          {/* Programs */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
              {isUr ? UR.footer.programs : "Programs"}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PROGRAMS.map((p) => (
                <li key={p.id}>
                  <a href="#programs" className="text-navy-100/70 transition-colors hover:text-gold-400">
                    {p.title} — {p.duration}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href="#welfare"
                  className="font-semibold text-gold-400 transition-colors hover:text-gold-300"
                >
                  {isUr ? UR.footer.welfareFree : "Welfare Free Admissions"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
              {isUr ? UR.footer.contact : "Contact Us"}
            </p>
            <ul className="mt-4 space-y-3.5 text-sm text-navy-100/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4.5 shrink-0 text-gold-400/90" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4.5 shrink-0 text-gold-400/90" />
                <a href={`https://wa.me/${SITE.whatsappIntl}`} className="transition-colors hover:text-gold-400">
                  <span className="rtl-ltr">{SITE.whatsapp}</span> · <span className="rtl-ltr">{SITE.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4.5 shrink-0 text-gold-400/90" />
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-400">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <a
              href="#apply"
              className="mt-5 inline-flex min-h-[46px] items-center rounded-lg bg-brand-red px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-redlight"
            >
              {isUr ? UR.footer.applyNow : "Apply Now — Fall 2026"}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-100/55 sm:flex-row">
          <p>
            © {year} {SITE.name}. {isUr ? UR.footer.rights : "All rights reserved."}
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-gold-400" aria-hidden />
            {isUr ? UR.footer.open : "Admissions Open — Fall 2026 · Lahore, Pakistan"}
          </p>
          <button
            onClick={openAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-gold-400"
          >
            <LockKeyhole className="size-3" />
            {isUr ? UR.footer.staffLogin : "Staff Login"}
          </button>
        </div>
      </div>
    </footer>
  );
}
