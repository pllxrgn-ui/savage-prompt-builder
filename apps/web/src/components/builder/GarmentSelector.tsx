"use client";

import { Moon, Sun } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

const OPTIONS = [
  { value: "dark" as const, label: "Dark Garment", icon: Moon, hint: "Light/neon colors on dark fabric" },
  { value: "light" as const, label: "Light Garment", icon: Sun, hint: "Dark/saturated colors on light fabric" },
] as const;

export function GarmentSelector() {
  const garmentMode = useBuilderStore((s) => s.garmentMode);
  const setGarmentMode = useBuilderStore((s) => s.setGarmentMode);

  return (
    <div className="border border-accent/8 bg-bg-2 p-4 rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-medium text-text-2 uppercase tracking-wider">Garment Type</h3>
        {garmentMode && (
          <button
            onClick={() => setGarmentMode(null)}
            className="text-[10px] text-text-3 hover:text-accent transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {OPTIONS.map(({ value, label, icon: Icon, hint }) => {
          const isActive = garmentMode === value;
          return (
            <button
              key={value}
              onClick={() => setGarmentMode(isActive ? null : value)}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1.5 px-3 py-3 text-xs font-medium",
                "border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)]",
                isActive
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-surface border-transparent text-text-2 hover:bg-bg-3 hover:text-text-1",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              <span className={clsx("text-[10px]", isActive ? "text-accent/70" : "text-text-3")}>
                {hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
