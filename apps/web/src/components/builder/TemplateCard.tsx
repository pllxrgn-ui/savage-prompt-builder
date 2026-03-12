"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { useBuilderStore } from "@/lib/store";
import type { Template } from "@/types";
import { Badge } from "@/components/ui/badge";

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
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group flex flex-col items-start gap-3 p-4 text-left",
        "bg-bg-2 border border-accent/8",
        "hover:border-accent/30 hover:bg-surface",
        "transition-[border-color,background-color] duration-200 cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9",
          "border border-accent/20 group-hover:border-accent/40 transition-colors",
        )}
      >
        <LucideIcon name={template.icon} className="w-4 h-4 text-accent" />
      </div>
      <div>
        <h3 className="font-mono font-semibold text-[11px] uppercase tracking-wide text-text-1 group-hover:text-accent transition-colors">
          {template.name}
        </h3>
        <p className="font-mono text-[10px] text-text-3 mt-1 line-clamp-2 leading-relaxed">
          {template.description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 mt-auto">
        <Badge variant="outline" className="font-mono text-[9px] text-text-3 border-accent/10 uppercase tracking-wider">
          {template.fields.length} fields
        </Badge>
      </div>
    </motion.button>
  );
}
