import "server-only";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { contentSchemas } from "@/lib/validation/schemas";
import {
  CONTENT_DIR,
  CONTENT_FILENAMES,
  CONTENT_FILE_KEYS,
  resolveContentPath,
  type ContentFileKey,
} from "./content-dir";

export class ContentError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ContentError";
  }
}

function schemaFor(key: ContentFileKey): z.ZodType {
  return contentSchemas[key];
}

export async function readContentFile<T = unknown>(key: ContentFileKey): Promise<T> {
  const filePath = resolveContentPath(key);
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    throw new ContentError(`Failed to read content file "${key}": ${String(error)}`, {
      cause: error,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new ContentError(`Content file "${key}" contains invalid JSON`, { cause: error });
  }

  const result = schemaFor(key).safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .slice(0, 10)
      .join("; ");
    throw new ContentError(`Content file "${key}" failed validation: ${issues}`);
  }

  return result.data as T;
}

export async function readAllContent() {
  const entries = await Promise.all(
    CONTENT_FILE_KEYS.map(async (key) => [key, await readContentFile(key)] as const),
  );
  return Object.fromEntries(entries) as Record<ContentFileKey, unknown>;
}

export async function contentFileStat(
  key: ContentFileKey,
): Promise<{ exists: boolean; size: number; mtimeMs: number }> {
  try {
    const s = await stat(resolveContentPath(key));
    return { exists: true, size: s.size, mtimeMs: s.mtimeMs };
  } catch {
    return { exists: false, size: 0, mtimeMs: 0 };
  }
}

export async function publicFileExists(relativePath: string): Promise<boolean> {
  try {
    const s = await stat(path.join(process.cwd(), "public", relativePath.replace(/^\/+/, "")));
    return s.isFile();
  } catch {
    return false;
  }
}

export async function listContentFiles() {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      name: f,
      fileName: f,
      key: (Object.keys(CONTENT_FILENAMES) as ContentFileKey[]).find(
        (k) => CONTENT_FILENAMES[k] === f,
      ),
      path: path.join("content", f),
    }));
}

export const lastContentUpdated = async (): Promise<string | null> => {
  try {
    const stats = await Promise.all(
      CONTENT_FILE_KEYS.map((k) => contentFileStat(k)),
    );
    const maxMtime = Math.max(...stats.map((s) => s.mtimeMs));
    return maxMtime > 0 ? new Date(maxMtime).toISOString() : null;
  } catch {
    return null;
  }
};