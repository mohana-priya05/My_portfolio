import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { AiTools, SkillCategory } from "@/types/content";

interface SkillsProps {
  heading: string;
  categories: SkillCategory[];
  aiTools: AiTools;
}

export function SkillsSection({ heading, categories, aiTools }: SkillsProps) {
  const aiCategory: SkillCategory = {
    id: "ai-tools",
    name: "AI & Development Tools",
    skills: aiTools.tools,
  };
  const all: SkillCategory[] = [...categories, aiCategory];

  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Skills" title={heading} id="skills-heading" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((category, index) => (
            <Reveal key={category.id} delay={(index % 3) * 80}>
              <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                  {category.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}