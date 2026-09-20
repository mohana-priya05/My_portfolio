"use client";

import { useState } from "react";
import type { AiTools } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Card, Field, Input, Textarea } from "../ui";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function AiToolsEditor({ initial }: { initial: AiTools }) {
  const [form, setForm] = useState<AiTools>(initial);
  const { saving, save } = useSaveContent("ai-tools");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <div>
      <EditorPageHeader
        title="AI & Development Tools"
        description="The AI-assisted development section. Tools are also referenced in the Skills section."
      />

      <div className="space-y-5">
        <Card title="Section">
          <div className="grid gap-4">
            <Field label="Heading">
              <Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Tools & practices">
          <TagInput
            label="Tools"
            values={form.tools}
            onChange={(tools) => setForm({ ...form, tools })}
            placeholder="Add a tool or practice"
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Order is preserved. Tools cannot be reordered individually here — remove and re-add to reorder.
          </p>
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