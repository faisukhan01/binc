"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  Download,
  GraduationCap,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Megaphone,
  Newspaper,
  Pin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
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
  const [tab, setTab] = useState<"applications" | "announcements">("applications");
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annTag, setAnnTag] = useState("Notice");
  const [annPinned, setAnnPinned] = useState(false);
  const [annSaving, setAnnSaving] = useState(false);
  const [annError, setAnnError] = useState<string | null>(null);

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
        setAuthed(true);
        void loadAnnouncements();
      } catch {
        setError("Network error — please try again");
      } finally {
        setLoading(false);
      }
    },
    []
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) =>
      [a.trackingCode, a.fullName, a.program, a.phone, a.city, a.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [apps, query]);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setAdminKey("");
    setApps([]);
    setStats(null);
    setByProgram([]);
    setAnnouncements([]);
    setTab("applications");
    setError(null);
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

  const createAnnouncement = useCallback(async () => {
    setAnnSaving(true);
    setAnnError(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey, title: annTitle, body: annBody, tag: annTag, pinned: annPinned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnnError(data.error || "Could not publish announcement");
        return;
      }
      setAnnouncements((list) => [data.announcement, ...list]);
      setAnnTitle("");
      setAnnBody("");
      setAnnTag("Notice");
      setAnnPinned(false);
    } catch {
      setAnnError("Network error — please try again");
    } finally {
      setAnnSaving(false);
    }
  }, [adminKey, annTitle, annBody, annTag, annPinned]);

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/announcements?adminKey=${encodeURIComponent(adminKey)}&id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) setAnnouncements((list) => list.filter((a) => a.id !== id));
      } catch {
        /* keep row on failure */
      }
    },
    [adminKey]
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
              className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-navy-50 p-1"
              role="tablist"
              aria-label="Console sections"
            >
              {([
                { id: "applications", label: "Applications", icon: Users },
                { id: "announcements", label: "Announcements", icon: Megaphone },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg text-sm font-extrabold transition-all ${
                    tab === t.id
                      ? "bg-white text-navy-900 shadow-sm"
                      : "text-muted-foreground hover:text-navy-800"
                  }`}
                >
                  <t.icon className="size-4" /> {t.label}
                </button>
              ))}
            </div>

            {tab === "applications" ? (
            <>
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
                        className="flex flex-col gap-3 p-4 transition-colors hover:bg-navy-50/60 sm:flex-row sm:items-center sm:justify-between"
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
            ) : (
              /* ============ ANNOUNCEMENTS TAB ============ */
              <div>
                {/* Compose */}
                <div className="rounded-xl border border-border bg-navy-50/50 p-4">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-800">
                    <Newspaper className="size-4 text-brand-red" /> Publish to the website notice board
                  </p>
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
                        onClick={() => void createAnnouncement()}
                        disabled={annSaving || annTitle.trim().length < 4 || annBody.trim().length < 10}
                        className="mt-4 ml-auto min-h-[40px] rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 px-5 text-sm font-extrabold text-white shadow-lg hover:shadow-xl disabled:opacity-60"
                      >
                        {annSaving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Publishing…
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
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => void deleteAnnouncement(a.id)}
                              aria-label={`Delete announcement: ${a.title}`}
                              className="size-9 shrink-0 border-brand-red/25 text-brand-red hover:bg-brand-red hover:text-white"
                            >
                              <Trash2 className="size-4" />
                            </Button>
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
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
