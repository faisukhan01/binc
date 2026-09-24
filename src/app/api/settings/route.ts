import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Site settings API.
 * GET  — public: returns only whitelisted, non-secret keys.
 * PUT  — staff-only (adminKey body field, same passcode as the admin console).
 *
 * Supported keys:
 *  - admissionDeadline: "" | "YYYY-MM-DD" — public countdown on the CTA banner.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

const PUBLIC_KEYS = ["admissionDeadline"] as const;
type PublicSettingKey = (typeof PUBLIC_KEYS)[number];

const putSchema = z.object({
  adminKey: z.string().min(1).max(100),
  admissionDeadline: z
    .string()
    .regex(/^$|^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD or an empty string to clear"),
});

/** GET — public settings (whitelisted keys only) */
export async function GET() {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: [...PUBLIC_KEYS] } },
    });
    const settings: Record<string, string> = {};
    for (const k of PUBLIC_KEYS) settings[k] = "";
    for (const row of rows) {
      if ((PUBLIC_KEYS as readonly string[]).includes(row.key)) {
        settings[row.key as PublicSettingKey] = row.value;
      }
    }
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("[settings:GET]", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

/** PUT — staff-only update of whitelisted keys */
export async function PUT(req: NextRequest) {
  try {
    const parsed = putSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 }
      );
    }
    if (parsed.data.adminKey !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const { admissionDeadline } = parsed.data;

    // Validate the date is a real calendar date (e.g. reject 2026-02-31 —
    // JS Date silently rolls overflow days over, so round-trip the parts)
    if (admissionDeadline) {
      const [y, m, d] = admissionDeadline.split("-").map(Number);
      const roundTrip = new Date(Date.UTC(y, m - 1, d));
      const valid =
        roundTrip.getUTCFullYear() === y &&
        roundTrip.getUTCMonth() === m - 1 &&
        roundTrip.getUTCDate() === d;
      if (!valid) {
        return NextResponse.json({ error: "Not a valid calendar date" }, { status: 400 });
      }
    }

    await db.setting.upsert({
      where: { key: "admissionDeadline" },
      update: { value: admissionDeadline },
      create: { key: "admissionDeadline", value: admissionDeadline },
    });

    return NextResponse.json({ ok: true, admissionDeadline });
  } catch (err) {
    console.error("[settings:PUT]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
