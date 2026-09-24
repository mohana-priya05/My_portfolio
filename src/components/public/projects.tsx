import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types/content";

interface ProjectsSectionProps {
  heading: string;
  subheading?: string;
  projects: Project[];
}

export function ProjectsSection({ heading, subheading, projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="projects-backdrop relative scroll-mt-24 overflow-hidden"
    >
      <div className="container-page relative py-16 md:py-24">
        <SectionHeading
          eyebrow="Work"
          title={heading}
          description={subheading}
          id="projects-heading"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map((project, index) => (
            <Reveal key={project.id} delay={(index % 2) * 90} className="h-full">
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}