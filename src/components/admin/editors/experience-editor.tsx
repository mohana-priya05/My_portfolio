"use client";

import { useState } from "react";
import type { ExperienceEntry } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Button, Card, Field, Input, Textarea } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function ExperienceEditor({
  initialHeading,
  initialEntries,
}: {
  initialHeading: string;
  initialEntries: ExperienceEntry[];
}) {
  const [heading, setHeading] = useState(initialHeading);
  const [entries, setEntries] = useState<ExperienceEntry[]>(initialEntries);
  const { saving, save } = useSaveContent("experience");
  const dirty =
    heading !== initialHeading || JSON.stringify(entries) !== JSON.stringify(initialEntries);

  function patch(id: string, patch: Partial<ExperienceEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function move(from: number, to: number) {
    setEntries((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function remove(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    const base = "experience";
    let id = base;
    let n = 1;
    while (entries.some((e) => e.id === id)) {
      id = base + n;
      n += 1;
    }
    setEntries((prev) => [
      ...prev,
      { id, company: "", role: "", logo: "", location: "", startDate: "", endDate: "", current: false, displayOrder: prev.length + 1, summary: "", technologies: [], highlights: [], responsibilities: [] },
    ]);
  }

  return (
    <div>
      <EditorPageHeader
        title="Experience"
        description="Timeline entries for overall role contributions. Add company logo path and display order; dates, company, and current status can be empty until known — they are hidden when blank."
      />

      <div className="space-y-5">
        <Card title="Section">
          <Field label="Heading">
            <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
          </Field>
        </Card>

        {entries.map((entry, index) => (
          <Card
            key={entry.id}
            title={<span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">{entry.id}</span>}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{entry.role || "Untitled role"}</p>
              <RepeaterControls
                index={index}
                total={entries.length}
                onMove={move}
                onDelete={remove}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role">
                <Input value={entry.role} onChange={(e) => patch(entry.id, { role: e.target.value })} />
              </Field>
              <Field label="Company" hint="Leave empty until known">
                <Input value={entry.company} onChange={(e) => patch(entry.id, { company: e.target.value })} />
              </Field>
              <Field label="Company logo path" hint="e.g. /officeImg/image.png. Upload in Media manager.">
                <Input value={entry.logo ?? ""} onChange={(e) => patch(entry.id, { logo: e.target.value })} />
              </Field>
              <Field label="Location">
                <Input value={entry.location ?? ""} onChange={(e) => patch(entry.id, { location: e.target.value })} />
              </Field>
              <Field label="Display order" hint="Lower numbers appear first">
                <Input
                  type="number"
                  min={0}
                  value={String(entry.displayOrder ?? 0)}
                  onChange={(e) => patch(entry.id, { displayOrder: Math.max(0, Number(e.target.value) || 0) })}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Start date" hint="e.g. Jan 2024">
                  <Input value={entry.startDate ?? ""} onChange={(e) => patch(entry.id, { startDate: e.target.value })} />
                </Field>
                <Field label="End date" hint="Ignored when Current is on">
                  <Input value={entry.endDate ?? ""} onChange={(e) => patch(entry.id, { endDate: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(entry.current)}
                  onChange={(e) => patch(entry.id, { current: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-[var(--primary)]"
                />
                Current role
              </label>
            </div>
            <div className="mt-4">
              <Field label="Summary">
                <Textarea rows={3} value={entry.summary ?? ""} onChange={(e) => patch(entry.id, { summary: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TagInput
                label="Technologies"
                values={entry.technologies}
                onChange={(technologies) => patch(entry.id, { technologies })}
                placeholder="Add a technology"
              />
              <TagInput
                label="Key highlights"
                values={entry.highlights ?? []}
                onChange={(highlights) => patch(entry.id, { highlights })}
                placeholder="Add a highlight (e.g. 10+ Releases)"
              />
            </div>
            <div className="mt-4">
              <TagInput
                label="Overall responsibilities & contributions"
                values={entry.responsibilities}
                onChange={(responsibilities) => patch(entry.id, { responsibilities })}
                placeholder="Add a responsibility"
              />
            </div>
          </Card>
        ))}

        <div>
          <Button type="button" variant="outline" onClick={add}>
            + Add experience
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <SaveBar
          saving={saving}
          dirty={dirty}
          onSave={() => {
            if (dirty) void save({ heading, entries });
          }}
        />
      </div>
    </div>
  );
}