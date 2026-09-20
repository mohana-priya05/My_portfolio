"use client";

import { useCallback, useEffect, useState } from "react";
import { Upload, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { Button, Card } from "./ui";
import { useToast } from "./toast";
import { ConfirmDialog } from "./confirm-dialog";

interface Asset {
  name: string;
  url: string;
}

interface MediaList {
  images: Asset[];
  resume: Asset[];
}

export function MediaManager() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaList | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"images" | "resume" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<"images" | "resume">("images");
  const [deleteTarget, setDeleteTarget] = useState<{ folder: "images" | "resume"; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (): Promise<MediaList | null> => {
    try {
      const res = await fetch("/api/admin/images");
      const data = (await res.json()) as { ok: boolean; images: Asset[]; resume: Asset[] };
      if (data.ok) return { images: data.images, resume: data.resume };
      toast("error", "Could not load media list");
      return null;
    } catch {
      toast("error", "Could not load media list");
      return null;
    }
  }, [toast]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await load();
    if (list) setMedia(list);
    setLoading(false);
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    void load().then((list) => {
      if (cancelled) return;
      if (list) setMedia(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function upload() {
    if (!file || !uploading) return;
    setUploading(uploading);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, base64, folder }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; local?: { ok: boolean }; github?: { ok: boolean; error?: string } };
      if (data.ok) {
        toast("success", "✓ File uploaded", githubDetail(data.github));
        setFile(null);
        void refresh();
      } else {
        toast("error", "✕ Upload failed", data.error);
      }
    } catch {
      toast("error", "✕ Upload failed", "Could not read the selected file");
    } finally {
      setUploading(null);
    }
  }

  async function removeAsset(folderName: "images" | "resume", name: string) {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: name, folder: folderName }),
      });
      const data = (await res.json()) as { ok: boolean; github?: { ok: boolean; error?: string }; error?: string };
      if (data.ok) {
        toast("success", "File deleted", githubDetail(data.github));
        setDeleteTarget(null);
        void refresh();
      } else {
        toast("error", "Delete failed", data.error);
      }
    } catch {
      toast("error", "Delete failed", "Network error");
    } finally {
      setDeleting(false);
    }
  }

  function githubDetail(g?: { ok?: boolean; error?: string }) {
    if (!g) return "GitHub not configured — saved locally";
    if (g.ok) return "✓ GitHub commit created";
    return "✕ GitHub commit failed — " + (g.error ?? "unknown error");
  }

  function renderAssets(title: string, assets: Asset[], kind: "images" | "resume") {
    return (
      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
        {assets.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No files yet. Upload below.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {assets.map((asset) => (
              <li key={asset.url} className="flex items-center justify-between gap-3 rounded-md bg-muted/60 px-3 py-2">
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate font-mono text-xs text-foreground hover:text-primary">
                  {asset.name}
                </a>
                <button
                  type="button"
                  aria-label={"Delete " + asset.name}
                  onClick={() => setDeleteTarget({ folder: kind, name: asset.name })}
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div>
      <Card title="Media" description="Portfolio images (public/images/) and the resume (public/resume/). Uploads are committed to GitHub when configured.">
        <div className="flex items-center justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={() => void refresh()} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
            Refresh
          </Button>
        </div>

        {media ? (
          <div className="grid gap-6 md:grid-cols-2">
            {renderAssets("Images", media.images, "images")}
            {renderAssets("Resume", media.resume, "resume")}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading media…</p>
        )}

        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="radio"
                checked={folder === "images"}
                onChange={() => setFolder("images")}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Images (PNG/JPG/WebP/GIF/SVG)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="radio"
                checked={folder === "resume"}
                onChange={() => setFolder("resume")}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Resume (PDF)
            </label>
            <input
              type="file"
              accept={folder === "resume" ? ".pdf" : ".png,.jpg,.jpeg,.webp,.gif,.svg"}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="min-w-40 text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
            />
            <Button type="button" onClick={() => void upload()} disabled={!file || Boolean(uploading)}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Max 5 MB per file. Files are optimized before publishing — prefer WebP for images.
          </p>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={"Delete " + (deleteTarget?.name ?? "") + "?"}
        description="This will remove the file from the site and commit the deletion to GitHub if configured."
        onConfirm={() => {
          if (deleteTarget) void removeAsset(deleteTarget.folder, deleteTarget.name);
        }}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
      />
    </div>
  );
}