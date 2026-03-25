"use client";

import { clsx } from "clsx";
import { LucideIcon } from "@/components/ui/LucideIcon";
import type { PrintMethod } from "@/lib/data/clothing";

interface PrintMethodCardProps {
  method: PrintMethod;
  isSelected: boolean;
  onSelect: () => void;
}

export function PrintMethodCard({ method, isSelected, onSelect }: PrintMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "w-full text-left p-4 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        isSelected
          ? "bg-accent/10 border-accent/30"
          : "bg-surface border-transparent hover:bg-bg-3 hover:border-glass-border",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            isSelected ? "bg-accent/20" : "bg-bg-3",
          )}
        >
          <LucideIcon name="Printer" className={clsx("w-4 h-4", isSelected ? "text-accent" : "text-text-3")} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={clsx("text-xs font-semibold leading-tight", isSelected ? "text-accent" : "text-text-1")}>
            {method.label}
          </p>
          <p className="text-[11px] text-text-3 mt-0.5 leading-snug">{method.description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
            <span className="text-[10px] text-text-3">
              <span className="text-text-2 font-medium">Best for:</span> {method.bestFor}
            </span>
            <span className="text-[10px] text-text-3">
              <span className="text-text-2 font-medium">Colors:</span> {method.colorLimit}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
