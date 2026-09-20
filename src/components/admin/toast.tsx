"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  sub?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, sub?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeout = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeout.current.get(id);
    if (handle) clearTimeout(handle);
    timeout.current.delete(id);
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string, sub?: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, message, sub }]);
      const t = setTimeout(() => dismiss(id), 6000);
      timeout.current.set(id, t);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />,
    error: <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />,
    info: <Info className="h-5 w-5 shrink-0 text-sky-500" aria-hidden="true" />,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg"
          >
            {icons[t.type]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{t.message}</p>
              {t.sub ? <p className="mt-0.5 break-words text-xs text-muted-foreground">{t.sub}</p> : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}