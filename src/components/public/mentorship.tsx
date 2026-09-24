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
    <section id="mentorship" aria-labelledby="mentorship-heading" className="scroll-mt-24 bg-section-alt">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Mentorship" title={mentorship.heading} id="mentorship-heading" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="deep-gradient flex h-full flex-col justify-center rounded-2xl p-7 text-white shadow-soft">
              <Users className="mb-5 h-7 w-7" aria-hidden="true" />
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-mono text-3xl font-bold md:text-4xl">
                      {stat.value}
                      {stat.suffix}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              {mentorship.summary ? (
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {mentorship.summary}
                </p>
              ) : null}
              {mentorship.technologies.length > 0 ? (
                <>
                  <h3 className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Focus areas
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {mentorship.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-primary/10 bg-primary-soft px-3 py-1.5 text-xs font-medium text-accent-foreground"
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