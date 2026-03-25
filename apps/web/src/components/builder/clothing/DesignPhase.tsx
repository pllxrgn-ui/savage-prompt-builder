"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { useClothingStore } from "@/lib/store/clothing-store";
import { CLOTHING_SUBJECTS, CLOTHING_VIBES, LETTERING_STYLES, CLOTHING_LAYOUTS, PLACEMENTS } from "@/lib/data/clothing";
import { TagChipSelector } from "./TagChipSelector";
import { AccordionSection, useAccordion } from "./AccordionSection";
import { PillTagInput, type Pill } from "./PillTagInput";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const REFERENCE_TYPES = [
  { value: "style", label: "Style reference" },
  { value: "composition", label: "Composition reference" },
  { value: "subject", label: "Subject reference" },
  { value: "color", label: "Color reference" },
] as const;

type ReferenceImage = {
  id: string;
  file: File;
  previewUrl: string;
  type: (typeof REFERENCE_TYPES)[number]["value"];
};

export function DesignPhase() {
  const subjects = useClothingStore((s) => s.subjects);
  const toggleSubject = useClothingStore((s) => s.toggleSubject);
  const vibeTheme = useClothingStore((s) => s.vibeTheme);
  const setVibeTheme = useClothingStore((s) => s.setVibeTheme);
  const letteringStyle = useClothingStore((s) => s.letteringStyle);
  const setLetteringStyle = useClothingStore((s) => s.setLetteringStyle);
  const letteringText = useClothingStore((s) => s.letteringText);
  const setLetteringText = useClothingStore((s) => s.setLetteringText);
  const layout = useClothingStore((s) => s.layout);
  const setLayout = useClothingStore((s) => s.setLayout);
  const placements = useClothingStore((s) => s.placements);
  const togglePlacement = useClothingStore((s) => s.togglePlacement);
  const customTags = useClothingStore((s) => s.customTags);
  const addCustomTag = useClothingStore((s) => s.addCustomTag);
  const removeCustomTag = useClothingStore((s) => s.removeCustomTag);

  const [openId, toggle] = useAccordion("subjects");

  // --- Reference images (local state — blob URLs don't persist) ---
  const [refImages, setRefImages] = useState<ReferenceImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - refImages.length;
    const newImages: ReferenceImage[] = files.slice(0, remaining).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      type: "style" as const,
    }));
    setRefImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [refImages.length]);

  const removeRefImage = useCallback((id: string) => {
    setRefImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const updateRefType = useCallback((id: string, type: ReferenceImage["type"]) => {
    setRefImages((prev) => prev.map((img) => img.id === id ? { ...img, type } : img));
  }, []);

  // --- Pill builders ---
  const subjectPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = subjects.map((id) => ({
      id,
      label: CLOTHING_SUBJECTS.find((s) => s.id === id)?.label ?? id,
      type: "selected" as const,
    }));
    const custom: Pill[] = (customTags["subjects"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return [...selected, ...custom];
  }, [subjects, customTags]);

  const vibePills = useMemo<Pill[]>(() => {
    const selected: Pill[] = vibeTheme
      ? [{ id: vibeTheme, label: CLOTHING_VIBES.find((v) => v.id === vibeTheme)?.label ?? vibeTheme, type: "selected" as const }]
      : [];
    const custom: Pill[] = (customTags["vibe"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return [...selected, ...custom];
  }, [vibeTheme, customTags]);

  const letteringPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = letteringStyle && letteringStyle !== "none"
      ? [{ id: letteringStyle, label: LETTERING_STYLES.find((l) => l.id === letteringStyle)?.label ?? letteringStyle, type: "selected" as const }]
      : [];
    const custom: Pill[] = (customTags["lettering"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return [...selected, ...custom];
  }, [letteringStyle, customTags]);

  const layoutPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = layout
      ? [{ id: layout, label: CLOTHING_LAYOUTS.find((l) => l.id === layout)?.label ?? layout, type: "selected" as const }]
      : [];
    const custom: Pill[] = (customTags["layout"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return [...selected, ...custom];
  }, [layout, customTags]);

  const placementPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = placements.map((id) => ({
      id,
      label: PLACEMENTS.find((p) => p.id === id)?.label ?? id,
      type: "selected" as const,
    }));
    const custom: Pill[] = (customTags["placement"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return [...selected, ...custom];
  }, [placements, customTags]);

  const handleRemovePill = (section: string, deselect: (id: string | null) => void) => (pill: Pill) => {
    if (pill.type === "selected") deselect(pill.id);
    else removeCustomTag(section, pill.id);
  };

  const vibeBadge = vibeTheme
    ? CLOTHING_VIBES.find((v) => v.id === vibeTheme)?.label
    : undefined;
  const letteringBadge = letteringStyle && letteringStyle !== "none"
    ? LETTERING_STYLES.find((l) => l.id === letteringStyle)?.label
    : letteringStyle === "none" ? "None" : undefined;
  const layoutBadge = layout
    ? CLOTHING_LAYOUTS.find((l) => l.id === layout)?.label
    : undefined;
  const placementBadge = placements.length > 0
    ? placements.map((id) => PLACEMENTS.find((p) => p.id === id)?.label ?? id).join(", ")
    : undefined;

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      {/* Reference Images */}
      <AccordionSection
        id="reference-images"
        title="Reference Images"
        description="Upload images to guide the AI — style, composition, subject, or color"
        badge={refImages.length > 0 ? `${refImages.length}/5` : undefined}
        isOpen={openId === "reference-images"}
        onToggle={toggle}
      >
        {refImages.length < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-glass-border rounded-[var(--radius-md)] py-5 px-4 text-center hover:border-accent/30 hover:bg-glass transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <p className="text-xs text-text-3">Click to upload reference images</p>
            <p className="text-[10px] text-text-3/70 mt-0.5">JPG, PNG, WEBP · Max 5 images</p>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload reference images"
        />
        {refImages.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {refImages.map((img, idx) => (
              <div key={img.id} className="flex items-center gap-3 bg-bg-3 rounded-[var(--radius-md)] p-2">
                <span className="text-[10px] text-text-3 font-bold w-4 shrink-0 text-center">{idx + 1}</span>
                <img
                  src={img.previewUrl}
                  alt={`Reference ${idx + 1}`}
                  className="w-12 h-12 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-text-2 truncate">{img.file.name}</p>
                  <select
                    value={img.type}
                    onChange={(e) => updateRefType(img.id, e.target.value as ReferenceImage["type"])}
                    className="mt-1 text-[10px] bg-bg-input border border-glass-border rounded-md px-1.5 py-0.5 text-text-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
                    aria-label={`Reference type for image ${idx + 1}`}
                  >
                    {REFERENCE_TYPES.map((rt) => (
                      <option key={rt.value} value={rt.value}>{rt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeRefImage(img.id)}
                  className="text-text-3 hover:text-red-400 text-xs px-1 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  aria-label={`Remove reference image ${idx + 1}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {refImages.length > 1 && (
              <p className="text-[10px] text-text-3 mt-1">
                Image #1 has the strongest influence. Lower positions have progressively less.
              </p>
            )}
          </div>
        )}
      </AccordionSection>

      {/* Import Moodboard (coming soon) */}
      <AccordionSection
        id="moodboard"
        title="Import Moodboard"
        description="Pull styles and keywords from a saved moodboard using AI vision"
        isOpen={openId === "moodboard"}
        onToggle={toggle}
      >
        <div className="flex flex-col items-center py-6 px-4 border border-dashed border-glass-border rounded-[var(--radius-md)] bg-bg-3/50">
          <div className="w-10 h-10 rounded-full bg-accent2/10 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-accent2" />
          </div>
          <p className="text-sm font-medium text-text-2 mb-1">AI Moodboard Import</p>
          <p className="text-xs text-text-3 text-center max-w-xs">
            Select a moodboard and AI will extract colors, styles, and keywords to auto-fill your prompt fields.
          </p>
          <span className="mt-3 px-3 py-1 text-[10px] font-medium text-accent2 bg-accent2/10 border border-accent2/20 rounded-full">
            Coming Soon
          </span>
        </div>
      </AccordionSection>

      {/* Subjects */}
      <AccordionSection
        id="subjects"
        title="Subjects"
        description="The main visual elements in your design"
        badge={subjectPills.length > 0 ? `${subjectPills.length}/5` : undefined}
        isOpen={openId === "subjects"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={subjectPills}
          onRemove={handleRemovePill("subjects", (id) => id && toggleSubject(id))}
          onAddCustom={(text) => addCustomTag("subjects", text)}
          placeholder="Type a custom subject and press Enter…"
        />
        <div className="mt-3">
          <TagChipSelector
            items={CLOTHING_SUBJECTS}
            selected={subjects}
            onToggle={toggleSubject}
            max={5}
            size="md"
          />
        </div>
      </AccordionSection>

      {/* Vibe / Theme */}
      <AccordionSection
        id="vibe"
        title="Vibe / Theme"
        description="The overall mood and aesthetic direction"
        badge={vibeBadge}
        isOpen={openId === "vibe"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={vibePills}
          onRemove={handleRemovePill("vibe", () => setVibeTheme(null))}
          onAddCustom={(text) => addCustomTag("vibe", text)}
          placeholder="Type a custom vibe and press Enter…"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {CLOTHING_VIBES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibeTheme(vibeTheme === v.id ? null : v.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer rounded-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                vibeTheme === v.id
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Lettering */}
      <AccordionSection
        id="lettering"
        title="Lettering"
        description="Add text or typography to your design"
        badge={letteringBadge}
        isOpen={openId === "lettering"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={letteringPills}
          onRemove={handleRemovePill("lettering", () => setLetteringStyle(null))}
          onAddCustom={(text) => addCustomTag("lettering", text)}
          placeholder="Type custom lettering and press Enter…"
        />
        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {LETTERING_STYLES.map((ls) => (
            <button
              key={ls.id}
              onClick={() => setLetteringStyle(letteringStyle === ls.id ? null : ls.id)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium border transition-all duration-150 cursor-pointer rounded-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                letteringStyle === ls.id
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
              )}
            >
              {ls.label}
            </button>
          ))}
        </div>
        {letteringStyle && letteringStyle !== "none" && (
          <Input
            placeholder="Enter lettering text…"
            value={letteringText}
            onChange={(e) => setLetteringText(e.target.value)}
            className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent text-xs"
          />
        )}
      </AccordionSection>

      {/* Layout */}
      <AccordionSection
        id="layout"
        title="Layout"
        description="How design elements are arranged"
        badge={layoutBadge}
        isOpen={openId === "layout"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={layoutPills}
          onRemove={handleRemovePill("layout", () => setLayout(null))}
          onAddCustom={(text) => addCustomTag("layout", text)}
          placeholder="Type custom layout and press Enter…"
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          {CLOTHING_LAYOUTS.map((lo) => (
            <button
              key={lo.id}
              onClick={() => setLayout(layout === lo.id ? null : lo.id)}
              className={`flex flex-col items-start p-3 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                layout === lo.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3"
              }`}
            >
              <span className={`text-xs font-medium ${layout === lo.id ? "text-accent" : "text-text-1"}`}>
                {lo.label}
              </span>
              <span className="text-[10px] text-text-3 mt-0.5">{lo.description}</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Placement */}
      <AccordionSection
        id="placement"
        title="Placement"
        description="Where on the garment the design goes"
        badge={placementBadge}
        isOpen={openId === "placement"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={placementPills}
          onRemove={(pill) => pill.type === "selected" ? togglePlacement(pill.id) : removeCustomTag("placement", pill.id)}
          onAddCustom={(text) => addCustomTag("placement", text)}
          placeholder="Type a custom placement and press Enter…"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePlacement(p.id)}
              className={`px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                placements.includes(p.id)
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
