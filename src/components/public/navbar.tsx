"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, FileDown } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  name: string;
  resumeHref?: string;
}

export function Navbar({ name, resumeHref }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const showResume = Boolean(resumeHref);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur transition-colors ${
        scrolled || open
          ? "border-border bg-background/85"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 font-mono text-sm font-bold tracking-[0.18em] text-foreground"
          >
            {name}
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.section}
                href={link.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {showResume ? (
              <Link
                href={resumeHref!}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent md:inline-flex"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
                Resume
              </Link>
            ) : null}
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {open ? (
          <div id="mobile-menu" className="border-t border-border pb-4 pt-2 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.section}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {showResume ? (
                <li>
                  <Link
                    href={resumeHref!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <FileDown className="h-4 w-4" aria-hidden="true" />
                    Resume
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}