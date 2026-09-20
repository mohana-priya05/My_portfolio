import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { GraduationCap } from "lucide-react";
import type { EducationEntry } from "@/types/content";

interface EducationProps {
  heading: string;
  entries: EducationEntry[];
}

export function EducationSection({ heading, entries }: EducationProps) {
  if (entries.length === 0) return null;

  return (
    <section id="education" aria-labelledby="education-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Education" title={heading} id="education-heading" />

        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry, index) => {
            const range = [entry.startDate, entry.endDate].filter(Boolean).join(" — ");
            return (
              <Reveal key={entry.id} delay={index * 60}>
                <article className="flex h-full gap-4 rounded-lg border border-border bg-card p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-accent-foreground">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{entry.degree}</h3>
                    {entry.field ? (
                      <p className="mt-0.5 text-sm font-medium text-primary">{entry.field}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">{entry.institution}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {range}
                      {entry.location ? " • " + entry.location : ""}
                    </p>
                    {entry.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}