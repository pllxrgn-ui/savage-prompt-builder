"use client";

import { useUIStore } from "@/lib/store";
import { clsx } from "clsx";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
} as const;

export function ToastProvider() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
              "bg-bg-2 border border-border text-text-1",
              "animate-[slideIn_0.3s_ease-out]",
            )}
          >
            <Icon
              className={clsx("w-4 h-4 shrink-0", {
                "text-success": toast.type === "success",
                "text-accent": toast.type === "error",
                "text-info": toast.type === "info",
              })}
            />
            <span className="text-sm flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-text-3 hover:text-text-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
