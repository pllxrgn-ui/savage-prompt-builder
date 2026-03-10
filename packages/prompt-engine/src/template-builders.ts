/**
 * Template builders: one per template ID.
 * Each takes a fields record and returns the core positive prompt string
 * (before styles, keywords, palette, or phrases are appended).
 */

type Fields = Record<string, string>;

function compact(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(", ");
}

function sentence(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(". ");
}

function wrap(prefix: string, value: string | undefined): string | undefined {
  return value ? `${prefix} ${value}` : undefined;
}

// --- Photography ---

function portrait(f: Fields): string {
  const base = f.subject || "portrait photograph";
  return compact([
    base,
    wrap("in", f.setting),
    f.mood,
    wrap("shot on", f.camera),
    "professional photography",
  ]);
}

function landscape(f: Fields): string {
  const base = f.scene || "landscape photograph";
  return compact([
    base,
    f.weather,
    f.composition,
    wrap("shot on", f.camera),
    "landscape photography",
  ]);
}

function street(f: Fields): string {
  const base = f.scene || "street photography scene";
  return compact([
    base,
    f.subject,
    f.mood,
    f.style,
    "street photography",
  ]);
}

function product(f: Fields): string {
  const base = f.product || "product photograph";
  return compact([
    base,
    wrap("on", f.surface),
    f.lighting,
    f.style,
    "commercial product photography",
  ]);
}

// --- Illustration ---

function digitalArt(f: Fields): string {
  const base = f.subject || "digital artwork";
  return compact([
    base,
    f.style,
    wrap("color palette:", f.colors),
    f.mood,
    "digital art",
  ]);
}

function anime(f: Fields): string {
  const base = f.character || "anime character";
  return compact([
    base,
    f.action,
    wrap("in the style of", f.style),
    f.background,
    "anime illustration",
  ]);
}

function watercolor(f: Fields): string {
  const base = f.subject || "watercolor painting";
  return compact([
    base,
    f.technique,
    f.colors,
    wrap("on", f.paper),
    "watercolor painting",
  ]);
}

function comic(f: Fields): string {
  const base = f.scene || "comic book panel";
  return compact([
    base,
    wrap("style of", f.style),
    f.inking,
    f.colors,
    "comic book art",
  ]);
}

// --- Design ---

function logo(f: Fields): string {
  const brand = f.brand || "brand";
  return compact([
    `logo design for "${brand}"`,
    f.style,
    wrap("featuring", f.icon),
    f.colors,
    "professional logo design, vector, clean",
  ]);
}

function uiMockup(f: Fields): string {
  const app = f.app || "application";
  return compact([
    `UI design for ${app}`,
    f.platform,
    f.style,
    wrap("showing", f.features),
    "UI/UX design mockup",
  ]);
}

function poster(f: Fields): string {
  const title = f.title || "poster";
  return compact([
    `poster design with title "${title}"`,
    f.theme,
    f.style,
    f.elements,
    "graphic design poster",
  ]);
}

function pattern(f: Fields): string {
  const motif = f.motif || "decorative pattern";
  return compact([
    `seamless pattern of ${motif}`,
    f.style,
    f.colors,
    f.repeat,
    "seamless tileable pattern",
  ]);
}

// --- 3D & Render ---

function threeDRender(f: Fields): string {
  const base = f.subject || "3D object";
  return compact([
    base,
    wrap("material:", f.material),
    f.lighting,
    f.renderer,
    "3D render",
  ]);
}

function isometric(f: Fields): string {
  const base = f.scene || "isometric scene";
  return compact([
    `isometric view of ${base}`,
    f.style,
    f.details,
    f.scale,
    "isometric 3D illustration",
  ]);
}

function archViz(f: Fields): string {
  const space = f.space || "architectural space";
  return compact([
    `architectural visualization of ${space}`,
    f.style,
    f.lighting,
    f.details,
    "architecture visualization, interior design",
  ]);
}

function character3d(f: Fields): string {
  const character = f.character || "3D character";
  return compact([
    character,
    f.style,
    f.pose,
    wrap("material:", f.material),
    "3D character design",
  ]);
}

// --- Experimental ---

function abstract(f: Fields): string {
  const concept = f.concept || "abstract composition";
  return compact([
    concept,
    wrap("medium:", f.medium),
    f.colors,
    f.texture,
    "abstract art",
  ]);
}

function surreal(f: Fields): string {
  const base = f.scene || "surreal scene";
  return compact([
    base,
    f.elements,
    f.style,
    f.mood,
    "surrealism",
  ]);
}

function pixelArt(f: Fields): string {
  const base = f.scene || "pixel art scene";
  return compact([
    base,
    f.resolution,
    wrap("palette:", f.palette),
    f.style,
    "pixel art",
  ]);
}

function collage(f: Fields): string {
  const theme = f.theme || "mixed media collage";
  return compact([
    theme,
    wrap("materials:", f.materials),
    f.composition,
    f.colors,
    "mixed media collage art",
  ]);
}

/**
 * Maps template ID → builder function.
 * Each builder assembles the core prompt from the user's field values.
 */
export const templateBuilders: Record<string, (fields: Fields) => string> = {
  portrait,
  landscape,
  street,
  product,
  "digital-art": digitalArt,
  anime,
  watercolor,
  comic,
  logo,
  "ui-mockup": uiMockup,
  poster,
  pattern,
  "3d-render": threeDRender,
  isometric,
  "arch-viz": archViz,
  "character-3d": character3d,
  abstract,
  surreal,
  "pixel-art": pixelArt,
  collage,
};

/**
 * Build the core prompt for any template.
 * Falls back to comma-joining all non-empty field values.
 */
export function buildTemplatePrompt(
  templateId: string,
  fields: Fields,
): string {
  const builder = templateBuilders[templateId];
  if (builder) {
    return builder(fields);
  }
  // Generic fallback: join all non-empty field values
  return Object.values(fields).filter(Boolean).join(", ");
}
