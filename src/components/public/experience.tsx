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
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative scroll-mt-24 overflow-hidden"
    >
      <div className="experience-backdrop absolute inset-0" aria-hidden="true" />
      <div className="container-page relative py-16 md:py-24">
        <SectionHeading eyebrow="Experience" title={heading} id="experience-heading" />

        <ol className="relative ml-2 space-y-10 before:absolute before:bottom-8 before:left-[3px] before:top-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-secondary before:to-primary/10">
          {ordered.map((entry, index) => {
            const range = formatRange(entry);
            const meta = [entry.location, range].filter(Boolean).join(" · ");
            const heading = entry.company || entry.role;
            return (
              <li key={entry.id} className="relative pl-8 md:pl-10">
                <span
                  className="absolute left-0 top-7 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/15 md:top-8"
                  aria-hidden="true"
                />
                <Reveal delay={(index % 2) * 80}>
                  <article className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        {entry.logo ? (
                          <Image
                            src={entry.logo}
                            alt={entry.company ? entry.company + " logo" : "Company logo"}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 rounded-xl border border-border bg-section object-contain p-1.5 md:h-16 md:w-16"
                          />
                        ) : null}
                        <div>
                          <h3 className="text-lg font-bold text-foreground md:text-xl">
                            {heading}
                          </h3>
                          {entry.role && entry.company ? (
                            <p className="mt-0.5 font-semibold text-primary">{entry.role}</p>
                          ) : null}
                          {meta ? (
                            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              {entry.location ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 text-primary/60" aria-hidden="true" />
                                  {entry.location}
                                </span>
                              ) : null}
                              {range ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4 text-primary/60" aria-hidden="true" />
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
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            (entry.current
                              ? "bg-primary text-primary-foreground"
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
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          <Sparkles
                            className="mr-1.5 inline h-3.5 w-3.5 align-[-2px] text-primary"
                            aria-hidden="true"
                          />
                          Key Highlights
                        </p>
                        <ul className="mt-2.5 flex flex-wrap gap-2">
                          {entry.highlights.map((item) => (
                            <li
                              key={item}
                              className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent-foreground"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.responsibilities.length > 0 ? (
                      <div className="mt-5">
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Overall Contributions
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {entry.responsibilities.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm leading-relaxed text-foreground md:text-[15px]"
                            >
                              <span
                                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.technologies.length > 0 ? (
                      <div className="mt-5">
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Technologies
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {entry.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-border/80 bg-section-alt px-3 py-1 font-mono text-xs text-muted-foreground"
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