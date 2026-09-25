import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const admissionSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  fatherName: z.string().trim().min(3).max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().regex(/^[+0-9][0-9\s-]{9,15}$/),
  program: z.string().trim().min(1).max(80),
  qualification: z.string().trim().min(1).max(120),
  lastMarks: z.string().trim().max(40).optional(),
  city: z.string().trim().min(2).max(80),
  isWelfare: z.boolean().optional().default(false),
  message: z.string().trim().max(2000).optional(),
});

function generateTrackingCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `BINC-F26-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = admissionSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: `Invalid field "${firstError.path.join(".")}": ${firstError.message}`,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Retry on the (rare) tracking-code collision
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const admission = await db.admission.create({
          data: {
            trackingCode: generateTrackingCode(),
            fullName: data.fullName,
            fatherName: data.fatherName,
            email: data.email || null,
            phone: data.phone,
            program: data.program,
            qualification: data.qualification,
            lastMarks: data.lastMarks || null,
            city: data.city,
            isWelfare: data.isWelfare ?? false,
            message: data.message || null,
            events: {
              create: { status: "PENDING" }, // first entry of the applicant's status history
            },
          },
          include: { events: { orderBy: { createdAt: "asc" } } },
        });

        return NextResponse.json(
          {
            ok: true,
            trackingCode: admission.trackingCode,
            program: admission.program,
            submittedAt: admission.createdAt,
          },
          { status: 201 }
        );
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002" &&
          attempt < 4
        ) {
          continue; // collision — regenerate and retry
        }
        throw e;
      }
    }

    return NextResponse.json(
      { error: "Could not allocate a tracking code. Please try again." },
      { status: 500 }
    );
  } catch (err) {
    console.error("[admissions:POST]", err);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again or contact us on WhatsApp." },
      { status: 500 }
    );
  }
}

// Simple aggregate stats (safe, non-sensitive) — used for dashboard counters
export async function GET() {
  try {
    const [total, welfare] = await Promise.all([
      db.admission.count(),
      db.admission.count({ where: { isWelfare: true } }),
    ]);
    const byProgram = await db.admission.groupBy({
      by: ["program"],
      _count: { program: true },
    });

    return NextResponse.json({
      ok: true,
      total,
      welfare,
      byProgram: byProgram.map((b) => ({ program: b.program, count: b._count.program })),
    });
  } catch (err) {
    console.error("[admissions:GET]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
