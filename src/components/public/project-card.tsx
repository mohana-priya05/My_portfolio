import Link from "next/link";
import { ArrowRight, Building2, Folder, HeartPulse, ShoppingCart, Users } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import type { LucideIcon } from "lucide-react";
import type { Project } from "@/types/content";

interface CategoryStyle {
  label: string;
  icon: LucideIcon;
  accentText: string;
  accentBorder: string;
  accentBg: string;
}

const CATEGORIES: Record<string, CategoryStyle> = {
  "mukizh-apparel-inventory-billing": {
    label: "Enterprise",
    icon: Building2,
    accentText: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/25 dark:border-blue-400/30",
    accentBg: "bg-blue-500/10 dark:bg-blue-400/10",
  },
  "mukizh-fashion-ecommerce": {
    label: "E-Commerce",
    icon: ShoppingCart,
    accentText: "text-indigo-600 dark:text-indigo-400",
    accentBorder: "border-indigo-500/25 dark:border-indigo-400/30",
    accentBg: "bg-indigo-500/10 dark:bg-indigo-400/10",
  },
  "elitehire360-recruitment": {
    label: "Recruitment",
    icon: Users,
    accentText: "text-teal-600 dark:text-teal-400",
    accentBorder: "border-teal-500/25 dark:border-teal-400/30",
    accentBg: "bg-teal-500/10 dark:bg-teal-400/10",
  },
  "fridex-fraud-identification": {
    label: "Healthcare",
    icon: HeartPulse,
    accentText: "text-rose-600 dark:text-rose-400",
    accentBorder: "border-rose-500/25 dark:border-rose-400/30",
    accentBg: "bg-rose-500/10 dark:bg-rose-400/10",
  },
};

const FALLBACK: CategoryStyle = {
  label: "Project",
  icon: Folder,
  accentText: "text-muted-foreground",
  accentBorder: "border-border",
  accentBg: "bg-muted/60",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const category = CATEGORIES[project.slug] ?? FALLBACK;
  const CategoryIcon = category.icon;
  const showGithub = Boolean(project.githubUrl);
  const showLive = Boolean(project.liveUrl);

  return (
    <article
      className={
        "group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft card-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lift md:p-7"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold tracking-[0.18em] text-muted-foreground/70">
            {String(index + 1).padStart(2, "0")}
          </p>
          <span
            className={
              "mt-3 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide " +
              category.accentBorder +
              " " +
              category.accentBg +
              " " +
              category.accentText
            }
          >
            {category.label}
          </span>
        </div>
        <CategoryIcon
          className={"h-5 w-5 shrink-0 " + category.accentText}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl">
        {project.name}
      </h3>

      {project.company ? (
        <p className="mt-2 text-xs font-medium text-muted-foreground/80">{project.company}</p>
      ) : null}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.shortDescription}
      </p>

      {project.technologies.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
        <Link
          href={"/projects/" + project.slug}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          View Project
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
        {showGithub || showLive ? (
          <div className="flex items-center gap-2">
            {showGithub ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"GitHub repository for " + project.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
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
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Live demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}