import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MarqueeStrip } from "@/components/site/MarqueeStrip";
import { About } from "@/components/site/About";
import { Programs } from "@/components/site/Programs";
import { Welfare } from "@/components/site/Welfare";
import { CampusLife } from "@/components/site/CampusLife";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { AdmissionPopup } from "@/components/site/AdmissionPopup";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeStrip />
        <About />
        <Programs />
        <Welfare />
        <Process />
        <CampusLife />
        <Testimonials />
        <Faq />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <AdmissionPopup />
    </div>
  );
}
