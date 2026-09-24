"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  Clock3,
  Copy,
  Download,
  GraduationCap,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Megaphone,
  MessageCircle,
  Newspaper,
  Pencil,
  Pin,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AdminApplication {
  id: string;
  trackingCode: string;
  fullName: string;
  fatherName: string;
  email: string | null;
  phone: string;
  program: string;
  qualification: string;
  lastMarks: string | null;
  city: string;
  isWelfare: boolean;
  status: string;
  message: string | null;
  createdAt: string;
}

interface ProgramCount {
  program: string;
  count: number;
}

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  imageUrl?: string | null;
  createdAt: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  program: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
  pinned: boolean;
  createdAt: string;
}

interface AdminStats {
  total: number;
  pending: number;
  contacted: number;
  approved: number;
  rejected: number;
  welfare: number;
}

const STATUSES = ["PENDING", "CONTACTED", "APPROVED", "REJECTED"] as const;

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-gold-400/15 text-gold-600 ring-gold-400/40" },
  CONTACTED: { label: "Contacted", className: "bg-navy-100 text-navy-800 ring-navy-500/30" },
  APPROVED: { label: "Approved", className: "bg-welfare-500/15 text-welfare-700 ring-welfare-500/40" },
  REJECTED: { label: "Rejected", className: "bg-brand-red/10 text-brand-red ring-brand-red/30" },
};

const STORAGE_KEY = "binc_admin_key";

/** Convert a local Pakistani mobile number (03XX-XXXXXXX) to wa.me intl digits (92XXXXXXXXXX) */
function waIntl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full;
}

/** Shared staff image picker — uploads to /api/upload and stores the /uploads/… URL. */
function ImagePicker({
  url,
  onChange,
  adminKey,
  label,
  hint,
  aspect = "aspect-[16/9]",
}: {
  url: string;
  onChange: (url: string) => void;
  adminKey: string;
  label: string;
  hint?: string;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setPickerError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("adminKey", adminKey);
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setPickerError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setPickerError("Network error — upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold">{label}</Label>
      {url ? (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-navy-50">
          <img
            src={url}
            alt="Selected preview"
            className={cn("w-full object-cover", aspect)}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-950/55 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="border-white/40 bg-white/90 text-xs font-bold text-navy-900 hover:bg-white"
            >
              <Pencil className="size-3.5" /> Replace
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("")}
              className="border-brand-red/40 bg-white/90 text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white"
            >
              <Trash2 className="size-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[72px] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/50 px-4 py-4 text-center transition-colors hover:border-gold-400/70 hover:bg-gold-400/5 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="size-5 animate-spin text-navy-700" />
              <span className="text-xs font-bold text-navy-800">Uploading…</span>
            </>
          ) : (
            <>
              <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-navy-100">
                <Plus className="size-4 text-brand-red" />
              </span>
              <span className="text-xs font-extrabold text-navy-900">Upload an image</span>
              <span className="text-[11px] text-muted-foreground">JPG · PNG · WEBP · GIF — up to 3 MB</span>
            </>
          )}
        </button>
      )}
      {hint && !url && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {pickerError && (
        <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-xs font-bold text-brand-red">{pickerError}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        aria-label="Choose image file"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
    </div>
  );
}

export function AdminConsole() {
  const [open, setOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [byProgram, setByProgram] = useState<ProgramCount[]>([]);
  const [query, setQuery] = useState("");
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);
  const [tab, setTab] = useState<
    "applications" | "announcements" | "testimonials" | "settings"
  >("applications");

  /** Public site settings for the Settings tab (deadline + popup behaviour) */
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok) {
        const s = data.settings ?? {};
        setDeadline(s.admissionDeadline ?? "");
        setPopupEnabled(s.popupEnabled === "off" ? "off" : "on");
        setPopupTitle(s.popupTitle ?? "");
        setPopupMessage(s.popupMessage ?? "");
      }
    } catch {
      /* non-critical */
    }
  }, []);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annTag, setAnnTag] = useState("Notice");
  const [annPinned, setAnnPinned] = useState(false);
  const [annSaving, setAnnSaving] = useState(false);
  const [annError, setAnnError] = useState<string | null>(null);
  const [annEditingId, setAnnEditingId] = useState<string | null>(null);
  const [annImage, setAnnImage] = useState("");
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [tstLoading, setTstLoading] = useState(false);
  const [tstName, setTstName] = useState("");
  const [tstProgram, setTstProgram] = useState("");
  const [tstQuote, setTstQuote] = useState("");
  const [tstRating, setTstRating] = useState(5);
  const [tstPhoto, setTstPhoto] = useState("");
  const [tstPinned, setTstPinned] = useState(false);
  const [tstSaving, setTstSaving] = useState(false);
  const [tstError, setTstError] = useState<string | null>(null);
  const [tstEditingId, setTstEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [trendRange, setTrendRange] = useState<7 | 14 | 30>(14);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newApp, setNewApp] = useState<{ code: string; name: string } | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [liveAt, setLiveAt] = useState<number | null>(null);
  const [deadline, setDeadline] = useState("");
  const [deadlineSaving, setDeadlineSaving] = useState(false);
  const [deadlineMsg, setDeadlineMsg] = useState<string | null>(null);
  const [popupEnabled, setPopupEnabled] = useState<"on" | "off">("on");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSaving, setPopupSaving] = useState(false);
  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const prevTotalRef = useRef<number | null>(null);

  // Open via footer event
  useEffect(() => {
    const handler = () => {
      setBooted(true);
      setAdminKey(localStorage.getItem(STORAGE_KEY) || "");
      setOpen(true);
    };
    window.addEventListener("binc:open-admin", handler);
    return () => window.removeEventListener("binc:open-admin", handler);
  }, []);

  const login = useCallback(
    async (key: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admissions/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminKey: key }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Login failed");
          setAuthed(false);
          return;
        }
        localStorage.setItem(STORAGE_KEY, key);
        setAdminKey(key);
        setApps(data.applications);
        setStats(data.stats);
        setByProgram(data.byProgram ?? []);
        prevTotalRef.current = data.stats.total;
        setNewApp(null);
        setHighlightId(null);
        setAuthed(true);
        void loadAnnouncements();
        void loadTestimonials();
        void loadSettings();
      } catch {
        setError("Network error — please try again");
      } finally {
        setLoading(false);
      }
    },
    [loadSettings]
  );

  // Auto-login if a saved key exists
  useEffect(() => {
    if (!open || authed || !booted) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) void login(saved);
  }, [open, booted]);

  const updateStatus = useCallback(
    async (code: string, status: string) => {
      setSavingCode(code);
      try {
        const res = await fetch("/api/admissions/admin", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminKey, code, status }),
        });
        const data = await res.json();
        if (res.ok) {
          setApps((list) =>
            list.map((a) => (a.trackingCode === code ? { ...a, status } : a))
          );
          setStats((s) => {
            if (!s) return s;
            const prev = apps.find((a) => a.trackingCode === code)?.status;
            if (!prev || prev === status) return s;
            const next = { ...s };
            next[prev.toLowerCase() as keyof AdminStats]--;
            next[status.toLowerCase() as keyof AdminStats]++;
            return next;
          });
        }
      } finally {
        setSavingCode(null);
      }
    },
    [adminKey, apps]
  );

  /** Silent re-fetch used by live polling — detects new applications without UI churn */
  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admissions/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 429) {
          const data = await res.json().catch(() => null);
          localStorage.removeItem(STORAGE_KEY);
          setAuthed(false);
          setError(data?.error ?? "Session expired — please log in again");
        }
        return;
      }
      const data = await res.json();
      const prev = prevTotalRef.current;
      const newest = (data.applications as AdminApplication[])[0];
      if (prev !== null && data.stats.total > prev && newest) {
        setNewApp({ code: newest.trackingCode, name: newest.fullName });
        setHighlightId(newest.id);
        toast({
          title: "New application received 🎉",
          description: `${newest.trackingCode} · ${newest.fullName} — ${newest.program}`,
        });
        setTimeout(() => setHighlightId(null), 8000);
        setTimeout(() => setNewApp(null), 12000);
      }
      prevTotalRef.current = data.stats.total;
      setApps(data.applications);
      setStats(data.stats);
      setByProgram(data.byProgram ?? []);
      setLiveAt(Date.now());
    } catch {
      /* transient network error — the next poll retries */
    }
  }, [adminKey, toast]);

  // Live polling — every 20s while the console is open & the tab is visible
  useEffect(() => {
    if (!authed || !open) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void silentRefresh();
    }, 20000);
    return () => clearInterval(id);
  }, [authed, open, silentRefresh]);

  const saveDeadline = useCallback(
    async (value: string) => {
      setDeadlineSaving(true);
      setDeadlineMsg(null);
      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminKey, admissionDeadline: value }),
        });
        const data = await res.json();
        if (!res.ok) {
          setDeadlineMsg(data.error || "Could not save the deadline");
          return;
        }
        setDeadline(data.settings?.admissionDeadline ?? value);
        setDeadlineMsg("✓ Saved — the website countdown updates instantly.");
      } catch {
        setDeadlineMsg("Network error — please try again");
      } finally {
        setDeadlineSaving(false);
      }
    },
    [adminKey]
  );

  /** Save the popup behaviour settings (enabled / title / message) */
  const savePopup = useCallback(async () => {
    setPopupSaving(true);
    setPopupMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          popupEnabled,
          popupTitle: popupTitle.trim(),
          popupMessage: popupMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPopupMsg(data.error || "Could not save popup settings");
        return;
      }
      setPopupMsg(
        popupEnabled === "off"
          ? "✓ Saved — the popup is now hidden for all visitors."
          : popupTitle.trim() || popupMessage.trim()
            ? "✓ Saved — visitors see your custom popup text."
            : "✓ Saved — the popup shows the default Fall 26 message."
      );
    } catch {
      setPopupMsg("Network error — please try again");
    } finally {
      setPopupSaving(false);
    }
  }, [adminKey, popupEnabled, popupTitle, popupMessage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (programFilter !== "ALL" && a.program !== programFilter) return false;
      if (!q) return true;
      return [a.trackingCode, a.fullName, a.program, a.phone, a.city, a.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [apps, query, statusFilter, programFilter]);

  /** Applications per day for the selected range (oldest → newest, local-day buckets) */
  const trendDays = useMemo(() => {
    const keyOf = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const counts = new Map<string, number>();
    for (const a of apps) {
      const k = keyOf(new Date(a.createdAt));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const days: { key: string; label: string; full: string; count: number }[] = [];
    for (let i = trendRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = keyOf(d);
      days.push({
        key: k,
        label: String(d.getDate()).padStart(2, "0"),
        full: d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }),
        count: counts.get(k) ?? 0,
      });
    }
    return days;
  }, [apps, trendRange]);

  const last7 = useMemo(
    () => trendDays.slice(-7).reduce((s, d) => s + d.count, 0),
    [trendDays]
  );

  /** Top cities by application count (max 6) */
  const byCity = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of apps) {
      const c = a.city.trim() || "Unknown";
      m.set(c, (m.get(c) ?? 0) + 1);
    }
    return [...m.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 6)
      .map(([city, count]) => ({ city, count }));
  }, [apps]);

  const trendMax = useMemo(
    () => Math.max(1, ...trendDays.map((d) => d.count)),
    [trendDays]
  );

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setAdminKey("");
    setApps([]);
    setStats(null);
    setByProgram([]);
    setAnnouncements([]);
    setTestimonials([]);
    setTab("applications");
    setError(null);
    setNewApp(null);
    setHighlightId(null);
    setDeadline("");
    setDeadlineMsg(null);
    setLiveAt(null);
    setPopupEnabled("on");
    setPopupTitle("");
    setPopupMessage("");
    setPopupMsg(null);
    prevTotalRef.current = null;
  };

  const loadAnnouncements = useCallback(async () => {
    setAnnLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements ?? []);
    } finally {
      setAnnLoading(false);
    }
  }, []);

  const loadTestimonials = useCallback(async () => {
    setTstLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials ?? []);
    } finally {
      setTstLoading(false);
    }
  }, []);

  /** Public sections on this page subscribe to these and refresh instantly */
  const notifySite = useCallback((name: string) => {
    window.dispatchEvent(new CustomEvent(name));
  }, []);

  const resetAnnForm = useCallback(() => {
    setAnnTitle("");
    setAnnBody("");
    setAnnTag("Notice");
    setAnnPinned(false);
    setAnnImage("");
    setAnnEditingId(null);
  }, []);

  const startEditAnnouncement = useCallback((a: AnnouncementItem) => {
    setAnnEditingId(a.id);
    setAnnTitle(a.title);
    setAnnBody(a.body);
    setAnnTag(a.tag);
    setAnnPinned(a.pinned);
    setAnnImage(a.imageUrl ?? "");
    setAnnError(null);
  }, []);

  const saveAnnouncement = useCallback(async () => {
    setAnnSaving(true);
    setAnnError(null);
    try {
      const editing = Boolean(annEditingId);
      const res = await fetch("/api/announcements", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          ...(editing ? { id: annEditingId } : {}),
          title: annTitle,
          body: annBody,
          tag: annTag,
          pinned: annPinned,
          imageUrl: annImage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnnError(data.error || "Could not save announcement");
        return;
      }
      setAnnouncements((list) => {
        const next = editing
          ? list.map((a) => (a.id === annEditingId ? (data.announcement as AnnouncementItem) : a))
          : [data.announcement as AnnouncementItem, ...list];
        // Re-sort: pinned first, then newest (mirrors the public API order)
        return [...next].sort((x, y) => {
          if (x.pinned !== y.pinned) return x.pinned ? -1 : 1;
          return new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime();
        });
      });
      resetAnnForm();
      notifySite("binc:announcements-changed");
    } catch {
      setAnnError("Network error — please try again");
    } finally {
      setAnnSaving(false);
    }
  }, [adminKey, annTitle, annBody, annTag, annPinned, annImage, annEditingId, resetAnnForm, notifySite]);

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/announcements?adminKey=${encodeURIComponent(adminKey)}&id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setAnnouncements((list) => list.filter((a) => a.id !== id));
          if (annEditingId === id) resetAnnForm();
          notifySite("binc:announcements-changed");
        }
      } catch {
        /* keep row on failure */
      }
    },
    [adminKey, annEditingId, resetAnnForm, notifySite]
  );

  const resetTstForm = useCallback(() => {
    setTstName("");
    setTstProgram("");
    setTstQuote("");
    setTstRating(5);
    setTstPhoto("");
    setTstPinned(false);
    setTstEditingId(null);
  }, []);

  const startEditTestimonial = useCallback((t: TestimonialItem) => {
    setTstEditingId(t.id);
    setTstName(t.name);
    setTstProgram(t.program);
    setTstQuote(t.quote);
    setTstRating(t.rating);
    setTstPhoto(t.photoUrl ?? "");
    setTstPinned(t.pinned);
    setTstError(null);
  }, []);

  const saveTestimonial = useCallback(async () => {
    setTstSaving(true);
    setTstError(null);
    try {
      const editing = Boolean(tstEditingId);
      const res = await fetch("/api/testimonials", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          ...(editing ? { id: tstEditingId } : {}),
          name: tstName,
          program: tstProgram,
          quote: tstQuote,
          rating: tstRating,
          photoUrl: tstPhoto.trim(),
          pinned: tstPinned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTstError(data.error || "Could not save testimonial");
        return;
      }
      setTestimonials((list) =>
        editing
          ? list.map((t) => (t.id === tstEditingId ? (data.testimonial as TestimonialItem) : t))
          : [data.testimonial as TestimonialItem, ...list]
      );
      resetTstForm();
      notifySite("binc:testimonials-changed");
    } catch {
      setTstError("Network error — please try again");
    } finally {
      setTstSaving(false);
    }
  }, [adminKey, tstEditingId, tstName, tstProgram, tstQuote, tstRating, tstPhoto, tstPinned, resetTstForm, notifySite]);

  const deleteTestimonial = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/testimonials?adminKey=${encodeURIComponent(adminKey)}&id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setTestimonials((list) => list.filter((t) => t.id !== id));
          notifySite("binc:testimonials-changed");
        }
      } catch {
        /* keep row on failure */
      }
    },
    [adminKey, notifySite]
  );

  /** Export the (filtered) application list as a CSV download */
  const exportCsv = () => {
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      return /["\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = [
      "Tracking Code", "Full Name", "Father Name", "Phone", "Email", "Program",
      "Qualification", "Last Marks", "City", "Welfare", "Status", "Applied On", "Message",
    ];
    const rows = filtered.map((a) => [
      a.trackingCode, a.fullName, a.fatherName, a.phone, a.email ?? "", a.program,
      a.qualification, a.lastMarks ?? "", a.city, a.isWelfare ? "Yes" : "No", a.status,
      new Date(a.createdAt).toLocaleString("en-GB"), a.message ?? "",
    ]);
    const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `binc-admissions-fall26-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-0 sm:max-w-4xl [&>button]:hidden">
        <DialogHeader className="space-y-0 rounded-t-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 px-6 py-5 text-left">
          <DialogTitle className="flex items-center gap-3 font-display text-xl font-black text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-gold-400/15 ring-1 ring-gold-400/40">
              <ShieldCheck className="size-5 text-gold-400" />
            </span>
            <span>
              Admissions Console
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
                Bright International College — Staff Area
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Staff login to review and manage admission applications.
          </DialogDescription>
          {authed && (
            <button
              onClick={logout}
              className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-red"
            >
              <LogOut className="size-3.5" /> Logout
            </button>
          )}
        </DialogHeader>

        {/* LOGIN GATE */}
        {!authed ? (
          <form
            className="px-6 py-8"
            onSubmit={(e) => {
              e.preventDefault();
              void login(adminKey);
            }}
          >
            <div className="mx-auto max-w-sm text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-navy-50 ring-1 ring-navy-100">
                <LockKeyhole className="size-8 text-navy-800" />
              </span>
              <h3 className="mt-4 font-display text-xl font-extrabold text-navy-900">
                Staff Login
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter the staff passcode shared by the admissions office.
              </p>
              <div className="relative mt-5">
                <KeyRound className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Staff passcode"
                  aria-label="Staff passcode"
                  className="h-12 rounded-xl pl-11 text-sm"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-3 rounded-lg bg-brand-red/10 px-3 py-2 text-xs font-bold text-brand-red">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading || !adminKey}
                className="mt-4 h-12 w-full rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 text-sm font-extrabold text-white shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4.5 animate-spin" /> Verifying…
                  </>
                ) : (
                  "Unlock Console"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-5 sm:px-6">
            {/* Tabs */}
            <div
              className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-navy-50 p-1 sm:grid-cols-4"
              role="tablist"
              aria-label="Console sections"
            >
              {([
                { id: "applications", label: "Applications", icon: Users, count: apps.length },
                { id: "announcements", label: "Announcements", icon: Megaphone, count: announcements.length },
                { id: "testimonials", label: "Voices", icon: Quote, count: testimonials.length },
                { id: "settings", label: "Settings", icon: Settings2, count: undefined },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-label={t.count !== undefined ? `${t.label} (${t.count})` : t.label}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg px-1 text-[13px] font-extrabold transition-all sm:gap-2 sm:text-sm ${
                    tab === t.id
                      ? "bg-white text-navy-900 shadow-sm"
                      : "text-muted-foreground hover:text-navy-800"
                  }`}
                >
                  <t.icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                  {t.count !== undefined && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                        tab === t.id ? "bg-navy-900 text-gold-400" : "bg-navy-100 text-navy-700"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab === "applications" ? (
            <>
            {/* New-application live alert */}
            <AnimatePresence>
              {newApp && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-gold-400/50 bg-gradient-to-r from-gold-400/15 to-transparent px-4 py-3"
                >
                  <p className="min-w-0 truncate text-xs font-extrabold text-navy-900">
                    <span className="mr-2 inline-flex items-center rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      New
                    </span>
                    {newApp.code} · {newApp.name} just applied
                  </p>
                  <button
                    onClick={() => setNewApp(null)}
                    aria-label="Dismiss new application alert"
                    className="rounded-md p-1 text-navy-600 transition hover:bg-navy-100"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "Total", value: stats?.total ?? 0, icon: Users, tone: "text-navy-800 bg-navy-50" },
                { label: "Pending", value: stats?.pending ?? 0, icon: Clock3, tone: "text-gold-600 bg-gold-400/15" },
                { label: "Contacted", value: stats?.contacted ?? 0, icon: KeyRound, tone: "text-navy-700 bg-navy-100" },
                { label: "Approved", value: stats?.approved ?? 0, icon: BadgeCheck, tone: "text-welfare-700 bg-welfare-500/15" },
                { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, tone: "text-brand-red bg-brand-red/10" },
                { label: "Welfare", value: stats?.welfare ?? 0, icon: GraduationCap, tone: "text-welfare-700 bg-welfare-500/10" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-white p-3.5">
                  <span className={`grid size-8 place-items-center rounded-lg ${s.tone}`}>
                    <s.icon className="size-4" />
                  </span>
                  <p className="mt-2 font-display text-2xl font-black leading-none text-navy-900">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Program distribution */}
            {byProgram.length > 0 && (
              <div className="mt-5 rounded-xl border border-border bg-navy-50/60 p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                  Applications by program
                </p>
                <div className="mt-3 space-y-2.5">
                  {byProgram.map((p) => {
                    const pct = stats && stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
                    return (
                      <div key={p.program} className="flex items-center gap-3">
                        <span className="w-20 shrink-0 truncate text-xs font-extrabold text-navy-900">
                          {p.program}
                        </span>
                        <div
                          className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy-100"
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${p.program}: ${p.count} applications (${pct}%)`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(pct, 6)}%` }}
                            transition={{ type: "spring", damping: 22, stiffness: 160 }}
                            className="h-full rounded-full bg-gradient-to-r from-navy-800 via-navy-700 to-brand-red"
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right text-xs font-bold text-muted-foreground">
                          {p.count} · {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* APPLICATION TRENDS — last 14 days + cities */}
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_260px]">
              <div className="rounded-xl border border-border bg-navy-50/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                    Applications — last {trendRange} days
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex rounded-lg bg-white p-0.5 ring-1 ring-navy-100"
                      role="group"
                      aria-label="Chart range"
                    >
                      {([7, 14, 30] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setTrendRange(r)}
                          aria-pressed={trendRange === r}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-black transition-colors",
                            trendRange === r
                              ? "bg-navy-900 text-gold-400"
                              : "text-navy-600 hover:bg-navy-50"
                          )}
                        >
                          {r}d
                        </button>
                      ))}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ring-1",
                        last7 > 0
                          ? "bg-welfare-500/12 text-welfare-700 ring-welfare-500/30"
                          : "bg-navy-100 text-navy-600 ring-navy-100"
                      )}
                    >
                      {last7} in last 7 days
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex h-28 items-end gap-1.5" role="img" aria-label={`Bar chart of applications per day over the last ${trendRange} days, ${last7} in the last 7 days`}>
                  {trendDays.map((d, i) => (
                    <div
                      key={d.key}
                      className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1"
                      title={`${d.full}: ${d.count} application${d.count === 1 ? "" : "s"}`}
                    >
                      {d.count > 0 && (
                        <span className="text-[9px] font-black text-navy-800 opacity-0 transition-opacity group-hover:opacity-100">
                          {d.count}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max((d.count / trendMax) * 100, d.count > 0 ? 10 : 3)}%` }}
                        transition={{ type: "spring", damping: 24, stiffness: 200, delay: i * 0.02 }}
                        className={cn(
                          "w-full max-w-[22px] rounded-t-md transition-colors",
                          d.count > 0
                            ? i === trendDays.length - 1
                              ? "bg-gradient-to-t from-brand-red to-gold-400"
                              : "bg-gradient-to-t from-navy-800 to-navy-500 group-hover:from-brand-red group-hover:to-gold-400"
                            : "bg-navy-100"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[9px] font-bold leading-none",
                          i === trendDays.length - 1 ? "text-brand-red" : "text-muted-foreground/70"
                        )}
                      >
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                  Top cities
                </p>
                {byCity.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">No applications yet.</p>
                ) : (
                  <ul className="mt-3 space-y-1.5">
                    {byCity.map((c, i) => (
                      <li key={c.city} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-md text-[10px] font-black text-white",
                            i === 0 ? "bg-brand-red" : i === 1 ? "bg-gold-500 text-navy-950" : "bg-navy-700"
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-bold text-navy-900">
                          {c.city}
                        </span>
                        <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-black text-navy-800 ring-1 ring-navy-100">
                          {c.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by code, name, program, phone, city…"
                  aria-label="Search applications"
                  className="h-11 rounded-xl pl-10 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    className="h-11 w-[126px] rounded-xl text-xs font-bold"
                    aria-label="Filter by status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs font-bold">All statuses</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs font-bold">
                        {STATUS_STYLES[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger
                    className="h-11 w-[118px] rounded-xl text-xs font-bold"
                    aria-label="Filter by program"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs font-bold">All programs</SelectItem>
                    {byProgram.map((p) => (
                      <SelectItem key={p.program} value={p.program} className="text-xs font-bold">
                        {p.program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <span
                  className="hidden items-center gap-1.5 rounded-full bg-welfare-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-welfare-700 ring-1 ring-welfare-500/30 sm:inline-flex"
                  title="Applications auto-refresh every 20 seconds while this window is open"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-welfare-500 opacity-80" />
                    <span className="relative inline-flex size-2 rounded-full bg-welfare-500" />
                  </span>
                  Live
                </span>
                <Button
                  variant="outline"
                  onClick={exportCsv}
                  disabled={filtered.length === 0}
                  className="h-11 flex-1 rounded-xl border-navy-200 px-4 text-sm font-bold text-navy-800 hover:bg-navy-50 sm:flex-none"
                >
                  <Download className="size-4" /> CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void login(adminKey)}
                  className="h-11 flex-1 rounded-xl border-navy-200 px-4 text-sm font-bold text-navy-800 hover:bg-navy-50 sm:flex-none"
                >
                  <RefreshCw className="size-4" /> Refresh
                </Button>
              </div>
            </div>
            {(statusFilter !== "ALL" || programFilter !== "ALL") && (
              <div className="mt-2.5 flex items-center gap-2">
                <p className="text-[11px] font-bold text-muted-foreground">
                  Filters active — showing {filtered.length} of {apps.length}
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("ALL");
                    setProgramFilter("ALL");
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-extrabold text-navy-800 ring-1 ring-navy-100 transition hover:bg-navy-100"
                >
                  <X className="size-3" /> Clear filters
                </button>
              </div>
            )}

            {/* List */}
            <div className="mt-4 max-h-[46vh] overflow-y-auto rounded-xl border border-border">
              {filtered.length === 0 ? (
                <div className="grid place-items-center gap-2 py-14 text-center">
                  <GraduationCap className="size-9 text-navy-200" />
                  <p className="text-sm font-bold text-navy-900">No applications found</p>
                  <p className="text-xs text-muted-foreground">
                    {query ? "Try a different search term." : "New applications will appear here."}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {filtered.map((a) => (
                      <motion.li
                        key={a.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                          highlightId === a.id ? "bg-gold-400/15" : "hover:bg-navy-50/60"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-extrabold tracking-wide text-brand-red">
                              {a.trackingCode}
                            </span>
                            <Badge
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${STATUS_STYLES[a.status]?.className ?? ""}`}
                            >
                              {STATUS_STYLES[a.status]?.label ?? a.status}
                            </Badge>
                            {a.isWelfare && (
                              <Badge className="rounded-full bg-welfare-500/12 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-welfare-700 ring-1 ring-welfare-500/30">
                                Welfare
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 truncate text-sm font-extrabold text-navy-900">
                            {a.fullName}{" "}
                            <span className="font-medium text-muted-foreground">
                              · {a.program} · {a.city}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            <a href={`tel:${a.phone}`} className="font-bold text-navy-700 hover:text-brand-red">
                              {a.phone}
                            </a>
                            {a.email && <> · {a.email}</>}
                            {a.qualification && <> · {a.qualification}</>}
                            {" · "}
                            {new Date(a.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              window.open(
                                `https://wa.me/${waIntl(a.phone)}?text=${encodeURIComponent(
                                  `Assalam-o-Alaikum ${firstName(a.fullName)}, this is Bright International College (Admissions Office). Regarding your Fall 2026 application ${a.trackingCode} for ${a.program} — we have received it and would like to guide you through the next steps.`
                                )}`,
                                "_blank",
                                "noopener"
                              )
                            }
                            aria-label={`WhatsApp ${a.fullName} about ${a.trackingCode}`}
                            className="size-9 border-welfare-500/40 text-welfare-700 hover:bg-welfare-500 hover:text-white"
                          >
                            <MessageCircle className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              void navigator.clipboard?.writeText(a.trackingCode).catch(() => {});
                              setCopiedCode(a.trackingCode);
                              setTimeout(
                                () => setCopiedCode((c) => (c === a.trackingCode ? null : c)),
                                1600
                              );
                            }}
                            aria-label={`Copy tracking code ${a.trackingCode}`}
                            className="size-9 border-navy-200 text-navy-700 hover:bg-navy-900 hover:text-white"
                          >
                            {copiedCode === a.trackingCode ? (
                              <Check className="size-4 text-welfare-600" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </Button>
                          {savingCode === a.trackingCode ? (
                            <Loader2 className="mr-1 size-4.5 animate-spin text-navy-600" />
                          ) : null}
                          <Select
                            value={a.status}
                            onValueChange={(v) => void updateStatus(a.trackingCode, v)}
                          >
                            <SelectTrigger
                              className="h-9 w-[132px] rounded-lg text-xs font-bold"
                              aria-label={`Update status for ${a.trackingCode}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs font-bold">
                                  {STATUS_STYLES[s].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Status changes reflect instantly on the applicant&apos;s tracking timeline.
            </p>
            </>
            ) : tab === "announcements" ? (
              /* ============ ANNOUNCEMENTS TAB ============ */
              <div>
                {/* Compose / Edit */}
                <div
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    annEditingId ? "border-gold-400/60 bg-gold-400/5" : "border-border bg-navy-50/50"
                  )}
                >
                  {annEditingId ? (
                    <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-gold-400/15 px-3 py-2">
                      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600">
                        <Pencil className="size-3.5" /> Editing announcement
                      </p>
                      <button
                        onClick={resetAnnForm}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-extrabold text-gold-600 transition hover:bg-gold-400/20"
                        aria-label="Cancel editing"
                      >
                        <X className="size-3.5" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                      <Newspaper className="size-4 text-brand-red" /> Publish to the website notice board
                    </p>
                  )}
                  <div className="mt-3 grid gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="ann-title" className="text-xs font-bold">Title *</Label>
                      <Input
                        id="ann-title"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="e.g. Fall 2026 admissions close on 30 September"
                        maxLength={140}
                        className="rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ann-body" className="text-xs font-bold">Details *</Label>
                      <Textarea
                        id="ann-body"
                        value={annBody}
                        onChange={(e) => setAnnBody(e.target.value)}
                        placeholder="Short announcement shown on the website notice board…"
                        rows={3}
                        maxLength={2000}
                        className="rounded-xl text-sm"
                      />
                    </div>
                    <ImagePicker
                      label="Image (optional)"
                      hint="Shown as a photo banner on the notice-board card — event posters, result sheets, campus snapshots."
                      url={annImage}
                      onChange={setAnnImage}
                      adminKey={adminKey}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Tag</Label>
                        <Select value={annTag} onValueChange={setAnnTag}>
                          <SelectTrigger className="h-9 w-[130px] rounded-lg text-xs font-bold" aria-label="Announcement tag">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Notice", "Event", "Deadline", "Result"].map((t) => (
                              <SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <label
                        htmlFor="ann-pinned"
                        className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg border border-gold-400/40 bg-gold-400/10 px-3 py-2"
                      >
                        <Checkbox
                          id="ann-pinned"
                          checked={annPinned}
                          onCheckedChange={(v) => setAnnPinned(v === true)}
                          className="size-4"
                        />
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-gold-600">
                          <Pin className="size-3.5" /> Pin to top
                        </span>
                      </label>
                      <Button
                        onClick={() => void saveAnnouncement()}
                        disabled={annSaving || annTitle.trim().length < 4 || annBody.trim().length < 10}
                        className={cn(
                          "mt-4 ml-auto min-h-[40px] rounded-xl px-5 text-sm font-extrabold text-white shadow-lg hover:shadow-xl disabled:opacity-60",
                          annEditingId
                            ? "bg-gradient-to-r from-gold-500 to-gold-600 !text-navy-950"
                            : "bg-gradient-to-r from-navy-900 to-navy-800"
                        )}
                      >
                        {annSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Saving…
                          </>
                        ) : annEditingId ? (
                          <>
                            <Pencil className="size-4" /> Save changes
                          </>
                        ) : (
                          <>
                            <Plus className="size-4" /> Publish
                          </>
                        )}
                      </Button>
                    </div>
                    {annError && (
                      <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-xs font-bold text-brand-red">{annError}</p>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="mt-4 max-h-[42vh] overflow-y-auto rounded-xl border border-border">
                  {annLoading ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-sm font-bold text-muted-foreground">
                      <Loader2 className="size-4.5 animate-spin" /> Loading…
                    </div>
                  ) : announcements.length === 0 ? (
                    <div className="grid place-items-center gap-2 py-14 text-center">
                      <Megaphone className="size-9 text-navy-200" />
                      <p className="text-sm font-bold text-navy-900">No announcements yet</p>
                      <p className="text-xs text-muted-foreground">
                        Published announcements appear on the website notice board instantly.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      <AnimatePresence initial={false}>
                        {announcements.map((a) => (
                          <motion.li
                            key={a.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start justify-between gap-3 p-4 transition-colors hover:bg-navy-50/60"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                {a.imageUrl && (
                                  <img
                                    src={a.imageUrl}
                                    alt=""
                                    aria-hidden
                                    className="size-10 shrink-0 rounded-lg border border-border object-cover"
                                  />
                                )}
                                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-800 ring-1 ring-navy-100">
                                  {a.tag}
                                </span>
                                {a.pinned && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-600 ring-1 ring-gold-400/40">
                                    <Pin className="size-3" /> Pinned
                                  </span>
                                )}
                                <span className="text-[11px] font-semibold text-muted-foreground">
                                  {new Date(a.createdAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 text-sm font-extrabold text-navy-900">{a.title}</p>
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => startEditAnnouncement(a)}
                                aria-label={`Edit announcement: ${a.title}`}
                                className="size-9 border-navy-200 text-navy-700 hover:bg-navy-900 hover:text-white"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => void deleteAnnouncement(a.id)}
                                aria-label={`Delete announcement: ${a.title}`}
                                className="size-9 border-brand-red/25 text-brand-red hover:bg-brand-red hover:text-white"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Announcements show under “Latest updates &amp; events” on the website — pinned items appear first.
                </p>
              </div>
            ) : tab === "testimonials" ? (
              /* ============ TESTIMONIALS (STUDENT VOICES) TAB ============ */
              <div>
                {/* Compose / Edit */}
                <div
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    tstEditingId ? "border-gold-400/60 bg-gold-400/5" : "border-border bg-navy-50/50"
                  )}
                >
                  {tstEditingId ? (
                    <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-gold-400/15 px-3 py-2">
                      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600">
                        <Pencil className="size-3.5" /> Editing testimonial
                      </p>
                      <button
                        onClick={resetTstForm}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-extrabold text-gold-600 transition hover:bg-gold-400/20"
                        aria-label="Cancel editing testimonial"
                      >
                        <X className="size-3.5" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                      <Quote className="size-4 text-brand-red" /> Publish a student testimonial
                    </p>
                  )}
                  {!tstEditingId && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Real student quotes appear in “Student Voices” with a verified badge.
                    </p>
                  )}
                  <div className="mt-3 grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="tst-name" className="text-xs font-bold">Student name *</Label>
                        <Input
                          id="tst-name"
                          value={tstName}
                          onChange={(e) => setTstName(e.target.value)}
                          placeholder="e.g. Ayesha Khan"
                          maxLength={80}
                          className="rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="tst-program" className="text-xs font-bold">Program / Batch *</Label>
                        <Input
                          id="tst-program"
                          value={tstProgram}
                          onChange={(e) => setTstProgram(e.target.value)}
                          placeholder="e.g. Pharm-D, Year 2"
                          maxLength={80}
                          className="rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tst-quote" className="text-xs font-bold">
                        Quote * <span className="font-medium text-muted-foreground">(min 20 characters)</span>
                      </Label>
                      <Textarea
                        id="tst-quote"
                        value={tstQuote}
                        onChange={(e) => setTstQuote(e.target.value)}
                        placeholder="What the student said about studying at Bright International College…"
                        rows={3}
                        maxLength={800}
                        className="rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Rating</Label>
                        <Select value={String(tstRating)} onValueChange={(v) => setTstRating(Number(v))}>
                          <SelectTrigger className="h-9 w-[120px] rounded-lg text-xs font-bold" aria-label="Star rating">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1].map((r) => (
                              <SelectItem key={r} value={String(r)} className="text-xs font-bold">
                                {r} star{r > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <label
                        htmlFor="tst-pinned"
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gold-400/40 bg-gold-400/10 px-3 py-2"
                      >
                        <Checkbox
                          id="tst-pinned"
                          checked={tstPinned}
                          onCheckedChange={(v) => setTstPinned(v === true)}
                          className="size-4"
                        />
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-gold-600">
                          <Pin className="size-3.5" /> Pin first
                        </span>
                      </label>
                      <Button
                        onClick={() => void saveTestimonial()}
                        disabled={
                          tstSaving ||
                          tstName.trim().length < 2 ||
                          tstProgram.trim().length < 2 ||
                          tstQuote.trim().length < 20
                        }
                        className={cn(
                          "ml-auto min-h-[40px] rounded-xl px-5 text-sm font-extrabold text-white shadow-lg hover:shadow-xl disabled:opacity-60",
                          tstEditingId
                            ? "bg-gradient-to-r from-gold-500 to-gold-600 !text-navy-950"
                            : "bg-gradient-to-r from-navy-900 to-navy-800"
                        )}
                      >
                        {tstSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Saving…
                          </>
                        ) : tstEditingId ? (
                          <>
                            <Pencil className="size-4" /> Save changes
                          </>
                        ) : (
                          <>
                            <Plus className="size-4" /> Publish
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tst-photo" className="text-xs font-bold">
                        Student photo{" "}
                        <span className="font-medium text-muted-foreground">
                          (optional — an initials avatar is used if empty)
                        </span>
                      </Label>
                      <ImagePicker
                        label="Upload photo"
                        hint="A square-ish portrait works best — it is shown as a ringed avatar on the website."
                        url={tstPhoto}
                        onChange={setTstPhoto}
                        adminKey={adminKey}
                        aspect="aspect-square max-w-[140px]"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">or paste a link</span>
                        <span className="h-px flex-1 bg-border" />
                      </div>
                      <Input
                        id="tst-photo"
                        value={tstPhoto}
                        onChange={(e) => setTstPhoto(e.target.value)}
                        type="url"
                        placeholder="https://…/student-photo.jpg"
                        maxLength={500}
                        className="rounded-xl text-sm"
                      />
                    </div>
                    {tstError && (
                      <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-xs font-bold text-brand-red">{tstError}</p>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="mt-4 max-h-[42vh] overflow-y-auto rounded-xl border border-border">
                  {tstLoading ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-sm font-bold text-muted-foreground">
                      <Loader2 className="size-4.5 animate-spin" /> Loading…
                    </div>
                  ) : testimonials.length === 0 ? (
                    <div className="grid place-items-center gap-2 py-14 text-center">
                      <Quote className="size-9 text-navy-200" />
                      <p className="text-sm font-bold text-navy-900">No published testimonials yet</p>
                      <p className="text-xs text-muted-foreground">
                        Until you publish one, the website shows the college&apos;s curated starter quotes.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      <AnimatePresence initial={false}>
                        {testimonials.map((t) => (
                          <motion.li
                            key={t.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-3 p-4 transition-colors hover:bg-navy-50/60"
                          >
                            <span
                              aria-hidden
                              className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-950 text-xs font-black text-white"
                            >
                              {t.name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-extrabold text-navy-900">{t.name}</p>
                                {t.pinned && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-600 ring-1 ring-gold-400/40">
                                    <Pin className="size-3" /> Pinned
                                  </span>
                                )}
                                <span className="flex items-center gap-0.5" aria-label={`${t.rating} stars`}>
                                  {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="size-3 fill-gold-500 text-gold-500" />
                                  ))}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-brand-red">{t.program}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">“{t.quote}”</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => startEditTestimonial(t)}
                                aria-label={`Edit testimonial from ${t.name}`}
                                className="size-9 border-navy-200 text-navy-700 hover:bg-navy-900 hover:text-white"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => void deleteTestimonial(t.id)}
                                aria-label={`Delete testimonial from ${t.name}`}
                                className="size-9 border-brand-red/25 text-brand-red hover:bg-brand-red hover:text-white"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Published testimonials replace the curated quotes in the “Student Voices” section instantly.
                </p>
              </div>
            ) : (
              /* ============ SETTINGS TAB ============ */
              <div>
                <div className="rounded-xl border border-border bg-navy-50/50 p-4">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                    <CalendarClock className="size-4 text-brand-red" /> Admission deadline &amp; countdown
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Set the Fall 2026 application deadline — a live countdown appears in the
                    “Your seat is waiting” banner on the homepage. Clear the date to hide it.
                  </p>
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="set-deadline" className="text-xs font-bold">Deadline date</Label>
                      <Input
                        id="set-deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => {
                          setDeadline(e.target.value);
                          setDeadlineMsg(null);
                        }}
                        className="h-10 w-[180px] rounded-xl text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => void saveDeadline(deadline)}
                      disabled={deadlineSaving || !deadline}
                      className="h-10 rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 px-5 text-sm font-extrabold text-white shadow-lg hover:shadow-xl disabled:opacity-60"
                    >
                      {deadlineSaving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Saving…
                        </>
                      ) : (
                        <>
                          <Check className="size-4" /> Save
                        </>
                      )}
                    </Button>
                    {deadline && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeadline("");
                          void saveDeadline("");
                        }}
                        disabled={deadlineSaving}
                        className="h-10 rounded-xl border-brand-red/25 px-4 text-sm font-bold text-brand-red hover:bg-brand-red hover:text-white"
                      >
                        <X className="size-4" /> Clear
                      </Button>
                    )}
                  </div>
                  {deadlineMsg && (
                    <p
                      className={cn(
                        "mt-3 rounded-lg px-3 py-2 text-xs font-bold",
                        deadlineMsg.startsWith("✓")
                          ? "bg-welfare-500/10 text-welfare-700"
                          : "bg-brand-red/10 text-brand-red"
                      )}
                    >
                      {deadlineMsg}
                    </p>
                  )}
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {deadline
                      ? `Countdown is live — applications close ${new Date(`${deadline}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
                      : "No deadline set — the countdown is currently hidden on the website."}
                  </p>
                </div>

                {/* POPUP BEHAVIOUR */}
                <div className="mt-4 rounded-xl border border-border bg-navy-50/50 p-4">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                    <Sparkles className="size-4 text-gold-600" /> Admission popup (Fall 26)
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The animated “Admissions Open” popup that appears when someone opens the
                    website. Turn it off for the season, or override its headline and message —
                    changes apply to new visitors instantly, no redeploy needed.
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="grid items-end gap-3 sm:grid-cols-[160px_1fr]">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Popup status</Label>
                        <Select value={popupEnabled} onValueChange={(v) => setPopupEnabled(v === "off" ? "off" : "on")}>
                          <SelectTrigger className="h-10 rounded-xl text-sm font-bold" aria-label="Popup status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on" className="text-sm font-bold">On — show to visitors</SelectItem>
                            <SelectItem value="off" className="text-sm font-bold">Off — hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold",
                          popupEnabled === "on"
                            ? "bg-welfare-500/10 text-welfare-700"
                            : "bg-brand-red/10 text-brand-red"
                        )}
                      >
                        <span className={`relative flex size-2 ${popupEnabled === "on" ? "" : "opacity-60"}`}>
                          {popupEnabled === "on" && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-welfare-500 opacity-75" />
                          )}
                          <span className={`relative inline-flex size-2 rounded-full ${popupEnabled === "on" ? "bg-welfare-500" : "bg-brand-red"}`} />
                        </span>
                        {popupEnabled === "on"
                          ? "Live — the popup appears ~1.6s after a visitor opens the site (once per session)."
                          : "Paused — new visitors will not see the popup until you switch it back on."}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="set-popup-title" className="text-xs font-bold">
                        Custom headline{" "}
                        <span className="font-medium text-muted-foreground">(optional — gold line under “Admissions”)</span>
                      </Label>
                      <Input
                        id="set-popup-title"
                        value={popupTitle}
                        onChange={(e) => {
                          setPopupTitle(e.target.value);
                          setPopupMsg(null);
                        }}
                        maxLength={80}
                        placeholder="e.g. OPEN — Fall 26 · Scholarships available"
                        className="rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="set-popup-message" className="text-xs font-bold">
                        Custom message{" "}
                        <span className="font-medium text-muted-foreground">(optional — body text of the popup)</span>
                      </Label>
                      <Textarea
                        id="set-popup-message"
                        value={popupMessage}
                        onChange={(e) => {
                          setPopupMessage(e.target.value);
                          setPopupMsg(null);
                        }}
                        rows={3}
                        maxLength={400}
                        placeholder="e.g. Last week to apply! Walk-in interviews every Saturday at the Township campus…"
                        className="rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button
                        onClick={() => void savePopup()}
                        disabled={popupSaving}
                        className="min-h-[40px] rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 px-5 text-sm font-extrabold text-white shadow-lg hover:shadow-xl disabled:opacity-60"
                      >
                        {popupSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Saving…
                          </>
                        ) : (
                          <>
                            <Check className="size-4" /> Save popup settings
                          </>
                        )}
                      </Button>
                      {(popupTitle || popupMessage) && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPopupTitle("");
                            setPopupMessage("");
                            setPopupMsg(null);
                          }}
                          disabled={popupSaving}
                          className="min-h-[40px] rounded-xl border-brand-red/25 px-4 text-sm font-bold text-brand-red hover:bg-brand-red hover:text-white"
                        >
                          <X className="size-4" /> Reset custom text
                        </Button>
                      )}
                    </div>
                    {popupMsg && (
                      <p
                        className={cn(
                          "rounded-lg px-3 py-2 text-xs font-bold",
                          popupMsg.startsWith("✓")
                            ? "bg-welfare-500/10 text-welfare-700"
                            : "bg-brand-red/10 text-brand-red"
                        )}
                      >
                        {popupMsg}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  More site settings will appear here as the console grows.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
