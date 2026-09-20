import { AlertTriangle, FileJson2 } from "lucide-react";

export function ContentError({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {title}
            <FileJson2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </h2>
          <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Fix the JSON or validation error in the content file, then reload this page.
          </p>
        </div>
      </div>
    </div>
  );
}