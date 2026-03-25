"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionSectionProps {
  id: string;
  title: string;
  /** Short helper text shown below the title when collapsed */
  description?: string;
  /** Badge text shown on the right (e.g. "3/5", selected label) */
  badge?: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

export function AccordionSection({
  id,
  title,
  description,
  badge,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <div className="border-b border-glass-border/60 last:border-b-0">
      <button
        id={`accordion-${id}`}
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-glass transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
      >
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-text-2 uppercase tracking-wider">
            {title}
          </span>
          {description && !isOpen && (
            <span className="text-[10px] text-text-3 mt-0.5 leading-snug">
              {description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] text-accent font-medium px-2 py-0.5 border border-accent/20 rounded-full">
              {badge}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-text-3 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div id={`panel-${id}`} role="region" aria-labelledby={`accordion-${id}`} className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook for single-open accordion behavior.
 * Returns [openId, toggle] — calling toggle with a new id closes the previous.
 */
export function useAccordion(defaultOpenId?: string) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return [openId, toggle] as const;
}
