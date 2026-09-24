import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Track an admission application by its tracking code. */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Tracking code is required" }, { status: 400 });
    }

    const admission = await db.admission.findUnique({
      where: { trackingCode: code },
      select: {
        trackingCode: true,
        fullName: true,
        program: true,
        status: true,
        createdAt: true,
        events: {
          orderBy: { createdAt: "asc" },
          select: { status: true, createdAt: true },
        },
      },
    });

    if (!admission) {
      return NextResponse.json(
        { error: "No application found for this tracking code" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, application: admission });
  } catch (err) {
    console.error("[admissions/track:GET]", err);
    return NextResponse.json({ error: "Failed to track application" }, { status: 500 });
  }
}
