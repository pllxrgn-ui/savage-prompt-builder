"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore, useUIStore } from "@/lib/store";
import type { UIStore } from "@/types";

export function AISuggestButton() {
  const activeTemplateId = useBuilderStore((s) => s.activeTemplateId);
  const templateFields = useBuilderStore((s) => s.templateFields);
  const setField = useBuilderStore((s) => s.setField);
  const addToast = useUIStore((s: UIStore) => s.addToast);

  const [loading, setLoading] = useState(false);

  async function handleSuggest() {
    if (!activeTemplateId || loading) return;

    const filledFields: Record<string, string> = {};
    const emptyFields: string[] = [];

    for (const [key, value] of Object.entries(templateFields)) {
      if (value.trim()) {
        filledFields[key] = value;
      } else {
        emptyFields.push(key);
      }
    }

    if (emptyFields.length === 0) {
      addToast({ message: "All fields are filled — nothing to suggest", type: "info" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: activeTemplateId,
          filledFields,
          emptyFields,
        }),
      });

      if (!response.ok) throw new Error("Failed to get suggestions");

      const data = await response.json();
      const suggestions = data.result as Record<string, string>;

      let filled = 0;
      for (const [field, value] of Object.entries(suggestions)) {
        if (value && emptyFields.includes(field)) {
          setField(field, value);
          filled++;
        }
      }

      addToast({
        message: filled > 0 ? `Filled ${filled} field${filled > 1 ? "s" : ""} with AI suggestions` : "No suggestions available",
        type: filled > 0 ? "success" : "info",
      });
    } catch {
      addToast({ message: "AI suggest unavailable — check API key", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSuggest}
      disabled={loading || !activeTemplateId}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer",
        "bg-accent2/15 text-accent2 hover:bg-accent2/25 border border-accent2/20",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/50",
      )}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {loading ? "Suggesting…" : "AI Suggest"}
    </button>
  );
}
