"use client";

import { useState } from "react";
import type { SocialLink, SocialLinks } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Button, Card, Field, Input } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { EditorPageHeader } from "../editor-page-header";

export function SocialLinksEditor({ initial }: { initial: SocialLinks }) {
  const [form, setForm] = useState<SocialLinks>(initial);
  const { saving, save } = useSaveContent("social-links");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function patchLink(id: string, patch: Partial<SocialLink>) {
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  function move(from: number, to: number) {
    setForm((prev) => {
      const next = [...prev.links];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, links: next };
    });
  }

  function remove(index: number) {
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  }

  function add() {
    const base = "link";
    let id = base;
    let n = 1;
    while (form.links.some((l) => l.id === id)) {
      id = base + n;
      n += 1;
    }
    setForm((prev) => ({ ...prev, links: [...prev.links, { id, label: "", url: "" }] }));
  }

  return (
    <div>
      <EditorPageHeader
        title="Social Links"
        description="Social profiles used in the navbar and footer."
      />

      <div className="space-y-5">
        <Card title="Primary contacts">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="LinkedIn URL" hint="Optional">
              <Input value={form.linkedin ?? ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </Field>
            <Field label="GitHub URL" hint="Optional">
              <Input value={form.github ?? ""} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Additional links" description="Extra social profiles shown in the footer.">
          {form.links.map((link, index) => (
            <div key={link.id} className="mb-4 grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Label" hint="e.g. Portfolio">
                  <Input value={link.label} onChange={(e) => patchLink(link.id, { label: e.target.value })} />
                </Field>
                <Field label="URL">
                  <Input value={link.url} onChange={(e) => patchLink(link.id, { url: e.target.value })} />
                </Field>
              </div>
              <RepeaterControls index={index} total={form.links.length} onMove={move} onDelete={remove} />
            </div>
          ))}
          <div>
            <Button type="button" variant="outline" onClick={add}>
              + Add link
            </Button>
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