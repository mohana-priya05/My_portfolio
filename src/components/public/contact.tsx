import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/brand-icons";
import type { SocialLinks } from "@/types/content";

interface ContactSectionProps {
  social: SocialLinks;
}

export function ContactSection({ social }: ContactSectionProps) {
  if (!social.email && !social.linkedin) return null;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Talk"
          description="Have a project in mind or want to collaborate? Reach out."
          id="contact-heading"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {social.email ? (
            <Reveal>
              <a
                href={"mailto:" + social.email}
                aria-label={"Email " + social.email}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-accent-foreground">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </span>
                  <span className="mt-0.5 block break-all font-medium text-foreground">
                    {social.email}
                  </span>
                </span>
              </a>
            </Reveal>
          ) : null}

          {social.linkedin ? (
            <Reveal delay={100}>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-accent-foreground">
                  <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    LinkedIn
                  </span>
                  <span className="mt-0.5 block max-w-[16rem] truncate font-medium text-foreground">
                    {social.linkedin}
                  </span>
                </span>
              </a>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}