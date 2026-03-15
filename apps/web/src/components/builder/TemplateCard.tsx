"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { useBuilderStore } from "@/lib/store";
import type { Template } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CardAccent {
  text: string;
  bg: string;
  bgHover: string;
  border: string;
  titleHover: string;
}

interface TemplateCardProps {
  template: Template;
  accent?: CardAccent;
}

const defaultAccent: CardAccent = {
  text: "text-accent",
  bg: "bg-accent/10",
  bgHover: "group-hover:bg-accent/15",
  border: "hover:border-accent/30",
  titleHover: "group-hover:text-accent",
};

export function TemplateCard({ template, accent = defaultAccent }: TemplateCardProps) {
  const router = useRouter();
  const setTemplate = useBuilderStore((s) => s.setTemplate);

  function handleClick() {
    setTemplate(template.id);
    router.push("/builder");
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 p-3 sm:items-start sm:gap-3 sm:p-6 sm:justify-start",
        "aspect-square sm:aspect-auto",
        "text-center sm:text-left rounded-[var(--radius-xl)] w-full",
        "bg-bg-2 border border-glass-border",
        accent.border, "hover:bg-glass-hover",
        "transition-colors duration-150 cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
          accent.bg, accent.bgHover,
        )}
      >
        <LucideIcon name={template.icon} className={cn("w-4.5 h-4.5", accent.text)} />
      </div>
      <div>
        <h3 className={cn("font-heading font-semibold text-sm text-text-1 transition-colors", accent.titleHover)}>
          {template.name}
        </h3>
        <p className="text-xs text-text-2 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
          {template.description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 sm:mt-auto">
        <Badge variant="outline" className="text-[11px] text-text-2 border-white/[0.08] rounded-full">
          {template.fields.length} fields
        </Badge>
      </div>
    </button>
  );
}
