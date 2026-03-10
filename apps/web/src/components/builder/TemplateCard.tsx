"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { useBuilderStore } from "@/lib/store";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const setTemplate = useBuilderStore((s) => s.setTemplate);

  function handleClick() {
    setTemplate(template.id);
    router.push("/builder");
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={clsx(
        "group flex flex-col items-start gap-3 p-4 rounded-xl text-left",
        "bg-bg-2 border border-border",
        "hover:border-accent/30 hover:bg-bg-3",
        "transition-[border-color,background-color] duration-200 cursor-pointer",
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          "bg-accent/10 group-hover:bg-accent/20 transition-colors",
        )}
      >
        <LucideIcon name={template.icon} className="w-5 h-5 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-sm text-text-1 group-hover:text-accent transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-text-3 mt-0.5 line-clamp-2">
          {template.description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 mt-auto">
        <span className="text-[10px] text-text-3 bg-surface px-2 py-0.5 rounded-full">
          {template.fields.length} fields
        </span>
      </div>
    </motion.button>
  );
}
