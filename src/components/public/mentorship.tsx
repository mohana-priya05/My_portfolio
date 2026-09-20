import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Users } from "lucide-react";
import type { Mentorship } from "@/types/content";

interface MentorshipProps {
  mentorship: Mentorship;
}

export function MentorshipSection({ mentorship }: MentorshipProps) {
  const stats = [
    {
      value: mentorship.counts.juniorDevelopers,
      label: mentorship.labels.juniorDevelopers,
      suffix: "+",
    },
    { value: mentorship.counts.interns, label: mentorship.labels.interns, suffix: "+" },
  ];

  return (
    <section id="mentorship" aria-labelledby="mentorship-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Mentorship" title={mentorship.heading} id="mentorship-heading" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="flex h-full flex-col justify-center rounded-lg border border-border bg-card p-6">
              <Users className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-mono text-3xl font-bold text-primary">
                      {stat.value}
                      {stat.suffix}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              {mentorship.summary ? (
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {mentorship.summary}
                </p>
              ) : null}
              {mentorship.technologies.length > 0 ? (
                <>
                  <h3 className="mt-5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Focus areas
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {mentorship.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}