import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import type { Project } from "@/types/content";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function ProjectCard({ project }: { project: Project }) {
  const hasImage = Boolean(project.image);
  const showGithub = Boolean(project.githubUrl);
  const showLive = Boolean(project.liveUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        {hasImage ? (
          <Image
            src={project.image!}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 100vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="deep-gradient relative flex h-full w-full flex-col justify-between p-6">
            <div className="bg-dots-light absolute inset-0" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-3">
              <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                {project.role || "Project"}
              </span>
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Featured
                </span>
              ) : null}
            </div>
            <div className="relative" style={{bottom:"3rem"}}>
              <p className="font-mono text-4xl font-black tracking-tight text-white/25 md:text-5xl">
                {initials(project.name)}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug text-white md:text-2xl">
                {project.name}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.company ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {project.company}
          </p>
        ) : null}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          {project.shortDescription}
        </p>

        {project.technologies.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border/80 bg-section-alt px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {tech}
              </li>
            ))}
            {project.technologies.length > 6 ? (
              <li className="rounded-full border border-border/80 bg-section-alt px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                +{project.technologies.length - 6}
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <Link
            href={"/projects/" + project.slug}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-indigo-600"
          >
            View Project
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <div className="flex items-center gap-2">
            {showGithub ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"GitHub repository for " + project.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:-translate-y-px hover:border-primary/40 hover:text-foreground"
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
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:bg-primary/90"
              >
                Live demo
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}