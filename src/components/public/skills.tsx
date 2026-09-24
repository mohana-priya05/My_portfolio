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
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24 bg-section-alt">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Skills" title={heading} id="skills-heading" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((category, index) => (
            <Reveal key={category.id} delay={(index % 3) * 80} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                  {category.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-primary/10 bg-primary-soft px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft/70"
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