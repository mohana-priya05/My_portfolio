"use client";

import { Save } from "lucide-react";
import { Button } from "./ui";

interface SaveBarProps {
  saving: boolean;
  onSave: () => void;
  dirty?: boolean;
}

export function SaveBar({ saving, onSave, dirty }: SaveBarProps) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
      <p className="text-xs text-muted-foreground">
        Changes are validated and committed to GitHub as version-controlled content.
      </p>
      <Button type="button" onClick={onSave} disabled={saving || !dirty}>
        {saving ? (
          <>
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
              aria-hidden="true"
            />
            Saving…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save changes
          </>
        )}
      </Button>
    </div>
  );
}