"use client";

import { useCallback, useState } from "react";
import type { ContentFileKey } from "@/lib/content/content-dir";
import { useToast } from "./toast";

interface SaveResult {
  ok: boolean;
  key?: string;
  github?: {
    ok: boolean;
    commitSha?: string;
    commitMessage?: string;
    error?: string;
  } | null;
  local?: { ok: boolean };
  error?: string;
  message?: string;
}

export function useSaveContent(key: ContentFileKey) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (content: unknown): Promise<boolean> => {
      setSaving(true);
      try {
        const res = await fetch("/api/admin/content/" + key, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = (await res.json().catch(() => ({ ok: false, error: "Invalid server response" }))) as SaveResult;

        if (data.ok) {
          const github = data.github;
          let sub = "Saved locally in content/";
          if (github && github.ok) {
            sub =
              "✓ GitHub commit created" +
              (github.commitSha ? " (" + github.commitSha.slice(0, 7) + ")" : "") +
              (github.commitMessage ? " • " + github.commitMessage : "");
          } else if (github && !github.ok) {
            sub = "✕ GitHub commit failed — " + (github.error ?? "unknown error");
          }
          toast("success", "✓ Content updated", sub);
        } else {
          toast("error", "✕ Changes could not be published", data.error ?? "Unknown error");
        }
        return Boolean(data.ok);
      } catch {
        toast("error", "✕ Changes could not be published", "Network error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [key, toast],
  );

  return { saving, save };
}