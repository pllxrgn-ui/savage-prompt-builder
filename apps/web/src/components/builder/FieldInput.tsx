"use client";

import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import { SuggestionChips } from "./SuggestionChips";
import type { TemplateField } from "@/types";

interface FieldInputProps {
  field: TemplateField;
  templateId: string;
}

export function FieldInput({ field, templateId }: FieldInputProps) {
  const value = useBuilderStore((s) => s.templateFields[field.id] ?? "");
  const setField = useBuilderStore((s) => s.setField);

  return (
    <div className="space-y-1">
      <label
        htmlFor={`field-${field.id}`}
        className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-text-3 uppercase tracking-[0.15em]"
      >
        {field.label}
        {field.required && <span className="text-accent">*</span>}
      </label>
      <input
        id={`field-${field.id}`}
        type="text"
        value={value}
        onChange={(e) => setField(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={cn(
          "w-full px-3 py-2.5 text-sm font-mono",
          "bg-bg-input border border-accent/8",
          "text-text-1 placeholder:text-text-3 placeholder:font-mono",
          "focus:outline-none focus:border-accent/40",
          "transition-all duration-150",
        )}
      />
      <SuggestionChips templateId={templateId} fieldId={field.id} />
    </div>
  );
}
