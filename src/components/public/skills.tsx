import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Boxes, Database, Palette, Server } from "lucide-react";
import type { SkillCategory } from "@/types/content";

interface SkillsProps {
  heading: string;
  categories: SkillCategory[];
}

const CORE_SKILLS = new Set([
  "React.js",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "GraphQL",
  "REST APIs",
  "PostgreSQL",
  "AWS S3",
  "Docker",
  "CI/CD Pipelines",
  "Micro Frontends",
  "Agile Scrum",
]);

interface CardStyle {
  iconChip: string;
  accentPill: string;
}

const STYLES: Record<string, CardStyle> = {
  frontend: {
    iconChip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    accentPill:
      "border-blue-500/25 bg-blue-500/10 text-blue-700 hover:border-blue-500/50 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300",
  },
  backend: {
    iconChip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    accentPill:
      "border-indigo-500/25 bg-indigo-500/10 text-indigo-700 hover:border-indigo-500/50 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300",
  },
  database: {
    iconChip: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    accentPill:
      "border-teal-500/25 bg-teal-500/10 text-teal-700 hover:border-teal-500/50 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300",
  },
  architecture: {
    iconChip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    accentPill:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 hover:border-amber-500/50 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  },
};

const ICONS = {
  frontend: Palette,
  backend: Server,
  database: Database,
  architecture: Boxes,
};

interface Group {
  id: string;
  name: string;
  description: string;
  categories: SkillCategory[];
}

function buildGroups(categories: SkillCategory[]): Group[] {
  const byId = (id: string) => categories.filter((c) => c.id === id);
  return [
    {
      id: "frontend",
      name: "Frontend",
      description: "Responsive, accessible interfaces built with modern React and Next.js.",
      categories: byId("frontend"),
    },
    {
      id: "backend",
      name: "Backend & APIs",
      description: "Scalable REST and GraphQL APIs with robust authentication and integrations.",
      categories: byId("backend"),
    },
    {
      id: "database",
      name: "Data & Cloud",
      description: "Relational data modeling and cloud-native deployment on AWS.",
      categories: [...byId("database"), ...byId("cloud")],
    },
    {
      id: "architecture",
      name: "Architecture & Engineering",
      description: "Structured codebases, review discipline, and reliable delivery practices.",
      categories: byId("architecture"),
    },
  ];
}

export function SkillsSection({ heading, categories }: SkillsProps) {
  const groups = buildGroups(categories).filter((group) => group.categories.length > 0);
  if (groups.length === 0) return null;

  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24 bg-section-alt">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="My Technical Skills" title={heading} id="skills-heading" />

        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group, index) => {
            const Icon = ICONS[group.id as keyof typeof ICONS];
            const style = STYLES[group.id];
            const skills = group.categories.flatMap((c) => c.skills);
            return (
              <Reveal key={group.id} delay={(index % 2) * 80} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft card-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift md:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + style.iconChip}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground md:text-lg">
                      {group.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {group.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className={
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:-translate-y-px hover:shadow-soft " +
                          (CORE_SKILLS.has(skill)
                            ? style.accentPill
                            : "border-border/70 bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground")
                        }
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}