"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { getMockupConfig } from "@/lib/data";

interface MockupPanelProps {
  templateId: string;
  onMockupChange: (mockup: {
    enabled: boolean;
    item: string;
    color: string;
    display: string;
  }) => void;
}

export function MockupPanel({ templateId, onMockupChange }: MockupPanelProps) {
  const config = getMockupConfig(templateId);
  const [enabled, setEnabled] = useState(false);
  const [item, setItem] = useState("");
  const [color, setColor] = useState("");
  const [display, setDisplay] = useState("");

  if (!config) {
    return (
      <div className="rounded-xl border border-border bg-bg-2 p-6 text-center">
        <p className="text-xs text-text-3">
          Mockup settings are not available for this template type.
        </p>
      </div>
    );
  }

  function toggleEnabled() {
    const next = !enabled;
    setEnabled(next);
    onMockupChange({ enabled: next, item, color, display });
  }

  function handleItem(value: string) {
    setItem(value);
    onMockupChange({ enabled, item: value, color, display });
  }

  function handleColor(value: string) {
    setColor(value);
    onMockupChange({ enabled, item, color: value, display });
  }

  function handleDisplay(value: string) {
    setDisplay(value);
    onMockupChange({ enabled, item, color, display: value });
  }

  const selectClass = clsx(
    "w-full px-3 py-2 rounded-lg text-xs",
    "bg-surface border border-border text-text-1",
    "outline-none focus:border-accent/50 transition-colors",
  );

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-1">{config.label}</h3>
        <button
          onClick={toggleEnabled}
          aria-label="Toggle mockup"
          className={clsx(
            "relative w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer",
            enabled ? "bg-accent" : "bg-border",
          )}
        >
          <div
            className={clsx(
              "absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-[left] duration-200",
              enabled ? "left-5" : "left-0.5",
            )}
          />
        </button>
      </div>

      {enabled && (
        <div className="p-4 space-y-3">
          {config.items.length > 0 && (
            <div>
              <p className="text-[10px] text-text-3 mb-1.5 uppercase tracking-wider font-medium">
                Item
              </p>
              <select
                value={item}
                onChange={(e) => handleItem(e.target.value)}
                aria-label="Mockup item"
                className={selectClass}
              >
                <option value="">Select item...</option>
                {config.items.map((it) => (
                  <option key={it.id} value={it.prompt}>
                    {it.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.colors.length > 0 && (
            <div>
              <p className="text-[10px] text-text-3 mb-1.5 uppercase tracking-wider font-medium">
                Color
              </p>
              <select
                value={color}
                onChange={(e) => handleColor(e.target.value)}
                aria-label="Mockup color"
                className={selectClass}
              >
                <option value="">Color...</option>
                {config.colors.map((c) => (
                  <option key={c.id} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.displays.length > 0 && (
            <div>
              <p className="text-[10px] text-text-3 mb-1.5 uppercase tracking-wider font-medium">
                Display
              </p>
              <select
                value={display}
                onChange={(e) => handleDisplay(e.target.value)}
                aria-label="Mockup display"
                className={selectClass}
              >
                <option value="">Display...</option>
                {config.displays.map((d) => (
                  <option key={d.id} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
