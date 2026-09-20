import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), {
    message: "Must be a valid http(s) URL or empty",
  });

const ctaLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(40),
  href: z.string().trim().min(1, "Link target is required").max(200),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  shortName: z.string().trim().min(1, "Short name is required").max(40),
  title: z.string().trim().min(1, "Title is required").max(100),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  location: z.string().trim().min(1, "Location is required").max(120),
  linkedin: optionalUrl,
  github: optionalUrl,
  experienceYears: z.string().trim().max(20).optional(),
  summary: z.string().trim().min(1, "Summary is required").max(2000),
  highlights: z.array(z.string().trim().min(1).max(200)).max(30).default([]),
});

export const heroSchema = z.object({
  heading: z.string().trim().min(1, "Heading is required").max(120),
  subtitle: z.string().trim().min(1, "Subtitle is required").max(120),
  tagline: z.string().trim().min(1, "Tagline is required").max(300),
  primaryCta: ctaLinkSchema,
  secondaryCta: ctaLinkSchema,
  resumeCtaLabel: z.string().trim().min(1).max(60),
  badge: z.string().trim().max(60).optional(),
});

export const aboutSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(3000),
  body: z.string().trim().max(5000).default(""),
});

export const statisticSchema = z.object({
  id: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(80),
});

export const statisticsSchema = z.object({
  statistics: z.array(statisticSchema).min(1, "At least one statistic is required").max(20),
});

export const skillCategorySchema = z.object({
  id: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1, "Category name is required").max(80),
  skills: z.array(z.string().trim().min(1).max(80)).max(100),
});

export const skillsSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  categories: z.array(skillCategorySchema).min(1).max(20),
});

export const experienceEntrySchema = z.object({
  id: z.string().trim().min(1).max(80),
  company: z.string().trim().max(160),
  role: z.string().trim().min(1, "Role is required").max(160),
  logo: z.string().trim().max(500).optional(),
  location: z.string().trim().max(160).optional(),
  startDate: z.string().trim().max(40).optional(),
  endDate: z.string().trim().max(40).optional(),
  current: z.boolean().default(false),
  displayOrder: z.number().int().min(0).optional(),
  summary: z.string().trim().max(2000).optional(),
  technologies: z.array(z.string().trim().min(1).max(80)).max(100),
  highlights: z.array(z.string().trim().min(1).max(300)).max(20).optional(),
  responsibilities: z.array(z.string().trim().min(1).max(300)).max(100),
});

export const experienceSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  entries: z.array(experienceEntrySchema).max(50),
});

export const projectSchema = z.object({
  id: z.string().trim().min(1, "id is required").max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and dashes"),
  name: z.string().trim().min(1, "Project name is required").max(200),
  shortDescription: z.string().trim().min(1, "Short description is required").max(300),
  description: z.string().trim().max(4000).optional(),
  company: z.string().trim().max(160).optional(),
  role: z.string().trim().max(160).optional(),
  technologies: z.array(z.string().trim().min(1).max(80)).max(100),
  responsibilities: z.array(z.string().trim().min(1).max(300)).max(100),
  architecture: z.string().trim().max(4000).optional(),
  achievements: z.array(z.string().trim().min(1).max(300)).max(100),
  problem: z.string().trim().max(4000).optional(),
  solution: z.string().trim().max(4000).optional(),
  image: z.string().trim().max(500).optional(),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0),
});

export const projectsSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  subheading: z.string().trim().max(300).optional(),
  projects: z.array(projectSchema).max(100),
});

export const educationEntrySchema = z.object({
  id: z.string().trim().min(1).max(80),
  degree: z.string().trim().min(1, "Degree is required").max(200),
  field: z.string().trim().max(200).optional(),
  institution: z.string().trim().min(1, "Institution is required").max(200),
  location: z.string().trim().max(160).optional(),
  startDate: z.string().trim().max(40).optional(),
  endDate: z.string().trim().max(40).optional(),
  description: z.string().trim().max(2000).optional(),
});

export const educationSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  entries: z.array(educationEntrySchema).max(50),
});

export const mentorshipSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(2000).optional(),
  counts: z.object({
    juniorDevelopers: z.number().int().min(0),
    interns: z.number().int().min(0),
  }),
  labels: z.object({
    juniorDevelopers: z.string().trim().min(1).max(80),
    interns: z.string().trim().min(1).max(80),
  }),
  technologies: z.array(z.string().trim().min(1).max(80)).max(50),
});

export const aiToolsSchema = z.object({
  heading: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  tools: z.array(z.string().trim().min(1).max(80)).max(100),
});

export const socialLinkSchema = z.object({
  id: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(80),
  url: optionalUrl,
  icon: z.string().trim().max(40).optional(),
});

export const socialLinksSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  linkedin: optionalUrl,
  github: optionalUrl,
  links: z.array(socialLinkSchema).max(50),
});

export const settingsSchema = z.object({
  site: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(500),
    author: z.string().trim().min(1).max(100),
    keywords: z.array(z.string().trim().min(1).max(60)).max(50),
    twitterHandle: z.string().trim().max(40).optional(),
    ogImage: optionalUrl,
    themeColor: z.string().trim().max(20).optional(),
  }),
  resume: z.object({
    fileName: z.string().trim().min(1).max(200),
    path: z.string().trim().min(1).max(300),
  }),
  admin: z.object({
    dashboardHeading: z.string().trim().max(120).optional(),
    dashboardDescription: z.string().trim().max(300).optional(),
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(200),
  password: z.string().min(1, "Password is required").max(200),
});

export type SchemaByFile = {
  profile: typeof profileSchema;
  hero: typeof heroSchema;
  about: typeof aboutSchema;
  statistics: typeof statisticsSchema;
  skills: typeof skillsSchema;
  experience: typeof experienceSchema;
  projects: typeof projectsSchema;
  education: typeof educationSchema;
  mentorship: typeof mentorshipSchema;
  "ai-tools": typeof aiToolsSchema;
  "social-links": typeof socialLinksSchema;
  settings: typeof settingsSchema;
};

export const contentSchemas: SchemaByFile = {
  profile: profileSchema,
  hero: heroSchema,
  about: aboutSchema,
  statistics: statisticsSchema,
  skills: skillsSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  education: educationSchema,
  mentorship: mentorshipSchema,
  "ai-tools": aiToolsSchema,
  "social-links": socialLinksSchema,
  settings: settingsSchema,
};