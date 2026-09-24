import type { Metadata } from "next";
import { Hero } from "@/components/public/hero";
import { AboutSection } from "@/components/public/about";
import { SkillsSection } from "@/components/public/skills";
import { ExperienceSection } from "@/components/public/experience";
import { ProjectsSection } from "@/components/public/projects";
import { EducationSection } from "@/components/public/education";
import { MentorshipSection } from "@/components/public/mentorship";
import { AiToolsSection } from "@/components/public/ai-tools";
import { ContactSection } from "@/components/public/contact";
import {
  readContentFile,
  publicFileExists,
} from "@/lib/content/read";
import type {
  About,
  AiTools,
  Education,
  Experience,
  Hero as HeroContent,
  Mentorship,
  Profile,
  Projects,
  Settings,
  Skills,
  SocialLinks,
  Statistics,
} from "@/types/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  let settings: Settings | null = null;
  try {
    settings = await readContentFile<Settings>("settings");
  } catch {
    /* fall through to defaults */
  }
  return {
    title: settings?.site.title ?? "Mohana Priya — Full Stack Developer",
    description:
      settings?.site.description ??
      "Full Stack Developer with 2+ years of experience building scalable enterprise and e-commerce web applications.",
  };
}

export default async function HomePage() {
  const [
    profile,
    hero,
    about,
    statistics,
    skills,
    experience,
    projects,
    education,
    mentorship,
    aiTools,
    social,
    settings,
  ] = await Promise.all([
    readContentFile<Profile>("profile"),
    readContentFile<HeroContent>("hero"),
    readContentFile<About>("about"),
    readContentFile<Statistics>("statistics"),
    readContentFile<Skills>("skills"),
    readContentFile<Experience>("experience"),
    readContentFile<Projects>("projects"),
    readContentFile<Education>("education"),
    readContentFile<Mentorship>("mentorship"),
    readContentFile<AiTools>("ai-tools"),
    readContentFile<SocialLinks>("social-links"),
    readContentFile<Settings>("settings"),
  ]);

  const resumeExists = await publicFileExists(settings.resume.path);

  return (
    <>
      <Hero
        heading={hero.heading}
        subtitle={hero.subtitle}
        tagline={hero.tagline}
        badge={hero.badge}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        resumeCtaLabel={hero.resumeCtaLabel}
        resumeHref={resumeExists ? settings.resume.path : undefined}
        photo={hero.photo}
      />

      <AboutSection
        about={about}
        statistics={statistics.statistics}
        profile={{ name: profile.name, location: profile.location, email: profile.email }}
      />

      <SkillsSection heading={skills.heading} categories={skills.categories} aiTools={aiTools} />

      <ExperienceSection heading={experience.heading} entries={experience.entries} />

      <ProjectsSection
        heading={projects.heading}
        subheading={projects.subheading}
        projects={projects.projects}
      />

      <EducationSection heading={education.heading} entries={education.entries} />

      <MentorshipSection mentorship={mentorship} />

      <AiToolsSection aiTools={aiTools} />

      <ContactSection social={social} />
    </>
  );
}