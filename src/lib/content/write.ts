import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { updateContentFile, type GitHubCommitResult, githubConfigured } from "@/lib/github/service";
import { contentSchemas } from "@/lib/validation/schemas";
import { CONTENT_DIR, resolveContentPath, type ContentFileKey } from "./content-dir";

export interface SaveContentResult {
  ok: boolean;
  validated: boolean;
  github: GitHubCommitResult | null;
  local: { ok: boolean };
  error?: string;
}

export async function saveContentFile(
  key: ContentFileKey,
  payload: unknown,
): Promise<SaveContentResult> {
  const schema = contentSchemas[key] as z.ZodType;
  const parsed = schema.safeParse(payload);
  let github: GitHubCommitResult | null = null;

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => i.path.join(".") + ": " + i.message)
      .slice(0, 5)
      .join("; ");
    return { ok: false, validated: false, github: null, local: { ok: false }, error: issues };
  }

  const serialized = JSON.stringify(parsed.data, null, 2) + "\n";

  let local = { ok: true };
  const writeLocal = process.env.CONTENT_WRITE_LOCAL !== "false";
  if (writeLocal) {
    try {
      await mkdir(CONTENT_DIR, { recursive: true });
      await writeFile(resolveContentPath(key), serialized, "utf8");
    } catch (error) {
      local = { ok: false };
      console.warn("Local content write skipped:", String(error));
    }
  }

  if (githubConfigured()) {
    github = await updateContentFile(key, serialized);
    return {
      ok: github.ok,
      validated: true,
      github,
      local,
      error: github.ok ? undefined : github.error,
    };
  }

  return { ok: local.ok, validated: true, github: null, local };
}

export async function saveContentFileRaw(
  key: ContentFileKey,
  payload: unknown,
): Promise<SaveContentResult> {
  return saveContentFile(key, payload);
}

export function contentWriteRoot(): string {
  return CONTENT_DIR;
}

export function resolveUploadDestinationPath(
  folder: "images" | "resume",
  fileName: string,
): string {
  const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "");
  return path.join(process.cwd(), "public", folder, safeName);
}