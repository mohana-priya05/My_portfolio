"use client";

import { useState } from "react";
import type { Hero } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Card, Field, Input, Textarea } from "../ui";
import { EditorPageHeader } from "../editor-page-header";

export function HeroEditor({ initial }: { initial: Hero }) {
  const [form, setForm] = useState<Hero>(initial);
  const { saving, save } = useSaveContent("hero");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function set<K extends keyof Hero>(key: K, value: Hero[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <EditorPageHeader
        title="Hero"
        description="The first thing visitors see. Keep it short and sharp."
      />
      <div className="space-y-5">
        <Card title="Text">
          <div className="grid gap-4">
            <Field label="Profile photo" hint="Optional. Public path, e.g. /profilePhoto/image.png">
              <Input value={form.photo ?? ""} onChange={(e) => set("photo", e.target.value)} />
            </Field>
            <Field label="Badge" hint="Optional small label above the heading">
              <Input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} />
            </Field>
            <Field label="Heading">
              <Input value={form.heading} onChange={(e) => set("heading", e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <Textarea rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Call to action buttons">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button label">
              <Input
                value={form.primaryCta.label}
                onChange={(e) => set("primaryCta", { ...form.primaryCta, label: e.target.value })}
              />
            </Field>
            <Field label="Primary button link" hint="Use #projects or an external URL">
              <Input
                value={form.primaryCta.href}
                onChange={(e) => set("primaryCta", { ...form.primaryCta, href: e.target.value })}
              />
            </Field>
            <Field label="Secondary button label">
              <Input
                value={form.secondaryCta.label}
                onChange={(e) => set("secondaryCta", { ...form.secondaryCta, label: e.target.value })}
              />
            </Field>
            <Field label="Secondary button link" hint="Use #contact or an external URL">
              <Input
                value={form.secondaryCta.href}
                onChange={(e) => set("secondaryCta", { ...form.secondaryCta, href: e.target.value })}
              />
            </Field>
            <Field label="Resume button label">
              <Input
                value={form.resumeCtaLabel}
                onChange={(e) => set("resumeCtaLabel", e.target.value)}
              />
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