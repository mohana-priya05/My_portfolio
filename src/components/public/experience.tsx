import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import Image from "next/image";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import type { ExperienceEntry } from "@/types/content";

interface ExperienceProps {
  heading: string;
  entries: ExperienceEntry[];
}

function formatRange(entry: ExperienceEntry): string | null {
  const parts: string[] = [];
  if (entry.startDate) parts.push(entry.startDate);
  if (entry.current) {
    parts.push("Present");
  } else if (entry.endDate) {
    parts.push(entry.endDate);
  }
  return parts.length > 0 ? parts.join(" – ") : null;
}

export function ExperienceSection({ heading, entries }: ExperienceProps) {
  if (entries.length === 0) return null;

  const ordered = [...entries].sort(
    (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity),
  );

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Experience" title={heading} id="experience-heading" />

        <ol className="relative space-y-8 border-l border-border pl-8">
          {ordered.map((entry, index) => {
            const range = formatRange(entry);
            const meta = [entry.location, range].filter(Boolean).join(" · ");
            const heading = entry.company || entry.role;
            return (
              <li key={entry.id} className="relative">
                <span
                  className="absolute -left-[2.1rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary ring-1 ring-border"
                  aria-hidden="true"
                />
                <Reveal delay={index * 60}>
                  <article className="rounded-lg border border-border bg-card p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        {entry.logo ? (
                          <Image
                            src={entry.logo}
                            alt={entry.company ? entry.company + " logo" : "Company logo"}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 rounded-lg border border-border bg-card object-contain p-1"
                          />
                        ) : null}
                        <div>
                          <h3 className="text-base font-semibold text-foreground md:text-lg">
                            {heading}
                          </h3>
                          {entry.role && entry.company ? (
                            <p className="mt-0.5 font-medium text-primary">{entry.role}</p>
                          ) : null}
                          {meta ? (
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                              {entry.location ? (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                  {entry.location}
                                </span>
                              ) : null}
                              {range ? (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                  {range}
                                </span>
                              ) : null}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {typeof entry.current === "boolean" ? (
                        <span
                          className={
                            "rounded-full px-2.5 py-1 text-xs font-medium " +
                            (entry.current
                              ? "bg-primary-soft text-accent-foreground"
                              : "bg-muted text-muted-foreground")
                          }
                        >
                          {entry.current ? "Current" : "Previous"}
                        </span>
                      ) : null}
                    </div>

                    {entry.summary ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {entry.summary}
                      </p>
                    ) : null}

                    {entry.highlights && entry.highlights.length > 0 ? (
                      <div className="mt-4">
                        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <Sparkles className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-primary" aria-hidden="true" />
                          Key Highlights
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {entry.highlights.map((item) => (
                            <li
                              key={item}
                              className="inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-3 py-1 font-mono text-xs font-medium text-accent-foreground"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.responsibilities.length > 0 ? (
                      <div className="mt-4">
                        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Overall Contributions
                        </p>
                        <ul className="mt-2 space-y-2">
                          {entry.responsibilities.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.technologies.length > 0 ? (
                      <div className="mt-4">
                        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Technologies
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {entry.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}