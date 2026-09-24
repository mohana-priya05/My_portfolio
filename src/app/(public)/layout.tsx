import type { ReactNode } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { readContentFile } from "@/lib/content/read";
import type { Profile, SocialLinks } from "@/types/content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [profile, social] = await Promise.all([
    readContentFile<Profile>("profile"),
    readContentFile<SocialLinks>("social-links").catch(() => null),
  ]);

  return (
    <>
      <Navbar name={profile.shortName || profile.name} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer
        name={profile.shortName || profile.name}
        title={profile.title}
        email={social?.email}
        linkedin={social?.linkedin}
        github={social?.github}
      />
    </>
  );
}