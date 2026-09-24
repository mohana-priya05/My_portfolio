"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  name: string;
}

export function Navbar({ name }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav aria-label="Primary" className="container-page">
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-300 ease-out ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 font-mono text-sm font-bold tracking-[0.18em] text-foreground transition-colors hover:text-primary"
          >
            {name}
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.section}
                href={link.href}
                onClick={closeMenu}
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white/70 text-foreground shadow-soft backdrop-blur transition-all hover:border-primary/40 hover:text-primary lg:hidden"
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
          <div id="mobile-menu" className="pb-4 pt-2 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.section}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}