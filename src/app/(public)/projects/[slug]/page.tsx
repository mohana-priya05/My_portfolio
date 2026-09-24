import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { readContentFile } from "@/lib/content/read";
import type { Projects } from "@/types/content";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { projects } = await readContentFile<Projects>("projects");
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.shortDescription,
  };
}

async function findProject(slug: string) {
  try {
    const { projects } = await readContentFile<Projects>("projects");
    return projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) notFound();

  const sections: Array<{ title: string; content?: string }> = [];
  if (project.problem) sections.push({ title: "Problem", content: project.problem });
  if (project.solution) sections.push({ title: "Solution", content: project.solution });
  if (project.role) sections.push({ title: "My Role", content: project.role });
  if (project.architecture) sections.push({ title: "Architecture", content: project.architecture });

  return (
    <div className="container-page py-12 md:py-16">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to projects
      </Link>

      <article className="mt-6">
        <header className="border-b border-border pb-8">
          <p className="inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
            {project.company || project.role || "Project"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {project.description || project.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <GithubIcon className="h-4 w-4" aria-hidden="true" />
                GitHub Repository
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                Live Demo
              </a>
            ) : null}
          </div>
        </header>

        {project.image ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-section-alt shadow-soft">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section aria-label="Overview">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {project.description || project.shortDescription}
              </p>
            </section>

            {sections.map((section) => (
              <section key={section.title} aria-label={section.title} className="mt-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                  {section.content}
                </p>
              </section>
            ))}

            {project.responsibilities.length > 0 ? (
              <section aria-label="Responsibilities" className="mt-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Responsibilities
                </h2>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {project.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.achievements.length > 0 ? (
              <section aria-label="Achievements" className="mt-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Achievements
                </h2>
                <ul className="mt-3 grid gap-2.5">
                  {project.achievements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Details
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {project.company ? (
                  <div>
                    <dt className="text-muted-foreground">Company</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{project.company}</dd>
                  </div>
                ) : null}
                {project.role ? (
                  <div>
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{project.role}</dd>
                  </div>
                ) : null}
              </dl>

              {project.technologies.length > 0 ? (
                <>
                  <h2 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Technologies
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-primary/10 bg-primary-soft px-2.5 py-1 font-mono text-xs text-accent-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}