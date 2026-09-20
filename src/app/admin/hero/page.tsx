import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { HeroEditor } from "@/components/admin/editors/hero-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Hero } from "@/types/content";

export const metadata: Metadata = { title: "Hero", robots: { index: false, follow: false } };

export default async function HeroPage() {
  let initial: Hero;
  try {
    initial = await readContentFile<Hero>("hero");
  } catch (error) {
    return <ContentError title="Unable to load hero content" message={String(error)} />;
  }
  return <HeroEditor initial={initial} />;
}