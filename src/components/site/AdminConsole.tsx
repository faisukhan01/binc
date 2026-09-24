"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  city: string;
  isWelfare: boolean;
  status: string;
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
  const [query, setQuery] = useState("");
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);

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
        setAuthed(true);
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
    setError(null);
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
              <Button
                variant="outline"
                onClick={() => void login(adminKey)}
                className="h-11 rounded-xl border-navy-200 px-4 text-sm font-bold text-navy-800 hover:bg-navy-50"
              >
                <RefreshCw className="size-4" /> Refresh
              </Button>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
