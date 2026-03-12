"use client";

import { useState } from "react";
import { getMockupConfig } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "@/components/ui/LucideIcon";

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
      <div className="border border-glass-border bg-bg-2 p-6 text-center rounded-[var(--radius-lg)]">
        <p className="text-xs text-text-2">
          Mockup settings are not available for this template type.
        </p>
      </div>
    );
  }

  function toggleEnabled(next: boolean) {
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

  return (
    <div className="border border-glass-border bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
        <h3 className="label-section">{config.label}</h3>
        <Switch
          checked={enabled}
          onCheckedChange={toggleEnabled}
          aria-label="Toggle mockup"
        />
      </div>

      {enabled && (
        <div className="p-4 space-y-4">
          {config.items.length > 0 && (
            <div>
              <p className="label-section mb-1.5">Item</p>
              <Select value={item} onValueChange={handleItem}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select item..." />
                </SelectTrigger>
                <SelectContent>
                  {config.items.map((it) => (
                    <SelectItem
                      key={it.id}
                      value={it.prompt}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {it.icon && (
                          <LucideIcon name={it.icon} className="w-3.5 h-3.5 text-text-3 shrink-0" />
                        )}
                        {it.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {config.colors.length > 0 && (
            <div>
              <p className="label-section mb-1.5">Color</p>
              <Select value={color} onValueChange={handleColor}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Color..." />
                </SelectTrigger>
                <SelectContent>
                  {config.colors.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.value}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {c.hex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-glass-border shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                        )}
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {config.displays.length > 0 && (
            <div>
              <p className="label-section mb-1.5">Display</p>
              <Select value={display} onValueChange={handleDisplay}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Display..." />
                </SelectTrigger>
                <SelectContent>
                  {config.displays.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.value}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {d.icon && (
                          <LucideIcon name={d.icon} className="w-3.5 h-3.5 text-text-3 shrink-0" />
                        )}
                        {d.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
