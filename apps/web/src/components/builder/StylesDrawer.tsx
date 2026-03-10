"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

interface DrawerSectionProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function DrawerSection({
  title,
  count,
  defaultOpen = false,
  children,
}: DrawerSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <span className="text-xs font-semibold text-text-2 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-3">{count}</span>
          <ChevronDown
            className={clsx(
              "w-3.5 h-3.5 text-text-3 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StyleChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

function StyleChip({ label, selected, onToggle }: StyleChipProps) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150",
        "border cursor-pointer",
        selected
          ? "bg-accent/15 text-accent border-accent/30"
          : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
      )}
    >
      {label}
    </button>
  );
}

interface StylesDrawerProps {
  templateId: string;
  styles: Array<{ label: string; category: string }>;
}

export function StylesDrawer({ templateId, styles }: StylesDrawerProps) {
  const selectedStyles = useBuilderStore((s) => s.selectedStyles);
  const toggleStyle = useBuilderStore((s) => s.toggleStyle);

  // Group styles by category
  const categories = new Map<string, Array<{ label: string }>>();
  for (const style of styles) {
    const existing = categories.get(style.category) ?? [];
    existing.push({ label: style.label });
    categories.set(style.category, existing);
  }

  if (styles.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-1">Styles</h3>
        {selectedStyles.length > 0 && (
          <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            {selectedStyles.length} selected
          </span>
        )}
      </div>
      {Array.from(categories.entries()).map(([category, items], index) => (
        <DrawerSection
          key={category}
          title={category}
          count={items.length}
          defaultOpen={index === 0}
        >
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <StyleChip
                key={item.label}
                label={item.label}
                selected={selectedStyles.includes(item.label)}
                onToggle={() => toggleStyle(item.label)}
              />
            ))}
          </div>
        </DrawerSection>
      ))}
    </div>
  );
}
