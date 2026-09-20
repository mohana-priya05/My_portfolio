import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Sparkles } from "lucide-react";
import type { AiTools } from "@/types/content";

interface AiToolsProps {
  aiTools: AiTools;
}

export function AiToolsSection({ aiTools }: AiToolsProps) {
  return (
    <section id="ai-tools" aria-labelledby="ai-tools-heading" className="scroll-mt-24">
      <div className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Workflow" title={aiTools.heading} id="ai-tools-heading" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="flex h-full flex-col justify-center rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-accent-foreground">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {aiTools.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Used for code generation, debugging, refactoring, architecture exploration,
                documentation, and development productivity.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tools &amp; Practices
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {aiTools.tools.map((tool) => (
                  <li
                    key={tool}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}