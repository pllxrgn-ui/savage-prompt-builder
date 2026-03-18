/**
 * Showcase image paths per template ID.
 * Images live at public/showcase/templates/{templateId}-{n}.jpg
 * Generated via scripts/generate-template-showcase.ts (FAL.ai (FLUX.1-schnell)).
 *
 * Re-run: pnpm --filter web generate:template-showcase
 * TemplateCard falls back gracefully to a gradient placeholder when empty.
 */
export const TEMPLATE_SHOWCASE: Record<string, string[]> = {
  clothing    : ["/showcase/templates/clothing-1.jpg", "/showcase/templates/clothing-2.jpg"],
  sticker     : ["/showcase/templates/sticker-1.jpg", "/showcase/templates/sticker-2.jpg"],
  pin         : ["/showcase/templates/pin-1.jpg", "/showcase/templates/pin-2.jpg"],
  poster      : ["/showcase/templates/poster-1.jpg", "/showcase/templates/poster-2.jpg"],
  album       : ["/showcase/templates/album-1.jpg", "/showcase/templates/album-2.jpg"],
  brand       : ["/showcase/templates/brand-1.jpg", "/showcase/templates/brand-2.jpg"],
  tattoo      : ["/showcase/templates/tattoo-1.jpg", "/showcase/templates/tattoo-2.jpg"],
  sneaker     : ["/showcase/templates/sneaker-1.jpg", "/showcase/templates/sneaker-2.jpg"],
  collection  : ["/showcase/templates/collection-1.jpg", "/showcase/templates/collection-2.jpg"],
  mockup      : ["/showcase/templates/mockup-1.jpg", "/showcase/templates/mockup-2.jpg"],
  pattern     : ["/showcase/templates/pattern-1.jpg", "/showcase/templates/pattern-2.jpg"],
  bookcover   : ["/showcase/templates/bookcover-1.jpg", "/showcase/templates/bookcover-2.jpg"],
  carwrap     : ["/showcase/templates/carwrap-1.jpg", "/showcase/templates/carwrap-2.jpg"],
  social      : ["/showcase/templates/social-1.jpg", "/showcase/templates/social-2.jpg"],
  wallpaper   : ["/showcase/templates/wallpaper-1.jpg", "/showcase/templates/wallpaper-2.jpg"],
  character   : ["/showcase/templates/character-1.jpg", "/showcase/templates/character-2.jpg"],
  threeD      : ["/showcase/templates/threeD-1.jpg", "/showcase/templates/threeD-2.jpg"],
  jewelry     : ["/showcase/templates/jewelry-1.jpg", "/showcase/templates/jewelry-2.jpg"],
  freestyle   : ["/showcase/templates/freestyle-1.jpg", "/showcase/templates/freestyle-2.jpg"],
  marketing   : ["/showcase/templates/marketing-1.jpg", "/showcase/templates/marketing-2.jpg"],
  meme        : ["/showcase/templates/meme-1.jpg", "/showcase/templates/meme-2.jpg"],
};
