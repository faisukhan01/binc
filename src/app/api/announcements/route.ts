import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Announcements API — public GET, staff-only POST/PATCH/DELETE.
 * Staff auth reuses the same shared passcode as the admin console
 * (ADMIN_PASSCODE env fallback) sent in the `adminKey` body/query field.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

const createSchema = z.object({
  adminKey: z.string().min(1).max(100),
  title: z.string().trim().min(4).max(140),
  body: z.string().trim().min(10).max(2000),
  tag: z.enum(["Notice", "Event", "Deadline", "Result"]).default("Notice"),
  pinned: z.boolean().optional().default(false),
});

const deleteSchema = z.object({
  adminKey: z.string().min(1).max(100),
  id: z.string().trim().min(5).max(50),
});

const patchSchema = z.object({
  adminKey: z.string().min(1).max(100),
  id: z.string().trim().min(5).max(50),
  title: z.string().trim().min(4).max(140),
  body: z.string().trim().min(10).max(2000),
  tag: z.enum(["Notice", "Event", "Deadline", "Result"]),
  pinned: z.boolean(),
});

function isAuthed(key: string | null): boolean {
  return key === ADMIN_PASSCODE;
}

/** GET — public list (pinned first, then newest). */
export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 12,
    });
    return NextResponse.json({ ok: true, announcements });
  } catch (err) {
    console.error("[announcements:GET]", err);
    return NextResponse.json({ error: "Failed to load announcements" }, { status: 500 });
  }
}

/** POST — create (staff only) */
export async function POST(req: NextRequest) {
  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: `Invalid field "${first.path.join(".")}": ${first.message}` },
        { status: 400 }
      );
    }
    if (!isAuthed(parsed.data.adminKey)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const announcement = await db.announcement.create({
      data: {
        title: parsed.data.title,
        body: parsed.data.body,
        tag: parsed.data.tag,
        pinned: parsed.data.pinned,
      },
    });
    return NextResponse.json({ ok: true, announcement }, { status: 201 });
  } catch (err) {
    console.error("[announcements:POST]", err);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

/** PATCH — edit an existing announcement (staff only) */
export async function PATCH(req: NextRequest) {
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: `Invalid field "${first.path.join(".")}": ${first.message}` },
        { status: 400 }
      );
    }
    if (!isAuthed(parsed.data.adminKey)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const existing = await db.announcement.findUnique({ where: { id: parsed.data.id } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    const announcement = await db.announcement.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        body: parsed.data.body,
        tag: parsed.data.tag,
        pinned: parsed.data.pinned,
      },
    });
    return NextResponse.json({ ok: true, announcement });
  } catch (err) {
    console.error("[announcements:PATCH]", err);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

/** DELETE — remove (staff only) */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = deleteSchema.safeParse({
      adminKey: url.searchParams.get("adminKey"),
      id: url.searchParams.get("id"),
    });
    if (!parsed.success || !isAuthed(parsed.data.adminKey)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const existing = await db.announcement.findUnique({ where: { id: parsed.data.id } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    await db.announcement.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[announcements:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
