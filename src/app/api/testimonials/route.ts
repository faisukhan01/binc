import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Testimonials API — public GET, staff-only POST/DELETE.
 * Staff auth reuses the shared passcode (ADMIN_PASSCODE env fallback) in `adminKey`.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

const createSchema = z.object({
  adminKey: z.string().min(1).max(100),
  name: z.string().trim().min(2).max(80),
  program: z.string().trim().min(2).max(80),
  quote: z.string().trim().min(20).max(800),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photoUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\//.test(v), "Must be an http(s) URL")
    .optional()
    .or(z.literal("")),
  pinned: z.boolean().optional().default(false),
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
