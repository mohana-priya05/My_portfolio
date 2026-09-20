"use client";

import { useState } from "react";
import type { Project } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Button, Card, Field, Input, Textarea } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function ProjectsEditor({
  initialHeading,
  initialSubheading,
  initialProjects,
}: {
  initialHeading: string;
  initialSubheading?: string;
  initialProjects: Project[];
}) {
  const [heading, setHeading] = useState(initialHeading);
  const [subheading, setSubheading] = useState(initialSubheading ?? "");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const { saving, save } = useSaveContent("projects");

  const dirty =
    heading !== initialHeading ||
    (subheading ?? "") !== (initialSubheading ?? "") ||
    JSON.stringify(projects) !== JSON.stringify(initialProjects);

  function patch(id: string, patch: Partial<Project>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function move(from: number, to: number) {
    setProjects((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function remove(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    const base = "project";
    let id = base;
    let n = 1;
    while (projects.some((p) => p.id === id)) {
      id = base + n;
      n += 1;
    }
    setProjects((prev) => [
      ...prev,
      {
        id,
        slug: slugify("project" + n),
        name: "",
        shortDescription: "",
        description: "",
        company: "",
        role: "",
        technologies: [],
        responsibilities: [],
        architecture: "",
        achievements: [],
        problem: "",
        solution: "",
        image: "",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        displayOrder: prev.length + 1,
      },
    ]);
  }

  function saveAll() {
    if (dirty) {
      const ordered = projects.map((p, index) => ({
        ...p,
        slug: p.slug || slugify(p.name) || "project-" + (index + 1),
        displayOrder: index + 1,
      }));
      void save({ heading, subheading, projects: ordered });
    }
  }

  return (
    <div>
      <EditorPageHeader
        title="Projects"
        description="Project cards shown on the homepage and detailed pages under /projects/<slug>. Blank GitHub or live URLs are hidden automatically."
      />

      <div className="space-y-5">
        <Card title="Section">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading">
              <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
            </Field>
            <Field label="Subheading">
              <Input value={subheading} onChange={(e) => setSubheading(e.target.value)} />
            </Field>
          </div>
        </Card>

        {projects.map((project, index) => {
          const selected = projects[index];
          return (
            <Card
              key={project.id}
              title={<span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">{project.id}</span>}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {project.name || "Untitled project"}
                  {project.featured ? <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-accent-foreground">Featured</span> : null}
                </p>
                <div className="flex items-center gap-2">
                  {project.slug ? (
                    <a
                      href={"/projects/" + project.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      View
                    </a>
                  ) : null}
                  <RepeaterControls index={index} total={projects.length} onMove={move} onDelete={remove} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project name">
                  <Input
                    value={project.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      patch(project.id, { name, slug: slugify(name) });
                    }}
                  />
                </Field>
                <Field label="Slug" hint="Used for the project URL">
                  <Input value={selected.slug} onChange={(e) => patch(project.id, { slug: slugify(e.target.value) })} />
                </Field>
                <Field label="Company" hint="Optional">
                  <Input value={project.company ?? ""} onChange={(e) => patch(project.id, { company: e.target.value })} />
                </Field>
                <Field label="Role" hint="Optional">
                  <Input value={project.role ?? ""} onChange={(e) => patch(project.id, { role: e.target.value })} />
                </Field>
                <Field label="GitHub URL" hint="Leave empty to hide the button">
                  <Input value={project.githubUrl ?? ""} onChange={(e) => patch(project.id, { githubUrl: e.target.value })} />
                </Field>
                <Field label="Live URL" hint="Leave empty to hide the button">
                  <Input value={project.liveUrl ?? ""} onChange={(e) => patch(project.id, { liveUrl: e.target.value })} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4">
                <Field label="Short description" hint="Shown on the project card">
                  <Textarea rows={2} value={project.shortDescription} onChange={(e) => patch(project.id, { shortDescription: e.target.value })} />
                </Field>
                <Field label="Detailed description" hint="Shown on the project detail page">
                  <Textarea rows={4} value={project.description ?? ""} onChange={(e) => patch(project.id, { description: e.target.value })} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Problem" hint="Optional — hidden when empty">
                  <Textarea rows={3} value={project.problem ?? ""} onChange={(e) => patch(project.id, { problem: e.target.value })} />
                </Field>
                <Field label="Solution" hint="Optional — hidden when empty">
                  <Textarea rows={3} value={project.solution ?? ""} onChange={(e) => patch(project.id, { solution: e.target.value })} />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Architecture" hint="Optional — hidden when empty">
                  <Textarea rows={3} value={project.architecture ?? ""} onChange={(e) => patch(project.id, { architecture: e.target.value })} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <TagInput
                  label="Technologies"
                  values={project.technologies}
                  onChange={(technologies) => patch(project.id, { technologies })}
                  placeholder="Add a technology"
                />
                <TagInput
                  label="Responsibilities"
                  values={project.responsibilities}
                  onChange={(responsibilities) => patch(project.id, { responsibilities })}
                  placeholder="Add a responsibility"
                />
                <TagInput
                  label="Achievements" hint="Optional — hidden when empty"
                  values={project.achievements}
                  onChange={(achievements) => patch(project.id, { achievements })}
                  placeholder="Add an achievement"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-4">
                <div className="min-w-48 flex-1">
                  <Field label="Image path" hint="e.g. /images/mukizh.webp — upload in Settings">
                    <Input value={project.image ?? ""} onChange={(e) => patch(project.id, { image: e.target.value })} />
                  </Field>
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) => patch(project.id, { featured: e.target.checked })}
                    className="h-4 w-4 rounded border-border accent-[var(--primary)]"
                  />
                  Featured
                </label>
              </div>
            </Card>
          );
        })}

        <div>
          <Button type="button" variant="outline" onClick={add}>
            + Add project
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <SaveBar saving={saving} dirty={dirty} onSave={saveAll} />
      </div>
    </div>
  );
}