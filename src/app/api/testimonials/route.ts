import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Testimonials API — public GET, staff-only POST/PATCH/DELETE.
 * Staff auth reuses the shared passcode (ADMIN_PASSCODE env fallback) in `adminKey`.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

/** Uploaded files live under /uploads/… — allow those alongside absolute http(s) URLs */
const photoUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/uploads/"), "Must be an http(s) URL or an /uploads/ path");

const createSchema = z.object({
  adminKey: z.string().min(1).max(100),
  name: z.string().trim().min(2).max(80),
  program: z.string().trim().min(2).max(80),
  quote: z.string().trim().min(20).max(800),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photoUrl: photoUrlSchema.optional().or(z.literal("")),
  pinned: z.boolean().optional().default(false),
});

const updateSchema = z.object({
  adminKey: z.string().min(1).max(100),
  id: z.string().trim().min(5).max(50),
  name: z.string().trim().min(2).max(80).optional(),
  program: z.string().trim().min(2).max(80).optional(),
  quote: z.string().trim().min(20).max(800).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  photoUrl: photoUrlSchema.optional(),
  pinned: z.boolean().optional(),
});

const deleteSchema = z.object({
  adminKey: z.string().min(1).max(100),
  id: z.string().trim().min(5).max(50),
});

function isAuthed(key: string | null): boolean {
  return key === ADMIN_PASSCODE;
}

/** GET — public list (pinned first, then newest). */
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 9,
    });
    return NextResponse.json({ ok: true, testimonials });
  } catch (err) {
    console.error("[testimonials:GET]", err);
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 });
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

    const testimonial = await db.testimonial.create({
      data: {
        name: parsed.data.name,
        program: parsed.data.program,
        quote: parsed.data.quote,
        rating: parsed.data.rating,
        photoUrl: parsed.data.photoUrl ? parsed.data.photoUrl : null,
        pinned: parsed.data.pinned,
      },
    });
    return NextResponse.json({ ok: true, testimonial }, { status: 201 });
  } catch (err) {
    console.error("[testimonials:POST]", err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

/** PATCH — update (staff only). At least one editable field required. */
export async function PATCH(req: NextRequest) {
  try {
    const parsed = updateSchema.safeParse(await req.json());
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

    const { adminKey: _key, id, ...fields } = parsed.data;
    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update — provide at least one field" },
        { status: 400 }
      );
    }

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...fields,
        ...(fields.photoUrl !== undefined ? { photoUrl: fields.photoUrl || null } : {}),
      },
    });
    return NextResponse.json({ ok: true, testimonial });
  } catch (err) {
    console.error("[testimonials:PATCH]", err);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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

    const existing = await db.testimonial.findUnique({ where: { id: parsed.data.id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    await db.testimonial.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[testimonials:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
