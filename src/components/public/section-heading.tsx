interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, id }: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16" id={id}>
      {eyebrow ? (
        <p className="mb-3 inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}