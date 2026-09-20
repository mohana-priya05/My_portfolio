import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { readContentFile } from "@/lib/content/read";
import { saveContentFile } from "@/lib/content/write";
import { CONTENT_FILE_KEYS } from "@/lib/content/content-dir";
import type { ContentFileKey } from "@/lib/content/content-dir";

export const runtime = "nodejs";

function validKey(v: string): v is ContentFileKey {
  return (CONTENT_FILE_KEYS as readonly string[]).includes(v);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!validKey(key)) {
    return NextResponse.json({ ok: false, error: "Unknown content file" }, { status: 400 });
  }

  try {
    const content = await readContentFile(key);
    return NextResponse.json({ ok: true, key, content });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to read content" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!validKey(key)) {
    return NextResponse.json({ ok: false, error: "Unknown content file" }, { status: 400 });
  }

  let body: { content?: unknown; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await saveContentFile(key, body.content);
  if (!result.validated) {
    return NextResponse.json({ ok: false, error: result.error ?? "Validation failed" }, { status: 400 });
  }

  if (result.ok) {
    revalidatePath("/", "page");
    revalidatePath("/projects", "page");
    revalidatePath("/projects/[slug]", "page");
  }

  // GitHub is optional in local development; local write is the fallback.
  const status = result.ok ? 200 : 502;
  return NextResponse.json(
    {
      ok: result.ok,
      key,
      github: result.github,
      local: result.local,
      error: result.error,
      message: result.ok
        ? "✓ Content updated" +
          (result.github?.ok ? " • ✓ GitHub commit created" : " • GitHub not configured")
        : "✕ Changes could not be published",
    },
    { status },
  );
}