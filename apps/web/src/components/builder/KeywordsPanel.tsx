"use client";

import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { KEYWORDS } from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { DrawerSection } from "./StylesDrawer";

export function KeywordsPanel() {
  const selectedKeywords = useBuilderStore((s) => s.selectedKeywords);
  const toggleKeyword = useBuilderStore((s) => s.toggleKeyword);

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/8">
        <h3 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Keywords</h3>
        {selectedKeywords.length > 0 && (
          <span className="text-[10px] text-accent font-mono px-2 py-0.5 border border-accent/20">
            [{selectedKeywords.length}] selected
          </span>
        )}
      </div>
      {KEYWORDS.map((category, index) => (
        <DrawerSection
          key={category.id}
          title={category.label}
          count={category.keywords.length}
          defaultOpen={index === 0}
        >
          <div className="flex flex-wrap gap-1.5">
            {category.keywords.map((keyword) => {
              const isSelected = selectedKeywords.includes(keyword);
              return (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={clsx(
                    "px-2.5 py-1 text-[11px] font-mono font-medium transition-all duration-150",
                    "border cursor-pointer",
                    isSelected
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
                  )}
                >
                  {keyword}
                </button>
              );
            })}
          </div>
        </DrawerSection>
      ))}
    </div>
  );
}
