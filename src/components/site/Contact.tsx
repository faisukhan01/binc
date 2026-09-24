"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Copy,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Printer,
  Send,
  Youtube,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAMS, SITE } from "@/lib/site-data";
import { Reveal, SectionHeading } from "./Reveal";
import { StatusTracker } from "./StatusTracker";

const formSchema = z.object({
  fullName: z.string().min(3, "Please enter your full name"),
  fatherName: z.string().min(3, "Father's name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[+0-9][0-9\s-]{9,15}$/, "Enter a valid phone number"),
  program: z.string().min(1, "Select a program"),
  qualification: z.string().min(1, "Select your qualification"),
  lastMarks: z.string().optional(),
  city: z.string().min(2, "City is required"),
  isWelfare: z.boolean().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SuccessState {
  trackingCode: string;
}

const QUALIFICATIONS = ["Matric", "Intermediate (FA/FSc/ICS/ICom)", "DAE", "Bachelor", "Other"];

const CONTACT_LINES = [
  { icon: Phone, label: "WhatsApp & Calls", value: `${SITE.whatsapp} · ${SITE.phone}`, href: `https://wa.me/${SITE.whatsappIntl}` },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Campus Address", value: SITE.address, href: "https://maps.google.com/?q=GECHS+Township+Lahore" },
  { icon: Building2, label: "Website", value: SITE.website, href: "https://www.binc.edu.pk" },
];

export function Contact() {
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      email: "",
      phone: "",
      program: "",
      qualification: "",
      lastMarks: "",
      city: "",
      isWelfare: false,
      message: "",
    },
  });

  const program = watch("program");
  const qualification = watch("qualification");
  const isWelfare = watch("isWelfare");

  // Program cards / modal dispatch this event → pre-select the program in the form
  useEffect(() => {
    const onSelectProgram = (e: Event) => {
      const detail = (e as CustomEvent<{ program?: string }>).detail;
      const title = detail?.program;
      if (!title) return;
      setValue("program", title, { shouldValidate: true });
      setSuccess(null);
      toast({
        title: `${title} selected 🎯`,
        description: "Program pre-filled in the admission form — complete the rest to apply.",
      });
    };
    window.addEventListener("binc:select-program", onSelectProgram);
    return () => window.removeEventListener("binc:select-program", onSelectProgram);
  }, [setValue]);

  // Draft autosave — restore a partially filled form when the visitor returns
  const DRAFT_KEY = "binc-form-draft";
  const draftRestored = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<FormValues>;
      if (draft && ((draft.fullName?.length ?? 0) > 2 || (draft.phone?.length ?? 0) > 5)) {
        reset({ ...draft, isWelfare: Boolean(draft.isWelfare) });
        draftRestored.current = true;
        toast({
          title: "Draft restored ✍️",
          description: "We kept your unfinished application — pick up right where you left off.",
        });
      }
    } catch {
      /* corrupted draft — ignore */
    }
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const meaningful = (values.fullName?.length ?? 0) > 2 || (values.phone?.length ?? 0) > 5;
        if (!meaningful) return;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* storage unavailable — ignore */
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setSuccess({ trackingCode: data.trackingCode });
      reset();
      try {
        localStorage.removeItem("binc-form-draft");
      } catch {
        /* ignore */
      }
      toast({
        title: "Application submitted 🎉",
        description: `Your tracking code is ${data.trackingCode}`,
      });
    } catch (err) {
      toast({
        title: "Could not submit application",
        description: err instanceof Error ? err.message : "Please try again or WhatsApp us.",
        variant: "destructive",
      });
    }
  }

  function copyCode() {
    if (!success) return;
    navigator.clipboard.writeText(success.trackingCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-navy-50/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-40 top-40 size-[420px] rounded-full bg-navy-100/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Admissions & Contact"
          title={
            <>
              Apply online — <span className="text-gradient-navy-red">secure your seat</span>
            </>
          }
          subtitle="Fill the online admission form and our admissions team will contact you the same day. Questions? Reach us on WhatsApp anytime."
        />

        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact info column */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 sm:p-8">
                <div
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent 0 30px, rgba(255,215,90,.5) 30px 31px)",
                  }}
                />
                <h3 className="relative font-display text-2xl font-black text-white">
                  Admissions Office
                </h3>
                <p className="relative mt-1 text-sm text-navy-100/80">
                  Open Mon–Sat · 9:00 AM – 5:00 PM
                </p>

                <div className="relative mt-6 space-y-4">
                  {CONTACT_LINES.map((line) => (
                    <a
                      key={line.label}
                      href={line.href}
                      target={line.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-gold-400/40 hover:bg-white/10"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-md">
                        <line.icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-navy-100/60">
                          {line.label}
                        </span>
                        <span className="mt-0.5 block text-sm font-bold text-white group-hover:text-gold-300 transition-colors break-words">
                          {line.value}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>

                {/* Socials */}
                <div className="relative mt-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-navy-100/60">
                    Follow Bright International College
                  </p>
                  <div className="mt-3 flex gap-3">
                    {[
                      { href: SITE.socials.facebook, icon: Facebook, label: "Facebook", grad: "from-[#1877f2] to-[#0e5fc7]" },
                      { href: SITE.socials.instagram, icon: Instagram, label: "Instagram", grad: "from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
                      { href: SITE.socials.youtube, icon: Youtube, label: "YouTube", grad: "from-[#ff0000] to-[#c00]" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Follow us on ${s.label}`}
                        className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${s.grad} text-white shadow-lg transition-transform hover:-translate-y-1 hover:scale-105`}
                      >
                        <s.icon className="size-5.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quick WhatsApp card */}
            <Reveal delay={0.1}>
              <a
                href={`https://wa.me/${SITE.whatsappIntl}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-3xl bg-gradient-to-r from-welfare-500 to-welfare-700 p-6 shadow-xl shadow-welfare-500/25 transition-transform hover:-translate-y-1"
              >
                <div>
                  <p className="font-display text-xl font-black text-white">
                    Fastest reply? WhatsApp us
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white/85">
                    {SITE.whatsapp} — admissions, fees & eligibility
                  </p>
                </div>
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="size-7 fill-welfare-500" aria-hidden>
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
                  </svg>
                </span>
              </a>
            </Reveal>
          </div>

          {/* Application form column */}
          <Reveal delay={0.08}>
            <div
              id="apply"
              className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-navy-900/10 sm:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-red via-gold-400 to-navy-800" />

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[560px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="grid size-20 place-items-center rounded-full bg-welfare-500/15"
                  >
                    <CheckCircle2 className="size-11 text-welfare-500" />
                  </motion.span>
                  <h3 className="mt-6 font-display text-3xl font-black text-navy-950">
                    Application Received! 🎓
                  </h3>
                  <p className="mt-3 max-w-sm text-muted-foreground">
                    Thank you for applying to Bright International College. Our
                    admissions team will call you shortly.
                  </p>
                  <div className="mt-6 rounded-2xl border-2 border-dashed border-gold-500 bg-gold-300/15 px-6 py-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-muted-foreground">
                      Your Tracking Code
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-3">
                      <p className="font-display text-2xl font-black tracking-wide text-navy-950">
                        {success.trackingCode}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyCode}
                        aria-label="Copy tracking code"
                        className="size-9"
                      >
                        {copied ? <CheckCircle2 className="size-4 text-welfare-500" /> : <Copy className="size-4" />}
                      </Button>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 underline-offset-4 hover:underline"
                    >
                      <Printer className="size-3.5" /> Print confirmation
                    </button>
                  </div>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                      href={`https://wa.me/${SITE.whatsappIntl}?text=Hi! I just submitted my admission application. Tracking code: ${success.trackingCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[48px] items-center rounded-xl bg-welfare-500 px-6 py-3 font-bold text-white transition-colors hover:bg-welfare-700"
                    >
                      Send on WhatsApp
                    </a>
                    <button
                      onClick={() => setSuccess(null)}
                      className="inline-flex min-h-[48px] items-center rounded-xl border border-border px-6 py-3 font-bold text-navy-900 transition-colors hover:bg-navy-50"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl font-black text-navy-950">
                        Online Admission Form
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Fall 2026 · takes less than 2 minutes
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-brand-red/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-red">
                      Open Now
                    </span>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" placeholder="e.g. Ahmed Raza" {...register("fullName")} />
                      {errors.fullName && <p className="text-xs font-semibold text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fatherName">Father's Name *</Label>
                      <Input id="fatherName" placeholder="e.g. Muhammad Raza" {...register("fatherName")} />
                      {errors.fatherName && <p className="text-xs font-semibold text-destructive">{errors.fatherName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone / WhatsApp *</Label>
                      <Input id="phone" type="tel" inputMode="tel" placeholder="03XX-XXXXXXX" {...register("phone")} />
                      {errors.phone && <p className="text-xs font-semibold text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                      {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="program">Program *</Label>
                      <Select value={program} onValueChange={(v) => setValue("program", v, { shouldValidate: true })}>
                        <SelectTrigger id="program" className="w-full" aria-label="Select program">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAMS.map((p) => (
                            <SelectItem key={p.id} value={p.title}>
                              {p.title} — {p.full} ({p.duration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.program && <p className="text-xs font-semibold text-destructive">{errors.program.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Qualification *</Label>
                      <Select value={qualification} onValueChange={(v) => setValue("qualification", v, { shouldValidate: true })}>
                        <SelectTrigger className="w-full" aria-label="Select qualification">
                          <SelectValue placeholder="Last qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUALIFICATIONS.map((q) => (
                            <SelectItem key={q} value={q}>{q}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.qualification && <p className="text-xs font-semibold text-destructive">{errors.qualification.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="lastMarks">Last Marks / % (optional)</Label>
                      <Input id="lastMarks" placeholder="e.g. 87% or 945/1100" {...register("lastMarks")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" placeholder="e.g. Lahore" {...register("city")} />
                      {errors.city && <p className="text-xs font-semibold text-destructive">{errors.city.message}</p>}
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea id="message" placeholder="Any question about fees, eligibility or welfare support…" rows={3} {...register("message")} />
                    </div>

                    <label
                      htmlFor="isWelfare"
                      className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-welfare-500/30 bg-welfare-500/8 p-4 transition-colors hover:bg-welfare-500/12"
                    >
                      <Checkbox
                        id="isWelfare"
                        checked={isWelfare}
                        onCheckedChange={(v) => setValue("isWelfare", v === true)}
                        className="mt-0.5 size-5 border-welfare-700 data-[state=checked]:bg-welfare-500 data-[state=checked]:border-welfare-500"
                      />
                      <span className="text-sm leading-snug">
                        <span className="font-bold text-welfare-700">
                          I am a welfare worker seeking 100% free admission support
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Eligible welfare workers (PWWF) get complete admission support.
                        </span>
                      </span>
                    </label>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="sm:col-span-2 min-h-[54px] rounded-2xl bg-gradient-to-r from-brand-red to-brand-redlight text-base font-extrabold shadow-lg shadow-brand-red/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-5 animate-spin" /> Submitting Application…
                        </>
                      ) : (
                        <>
                          <Send className="size-5" /> Submit Admission Application
                        </>
                      )}
                    </Button>
                    <p className="sm:col-span-2 text-center text-xs text-muted-foreground">
                      By submitting, you agree to be contacted by the admissions office.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>

        {/* Application status tracker */}
        <div className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]" id="track">
          <StatusTracker />
          <QuickHelp />
        </div>
      </div>
    </section>
  );
}

function QuickHelp() {
  return (
    <Reveal delay={0.12}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-800 p-6 sm:p-8">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 30px, rgba(255,215,90,.6) 30px 31px)",
          }}
        />
        <h3 className="relative font-display text-2xl font-black text-white">
          Admission Desk — We reply fast
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-navy-100/85">
          Lost your tracking code? Need fee details, eligibility check or welfare
          verification? Our admissions office is one message away.
        </p>

        <div className="relative mt-6 grid gap-3">
          <a
            href={`https://wa.me/${SITE.whatsappIntl}?text=Hi! I need help with my admission application.`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[56px] items-center justify-between rounded-2xl bg-welfare-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-welfare-900/30 transition-transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="size-6 fill-white" aria-hidden>
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.18 1.42z" />
              </svg>
              WhatsApp Admission Desk
            </span>
            <span className="font-display">{SITE.whatsapp}</span>
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="flex min-h-[56px] items-center justify-between rounded-2xl border border-white/15 bg-white/8 px-5 py-3.5 font-extrabold text-white transition-colors hover:bg-white/15"
          >
            <span className="flex items-center gap-2.5">
              <Phone className="size-5 text-gold-400" /> Call Campus Office
            </span>
            <span className="font-display">{SITE.phone}</span>
          </a>
          <div className="mt-1 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-100/60">
            <span className="size-1.5 rounded-full bg-welfare-500" />
            Mon – Sat · 9:00 AM – 5:00 PM
            <span className="size-1.5 rounded-full bg-welfare-500" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
