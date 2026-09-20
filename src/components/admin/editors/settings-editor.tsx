"use client";

import { useState } from "react";
import type { Settings } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Card, Field, Input, Textarea } from "../ui";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function SettingsEditor({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial);
  const { saving, save } = useSaveContent("settings");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <div>
      <EditorPageHeader
        title="Settings"
        description="Site metadata, resume config, and admin display text."
      />

      <div className="space-y-5">
        <Card title="Site (SEO & metadata)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page title">
              <Input value={form.site.title} onChange={(e) => setForm({ ...form, site: { ...form.site, title: e.target.value } })} />
            </Field>
            <Field label="Author">
              <Input value={form.site.author} onChange={(e) => setForm({ ...form, site: { ...form.site, author: e.target.value } })} />
            </Field>
            <Field label="Twitter handle" hint="Optional, no @ symbol">
              <Input value={form.site.twitterHandle ?? ""} onChange={(e) => setForm({ ...form, site: { ...form.site, twitterHandle: e.target.value } })} />
            </Field>
            <Field label="Open Graph image URL" hint="Optional, 1200x630 recommended">
              <Input value={form.site.ogImage ?? ""} onChange={(e) => setForm({ ...form, site: { ...form.site, ogImage: e.target.value } })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Meta description">
                <Textarea rows={3} value={form.site.description} onChange={(e) => setForm({ ...form, site: { ...form.site, description: e.target.value } })} />
              </Field>
            </div>
          </div>
          <div className="mt-4">
            <TagInput
              label="Keywords"
              values={form.site.keywords}
              onChange={(keywords) => setForm({ ...form, site: { ...form.site, keywords } })}
              placeholder="Add a keyword"
            />
          </div>
        </Card>

        <Card title="Resume">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="File name" hint="Stored in public/resume/">
              <Input value={form.resume.fileName} onChange={(e) => setForm({ ...form, resume: { ...form.resume, fileName: e.target.value } })} />
            </Field>
            <Field label="Public path" hint="Where the resume is served from">
              <Input value={form.resume.path} onChange={(e) => setForm({ ...form, resume: { ...form.resume, path: e.target.value } })} />
            </Field>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Use the Media manager below to upload or replace the PDF. The resume must live in
            public/resume/ — it is never stored inside JSON.
          </p>
        </Card>

        <Card title="Admin dashboard">
          <div className="grid gap-4">
            <Field label="Dashboard heading">
              <Input value={form.admin.dashboardHeading ?? ""} onChange={(e) => setForm({ ...form, admin: { ...form.admin, dashboardHeading: e.target.value } })} />
            </Field>
            <Field label="Dashboard description">
              <Textarea rows={2} value={form.admin.dashboardDescription ?? ""} onChange={(e) => setForm({ ...form, admin: { ...form.admin, dashboardDescription: e.target.value } })} />
            </Field>
          </div>
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