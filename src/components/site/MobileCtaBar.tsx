"use client";

import { motion } from "framer-motion";
import { ClipboardEdit, Phone } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";

/** Fixed bottom action bar — mobile only (Call / Apply / WhatsApp). */
export function MobileCtaBar() {
  const { isUr } = useT();
  return (
    <motion.nav
      initial={{ y: 90 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.4, type: "spring", damping: 22, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-[56] border-t border-white/10 bg-navy-950/95 backdrop-blur-lg sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <a
          href={`tel:${SITE.phone}`}
          className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 py-2 text-white/85 transition-colors active:bg-white/10"
        >
          <Phone className="size-5 text-gold-400" />
          <span className="text-[11px] font-bold">{isUr ? UR.mobileBar.call : "Call"}</span>
        </a>
        <a
          href="#apply"
          className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 bg-green-800 py-2 text-white"
        >
          <ClipboardEdit className="size-5" />
          <span className="text-[11px] font-extrabold tracking-wide">{isUr ? UR.mobileBar.apply : "Apply Now"}</span>
        </a>
        <a
          href={`https://wa.me/${SITE.whatsappIntl}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 py-2 text-white/85 transition-colors active:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-welfare-500" aria-hidden>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
          </svg>
          <span className="text-[11px] font-bold">{isUr ? UR.mobileBar.whatsapp : "WhatsApp"}</span>
        </a>
      </div>
    </motion.nav>
  );
}
