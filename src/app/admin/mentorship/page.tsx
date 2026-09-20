import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { MentorshipEditor } from "@/components/admin/editors/mentorship-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Mentorship } from "@/types/content";

export const metadata: Metadata = { title: "Mentorship", robots: { index: false, follow: false } };

export default async function MentorshipPage() {
  let mentorship: Mentorship;
  try {
    mentorship = await readContentFile<Mentorship>("mentorship");
  } catch (error) {
    return <ContentError title="Unable to load mentorship content" message={String(error)} />;
  }
  return <MentorshipEditor initial={mentorship} />;
}