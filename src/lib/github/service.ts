import "server-only";
import { CONTENT_FILENAMES, type ContentFileKey } from "@/lib/content/content-dir";

export interface GitHubCommitResult {
  ok: boolean;
  commitSha?: string;
  commitMessage?: string;
  error?: string;
}

type GitHubContentResource = {
  type: "file";
  sha: string;
  content: string;
  encoding: string;
  name: string;
  path: string;
  size: number;
  url: string;
  download_url: string;
  html_url: string;
  git_url: string;
};

function getRequiredEnv() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER and GITHUB_REPOSITORY must be set to use GitHub storage");
  }
  if (!token) {
    throw new Error("GITHUB_TOKEN must be set to use GitHub storage");
  }
  return { owner, repo, branch, token };
}

const API = "https://api.github.com";

export async function getGithubFile(key: ContentFileKey) {
  const { owner, repo, branch, token } = getRequiredEnv();
  const filePath = "content/" + CONTENT_FILENAMES[key];

  const res = await fetch(
    API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath) + "?ref=" + encodeURIComponent(branch),
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    return { exists: false, sha: "", content: "" };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error("GitHub GET failed for " + filePath + ": " + res.status + " " + body);
  }

  const data = (await res.json()) as GitHubContentResource;
  if (!data.content || data.encoding !== "base64") {
    return { exists: true, sha: data.sha, content: "" };
  }

  return {
    exists: true,
    sha: data.sha,
    content: Buffer.from(data.content, "base64").toString("utf8"),
  };
}

interface PutResult {
  commitSha: string;
}

async function putFile(
  key: ContentFileKey,
  serialized: string,
  message: string,
): Promise<PutResult> {
  const { owner, repo, branch, token } = getRequiredEnv();
  const filePath = "content/" + CONTENT_FILENAMES[key];

  const existing = await getGithubFile(key).catch(() => ({ exists: false, sha: "", content: "" }));
  const body: Record<string, string> = {
    message,
    content: Buffer.from(serialized, "utf8").toString("base64"),
    branch,
  };
  if (existing && existing.exists && existing.sha) {
    body.sha = existing.sha;
  }

  const res = await fetch(API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath), {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const respBody = await res.text().catch(() => "");
    throw new Error("GitHub PUT failed for " + filePath + ": " + res.status + " " + respBody);
  }

  const data = (await res.json()) as { content?: { sha?: string } };
  return { commitSha: data.content?.sha ?? "" };
}

export async function updateContentFile(
  key: ContentFileKey,
  serialized: string,
): Promise<GitHubCommitResult> {
  const message = commitMessageFor(key);
  try {
    const { commitSha } = await putFile(key, serialized, message);
    return { ok: true, commitSha, commitMessage: message };
  } catch (error) {
    return {
      ok: false,
      commitMessage: message,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createContentFile(
  key: ContentFileKey,
  serialized: string,
): Promise<GitHubCommitResult> {
  return updateContentFile(key, serialized);
}

export async function deleteContentFile(key: ContentFileKey): Promise<GitHubCommitResult> {
  const { owner, repo, branch, token } = getRequiredEnv();
  const filePath = "content/" + CONTENT_FILENAMES[key];
  const message = "Delete portfolio content: " + humanLabelFor(key);

  try {
    const existing = await getGithubFile(key);
    if (!existing.exists) {
      return { ok: false, error: "File does not exist on GitHub" };
    }
    const res = await fetch(
      API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath),
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ message, sha: existing.sha, branch }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const respBody = await res.text().catch(() => "");
      return { ok: false, error: "GitHub DELETE failed: " + res.status + " " + respBody };
    }
    return { ok: true, commitMessage: message };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function putAsset(
  relativePath: string,
  base64Content: string,
  message: string,
  options?: { contentSegment?: string },
): Promise<GitHubCommitResult> {
  const { owner, repo, branch, token } = getRequiredEnv();
  const segment = options?.contentSegment ?? "content";
  const filePath = segment.replace(/^\/+/, "") + "/" + relativePath.replace(/^\/+/, "");

  const existingRes = await fetch(
    API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath) + "?ref=" + encodeURIComponent(branch),
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  const body: Record<string, string> = {
    message,
    content: base64Content,
    branch,
  };
  if (existingRes.ok) {
    const existing = (await existingRes.json()) as { sha?: string };
    if (existing.sha) body.sha = existing.sha;
  }

  const res = await fetch(
    API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath),
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const respBody = await res.text().catch(() => "");
    return { ok: false, error: "GitHub asset PUT failed (" + res.status + "): " + respBody };
  }
  return { ok: true, commitMessage: message };
}

export async function deleteAsset(
  relativePath: string,
  message: string,
  options?: { contentSegment?: string },
): Promise<GitHubCommitResult> {
  const { owner, repo, branch, token } = getRequiredEnv();
  const segment = options?.contentSegment ?? "content";
  const filePath = segment.replace(/^\/+/, "") + "/" + relativePath.replace(/^\/+/, "");

  const existingRes = await fetch(
    API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath) + "?ref=" + encodeURIComponent(branch),
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!existingRes.ok) {
    return { ok: false, error: "Asset does not exist on GitHub" };
  }
  const existing = (await existingRes.json()) as { sha?: string };

  const res = await fetch(
    API + "/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(filePath),
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ message, sha: existing.sha, branch }),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const respBody = await res.text().catch(() => "");
    return { ok: false, error: "GitHub asset DELETE failed (" + res.status + "): " + respBody };
  }
  return { ok: true, commitMessage: message };
}

export function githubConfigured(): boolean {
  return Boolean(
    process.env.GITHUB_OWNER && process.env.GITHUB_REPOSITORY && process.env.GITHUB_TOKEN,
  );
}

function commitMessageFor(key: ContentFileKey): string {
  const label = humanLabelFor(key);
  return "Update portfolio " + label;
}

function humanLabelFor(key: ContentFileKey): string {
  const map: Record<ContentFileKey, string> = {
    profile: "profile",
    hero: "hero",
    about: "about",
    statistics: "statistics",
    skills: "skills",
    experience: "experience",
    projects: "projects",
    education: "education",
    mentorship: "mentorship",
    "ai-tools": "AI tools",
    "social-links": "social links",
    settings: "settings",
  };
  return map[key] ?? key;
}