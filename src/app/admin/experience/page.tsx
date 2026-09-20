import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { ExperienceEditor } from "@/components/admin/editors/experience-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Experience } from "@/types/content";

export const metadata: Metadata = { title: "Experience", robots: { index: false, follow: false } };

export default async function ExperiencePage() {
  let experience: Experience;
  try {
    experience = await readContentFile<Experience>("experience");
  } catch (error) {
    return <ContentError title="Unable to load experience content" message={String(error)} />;
  }
  return <ExperienceEditor initialHeading={experience.heading} initialEntries={experience.entries} />;
}