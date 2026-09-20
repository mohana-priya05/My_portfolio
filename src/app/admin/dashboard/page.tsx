import type { Metadata } from "next";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import Link from "next/link";
import { FileJson2, CheckCircle2, XCircle } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import {
  readContentFile,
  contentFileStat,
  listContentFiles,
} from "@/lib/content/read";
import { githubConfigured } from "@/lib/github/service";
import type {
  AiTools,
  Experience,
  Projects,
  Settings,
  Skills,
} from "@/types/content";

const execFileAsync = promisify(execFile);

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function lastGitCommit(folder: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["log", "-1", "--format=%h|%cI|%s", "--", folder],
      { cwd: process.cwd(), timeout: 5000 },
    );
    const trimmed = stdout.trim();
    if (!trimmed) return null;
    const [short, date, ...rest] = trimmed.split("|");
    return short + " • " + date + " • " + rest.join("|");
  } catch {
    return null;
  }
}

const EDITOR_PATHS: Record<string, string> = {
  profile: "/admin/profile",
  hero: "/admin/hero",
  about: "/admin/about",
  statistics: "/admin/about",
  skills: "/admin/skills",
  experience: "/admin/experience",
  projects: "/admin/projects",
  education: "/admin/education",
  mentorship: "/admin/mentorship",
  "ai-tools": "/admin/ai-tools",
  "social-links": "/admin/social-links",
  settings: "/admin/settings",
};

export default async function DashboardPage() {
  const [projects, experience, skills, aiTools, files, gitInfo] = await Promise.all([
    readContentFile<Projects>("projects").catch(() => null),
    readContentFile<Experience>("experience").catch(() => null),
    readContentFile<Skills>("skills").catch(() => null),
    readContentFile<AiTools>("ai-tools").catch(() => null),
    listContentFiles().catch(() => []),
    lastGitCommit("content"),
  ]);

  const totalProjects = projects?.projects.length ?? 0;
  const totalSkills =
    (skills?.categories.reduce((acc, c) => acc + c.skills.length, 0) ?? 0) +
    (aiTools?.tools.length ?? 0);
  const totalExperience = experience?.entries.length ?? 0;
  const totalFiles = files.length;
  const configured = githubConfigured();

  const cards = [
    { label: "Total Projects", value: String(totalProjects), href: "/admin/projects" },
    { label: "Total Skills", value: String(totalSkills), href: "/admin/skills" },
    { label: "Experience Entries", value: String(totalExperience), href: "/admin/experience" },
    { label: "Content Files", value: String(totalFiles), href: "/admin/settings" },
  ];

  const fileRows = await Promise.all(
    files.map(async (file) => {
      const stat = await contentFileStat(file.key as Parameters<typeof contentFileStat>[0]);
      return {
        ...file,
        size: stat.size,
        mtime: stat.mtimeMs > 0 ? new Date(stat.mtimeMs).toLocaleString() : "—",
        editPath: file.key ? EDITOR_PATHS[file.key] ?? null : null,
      };
    }),
  );

  let settings: Settings | null = null;
  try {
    settings = await readContentFile<Settings>("settings");
  } catch {
    settings = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {settings?.admin.dashboardHeading ?? "Content Dashboard"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {settings?.admin.dashboardDescription ??
            "Manage your portfolio content. Changes are committed to GitHub."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <p className="font-mono text-3xl font-bold text-primary">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
            GitHub Storage
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Configured</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                {configured ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    Yes
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                    No
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-mono text-xs text-foreground">
                {process.env.GITHUB_OWNER || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Repository</span>
              <span className="font-mono text-xs text-foreground">
                {process.env.GITHUB_REPOSITORY || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Branch</span>
              <span className="font-mono text-xs text-foreground">
                {process.env.GITHUB_BRANCH || "main"}
              </span>
            </div>
            {gitInfo ? (
              <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                Last commit: {gitInfo}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileJson2 className="h-4 w-4" aria-hidden="true" />
            Content Files
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Version-controlled JSON stored in the repository — no database.
          </p>
          <ul className="mt-3 space-y-1.5">
            {fileRows.map((file) => (
              <li key={file.name}>
                {file.editPath ? (
                  <Link
                    href={file.editPath}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-mono text-xs text-foreground">{file.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
                    <span className="font-mono text-xs text-foreground">{file.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}