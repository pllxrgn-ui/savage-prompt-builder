"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { useBuilderStore } from "@/lib/store";
import type { Template } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TEMPLATE_SHOWCASE } from "@/lib/data/template-showcase";

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
  const images = TEMPLATE_SHOWCASE[template.id] ?? [];
  const [activeImg, setActiveImg] = useState(0);
  const [erroredSrcs, setErroredSrcs] = useState<Set<string>>(new Set());

  const visibleImages = images.filter((src) => !erroredSrcs.has(src));

  useEffect(() => {
    if (visibleImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % visibleImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [visibleImages.length]);

  function handleClick() {
    setTemplate(template.id);
    router.push("/builder");
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex flex-col sm:flex-row",
        "items-center justify-center sm:items-stretch sm:justify-start",
        "gap-2 p-3 sm:p-0",
        "aspect-square sm:aspect-auto sm:h-[140px]",
        "text-center sm:text-left rounded-[var(--radius-xl)] w-full overflow-hidden",
        "bg-bg-2 border border-glass-border",
        accent.border,
        "transition-colors duration-150 cursor-pointer",
      )}
    >
      {/* Left: metadata */}
      <div className={cn(
        "flex flex-col items-center justify-center sm:items-start sm:justify-start",
        "sm:flex-1 sm:p-5 gap-2 sm:gap-2.5",
        "group-hover:bg-glass-hover transition-colors duration-150",
      )}>
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
          accent.bg, accent.bgHover,
        )}>
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
      </div>

      {/* Right: image slideshow — gradient base + crossfade images (sm+ only) */}
      <div className="hidden sm:block relative w-[42%] shrink-0 overflow-hidden">
        {/* Gradient placeholder — always visible as base */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-500",
          "bg-gradient-to-br from-bg-3 via-bg-2 to-bg-base",
        )} />
        {/* Subtle template-accent tint over gradient */}
        <div className={cn("absolute inset-0 opacity-20", accent.bg)} />

        {/* Crossfading images */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            role="presentation"
            fill
            sizes="(max-width: 640px) 0px, 42vw"
            onError={() => setErroredSrcs((prev) => new Set(prev).add(src))}
            className={cn(
              "object-cover transition-opacity duration-700",
              i === activeImg && !erroredSrcs.has(src) ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Blend edge into left column */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg-2 to-transparent pointer-events-none z-10" />

        {/* Dots indicator — only when multiple visible images */}
        {visibleImages.length > 1 && (
          <div className="absolute bottom-2.5 right-3 flex gap-1 z-20">
            {visibleImages.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block rounded-full transition-all duration-300",
                  i === activeImg ? "w-3 h-1 bg-white/80" : "w-1 h-1 bg-white/30",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
