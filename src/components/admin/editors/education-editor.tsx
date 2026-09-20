"use client";

import { useState } from "react";
import type { EducationEntry } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Button, Card, Field, Input, Textarea } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { EditorPageHeader } from "../editor-page-header";

export function EducationEditor({
  initialHeading,
  initialEntries,
}: {
  initialHeading: string;
  initialEntries: EducationEntry[];
}) {
  const [heading, setHeading] = useState(initialHeading);
  const [entries, setEntries] = useState<EducationEntry[]>(initialEntries);
  const { saving, save } = useSaveContent("education");
  const dirty =
    heading !== initialHeading || JSON.stringify(entries) !== JSON.stringify(initialEntries);

  function patch(id: string, patch: Partial<EducationEntry>) {
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
    const base = "education";
    let id = base;
    let n = 1;
    while (entries.some((e) => e.id === id)) {
      id = base + n;
      n += 1;
    }
    setEntries((prev) => [
      ...prev,
      { id, degree: "", field: "", institution: "", location: "", startDate: "", endDate: "", description: "" },
    ]);
  }

  return (
    <div>
      <EditorPageHeader
        title="Education"
        description="Degrees, certifications, and coursework."
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
              <p className="text-sm font-medium text-foreground">{entry.degree || "Untitled entry"}</p>
              <RepeaterControls index={index} total={entries.length} onMove={move} onDelete={remove} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Degree">
                <Input value={entry.degree} onChange={(e) => patch(entry.id, { degree: e.target.value })} />
              </Field>
              <Field label="Field of study" hint="Optional">
                <Input value={entry.field ?? ""} onChange={(e) => patch(entry.id, { field: e.target.value })} />
              </Field>
              <Field label="Institution">
                <Input value={entry.institution} onChange={(e) => patch(entry.id, { institution: e.target.value })} />
              </Field>
              <Field label="Location" hint="Optional">
                <Input value={entry.location ?? ""} onChange={(e) => patch(entry.id, { location: e.target.value })} />
              </Field>
              <Field label="Start year" hint="e.g. 2021">
                <Input value={entry.startDate ?? ""} onChange={(e) => patch(entry.id, { startDate: e.target.value })} />
              </Field>
              <Field label="End year" hint="e.g. 2024">
                <Input value={entry.endDate ?? ""} onChange={(e) => patch(entry.id, { endDate: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description" hint="Optional">
                <Textarea rows={3} value={entry.description ?? ""} onChange={(e) => patch(entry.id, { description: e.target.value })} />
              </Field>
            </div>
          </Card>
        ))}

        <div>
          <Button type="button" variant="outline" onClick={add}>
            + Add education
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