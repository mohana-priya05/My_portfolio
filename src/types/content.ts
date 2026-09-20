export interface CtaLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  email: string;
  location: string;
  linkedin?: string;
  github?: string;
  experienceYears?: string;
  summary: string;
  highlights: string[];
}

export interface Hero {
  heading: string;
  subtitle: string;
  tagline: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  resumeCtaLabel: string;
  badge?: string;
}

export interface About {
  heading: string;
  summary: string;
  body: string;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
}

export interface Statistics {
  statistics: Statistic[];
}

export interface Skill {
  name: string;
  tools?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Skills {
  heading: string;
  categories: SkillCategory[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  logo?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  displayOrder?: number;
  summary?: string;
  technologies: string[];
  highlights?: string[];
  responsibilities: string[];
}

export interface Experience {
  heading: string;
  entries: ExperienceEntry[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description?: string;
  company?: string;
  role?: string;
  technologies: string[];
  responsibilities: string[];
  architecture?: string;
  achievements: string[];
  problem?: string;
  solution?: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  displayOrder: number;
}

export interface Projects {
  heading: string;
  subheading?: string;
  projects: Project[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  heading: string;
  entries: EducationEntry[];
}

export interface Mentorship {
  heading: string;
  summary?: string;
  counts: {
    juniorDevelopers: number;
    interns: number;
  };
  labels: {
    juniorDevelopers: string;
    interns: string;
  };
  technologies: string[];
}

export interface AiTools {
  heading: string;
  description: string;
  tools: string[];
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface SocialLinks {
  email: string;
  linkedin?: string;
  github?: string;
  links: SocialLink[];
}

export interface Settings {
  site: {
    title: string;
    description: string;
    author: string;
    keywords: string[];
    twitterHandle?: string;
    ogImage?: string;
    themeColor?: string;
  };
  resume: {
    fileName: string;
    path: string;
  };
  admin: {
    dashboardHeading?: string;
    dashboardDescription?: string;
  };
}

export interface AllContent {
  profile: Profile;
  hero: Hero;
  about: About;
  statistics: Statistics;
  skills: Skills;
  experience: Experience;
  projects: Projects;
  education: Education;
  mentorship: Mentorship;
  aiTools: AiTools;
  socialLinks: SocialLinks;
  settings: Settings;
}

export type ContentFileKey =
  | "profile"
  | "hero"
  | "about"
  | "statistics"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "mentorship"
  | "ai-tools"
  | "social-links"
  | "settings";

export const CONTENT_FILES = [
  "profile",
  "hero",
  "about",
  "statistics",
  "skills",
  "experience",
  "projects",
  "education",
  "mentorship",
  "ai-tools",
  "social-links",
  "settings",
] as const satisfies readonly ContentFileKey[];