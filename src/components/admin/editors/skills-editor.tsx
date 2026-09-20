"use client";

import { useState } from "react";
import type { SkillCategory } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Button, Card, Field, Input } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { TagInput } from "../tag-input";
import { EditorPageHeader } from "../editor-page-header";

export function SkillsEditor({
  initialHeading,
  initialCategories,
}: {
  initialHeading: string;
  initialCategories: SkillCategory[];
}) {
  const [heading, setHeading] = useState(initialHeading);
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const { saving, save } = useSaveContent("skills");
  const dirty =
    heading !== initialHeading || JSON.stringify(categories) !== JSON.stringify(initialCategories);

  function patchCategory(id: string, patch: Partial<SkillCategory>) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function moveCategory(from: number, to: number) {
    setCategories((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function removeCategory(index: number) {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }

  function addCategory() {
    const base = "category";
    let id = base;
    let n = 1;
    while (categories.some((c) => c.id === id)) {
      id = base + n;
      n += 1;
    }
    setCategories((prev) => [...prev, { id, name: "New Category", skills: [] }]);
  }

  return (
    <div>
      <EditorPageHeader
        title="Skills"
        description="Skill groups rendered as cards. The AI & Development Tools group is managed on the AI & Tools page."
      />

      <div className="space-y-5">
        <Card title="Section">
          <Field label="Heading">
            <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
          </Field>
        </Card>

        {categories.map((category, index) => (
          <Card
            key={category.id}
            title={<span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category.id}</span>}
            description=""
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <Field label="Category name">
                <Input
                  value={category.name}
                  onChange={(e) => patchCategory(category.id, { name: e.target.value })}
                />
              </Field>
              <div className="pt-6">
                <RepeaterControls
                  index={index}
                  total={categories.length}
                  onMove={moveCategory}
                  onDelete={removeCategory}
                />
              </div>
            </div>
            <TagInput
              label="Skills"
              values={category.skills}
              onChange={(skills) => patchCategory(category.id, { skills })}
              placeholder="Add a skill and press Enter"
            />
          </Card>
        ))}

        <div>
          <Button type="button" variant="outline" onClick={addCategory}>
            + Add category
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <SaveBar
          saving={saving}
          dirty={dirty}
          onSave={() => {
            if (dirty) void save({ heading, categories });
          }}
        />
      </div>
    </div>
  );
}