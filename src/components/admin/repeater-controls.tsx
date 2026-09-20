"use client";

import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "./ui";

interface RepeaterControlsProps {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onDelete: (index: number) => void;
}

export function RepeaterControls({
  index,
  total,
  onMove,
  onDelete,
}: RepeaterControlsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Move up"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete item?"
        description="This item will be removed. Save the page to persist the change to GitHub."
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete(index);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}