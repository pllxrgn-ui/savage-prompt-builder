"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

export interface Pill {
  id: string;
  label: string;
  type: "selected" | "custom";
}

interface PillTagInputProps {
  pills: Pill[];
  onRemove: (pill: Pill) => void;
  onAddCustom?: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function PillTagInput({
  pills,
  onRemove,
  onAddCustom,
  placeholder = "Type and press Enter…",
  className,
}: PillTagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim() && onAddCustom) {
        e.preventDefault();
        const trimmed = inputValue.trim();
        // Prevent duplicates
        const exists = pills.some(
          (p) => p.label.toLowerCase() === trimmed.toLowerCase(),
        );
        if (!exists) {
          onAddCustom(trimmed);
        }
        setInputValue("");
      }
      // Backspace on empty input removes last pill
      if (e.key === "Backspace" && !inputValue && pills.length > 0) {
        onRemove(pills[pills.length - 1]);
      }
    },
    [inputValue, onAddCustom, onRemove, pills],
  );

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-1.5 min-h-[36px] px-2.5 py-1.5",
        "bg-bg-input border border-glass-border rounded-[var(--radius-md)]",
        "focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent",
        "transition-colors duration-150 cursor-text",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {pills.map((pill) => (
        <span
          key={`${pill.type}-${pill.id}`}
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
            "transition-colors duration-150 select-none",
            pill.type === "selected"
              ? "bg-accent/15 text-accent border border-accent/25"
              : "bg-accent2/15 text-accent2 border border-accent2/25",
          )}
        >
          <span className="max-w-[120px] truncate">{pill.label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(pill);
            }}
            className="shrink-0 hover:bg-white/10 rounded-full p-0.5 transition-colors duration-150 cursor-pointer"
            aria-label={`Remove ${pill.label}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      {onAddCustom && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={pills.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] bg-transparent text-text-1 text-xs placeholder:text-text-3 outline-none"
        />
      )}
    </div>
  );
}
