/**
 * Clothing V2 prompt builder (SIDEKICK v3.0 spec).
 *
 * Builds a structured prompt from the clothing-specific workflow state.
 * Self-contained, no React deps — receives plain data only.
 */

export interface ClothingPromptInput {
  // Phase 1: Design
  subjects: string[];
  customSubject: string;
  vibeTheme: string | null;
  letteringStyle: string | null;
  letteringText: string;
  layout: string | null;

  // Phase 2: Garment
  garmentType: string | null;
  placements: string[];
  printSize: string | null;
  garmentColor: string | null;
  customGarmentColors: string[];

  // Phase 3: Print Method
  printMethodPrefix: string | null;
  printMethodAutoNegatives: string[];

  // Phase 4: Look & Feel
  artStyles: string[];
  colorPalette: string | null;
  customPaletteColors: string[];
  detailLevel: string | null;

  // Phase 5: Final Touches
  background: string;
  customBackgroundColors: string[];
  outputQuality: string | null;
  extraNotes: string;
  userNegatives: string[];

  // Custom tags per section (user-typed free-text entries)
  customTags?: Record<string, string[]>;
}

export interface ClothingPromptOutput {
  positive: string;
  negative: string;
}

function compact(parts: (string | undefined | null | false)[]): string {
  return parts.filter(Boolean).join(", ");
}

/**
 * 11-step assembly order matching the spec:
 *
 * 1. Subject(s)
 * 2. Vibe / theme
 * 3. Lettering
 * 4. Layout / composition
 * 5. Art style(s)
 * 6. Color palette
 * 7. Detail level
 * 8. Print method prefix
 * 9. Background
 * 10. Output quality
 * 11. Extra notes
 */
export function buildClothingPrompt(input: ClothingPromptInput): ClothingPromptOutput {
  const parts: string[] = [];
  const ct = input.customTags ?? {};

  /** Helper: push custom tags for a given section key */
  function pushCustom(section: string): void {
    const tags = ct[section];
    if (tags && tags.length > 0) {
      parts.push(...tags);
    }
  }

  // 1. Subject(s) — include custom tags as additional subjects
  const subjectParts = [...input.subjects];
  if (input.customSubject.trim()) {
    subjectParts.push(input.customSubject.trim());
  }
  const customSubjects = ct["subjects"] ?? [];
  subjectParts.push(...customSubjects);

  if (subjectParts.length > 0) {
    parts.push(subjectParts.join(" and ") + " design");
  } else {
    parts.push("[SUBJECT] design");
  }

  // Garment context: type + placement → "for T-shirt, front center placement"
  const garmentContext: string[] = [];
  if (input.garmentType) {
    const gtLabel = input.garmentType.replace(/-/g, " ");
    garmentContext.push(`for ${gtLabel}`);
  }
  if (input.placements.length > 0) {
    const placementLabels = input.placements.map((p) => p.replace(/-/g, " "));
    garmentContext.push(placementLabels.join(" + ") + " placement");
  }
  if (input.printSize) {
    garmentContext.push(input.printSize.replace(/-/g, " ") + " print area");
  }
  if (input.garmentColor) {
    garmentContext.push(`on ${input.garmentColor.replace(/-/g, " ")} garment`);
  }
  if (input.customGarmentColors.length > 0) {
    garmentContext.push(`${input.customGarmentColors.join(", ")} garment colors`);
  }
  if (garmentContext.length > 0) {
    parts.push(garmentContext.join(", "));
  }

  // 2. Vibe / theme
  if (input.vibeTheme) {
    parts.push(input.vibeTheme + " vibe");
  }
  pushCustom("vibe");

  // 3. Lettering
  if (input.letteringStyle && input.letteringStyle !== "none") {
    const text = input.letteringText.trim();
    if (text) {
      parts.push(`"${text}" in ${input.letteringStyle} lettering`);
    } else {
      parts.push(input.letteringStyle + " lettering");
    }
  }
  pushCustom("lettering");

  // 4. Layout / composition
  if (input.layout) {
    parts.push(input.layout + " composition");
  }
  pushCustom("layout");

  // 5. Art style(s)
  if (input.artStyles.length > 0) {
    parts.push(input.artStyles.join(" + ") + " style");
  }
  pushCustom("art-style");

  // 6. Color palette
  if (input.colorPalette) {
    parts.push(input.colorPalette + " color palette");
  }
  if (input.customPaletteColors.length > 0) {
    parts.push(input.customPaletteColors.join(", ") + " design colors");
  }
  pushCustom("color-palette");

  // 7. Detail level
  if (input.detailLevel) {
    parts.push(input.detailLevel + " detail");
  }
  pushCustom("detail-level");

  // 8. Print method prefix
  if (input.printMethodPrefix) {
    parts.push(input.printMethodPrefix);
  }
  pushCustom("print-method");

  // 9. Background — "transparent" is the default, only emit when a specific bg is set
  if (input.background && input.background !== "transparent") {
    parts.push(`${input.background} background`);
  }
  if (input.customBackgroundColors.length > 0) {
    parts.push(input.customBackgroundColors.join(", ") + " background colors");
  }
  pushCustom("background");

  // 10. Output quality
  if (input.outputQuality === "print-ready") {
    parts.push("print-ready, high resolution, crisp detail");
  } else if (input.outputQuality === "quick-preview") {
    parts.push("preview quality");
  } else if (input.outputQuality === "pattern-tile") {
    parts.push("seamless repeating tile pattern");
  }
  pushCustom("output-quality");

  // Garment-level custom tags (user free-text additions)
  pushCustom("garment-type");
  pushCustom("placement");
  pushCustom("print-size");
  pushCustom("garment-color");

  // 11. Extra notes
  if (input.extraNotes.trim()) {
    parts.push(input.extraNotes.trim());
  }

  const positive = parts.join(", ");

  // Negative: combine print method auto-negatives + user negatives + base negatives
  const negParts = [
    ...input.printMethodAutoNegatives,
    ...input.userNegatives,
    "worst quality",
    "text artifacts",
  ];
  const negative = [...new Set(negParts)].join(", ");

  return { positive, negative };
}
