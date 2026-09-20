import type { ReactNode } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { readContentFile, publicFileExists } from "@/lib/content/read";
import type { Profile, Settings, SocialLinks } from "@/types/content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [profile, settings, social] = await Promise.all([
    readContentFile<Profile>("profile"),
    readContentFile<Settings>("settings").catch(() => null),
    readContentFile<SocialLinks>("social-links").catch(() => null),
  ]);

  const resumeHref = await (async () => {
    if (!settings) return undefined;
    const exists = await publicFileExists(settings.resume.path);
    return exists ? settings.resume.path : undefined;
  })();

  return (
    <>
      <Navbar name={profile.shortName || profile.name} resumeHref={resumeHref} />
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