import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Figtree, Gulzar, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LangBoot } from "@/components/site/LangBoot";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const gulzar = Gulzar({
  variable: "--font-gulzar",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.binc.edu.pk"),
  title: "Bright International College | Admissions Open Fall 2026 — Lahore",
  description:
    "Bright International College, Lahore — Excellence in Education. Apply now for Pharm-D, Doctor of Physical Therapy (DPT) and BS Computer Science. Admissions Open Fall 2026. 100% admission free for eligible welfare workers.",
  keywords: [
    "Bright International College",
    "BINC Lahore",
    "Pharm-D Lahore",
    "DPT Lahore",
    "BS Computer Science Lahore",
    "Admissions Open Fall 2026",
    "college in Township Lahore",
  ],
  authors: [{ name: "Bright International College" }],
  icons: { icon: "/images/logo.jpg" },
  openGraph: {
    title: "Bright International College — Admissions Open Fall 2026",
    description:
      "Build a brighter future with Pharm-D, DPT & BSCS at Bright International College, Lahore. Limited seats — apply online today.",
    url: "https://www.binc.edu.pk",
    siteName: "Bright International College",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bright International College — Admissions Open Fall 2026, Lahore. Pharm-D, DPT & BSCS.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright International College — Admissions Open Fall 2026",
    description:
      "Pharm-D · DPT · BSCS — Excellence in Education, Lahore. Apply online now.",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05301f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${figtree.variable} ${cormorant.variable} ${amiri.variable} ${gulzar.variable}`}
    >
      <body className="antialiased bg-background text-foreground font-sans">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-green-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-2xl"
        >
          Skip to content
        </a>
        {children}
        <LangBoot />
        <Toaster />
      </body>
    </html>
  );
}
