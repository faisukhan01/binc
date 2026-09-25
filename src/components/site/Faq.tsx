"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhoneCall } from "lucide-react";
import { FAQS, SITE } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

export function Faq() {
  const { isUr } = useT();
  const faqs = isUr ? UR.faq.items : FAQS;

  return (
    <section id="faqs" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Left — heading + help card */}
          <div>
            <SectionHeading
              index="07"
              align="left"
              kicker={isUr ? UR.faq.kicker : "FAQs"}
              title={
                isUr ? (
                  <>
                    {UR.faq.titleA} <span className="text-green-700">{UR.faq.titleB}</span>
                  </>
                ) : (
                  <>
                    Questions? <em className="not-italic text-green-700">Answered.</em>
                  </>
                )
              }
              subtitle={
                isUr
                  ? UR.faq.subtitle
                  : "Everything students and parents ask us most — still curious? WhatsApp us anytime."
              }
            />

            <Reveal delay={0.1}>
              <div className="rounded-lg border border-line bg-paper p-6 sm:p-7">
                <p className="font-display text-xl font-semibold text-green-950">
                  {isUr ? "ابھی کوئی سوال ہے؟" : "Still have a question?"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isUr
                    ? "ہمارا داخلہ آفس ہر پیغام کا جواب دیتا ہے — عموماً ایک گھنٹے کے اندر، ہفتے کے ساتوں دن۔"
                    : "Our admissions office answers every message — usually within the hour, seven days a week."}
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsappIntl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-[48px] items-center gap-2.5 rounded-md bg-green-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800"
                >
                  <PhoneCall className="size-4.5 text-gold-400" />
                  <span className="rtl-ltr">{SITE.whatsapp}</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — hairline accordion */}
          <Reveal>
            <Accordion type="single" collapsible className="border-t border-line">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="group border-b border-line"
                >
                  <AccordionTrigger className="py-5 text-start hover:no-underline data-[state=open]:text-green-800 [&>svg]:size-4.5 [&>svg]:text-gold-600">
                    <span className="flex items-baseline gap-4">
                      <span
                        aria-hidden
                        className="hidden w-8 shrink-0 font-display text-sm font-semibold text-gold-600 sm:block"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-bold leading-snug text-green-950 sm:text-base">
                        {f.q}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-0 text-[15px] leading-relaxed text-muted-foreground sm:pl-12">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
