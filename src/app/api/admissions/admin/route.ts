import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Admin Console API — protected by a shared passcode (adminKey body field).
 * Default passcode: "binc-admin-2026" (override with ADMIN_PASSCODE env var).
 * Brute-force protection: max 6 failed attempts per IP per 10-minute window.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

const RATE_LIMIT_MAX = 6; // resets on module reload (dev recompiles); 10-min lock in prod
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** In-memory failed-attempt tracker: ip -> { count, windowStart, blockedUntil } */
const attempts = new Map<
  string,
  { count: number; windowStart: number; blockedUntil: number }
>();

function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const rec = attempts.get(ip);

  if (rec?.blockedUntil && rec.blockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((rec.blockedUntil - now) / 1000) };
  }
  if (!rec || now - rec.windowStart > RATE_LIMIT_WINDOW_MS) {
    attempts.set(ip, { count: 0, windowStart: now, blockedUntil: 0 });
  }
  return { ok: true };
}

function recordFailure(ip: string): { blocked: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const rec = attempts.get(ip) ?? { count: 0, windowStart: now, blockedUntil: 0 };
  if (now - rec.windowStart > RATE_LIMIT_WINDOW_MS) {
    rec.count = 0;
    rec.windowStart = now;
  }
  rec.count += 1;
  if (rec.count >= RATE_LIMIT_MAX) {
    rec.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
  }
  attempts.set(ip, rec);
  return rec.blockedUntil > now
    ? { blocked: true, retryAfterSec: Math.ceil((rec.blockedUntil - now) / 1000) }
    : { blocked: false };
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

const VALID_STATUSES = ["PENDING", "CONTACTED", "APPROVED", "REJECTED"] as const;

const authSchema = z.object({
  adminKey: z.string().min(1).max(100),
});

const patchSchema = z.object({
  adminKey: z.string().min(1).max(100),
  code: z.string().trim().min(10).max(20),
  status: z.enum(VALID_STATUSES),
});

function isAuthed(adminKey: string): boolean {
  return adminKey === ADMIN_PASSCODE;
}

/** POST — authenticate + list all applications with stats */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${Math.ceil((rl.retryAfterSec ?? 60) / 60)} minute(s).` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
      );
    }

    const parsed = authSchema.safeParse(await req.json());
    if (!parsed.success || !isAuthed(parsed.data.adminKey)) {
      const fail = recordFailure(ip);
      if (fail.blocked) {
        return NextResponse.json(
          { error: `Too many failed attempts. Locked for ${Math.ceil((fail.retryAfterSec ?? 600) / 60)} minute(s).` },
          { status: 429, headers: { "Retry-After": String(fail.retryAfterSec ?? 600) } }
        );
      }
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    // Successful auth clears the failure counter for this IP
    attempts.delete(ip);

    const [applications, total, pending, contacted, approved, rejected, welfare, byProgram] =
      await Promise.all([
        db.admission.findMany({
          orderBy: { createdAt: "desc" },
          take: 200,
          select: {
            id: true,
            trackingCode: true,
            fullName: true,
            fatherName: true,
            email: true,
            phone: true,
            program: true,
            qualification: true,
            lastMarks: true,
            city: true,
            isWelfare: true,
            status: true,
            message: true,
            createdAt: true,
          },
        }),
        db.admission.count(),
        db.admission.count({ where: { status: "PENDING" } }),
        db.admission.count({ where: { status: "CONTACTED" } }),
        db.admission.count({ where: { status: "APPROVED" } }),
        db.admission.count({ where: { status: "REJECTED" } }),
        db.admission.count({ where: { isWelfare: true } }),
        db.admission.groupBy({
          by: ["program"],
          _count: { program: true },
        }),
      ]);

    return NextResponse.json({
      ok: true,
      stats: { total, pending, contacted, approved, rejected, welfare },
      byProgram: byProgram
        .map((b) => ({ program: b.program, count: b._count.program }))
        .sort((a, b) => b.count - a.count),
      applications,
    });
  } catch (err) {
    console.error("[admissions:admin:POST]", err);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}

/** PATCH — update application status */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      const statusIssue = parsed.error.issues.find((i) => i.path.includes("status"));
      return NextResponse.json(
        { error: statusIssue ? "Invalid status value" : "Invalid request payload" },
        { status: 400 }
      );
    }
    if (!isAuthed(parsed.data.adminKey)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const existing = await db.admission.findUnique({
      where: { trackingCode: parsed.data.code },
      select: { id: true, status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updated = await db.admission.update({
      where: { trackingCode: parsed.data.code },
      data: {
        status: parsed.data.status,
        // Append to the applicant's status history when the status actually changes
        ...(existing.status !== parsed.data.status
          ? { events: { create: { status: parsed.data.status } } }
          : {}),
      },
      select: { trackingCode: true, status: true },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.error("[admissions:admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
