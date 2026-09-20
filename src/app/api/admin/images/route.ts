import { NextResponse } from "next/server";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth/session";
import { putAsset, deleteAsset, githubConfigured } from "@/lib/github/service";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function sanitizeFileName(name: string): string | null {
  const base = path.basename(name).trim().replace(/[^a-zA-Z0-9._-]/g, "");
  const ext = path.extname(base).toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) return null;
  if (base.length === 0 || base.length > 200) return null;
  return base;
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const list = async (folder: string) => {
    const dir = path.join(process.cwd(), "public", folder);
    try {
      const files = await readdir(dir);
      return files
        .filter((f) => !f.startsWith("."))
        .map((f) => ({ name: f, url: "/" + folder + "/" + encodeURIComponent(f) }));
    } catch {
      return [];
    }
  };

  const [images, resume] = await Promise.all([list("images"), list("resume")]);
  return NextResponse.json({ ok: true, images, resume });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { fileName?: string; base64?: string; folder?: "images" | "resume" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const folder = body.folder === "resume" ? "resume" : "images";
  if (!body.fileName || !body.base64 || typeof body.base64 !== "string") {
    return NextResponse.json({ ok: false, error: "fileName and base64 are required" }, { status: 400 });
  }
  const fileName = sanitizeFileName(body.fileName);
  if (!fileName) {
    return NextResponse.json({ ok: false, error: "Unsupported file type or invalid name" }, { status: 400 });
  }

  const matches = body.base64.match(/^data:([^;]+);base64,([\s\S]+)$/);
  const base64Data = matches ? matches[2] : body.base64;
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, "base64");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid base64 payload" }, { status: 400 });
  }

  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File must be between 1 byte and 5MB" }, { status: 400 });
  }

  let local: { ok: boolean; error?: string } = { ok: true };
  try {
    const dir = path.join(process.cwd(), "public", folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), buffer);
  } catch (error) {
    local = { ok: false, error: String(error) };
  }

  let github;
  if (githubConfigured()) {
    github = await putAsset(
      folder + "/" + fileName,
      buffer.toString("base64"),
      "Upload portfolio asset: " + fileName,
      { contentSegment: "public" },
    );
  }

  if (!local.ok || (githubConfigured() && github && !github.ok)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Upload could not be published",
        local,
        github,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    fileName,
    url: "/" + folder + "/" + encodeURIComponent(fileName),
    local,
    github,
  });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { fileName?: string; folder?: "images" | "resume" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const folder = body.folder === "resume" ? "resume" : "images";
  if (!body.fileName) {
    return NextResponse.json({ ok: false, error: "fileName is required" }, { status: 400 });
  }
  const fileName = sanitizeFileName(body.fileName);
  if (!fileName) {
    return NextResponse.json({ ok: false, error: "Invalid file name" }, { status: 400 });
  }

  let local: { ok: boolean; error?: string } = { ok: true };
  try {
    await unlink(path.join(process.cwd(), "public", folder, fileName));
  } catch (error) {
    local = { ok: false, error: String(error) };
  }

  let github;
  if (githubConfigured()) {
    github = await deleteAsset(folder + "/" + fileName, "Delete portfolio asset: " + fileName, {
      contentSegment: "public",
    });
  }

  if (!local.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not delete local file", local },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, fileName, local, github });
}