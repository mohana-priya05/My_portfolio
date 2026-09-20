import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { About, Statistic } from "@/types/content";

interface AboutProps {
  about: About;
  statistics: Statistic[];
  profile: { name: string; location: string; email: string };
}

export function AboutSection({ about, statistics, profile }: AboutProps) {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="About" title={about.heading} id="about-heading" />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <p className="text-base leading-relaxed text-foreground md:text-lg">{about.summary}</p>
            {about.body ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {about.body}
              </p>
            ) : null}
          </Reveal>

          <Reveal className="lg:col-span-2" delay={120}>
            <div className="grid grid-cols-2 gap-3">
              {statistics.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <p className="font-mono text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <dl className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-3 py-1">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{profile.location}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-1">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="max-w-[14rem] truncate font-medium text-foreground">
                  <a href={"mailto:" + profile.email} className="hover:text-primary">
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}