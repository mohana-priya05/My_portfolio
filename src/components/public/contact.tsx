import { Reveal } from "./reveal";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/brand-icons";
import type { SocialLinks } from "@/types/content";

interface ContactSectionProps {
  social: SocialLinks;
}

export function ContactSection({ social }: ContactSectionProps) {
  if (!social.email && !social.linkedin) return null;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 bg-section-alt">
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <div className="contact-panel relative overflow-hidden rounded-3xl px-5 py-12 shadow-lift sm:px-6 md:px-16 md:py-20">
            <div
              className="blob animate-blob-slow absolute -right-16 -top-20 h-72 w-72 bg-secondary/30"
              aria-hidden="true"
            />
            <div
              className="blob animate-blob-slower absolute -bottom-24 -left-16 h-72 w-72 bg-primary/30"
              aria-hidden="true"
            />
            <div className="bg-dots-light absolute inset-0 opacity-30" aria-hidden="true" />

            <div className="relative mx-auto max-w-2xl text-center">
              <p
                id="contact-heading"
                className="mb-3 inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white/60"
              >
                <span className="h-px w-8 bg-white/40" aria-hidden="true" />
                Contact
                <span className="h-px w-8 bg-white/40" aria-hidden="true" />
              </p>
              <h2 className="text-[26px] font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Let&apos;s Talk
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/70 md:text-lg">
                Let&rsquo;s connect and build something meaningful.
              </p>

              <div className="mx-auto mt-10 grid max-w-full gap-3 md:max-w-2xl md:grid-cols-2">
                {social.email ? (
                  <a
                    href={"mailto:" + social.email}
                    aria-label={"Email " + social.email}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-left backdrop-blur transition-colors hover:bg-white/15 sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white sm:h-11 sm:w-11">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                        Email
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-white [overflow-wrap:anywhere] sm:text-sm sm:whitespace-nowrap">
                        {social.email}
                      </span>
                    </span>
                  </a>
                ) : null}

                {social.linkedin ? (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mohana Priya on LinkedIn"
                    className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-left backdrop-blur transition-colors hover:bg-white/15 sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white sm:h-11 sm:w-11">
                      <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                        LinkedIn
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-white transition-colors group-hover:text-white sm:text-sm">
                        Mohana Priya
                      </span>
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}