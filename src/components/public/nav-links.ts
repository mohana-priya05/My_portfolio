export interface NavLink {
  label: string;
  href: string;
  section: string;
}

// All nav items point to homepage anchors so the same navigation works from
// any page (e.g. project detail pages) via cross-page hash navigation.
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/#home", section: "home" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Skills", href: "/#skills", section: "skills" },
  { label: "Experience", href: "/#experience", section: "experience" },
  { label: "Projects", href: "/#projects", section: "projects" },
  { label: "Education", href: "/#education", section: "education" },
  { label: "AI & Tools", href: "/#ai-tools", section: "ai-tools" },
  { label: "Contact", href: "/#contact", section: "contact" },
];