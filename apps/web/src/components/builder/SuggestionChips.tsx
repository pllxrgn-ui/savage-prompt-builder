"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
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
            className={clsx(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-[background-color,color,border-color] duration-150",
              "border cursor-pointer",
              isActive
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
            )}
          >
            {preset}
          </motion.button>
        );
      })}
    </div>
  );
}
