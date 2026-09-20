"use client";

import { useState } from "react";
import type { Mentorship } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Card, Field, Input, Textarea } from "../ui";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function MentorshipEditor({ initial }: { initial: Mentorship }) {
  const [form, setForm] = useState<Mentorship>(initial);
  const { saving, save } = useSaveContent("mentorship");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <div>
      <EditorPageHeader
        title="Training & Mentorship"
        description="Mentorship counts, focus areas, and description."
      />

      <div className="space-y-5">
        <Card title="Section">
          <div className="grid gap-4">
            <Field label="Heading">
              <Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
            </Field>
            <Field label="Summary">
              <Textarea rows={3} value={form.summary ?? ""} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Counts">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Junior developers mentored" hint="e.g. 10">
              <Input
                type="number"
                min={0}
                value={String(form.counts.juniorDevelopers)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    counts: { ...form.counts, juniorDevelopers: Number(e.target.value) || 0 },
                  })
                }
              />
            </Field>
            <Field label="Interns mentored" hint="e.g. 15">
              <Input
                type="number"
                min={0}
                value={String(form.counts.interns)}
                onChange={(e) =>
                  setForm({ ...form, counts: { ...form.counts, interns: Number(e.target.value) || 0 } })
                }
              />
            </Field>
            <Field label="Junior developers label">
              <Input
                value={form.labels.juniorDevelopers}
                onChange={(e) =>
                  setForm({ ...form, labels: { ...form.labels, juniorDevelopers: e.target.value } })
                }
              />
            </Field>
            <Field label="Interns label">
              <Input
                value={form.labels.interns}
                onChange={(e) =>
                  setForm({ ...form, labels: { ...form.labels, interns: e.target.value } })
                }
              />
            </Field>
          </div>
        </Card>

        <Card title="Focus areas">
          <TagInput
            label="Technologies"
            values={form.technologies}
            onChange={(technologies) => setForm({ ...form, technologies })}
            placeholder="Add a focus area"
          />
        </Card>
      </div>

      <div className="mt-6">
        <SaveBar
          saving={saving}
          dirty={dirty}
          onSave={() => {
            if (dirty) void save(form);
          }}
        />
      </div>
    </div>
  );
}