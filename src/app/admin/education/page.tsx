import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { EducationEditor } from "@/components/admin/editors/education-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Education } from "@/types/content";

export const metadata: Metadata = { title: "Education", robots: { index: false, follow: false } };

export default async function EducationPage() {
  let education: Education;
  try {
    education = await readContentFile<Education>("education");
  } catch (error) {
    return <ContentError title="Unable to load education content" message={String(error)} />;
  }
  return <EducationEditor initialHeading={education.heading} initialEntries={education.entries} />;
}