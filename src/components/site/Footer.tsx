"use client";

import Image from "next/image";
import { Facebook, Instagram, LockKeyhole, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NAV_LINKS, PROGRAMS, SITE } from "@/lib/site-data";

export function Footer() {
  const year = new Date().getFullYear();
  const openAdmin = () => window.dispatchEvent(new Event("binc:open-admin"));
  return (
    <footer className="mt-auto relative overflow-hidden bg-navy-950 text-navy-100">
      {/* Gold + red top line */}
      <div className="h-1.5 bg-gradient-to-r from-brand-red via-gold-400 to-brand-red" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent 0 30px, rgba(255,255,255,.6) 30px 31px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-14 sm:pb-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Bright International College logo"
                width={56}
                height={56}
                className="size-14 rounded-full bg-white object-contain ring-1 ring-white/15"
              />
              <div className="leading-tight">
                <p className="font-display text-lg font-extrabold text-white">
                  BRIGHT INTERNATIONAL COLLEGE
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400">
                  Excellence in Education
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-100/75">
              A career-focused college in Lahore offering Pharm-D, DPT and BSCS
              programs — with dedicated welfare support making education
              accessible to everyone.
            </p>
            <div className="mt-6 flex gap-3">
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
                  className="grid size-11 place-items-center rounded-xl border border-white/12 bg-white/6 text-navy-100 transition-all hover:-translate-y-1 hover:border-gold-400/50 hover:text-gold-400"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="font-display text-base font-extrabold text-white">Quick Links</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-2 text-navy-100/75 transition-colors hover:text-gold-400"
                  >
                    <span className="size-1 rounded-full bg-brand-redlight" />
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/prospectus/binc-prospectus-2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-gold-400/95 transition-colors hover:text-gold-300"
                >
                  <span className="size-1 rounded-full bg-brand-redlight" />
                  Prospectus 2026 (PDF)
                </a>
              </li>
            </ul>
          </nav>

          {/* Programs */}
          <div>
            <p className="font-display text-base font-extrabold text-white">Programs</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PROGRAMS.map((p) => (
                <li key={p.id}>
                  <a
                    href="#programs"
                    className="inline-flex items-center gap-2 text-navy-100/75 transition-colors hover:text-gold-400"
                  >
                    <span className="size-1 rounded-full bg-brand-redlight" />
                    {p.title} — {p.duration}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href="#welfare"
                  className="inline-flex items-center gap-2 font-bold text-gold-400 transition-colors hover:text-gold-300"
                >
                  <span className="size-1.5 rounded-full bg-gold-400" />
                  Welfare Free Admissions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-base font-extrabold text-white">Contact Us</p>
            <ul className="mt-4 space-y-3.5 text-sm text-navy-100/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4.5 shrink-0 text-gold-400" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4.5 shrink-0 text-gold-400" />
                <a href={`https://wa.me/${SITE.whatsappIntl}`} className="hover:text-gold-400 transition-colors">
                  {SITE.whatsapp} · {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4.5 shrink-0 text-gold-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-400 transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <a
              href="#apply"
              className="mt-5 inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-redlight px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-red/25 transition-transform hover:-translate-y-0.5"
            >
              Apply Now — Fall 2026
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-100/60 sm:flex-row">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-gold-400" />
            Admissions Open — Fall 2026 · Lahore, Pakistan
          </p>
          <button
            onClick={openAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-100/45 transition-colors hover:text-gold-400"
          >
            <LockKeyhole className="size-3" />
            Staff Login
          </button>
        </div>
      </div>
    </footer>
  );
}
