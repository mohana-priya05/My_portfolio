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
    <section id="education" aria-labelledby="education-heading" className="scroll-mt-24 bg-section">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Education" title={heading} id="education-heading" />

        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry, index) => {
            const range = [entry.startDate, entry.endDate].filter(Boolean).join(" — ");
            return (
              <Reveal key={entry.id} delay={index * 60} className="h-full">
                <article className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft">
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground md:text-lg">
                      {entry.degree}
                    </h3>
                    {entry.field ? (
                      <p className="mt-0.5 text-sm font-semibold text-primary">{entry.field}</p>
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