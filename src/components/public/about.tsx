import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { MapPin, Mail } from "lucide-react";
import type { About, Statistic } from "@/types/content";

interface AboutProps {
  about: About;
  statistics: Statistic[];
  profile: { name: string; location: string; email: string };
}

export function AboutSection({ about, statistics, profile }: AboutProps) {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 bg-section">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="About" title={about.heading} id="about-heading" />

        <div className="grid gap-12 lg:grid-cols-5">
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
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <p className="font-mono text-2xl font-bold text-primary md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-muted-foreground md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <dl className="mt-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
              <div className="flex items-center justify-between gap-3 py-1.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60" aria-hidden="true" />
                  Location
                </dt>
                <dd className="font-medium text-foreground">{profile.location}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary/60" aria-hidden="true" />
                  Email
                </dt>
                <dd className="whitespace-nowrap text-[13px] font-medium text-foreground sm:text-sm">
                  <a href={"mailto:" + profile.email} className="transition-colors hover:text-primary">
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