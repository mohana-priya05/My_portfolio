import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { SettingsEditor } from "@/components/admin/editors/settings-editor";
import { MediaManager } from "@/components/admin/media-manager";
import { ContentError } from "@/components/admin/content-error";
import type { Settings } from "@/types/content";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  let settings: Settings;
  try {
    settings = await readContentFile<Settings>("settings");
  } catch (error) {
    return <ContentError title="Unable to load settings content" message={String(error)} />;
  }
  return (
    <div className="space-y-6">
      <SettingsEditor initial={settings} />
      <MediaManager />
    </div>
  );
}