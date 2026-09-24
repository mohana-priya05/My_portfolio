import Link from "next/link";
import Image from "next/image";
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
  photo?: string;
}

export function Hero(props: HeroProps) {
  const {
    heading,
    subtitle,
    tagline,
    badge,
    primaryCta,
    secondaryCta,
    resumeCtaLabel,
    resumeHref,
    photo,
  } = props;
  const showResume = Boolean(resumeHref);

  return (
    <section id="home" aria-label="Introduction" className="relative overflow-hidden">
      <div className="hero-backdrop absolute inset-0" aria-hidden="true" />
      <div
        className="bg-grid-lines absolute inset-0 [mask-image:radial-gradient(70rem_30rem_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="blob animate-blob-slow absolute -top-24 right-[-8%] h-96 w-96 bg-secondary/25" aria-hidden="true" />
      <div className="blob animate-blob-slower absolute bottom-[-24%] left-[-6%] h-80 w-80 bg-primary/25" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-12 pt-20 pb-16 md:pt-28 md:pb-24 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-3xl">
          {photo ? (
            <div className="hero-rise mb-8 flex justify-center lg:hidden" style={{ animationDelay: "0ms" }}>
              <div className="profile-photo h-32 w-32 sm:h-36 sm:w-36">
                <Image
                  src={photo}
                  alt={heading}
                  width={144}
                  height={144}
                  priority
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          ) : null}

          {badge ? (
            <p
              className="hero-rise mb-7 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary-soft/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {badge}
            </p>
          ) : null}

          <h1
            className="hero-rise text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "70ms" }}
          >
            {heading}
          </h1>

          <p
            className="hero-rise mt-6 text-xl font-semibold text-primary sm:text-2xl"
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
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Link href={primaryCta.href} className="btn-hero group">
              {primaryCta.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link href={secondaryCta.href} className="btn-hero-ghost btn-hero-bordered">
              {secondaryCta.label}
            </Link>
            {showResume ? (
              <Link
                href={resumeHref!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-ghost"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
                {resumeCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {photo ? (
          <div className="hero-rise hidden justify-center lg:flex" style={{ animationDelay: "280ms" }}>
            <div className="profile-photo h-72 w-72 xl:h-80 xl:w-80">
              <Image
                src={photo}
                alt={heading}
                width={320}
                height={320}
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}