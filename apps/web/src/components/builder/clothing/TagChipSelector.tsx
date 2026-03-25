"use client";

import { clsx } from "clsx";

interface TagChipSelectorProps<T extends { id: string; label: string }> {
  items: readonly T[];
  selected: string[];
  onToggle: (id: string) => void;
  max?: number;
  size?: "sm" | "md";
}

export function TagChipSelector<T extends { id: string; label: string }>({
  items,
  selected,
  onToggle,
  max,
  size = "sm",
}: TagChipSelectorProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const isSelected = selected.includes(item.id);
        const isDisabled = !isSelected && max !== undefined && selected.length >= max;
        return (
          <button
            key={item.id}
            onClick={() => !isDisabled && onToggle(item.id)}
            disabled={isDisabled}
            className={clsx(
              "font-medium transition-all duration-150 border cursor-pointer rounded-full",
              size === "sm" && "px-2.5 py-1 text-[11px]",
              size === "md" && "px-3 py-1.5 text-xs",
              isSelected
                ? "bg-accent/15 text-accent border-accent/30"
                : isDisabled
                  ? "bg-surface text-text-3/40 border-transparent cursor-not-allowed"
                  : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
