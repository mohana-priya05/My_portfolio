import Link from "next/link";
import { FileDown, ArrowRight } from "lucide-react";

interface HeroProps {
  heading: string;
  subtitle: string;
  tagline: string;
  badge?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  resumeCtaLabel: string;
  resumeHref?: string;
}

export function Hero(props: HeroProps) {
  const { heading, subtitle, tagline, badge, primaryCta, secondaryCta, resumeCtaLabel, resumeHref } =
    props;
  const showResume = Boolean(resumeHref);

  return (
    <section id="home" aria-label="Introduction" className="relative">
      <div className="container-page pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          {badge ? (
            <p
              className="hero-rise mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-medium text-muted-foreground"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {badge}
            </p>
          ) : null}

          <h1
            className="hero-rise text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            style={{ animationDelay: "70ms" }}
          >
            {heading}
          </h1>

          <p
            className="hero-rise mt-3 font-mono text-base font-medium text-primary sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            {subtitle}
          </p>

          <p
            className="hero-rise mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: "210ms" }}
          >
            {tagline}
          </p>

          <div
            className="hero-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {secondaryCta.label}
            </Link>
            {showResume ? (
              <Link
                href={resumeHref!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
                {resumeCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}