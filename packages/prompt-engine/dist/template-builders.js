/**
 * Template builders: one per template ID.
 * Each takes a fields record and returns the core positive prompt string
 * (before styles, keywords, palette, or phrases are appended).
 */
function compact(parts) {
    return parts.filter(Boolean).join(", ");
}
// --- Builders ---
function clothing(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " design",
        f.style ? f.style + " style" : undefined,
        f.mood ? f.mood + " mood" : undefined,
        "isolated centered composition",
        f.colors ? "colors: " + f.colors : undefined,
        f.background,
        "print-ready, high detail, clean edges",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function social(f) {
    return compact([
        f.subject || "[SUBJECT]",
        f.style,
        f.mood ? f.mood + " tone" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.composition ? f.composition + " composition" : undefined,
        "social media ready, 1:1 square aspect ratio, high quality",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function marketing(f) {
    return compact([
        f.product
            ? "marketing visual for " + f.product
            : "[PRODUCT/SERVICE] marketing visual",
        f.headline ? f.headline + " messaging concept" : undefined,
        f.style ? f.style + " visual style" : undefined,
        f.mood ? f.mood + " emotional tone" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        "advertising quality, commercial grade, attention-grabbing",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function brand(f) {
    const bn = f.brandname || "[BRAND NAME]";
    return compact([
        `"${bn}" brand logo design`,
        (f.subject || "[SUBJECT]") + " as the central brand mark symbol",
        f.style ? f.style + " design style" : undefined,
        f.mood ? f.mood + " aesthetic" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.composition ? f.composition + " layout" : undefined,
        `the text "${bn}" must be prominently displayed, transparent background, scalable, vector quality`,
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function threeD(f) {
    return compact([
        "3D render of " + (f.subject || "[SUBJECT]"),
        f.style ? f.style + " 3D style" : undefined,
        f.material ? f.material + " material" : undefined,
        f.lighting ? f.lighting + " lighting" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.camera ? f.camera + " camera angle" : undefined,
        "high-quality 3D render, octane render quality, 8K detail",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function jewelry(f) {
    return compact([
        (f.piece || "[PIECE TYPE]") + " jewelry design",
        f.style ? f.style + " style" : undefined,
        f.material ? f.material + " metal" : undefined,
        f.gemstones ? "featuring " + f.gemstones : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        "professional jewelry photography, studio lighting, macro detail",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function collection(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " design",
        f.style ? f.style + " style" : undefined,
        "part of " + (f.theme || "[THEME]") + " series",
        f.colors ? "colors: " + f.colors : undefined,
        f.unique ? "featuring " + f.unique : undefined,
        f.details,
        "consistent composition, series-ready",
    ]);
}
function freestyle(f) {
    return compact([
        f.subject || "[SUBJECT]",
        f.style ? f.style + " style" : undefined,
        f.mood,
        f.colors ? "colors: " + f.colors : undefined,
        f.composition ? f.composition + " composition" : undefined,
        f.details,
    ]);
}
function album(f) {
    return compact([
        f.subject || "[SUBJECT]",
        f.style,
        f.mood ? f.mood + " atmosphere" : undefined,
        f.genre ? f.genre + " aesthetic" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        "square 1:1, album cover quality, cinematic lighting",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function poster(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " poster design",
        f.style,
        f.mood ? f.mood + " energy" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.composition,
        "portrait orientation, print-ready, high impact",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function sticker(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " sticker design",
        f.style ? f.style + " style" : undefined,
        f.mood,
        f.colors ? "limited palette: " + f.colors : undefined,
        f.shape ? f.shape + " shape" : undefined,
        "thick outlines, flat colors, die-cut ready, transparent background",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function wallpaper(f) {
    return compact([
        f.subject || "[SUBJECT]",
        f.style,
        f.mood ? f.mood + " atmosphere" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        (f.device || "phone 9:16 portrait") + " aspect ratio",
        "wallpaper, high resolution",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function mockup(f) {
    return compact([
        "product photography of " + (f.product || "[PRODUCT]"),
        f.scene ? "on " + f.scene : undefined,
        f.style ? f.style + " photography" : undefined,
        f.colors ? "color scheme: " + f.colors : undefined,
        f.lighting ? f.lighting + " lighting" : undefined,
        "commercial quality, professional product shot",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function tattoo(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " tattoo design",
        f.style ? f.style + " tattoo style" : undefined,
        f.placement ? "designed for " + f.placement : undefined,
        f.size ? f.size + " scale" : undefined,
        f.colors ? "ink: " + f.colors : undefined,
        "clean white background, crisp lines, tattoo flash sheet quality",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function sneaker(f) {
    return compact([
        (f.silhouette || "[SILHOUETTE]") + " sneaker concept",
        f.style ? f.style + " design" : undefined,
        f.materials ? f.materials + " materials" : undefined,
        f.colors ? "colorway: " + f.colors : undefined,
        f.details ? "featuring " + f.details : undefined,
        "side profile, white background, sharp detail",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function pattern(f) {
    return compact([
        "seamless tileable pattern",
        (f.subject || "[ELEMENTS]") + " motif",
        f.style ? f.style + " technique" : undefined,
        f.mood ? f.mood + " feel" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.density ? f.density + " density" : undefined,
        "seamless repeat, fabric-ready, no visible edges",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function character(f) {
    return compact([
        (f.character || "[CHARACTER]") + " character design",
        f.style ? f.style + " style" : undefined,
        f.outfit ? "wearing " + f.outfit : undefined,
        f.colors ? "color scheme: " + f.colors : undefined,
        f.pose ? f.pose + " pose" : undefined,
        "full body, character sheet, clean background",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function bookcover(f) {
    return compact([
        (f.subject || "[CONCEPT]") + " book cover artwork",
        f.style,
        f.genre ? f.genre + " genre aesthetic" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.composition ? f.composition + " for title placement" : undefined,
        "portrait, editorial quality, high detail",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function pin(f) {
    return compact([
        (f.subject || "[SUBJECT]") + " enamel pin design",
        f.style,
        f.mood ? f.mood + " vibe" : undefined,
        f.colors ? "enamel colors: " + f.colors : undefined,
        f.shape ? f.shape + " shape" : undefined,
        "gold metal outlines, flat enamel fills, white background",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function carwrap(f) {
    return compact([
        (f.design || "[DESIGN]") + " vehicle wrap",
        "on " + (f.vehicle || "[VEHICLE]"),
        f.style ? f.style + " aesthetic" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.coverage,
        "side profile, showroom quality",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
function meme(f) {
    return compact([
        f.subject || "[SUBJECT]",
        f.expression ? "with " + f.expression + " expression" : undefined,
        f.style ? f.style + " style" : undefined,
        f.colors ? "colors: " + f.colors : undefined,
        f.context ? f.context + " background" : undefined,
        "expressive, shareable, reaction image quality, meme-ready",
        f.avoid ? "--no " + f.avoid : undefined,
    ]);
}
/**
 * Maps template ID → builder function.
 * Each builder assembles the core prompt from the user's field values.
 */
export const templateBuilders = {
    clothing,
    social,
    marketing,
    brand,
    threeD,
    jewelry,
    collection,
    freestyle,
    album,
    poster,
    sticker,
    wallpaper,
    mockup,
    tattoo,
    sneaker,
    pattern,
    character,
    bookcover,
    pin,
    carwrap,
    meme,
};
/**
 * Build the core prompt for any template.
 * Falls back to comma-joining all non-empty field values.
 */
export function buildTemplatePrompt(templateId, fields) {
    const builder = templateBuilders[templateId];
    if (builder) {
        return builder(fields);
    }
    // Generic fallback: join all non-empty field values
    return Object.values(fields).filter(Boolean).join(", ");
}
//# sourceMappingURL=template-builders.js.map