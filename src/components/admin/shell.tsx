"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Home,
  NotebookText,
  Gauge,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Users,
  Sparkles,
  Share2,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "./ui";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_GROUPS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/hero", label: "Hero", icon: Home },
  { href: "/admin/about", label: "About", icon: NotebookText },
  { href: "/admin/skills", label: "Skills", icon: Gauge },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/mentorship", label: "Mentorship", icon: Users },
  { href: "/admin/ai-tools", label: "AI & Tools", icon: Sparkles },
  { href: "/admin/social-links", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* continue regardless */
    }
    router.push("/admin/login");
    router.refresh();
  }

  const current = NAV_GROUPS.find(
    (item) => item.href === pathname || (pathname ?? "").startsWith(item.href + "/"),
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/admin/dashboard" className="font-mono text-sm font-bold tracking-[0.15em] text-foreground">
          MOHANA PRIYA
        </Link>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_GROUPS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-soft text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          View site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="presentation" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <aside
            className="absolute inset-y-0 left-0 w-64 border-r border-border bg-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Admin navigation"
          >
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <h1 className="text-sm font-semibold text-foreground md:text-base">
              {current?.label ?? "Admin"}
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Logout
          </button>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}