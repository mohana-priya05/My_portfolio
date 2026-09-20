import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  const hasImage = Boolean(project.image);
  const showGithub = Boolean(project.githubUrl);
  const showLive = Boolean(project.liveUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={project.image!}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 100vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-primary-soft p-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-foreground/70">
              {project.role || "Project"}
            </span>
            <span className="font-mono text-sm font-semibold text-accent-foreground">
              {project.name}
            </span>
          </div>
        )}
        {project.featured ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2 py-0.5 text-[11px] font-medium text-background backdrop-blur">
            <Star className="h-3 w-3" aria-hidden="true" />
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-foreground md:text-lg">{project.name}</h3>
        {project.company ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{project.company}</p>
        ) : null}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        {project.technologies.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tech}
              </li>
            ))}
            {project.technologies.length > 6 ? (
              <li className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                +{project.technologies.length - 6}
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Link
            href={"/projects/" + project.slug}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {showGithub ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"GitHub repository for " + project.name}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Code
            </a>
          ) : null}
          {showLive ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"Live demo for " + project.name}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Live demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}