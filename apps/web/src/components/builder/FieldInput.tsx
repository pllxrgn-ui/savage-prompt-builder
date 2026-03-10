"use client";

import { clsx } from "clsx";
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
        className={clsx(
          "w-full px-3 py-2.5 rounded-lg text-sm",
          "bg-bg-input border border-border",
          "text-text-1 placeholder:text-text-3",
          "focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
          "transition-all duration-150",
        )}
      />
      <SuggestionChips templateId={templateId} fieldId={field.id} />
    </div>
  );
}
