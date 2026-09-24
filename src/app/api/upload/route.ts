import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

/**
 * Staff-only image upload API.
 * POST multipart/form-data: { adminKey, file } → { ok, url: "/uploads/<name>" }
 * Files land in <project>/public/uploads and are served statically at /uploads/…
 * Whitelist: JPEG / PNG / WEBP / GIF, max 3 MB.
 */
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "binc-admin-2026";

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Magic-byte sniffing — never trust the client-declared Content-Type alone. */
function sniffImage(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  )
    return "image/png";
  if (
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
  )
    return "image/gif";
  // WEBP: "RIFF" .... "WEBP"
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "image/webp";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const adminKey = String(form.get("adminKey") ?? "");
    if (adminKey !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large — maximum 3 MB" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const mime = sniffImage(buf);
    if (!mime || !(mime in MIME_EXT)) {
      return NextResponse.json(
        { error: "Unsupported file — use JPG, PNG, WEBP or GIF" },
        { status: 400 }
      );
    }

    const ext = MIME_EXT[mime];
    const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buf);

    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (err) {
    console.error("[upload:POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
