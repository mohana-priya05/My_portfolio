import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { SkillsEditor } from "@/components/admin/editors/skills-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Skills } from "@/types/content";

export const metadata: Metadata = { title: "Skills", robots: { index: false, follow: false } };

export default async function SkillsPage() {
  let skills: Skills;
  try {
    skills = await readContentFile<Skills>("skills");
  } catch (error) {
    return <ContentError title="Unable to load skills content" message={String(error)} />;
  }
  return (
    <SkillsEditor initialHeading={skills.heading} initialCategories={skills.categories} />
  );
}