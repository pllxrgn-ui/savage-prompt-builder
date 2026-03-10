"use client";

import { clsx } from "clsx";
import { Check } from "lucide-react";
import { useSettingsStore } from "@/lib/store";
import { ACCENTS } from "@/lib/data";
import type { AccentId } from "@/types";

export function AccentPicker() {
  const currentAccent = useSettingsStore((s) => s.accent);
  const setAccent = useSettingsStore((s) => s.setAccent);

  return (
    <div className="flex flex-wrap gap-2">
      {ACCENTS.map((accent) => (
        <button
          key={accent.id}
          onClick={() => setAccent(accent.id as AccentId)}
          className={clsx(
            "relative w-8 h-8 rounded-full transition-all duration-200",
            "ring-2 ring-offset-2 ring-offset-bg-base",
            currentAccent === accent.id
              ? "ring-white/30 scale-110"
              : "ring-transparent hover:ring-white/10 hover:scale-105",
          )}
          style={{ backgroundColor: accent.color }}
          aria-label={`Set accent to ${accent.label}`}
        >
          {currentAccent === accent.id && (
            <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
          )}
        </button>
      ))}
    </div>
  );
}
