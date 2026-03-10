"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { getMockupConfig } from "@/lib/data";

interface MockupPanelProps {
  templateId: string;
  onMockupChange: (layers: Record<string, string>) => void;
}

export function MockupPanel({ templateId, onMockupChange }: MockupPanelProps) {
  const config = getMockupConfig(templateId);
  const [selections, setSelections] = useState<Record<string, string>>({});

  if (!config) return null;

  function handleSelect(layerId: string, option: string) {
    const next = { ...selections, [layerId]: option };
    setSelections(next);
    onMockupChange(next);
  }

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-1">Mockup Settings</h3>
      </div>
      <div className="p-4 space-y-4">
        {config.layers.map((layer) => (
          <div key={layer.id}>
            <p className="text-[10px] text-text-3 mb-2 uppercase tracking-wider font-medium">
              {layer.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {layer.options.map((option) => {
                const isSelected = selections[layer.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(layer.id, option)}
                    className={clsx(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150",
                      "border cursor-pointer",
                      isSelected
                        ? "bg-accent/15 text-accent border-accent/30"
                        : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
