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
    <div className="space-y-1.5">
      <label
        htmlFor={`field-${field.id}`}
        className="flex items-center gap-1.5 text-xs font-medium text-text-2"
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
          "w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)]",
          "bg-bg-input border border-white/[0.06]",
          "text-text-1 placeholder:text-text-3",
          "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20",
          "transition-all duration-150",
        )}
      />
      <SuggestionChips templateId={templateId} fieldId={field.id} />
    </div>
  );
}
