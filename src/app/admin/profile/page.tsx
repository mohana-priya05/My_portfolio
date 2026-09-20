import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { ProfileEditor } from "@/components/admin/editors/profile-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Profile } from "@/types/content";

export const metadata: Metadata = { title: "Profile", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  let initial: Profile;
  try {
    initial = await readContentFile<Profile>("profile");
  } catch (error) {
    return <ContentError title="Unable to load profile content" message={String(error)} />;
  }
  return <ProfileEditor initial={initial} />;
}