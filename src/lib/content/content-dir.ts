import "server-only";
import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export const CONTENT_FILENAMES = {
  profile: "profile.json",
  hero: "hero.json",
  about: "about.json",
  statistics: "statistics.json",
  skills: "skills.json",
  experience: "experience.json",
  projects: "projects.json",
  education: "education.json",
  mentorship: "mentorship.json",
  "ai-tools": "ai-tools.json",
  "social-links": "social-links.json",
  settings: "settings.json",
} as const;

export type ContentFileKey = keyof typeof CONTENT_FILENAMES;

export const CONTENT_FILE_KEYS = Object.keys(CONTENT_FILENAMES) as ContentFileKey[];

export function resolveContentPath(key: ContentFileKey): string {
  return path.join(CONTENT_DIR, CONTENT_FILENAMES[key]);
}