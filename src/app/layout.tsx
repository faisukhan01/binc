import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
    images: [{ url: "/images/logo.jpg", width: 447, height: 447 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright International College — Admissions Open Fall 2026",
    description:
      "Pharm-D · DPT · BSCS — Excellence in Education, Lahore. Apply online now.",
  },
};

export const viewport: Viewport = {
  themeColor: "#071d49",
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
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable}`}
    >
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
