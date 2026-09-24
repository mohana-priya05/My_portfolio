import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { NAV_LINKS } from "./nav-links";

interface FooterProps {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export function Footer({ name, title, email, linkedin, github }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-section">
      <div className="container-page py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-sm font-bold tracking-[0.18em] text-foreground">
              {name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            {NAV_LINKS.slice(0, 8).map((link) => (
              <Link
                key={link.section}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ul className="flex items-center gap-3">
            {email ? (
              <li>
                <a
                  href={"mailto:" + email}
                  aria-label={"Email " + email}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-px hover:border-primary/40 hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ) : null}
            {linkedin ? (
              <li>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mohana Priya on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-px hover:border-primary/40 hover:text-primary"
                >
                  <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ) : null}
            {github ? (
              <li>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-px hover:border-primary/40 hover:text-primary"
                >
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
            Chennai, Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
}