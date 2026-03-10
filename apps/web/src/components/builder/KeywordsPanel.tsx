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
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-1">Keywords</h3>
        {selectedKeywords.length > 0 && (
          <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            {selectedKeywords.length} selected
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
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150",
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
