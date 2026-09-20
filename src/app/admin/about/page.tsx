import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { AboutEditor } from "@/components/admin/editors/about-editor";
import { ContentError } from "@/components/admin/content-error";
import type { About, Statistics } from "@/types/content";

export const metadata: Metadata = { title: "About", robots: { index: false, follow: false } };

export default async function AboutPage() {
  let about: About;
  let statistics: Statistics;
  try {
    [about, statistics] = await Promise.all([
      readContentFile<About>("about"),
      readContentFile<Statistics>("statistics"),
    ]);
  } catch (error) {
    return <ContentError title="Unable to load about content" message={String(error)} />;
  }
  return <AboutEditor initialAbout={about} initialStatistics={statistics.statistics} />;
}