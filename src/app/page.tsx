import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MarqueeStrip } from "@/components/site/MarqueeStrip";
import { About } from "@/components/site/About";
import { Announcements } from "@/components/site/Announcements";
import { Programs } from "@/components/site/Programs";
import { Welfare } from "@/components/site/Welfare";
import { Admissions } from "@/components/site/Admissions";
import { CampusLife } from "@/components/site/CampusLife";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { AdmissionPopup } from "@/components/site/AdmissionPopup";
import { AdminConsole } from "@/components/site/AdminConsole";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { SITE, FAQS } from "@/lib/site-data";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: SITE.name,
      alternateName: SITE.shortName,
      slogan: SITE.tagline,
      email: SITE.email,
      telephone: `+${SITE.whatsappIntl}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "57 Sector A, GECHS Township, Near Pindi Stop",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
      sameAs: [SITE.socials.facebook, SITE.socials.instagram, SITE.socials.youtube],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Degree Programs",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Course", name: "Pharm-D — Doctor of Pharmacy (5 Years)" } },
          { "@type": "Offer", itemOffered: { "@type": "Course", name: "DPT — Doctor of Physical Therapy (5 Years)" } },
          { "@type": "Offer", itemOffered: { "@type": "Course", name: "BSCS — BS Computer Science (4 Years)" } },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeStrip />
        <About />
        <Announcements />
        <Programs />
        <Welfare />
        <Admissions />
        <CampusLife />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
      <FloatingWhatsApp />
      <AdmissionPopup />
      <AdminConsole />
    </div>
  );
}
