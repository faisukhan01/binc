import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Admin Console API — protected by a shared passcode (adminKey body field).
 * Default passcode: "binc-admin-2026" (override with ADMIN_PASSCODE env var).
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

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
    const parsed = authSchema.safeParse(await req.json());
    if (!parsed.success || !isAuthed(parsed.data.adminKey)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const [applications, total, pending, contacted, approved, rejected, welfare] =
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
            city: true,
            isWelfare: true,
            status: true,
            createdAt: true,
          },
        }),
        db.admission.count(),
        db.admission.count({ where: { status: "PENDING" } }),
        db.admission.count({ where: { status: "CONTACTED" } }),
        db.admission.count({ where: { status: "APPROVED" } }),
        db.admission.count({ where: { status: "REJECTED" } }),
        db.admission.count({ where: { isWelfare: true } }),
      ]);

    return NextResponse.json({
      ok: true,
      stats: { total, pending, contacted, approved, rejected, welfare },
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
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updated = await db.admission.update({
      where: { trackingCode: parsed.data.code },
      data: { status: parsed.data.status },
      select: { trackingCode: true, status: true },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.error("[admissions:admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
