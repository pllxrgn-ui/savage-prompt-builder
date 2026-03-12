"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import { getPresetsForField } from "@/lib/data";

interface SuggestionChipsProps {
  templateId: string;
  fieldId: string;
}

export function SuggestionChips({ templateId, fieldId }: SuggestionChipsProps) {
  const setField = useBuilderStore((s) => s.setField);
  const currentValue = useBuilderStore((s) => s.templateFields[fieldId] ?? "");
  const presets = getPresetsForField(templateId, fieldId);

  if (presets.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {presets.map((preset, index) => {
        const isActive = currentValue === preset;
        return (
          <motion.button
            key={preset}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setField(fieldId, isActive ? "" : preset)}
            className={cn(
              "px-2.5 py-1 text-[10px] font-medium transition-[background-color,color,border-color] duration-150",
              "border cursor-pointer rounded-full",
              isActive
                ? "bg-accent text-black border-accent"
                : "bg-surface text-text-3 border-accent/10 hover:text-text-2 hover:border-accent/30",
            )}
          >
            {preset}
          </motion.button>
        );
      })}
    </div>
  );
}
