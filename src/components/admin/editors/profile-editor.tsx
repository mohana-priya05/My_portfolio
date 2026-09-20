"use client";

import { useState } from "react";
import type { Profile } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Field, Input, Textarea, Card } from "../ui";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function ProfileEditor({ initial }: { initial: Profile }) {
  const [form, setForm] = useState<Profile>(initial);
  const { saving, save } = useSaveContent("profile");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <EditorPageHeader
        title="Profile"
        description="Core identity and professional summary. Used across the site, footer, and SEO."
      />
      <div className="space-y-5">
        <Card title="Identity">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Short name (navbar/footer)">
              <Input value={form.shortName} onChange={(e) => set("shortName", e.target.value)} />
            </Field>
            <Field label="Title">
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Experience (e.g. 2+)">
              <Input value={form.experienceYears ?? ""} onChange={(e) => set("experienceYears", e.target.value)} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="LinkedIn URL" hint="Optional">
              <Input value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} />
            </Field>
            <Field label="GitHub URL" hint="Optional">
              <Input value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Summary">
          <Field label="Professional summary">
            <Textarea
              rows={4}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
        </Card>

        <Card title="Highlights">
          <TagInput
            label="Highlights"
            values={form.highlights}
            onChange={(v) => set("highlights", v)}
            placeholder="Add a highlight and press Enter"
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