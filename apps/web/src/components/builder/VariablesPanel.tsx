"use client";

import { useState } from "react";
import { Variable, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

export function VariablesPanel() {
  const variables = useBuilderStore((s) => s.variables);
  const setVariable = useBuilderStore((s) => s.setVariable);
  const removeVariable = useBuilderStore((s) => s.removeVariable);
  const [expanded, setExpanded] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const entries = Object.entries(variables);

  function handleAdd() {
    const key = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    if (!key || !newValue.trim()) return;
    setVariable(key, newValue.trim());
    setNewKey("");
    setNewValue("");
  }

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-bg-3 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-text-3" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-text-3" />
        )}
        <Variable className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-text-1">Variables</span>
        {entries.length > 0 && (
          <span className="ml-auto text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
            {entries.length}
          </span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-[10px] text-text-3">
            Add tokens like {"{BRAND}"} in your fields. They&apos;ll be replaced in the final prompt.
          </p>

          {/* Existing variables */}
          {entries.length > 0 && (
            <div className="space-y-1.5">
              {entries.map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 group">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded shrink-0">
                    {`{${key}}`}
                  </span>
                  <span className="text-xs text-text-3">=</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setVariable(key, e.target.value)}
                    aria-label={`Value for ${key}`}
                    className="flex-1 min-w-0 bg-bg-1 border border-border rounded px-2 py-1 text-xs text-text-1 outline-none focus:border-accent/50"
                  />
                  <button
                    onClick={() => removeVariable(key)}
                    className="flex items-center justify-center w-5 h-5 rounded text-text-3 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Remove variable ${key}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new variable */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="TOKEN"
              className="w-24 bg-bg-1 border border-border rounded px-2 py-1 text-xs text-text-1 font-mono placeholder:text-text-3 outline-none focus:border-accent/50"
            />
            <span className="text-xs text-text-3">=</span>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="Value"
              className="flex-1 min-w-0 bg-bg-1 border border-border rounded px-2 py-1 text-xs text-text-1 placeholder:text-text-3 outline-none focus:border-accent/50"
            />
            <button
              onClick={handleAdd}
              disabled={!newKey.trim() || !newValue.trim()}
              className={clsx(
                "flex items-center justify-center w-6 h-6 rounded transition-colors",
                newKey.trim() && newValue.trim()
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-surface text-text-3 cursor-not-allowed",
              )}
              aria-label="Add variable"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
