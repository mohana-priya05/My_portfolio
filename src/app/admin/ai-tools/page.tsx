import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { AiToolsEditor } from "@/components/admin/editors/ai-tools-editor";
import { ContentError } from "@/components/admin/content-error";
import type { AiTools } from "@/types/content";

export const metadata: Metadata = { title: "AI & Tools", robots: { index: false, follow: false } };

export default async function AiToolsPage() {
  let aiTools: AiTools;
  try {
    aiTools = await readContentFile<AiTools>("ai-tools");
  } catch (error) {
    return <ContentError title="Unable to load AI tools content" message={String(error)} />;
  }
  return <AiToolsEditor initial={aiTools} />;
}