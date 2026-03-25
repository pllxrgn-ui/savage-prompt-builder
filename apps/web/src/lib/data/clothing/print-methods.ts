export type PrintMethod = {
  id: string;
  label: string;
  description: string;
  bestFor: string;
  background: string;
  colorLimit: string;
  autoNegatives: string[];
  promptPrefix: string;
  artStyleWarnings: Record<string, string>;
};

export const PRINT_METHODS: PrintMethod[] = [
  {
    id: "dtf",
    label: "DTF (Direct to Film)",
    description: "Full-color art with crisp clean edges, isolated subject on solid background",
    bestFor: "Any garment, any color",
    background: "Solid white or black",
    colorLimit: "Unlimited",
    autoNegatives: ["blurry edges", "background artifacts", "low resolution", "jagged edges"],
    promptPrefix: "DTF print-ready, full-color, crisp edges, isolated subject",
    artStyleWarnings: {},
  },
  {
    id: "sublimation",
    label: "Sublimation",
    description: "Vibrant edge-to-edge art that fills the entire print area with no gaps",
    bestFor: "White polyester only",
    background: "Solid white",
    colorLimit: "Unlimited",
    autoNegatives: ["transparent gaps", "white space", "isolated subject", "clipped edges", "visible seams"],
    promptPrefix: "sublimation print-ready, vibrant edge-to-edge, seamless full-bleed design",
    artStyleWarnings: {
      "line-art": "Line art may look too thin when sublimated — consider heavier strokes",
    },
  },
  {
    id: "screen-print",
    label: "Screen Print",
    description: "Bold shapes with limited flat colors, no gradients, thick outlines",
    bestFor: "Any garment, bulk orders",
    background: "Solid white or black",
    colorLimit: "1–6 spot colors",
    autoNegatives: ["gradients", "photorealism", "complex shading", "soft edges", "too many colors"],
    promptPrefix: "screen print style, bold flat colors, thick outlines, limited color palette, no gradients",
    artStyleWarnings: {
      photorealistic: "Photorealistic style is incompatible with screen print — use vector or flat styles",
      watercolor: "Watercolor gradients cannot be screen printed — simplify to flat washes",
      "3d-render": "3D renders have too many gradients for screen print — flatten colors",
    },
  },
  {
    id: "dtg",
    label: "DTG (Direct to Garment)",
    description: "Full-color art with slightly soft edges that look natural on fabric",
    bestFor: "Cotton tees, small runs",
    background: "Solid white or black",
    colorLimit: "Unlimited",
    autoNegatives: ["hard mechanical edges", "vector-perfect lines", "metallic effects"],
    promptPrefix: "DTG print-ready, full-color, soft natural fabric texture edges",
    artStyleWarnings: {},
  },
  {
    id: "embroidery",
    label: "Embroidery-style",
    description: "Simple bold shapes that look like they could be stitched with thread",
    bestFor: "Polos, caps, jackets",
    background: "Solid white or black",
    colorLimit: "1–12 thread colors",
    autoNegatives: ["fine detail", "photorealism", "gradients", "thin lines", "complex shading"],
    promptPrefix: "embroidery-style design, bold simple shapes, thread-stitch appearance, limited colors",
    artStyleWarnings: {
      photorealistic: "Photorealism cannot be embroidered — simplify to bold shapes",
      halftone: "Halftone dots can't be stitched — use solid fills instead",
    },
  },
  {
    id: "vinyl-htv",
    label: "Vinyl / HTV",
    description: "Clean solid shapes with no gradients — perfect for cutting machines",
    bestFor: "Names, numbers, simple logos",
    background: "Solid white or black",
    colorLimit: "1–3 layers",
    autoNegatives: ["gradients", "shading", "photorealism", "fine detail", "overlapping colors"],
    promptPrefix: "vinyl-cut ready, clean solid shapes, no gradients, sharp contour edges",
    artStyleWarnings: {
      watercolor: "Watercolor can't be cut as vinyl — use flat solid shapes",
      photorealistic: "Photos can't be cut as vinyl — use silhouette or flat art",
    },
  },
  {
    id: "puff-print",
    label: "Puff Print 3D",
    description: "Bold raised-looking shapes with thick outlines suited for 3D puff ink",
    bestFor: "Streetwear, bold logos",
    background: "Solid white or black",
    colorLimit: "1–4 colors",
    autoNegatives: ["fine lines", "gradients", "small text", "detailed shading", "thin elements"],
    promptPrefix: "puff print 3D style, bold raised shapes, thick outlines, dimensional appearance",
    artStyleWarnings: {
      "line-art": "Thin line art won't puff well — use thicker strokes",
      stipple: "Stipple dots are too fine for puff print — use solid fills",
    },
  },
  {
    id: "discharge",
    label: "Discharge Soft-Hand",
    description: "Faded, cracked, worn-looking art that looks like a vintage thrift find",
    bestFor: "Vintage aesthetic, retro brands",
    background: "Solid white or black",
    colorLimit: "Limited",
    autoNegatives: ["crisp edges", "perfect lines", "clean modern look", "sharp detail"],
    promptPrefix: "discharge print style, faded vintage wash, cracked worn appearance, soft-hand feel",
    artStyleWarnings: {
      vector: "Clean vector edges conflict with discharge — the vintage wash will soften them anyway",
    },
  },
  {
    id: "foil-metallic",
    label: "Foil Metallic",
    description: "Designs with metallic shine, foil-stamped appearance, clean edges",
    bestFor: "Luxury, premium branding",
    background: "Solid black (shows foil)",
    colorLimit: "1–2 foil colors",
    autoNegatives: ["gradients", "multi-color blends", "photorealism", "soft textures"],
    promptPrefix: "foil metallic print, metallic shine, foil-stamped appearance, clean sharp edges",
    artStyleWarnings: {
      watercolor: "Watercolor textures conflict with foil — use clean geometric shapes",
      "grunge-texture": "Grunge textures may reduce foil clarity — keep shapes clean",
    },
  },
] as const;

export function getPrintMethodById(id: string): PrintMethod | undefined {
  return PRINT_METHODS.find((m) => m.id === id);
}
