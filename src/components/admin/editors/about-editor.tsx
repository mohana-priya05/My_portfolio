"use client";

import { useMemo, useState } from "react";
import type { About, Statistic } from "@/types/content";
import { useSaveContent } from "../use-save-content";
import { SaveBar } from "../save-bar";
import { Card, Field, Input, Textarea } from "../ui";
import { RepeaterControls } from "../repeater-controls";
import { EditorPageHeader } from "../editor-page-header";
import { TagInput } from "../tag-input";

export function AboutEditor({
  initialAbout,
  initialStatistics,
}: {
  initialAbout: About;
  initialStatistics: Statistic[];
}) {
  const [about, setAbout] = useState<About>(initialAbout);
  const [statistics, setStatistics] = useState<Statistic[]>(initialStatistics);
  const saveAbout = useSaveContent("about");
  const saveStatistics = useSaveContent("statistics");

  const dirtyAbout = JSON.stringify(about) !== JSON.stringify(initialAbout);
  const dirtyStats =
    JSON.stringify([...statistics].sort((a, b) => a.id.localeCompare(b.id))) !==
    JSON.stringify(initialStatistics);
  const saving = saveAbout.saving || saveStatistics.saving;
  const labelStats = useMemo(() => new Set(statistics.map((s) => s.label.toLowerCase())), [statistics]);

  async function saveAll() {
    const results: boolean[] = [];
    if (dirtyAbout) results.push(await saveAbout.save(about));
    if (dirtyStats) results.push(await saveStatistics.save({ statistics }));
    if (results.every(Boolean)) return;
  }

  function moveStat(from: number, to: number) {
    setStatistics((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function removeStat(index: number) {
    setStatistics((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <EditorPageHeader
        title="About"
        description="About section summary, body copy, and the statistics cards shown beside it."
      />

      <div className="space-y-5">
        <Card title="About copy">
          <div className="grid gap-4">
            <Field label="Heading">
              <Input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
            </Field>
            <Field label="Summary">
              <Textarea rows={4} value={about.summary} onChange={(e) => setAbout({ ...about, summary: e.target.value })} />
            </Field>
            <Field label="Body" hint="Optional longer paragraph">
              <Textarea rows={4} value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Statistics" description="Shown as cards in the About section.">
          <div className="space-y-4">
            {statistics.map((stat, index) => (
              <div key={stat.id} className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{stat.id}</span>
                  <RepeaterControls
                    index={index}
                    total={statistics.length}
                    onMove={moveStat}
                    onDelete={removeStat}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Value" hint="e.g. 2+">
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        setStatistics((prev) =>
                          prev.map((s) => (s.id === stat.id ? { ...s, value: e.target.value } : s)),
                        )
                      }
                    />
                  </Field>
                  <Field label="Label">
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        setStatistics((prev) =>
                          prev.map((s) => (s.id === stat.id ? { ...s, label: e.target.value } : s)),
                        )
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TagInput
              label="Quick add a new statistic (value:label)"
              values={[]}
              onChange={(entries) => {
                for (const entry of entries) {
                  const [value, ...rest] = entry.split(":");
                  const label = rest.join(":").trim();
                  if (labelStats.has(label.toLowerCase())) continue;
                  const base = "stat";
                  let id = base;
                  let n = 1;
                  while (statistics.some((s) => s.id === id)) {
                    id = base + n;
                    n += 1;
                  }
                  setStatistics((prev) => [...prev, { id, value: (value ?? "").trim(), label }]);
                }
              }}
              placeholder='e.g. "10: Awards"—press Enter'
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <SaveBar saving={saving} dirty={dirtyAbout || dirtyStats} onSave={() => void saveAll()} />
      </div>
    </div>
  );
}