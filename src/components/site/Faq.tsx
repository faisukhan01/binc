"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";
import { FAQS } from "@/lib/site-data";
import { useT } from "@/lib/lang";
import { UR } from "@/lib/i18n";
import { Reveal, SectionHeading } from "./Reveal";

export function Faq() {
  const { isUr } = useT();
  const faqs = isUr ? UR.faq.items : FAQS;
  return (
    <section id="faqs" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          kicker={isUr ? UR.faq.kicker : "FAQs"}
          title={
            isUr ? (
              <>
                {UR.faq.titleA} <span className="text-gradient-navy-red">{UR.faq.titleB}</span>
              </>
            ) : (
              <>
                Questions? <span className="text-gradient-navy-red">Answered.</span>
              </>
            )
          }
          subtitle={
            isUr
              ? UR.faq.subtitle
              : "Everything students and parents ask us most — still curious? WhatsApp us anytime."
          }
        />

        <Reveal>
          <Accordion type="single" collapsible className="space-y-3.5">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="group rounded-2xl border border-border bg-white px-5 shadow-sm transition-all data-[state=open]:border-navy-200 data-[state=open]:shadow-lg data-[state=open]:shadow-navy-900/10 sm:px-6"
              >
                <AccordionTrigger className="py-4.5 text-start font-bold text-navy-900 hover:no-underline [&[data-state=open]]:text-brand-red [&>svg]:size-5 [&>svg]:text-brand-red">
                  <span className="flex items-center gap-3.5">
                    <span className="hidden sm:grid size-9 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800 transition-colors group-data-[state=open]:bg-brand-red group-data-[state=open]:text-white">
                      <MessageCircleQuestion className="size-4.5" />
                    </span>
                    <span className="text-[15px] sm:text-base">{f.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-0 text-[15px] leading-relaxed text-muted-foreground sm:pl-[52px]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
