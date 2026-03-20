"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Pencil, X, Check } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import type { CustomStyle } from "@/types";

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
    <div className="border-b border-accent/8 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <span className="text-[10px] font-medium text-text-3 uppercase tracking-wider">
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
        "px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
        "border cursor-pointer rounded-full",
        selected
          ? "bg-accent/15 text-accent border-accent/30"
          : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
      )}
    >
      {label}
    </button>
  );
}

/* ── Custom style chip with edit/delete ── */
function CustomStyleChip({
  style,
  selected,
  onToggle,
  onEdit,
  onDelete,
}: {
  style: CustomStyle;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-1">
      <button
        onClick={onToggle}
        className={clsx(
          "px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
          "border cursor-pointer rounded-full",
          selected
            ? "bg-accent/15 text-accent border-accent/30"
            : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
        )}
      >
        {style.label}
      </button>
      <button
        onClick={onEdit}
        className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-text-3 hover:text-text-1 hover:bg-surface transition-colors"
        aria-label={`Edit ${style.label}`}
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={onDelete}
        className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        aria-label={`Delete ${style.label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ── Inline create/edit form ── */
function CustomStyleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: { label: string; content: string };
  onSave: (label: string, content: string) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  return (
    <div className="p-3 bg-bg-3 border border-accent/20 space-y-2 rounded-[var(--radius-md)]">
      <input
        type="text"
        placeholder="Style name…"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        aria-label="Style name"
        className="w-full px-2.5 py-1.5 bg-bg-input border border-accent/8 text-xs text-text-1 placeholder:text-text-3 focus-visible:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20 rounded-[var(--radius-md)]"
      />
      <textarea
        placeholder="Style instruction (e.g. 'dramatic rim lighting, cinematic color grading')…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        aria-label="Style content"
        className="w-full px-2.5 py-1.5 bg-bg-input border border-accent/8 text-xs text-text-1 placeholder:text-text-3 focus-visible:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20 resize-none rounded-[var(--radius-md)]"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-2.5 py-1 text-[11px] text-text-3 hover:text-text-1 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (label.trim() && content.trim()) onSave(label.trim(), content.trim());
          }}
          disabled={!label.trim() || !content.trim()}
          className="flex items-center gap-1 px-2.5 py-1 bg-accent text-white text-[11px] font-medium hover:opacity-90 disabled:opacity-40 transition-opacity rounded-[var(--radius-md)]"
        >
          <Check className="w-3 h-3" /> Save
        </button>
      </div>
    </div>
  );
}

interface StylesDrawerProps {
  templateId: string;
  styles: Array<{ label: string; category: string }>;
}

export function StylesDrawer({ templateId, styles }: StylesDrawerProps) {
  const selectedStyles = useBuilderStore((s) => s.selectedStyles);
  const toggleStyle = useBuilderStore((s) => s.toggleStyle);
  const customStyles = useBuilderStore((s) => s.customStyles);
  const addCustomStyle = useBuilderStore((s) => s.addCustomStyle);
  const updateCustomStyle = useBuilderStore((s) => s.updateCustomStyle);
  const deleteCustomStyle = useBuilderStore((s) => s.deleteCustomStyle);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Group styles by category
  const categories = new Map<string, Array<{ label: string }>>();
  for (const style of styles) {
    const existing = categories.get(style.category) ?? [];
    existing.push({ label: style.label });
    categories.set(style.category, existing);
  }

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/8">
        <h3 className="text-[10px] font-medium text-text-3 uppercase tracking-wider">Styles</h3>
        {selectedStyles.length > 0 && (
          <span className="text-[10px] text-accent font-medium px-2 py-0.5 border border-accent/20 rounded-full">
            {selectedStyles.length} selected
          </span>
        )}
      </div>

      {/* Custom styles section */}
      <DrawerSection
        title="Custom"
        count={customStyles.length}
        defaultOpen={customStyles.length > 0}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {customStyles.map((cs) =>
              editingId === cs.id ? (
                <CustomStyleForm
                  key={cs.id}
                  initial={{ label: cs.label, content: cs.content }}
                  onSave={(label, content) => {
                    updateCustomStyle(cs.id, { label, content });
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <CustomStyleChip
                  key={cs.id}
                  style={cs}
                  selected={selectedStyles.includes(cs.label)}
                  onToggle={() => toggleStyle(cs.label)}
                  onEdit={() => setEditingId(cs.id)}
                  onDelete={() => deleteCustomStyle(cs.id)}
                />
              ),
            )}
          </div>

          {showCreateForm ? (
            <CustomStyleForm
              onSave={(label, content) => {
                addCustomStyle({ label, content });
                setShowCreateForm(false);
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Custom Style
            </button>
          )}
        </div>
      </DrawerSection>

      {/* Preset categories */}
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
