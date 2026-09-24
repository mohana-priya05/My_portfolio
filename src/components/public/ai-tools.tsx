import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Sparkles } from "lucide-react";
import type { AiTools } from "@/types/content";

interface AiToolsProps {
  aiTools: AiTools;
}

export function AiToolsSection({ aiTools }: AiToolsProps) {
  return (
    <section id="ai-tools" aria-labelledby="ai-tools-heading" className="scroll-mt-24 bg-section">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Workflow" title={aiTools.heading} id="ai-tools-heading" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-7 shadow-soft">
              <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-soft">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {aiTools.description}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Used for code generation, debugging, refactoring, architecture exploration,
                documentation, and development productivity.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tools &amp; Practices
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {aiTools.tools.map((tool) => (
                  <li
                    key={tool}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:border-primary/30"
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