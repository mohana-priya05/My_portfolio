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
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Work" title={heading} description={subheading} id="projects-heading" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {sorted.map((project, index) => (
            <Reveal key={project.id} delay={(index % 2) * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}