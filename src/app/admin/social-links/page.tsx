import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { SocialLinksEditor } from "@/components/admin/editors/social-links-editor";
import { ContentError } from "@/components/admin/content-error";
import type { SocialLinks } from "@/types/content";

export const metadata: Metadata = { title: "Social Links", robots: { index: false, follow: false } };

export default async function SocialLinksPage() {
  let social: SocialLinks;
  try {
    social = await readContentFile<SocialLinks>("social-links");
  } catch (error) {
    return <ContentError title="Unable to load social links content" message={String(error)} />;
  }
  return <SocialLinksEditor initial={social} />;
}