/** Field suggestion presets per template + field combo */
export const FIELD_PRESETS: Record<string, Record<string, string[]>> = {
  clothing: {
    subject: ["skull", "lion", "eagle", "dragon", "roses", "snake", "wolf", "tiger", "phoenix", "samurai", "angel wings", "crown", "flames", "koi fish", "panther", "dagger"],
    style: ["screenprint", "vector", "hand-drawn illustration", "vintage distressed", "halftone", "woodcut", "stipple", "stencil art", "line art", "engraving", "risograph", "cel-shaded"],
    mood: ["bold", "dark", "aggressive", "elegant", "raw", "gritty", "ethereal", "fierce", "powerful", "mysterious", "rebellious", "edgy"],
    background: ["transparent background", "solid white (#FFFFFF) background", "solid black (#000000) background", "off-white (#F5F5F5) background", "none, isolated subject"],
    avoid: ["text", "lettering", "words", "watermark", "border", "blurry edges", "photorealism", "gradient background"],
  },
  social: {
    subject: ["brand pattern", "flat lay", "lifestyle shot", "product closeup", "quote card background", "abstract gradient", "team photo setup", "food styling"],
    style: ["modern minimal", "editorial", "bold graphic", "soft pastel", "dark moody", "vintage film", "neon glow", "hand-drawn"],
    mood: ["aspirational", "energetic", "calm", "playful", "professional", "luxurious", "authentic", "inspiring"],
    composition: ["centered", "rule of thirds", "negative space left", "text safe zone top", "full bleed", "symmetrical"],
    avoid: ["text", "clutter", "busy backgrounds", "low contrast", "tiny details", "watermarks"],
  },
  marketing: {
    product: ["sneaker launch", "mobile app", "SaaS dashboard", "beauty product", "food delivery", "fitness program", "online course", "subscription box"],
    headline: ["urgency", "luxury reveal", "seasonal", "discount", "new arrival", "limited edition", "before/after", "social proof"],
    style: ["bold graphic", "clean minimal", "lifestyle", "editorial", "retro", "futuristic", "organic", "premium"],
    mood: ["exciting", "trustworthy", "exclusive", "playful", "professional", "warm", "energetic", "sophisticated"],
    avoid: ["text", "logos", "fine print", "busy backgrounds", "low quality", "stock photo feel"],
  },
  brand: {
    brandname: ["SAVAGE", "APEX", "NOIR", "ZENITH", "ATLAS", "PULSE", "FORGE", "EMBER", "DRIFT", "NOVA"],
    subject: ["phoenix", "crown", "lion", "shield", "mountain", "wave", "flame", "compass", "diamond", "wolf"],
    style: ["line art", "emblem badge", "minimalist", "lettermark", "geometric", "vintage seal", "abstract", "monogram"],
    mood: ["premium", "bold", "trustworthy", "modern", "timeless", "innovative", "luxurious", "approachable"],
    composition: ["centered", "circular", "shield", "horizontal lockup", "stacked", "icon + wordmark"],
    avoid: ["gradients", "too many colors", "tiny details", "generic clipart", "3D effects"],
  },
  freestyle: {
    subject: ["cosmic landscape", "underwater city", "mechanical heart", "floating island", "neon jungle", "crystal cave", "time portal", "dream sequence"],
    style: ["oil painting", "digital art", "watercolor", "photo manipulation", "pixel art", "pencil sketch", "collage", "surrealism"],
    mood: ["ethereal", "dark", "whimsical", "epic", "peaceful", "chaotic", "nostalgic", "futuristic"],
    composition: ["centered", "panoramic", "close-up", "bird's eye", "dutch angle", "symmetrical", "layered depth"],
    details: ["4K resolution", "sharp focus", "volumetric lighting", "ray tracing", "film grain", "bokeh", "god rays", "lens flare"],
  },
  album: {
    subject: ["silhouette figure", "cosmic void", "city skyline at night", "abstract fluid", "portrait with shadows", "surreal landscape", "neon lights", "abandoned building"],
    style: ["cinematic", "painted", "collage", "photography", "minimalist", "psychedelic", "glitch art", "double exposure"],
    mood: ["moody", "dreamy", "aggressive", "melancholic", "euphoric", "dark", "ethereal", "raw"],
    genre: ["hip-hop", "indie", "R&B", "electronic", "rock", "jazz", "pop", "ambient"],
    avoid: ["text", "album title", "artist name", "watermark", "low quality", "generic stock"],
  },
  poster: {
    subject: ["concert scene", "hero pose", "abstract explosion", "crowd shot", "dancer", "cityscape", "nature panorama", "event collage"],
    style: ["bold graphic", "Swiss grid", "psychedelic", "minimalist", "grunge", "art nouveau", "constructivist", "pop art"],
    mood: ["high energy", "sophisticated", "mysterious", "celebratory", "intense", "dreamy", "rebellious", "elegant"],
    composition: ["text space top", "text space bottom", "full bleed", "centered focal", "split layout", "diagonal flow"],
    avoid: ["text", "date", "venue name", "sponsor logos", "QR codes", "small print"],
  },
  sticker: {
    subject: ["skull", "mushroom", "ghost", "cat face", "pizza slice", "crystal ball", "alien", "cactus", "flame", "rainbow"],
    style: ["kawaii", "skate punk", "retro", "pixel art", "chibi", "pop art", "gothic", "doodle"],
    mood: ["fun", "edgy", "cute", "spooky", "chill", "wild", "sweet", "dark"],
    shape: ["circle", "die-cut", "star", "heart", "rectangle", "oval", "custom outline", "badge"],
    avoid: ["gradients", "thin lines", "too many colors", "tiny details", "realistic shading", "background"],
  },
  tattoo: {
    subject: ["skull", "rose", "dragon", "snake", "lion", "geometric mandala", "compass", "feather", "clock", "butterfly"],
    style: ["traditional", "fine line", "blackwork", "neo-traditional", "Japanese", "geometric", "dotwork", "watercolor", "tribal", "realism"],
    placement: ["forearm", "chest", "back", "shoulder", "calf", "thigh", "ribcage", "neck", "wrist", "ankle"],
    colors: ["black ink only", "black and grey", "#8B0000 red accent", "full color", "black with gold", "limited palette"],
    avoid: ["color background", "blurry lines", "too much detail", "text", "realistic skin"],
  },
  sneaker: {
    silhouette: ["low-top", "high-top", "runner", "boot", "slide", "platform", "mid-top", "slip-on"],
    style: ["futuristic", "retro", "minimal", "chunky", "techwear", "luxury", "streetwear", "outdoor"],
    materials: ["leather", "mesh", "suede", "canvas", "nylon", "patent leather", "woven", "recycled materials"],
    colors: ["black/white", "all white", "earth tones", "neon accents", "monochrome", "pastel", "metallic"],
    details: ["gum sole", "3M reflective", "visible air unit", "translucent sole", "co-branding space", "zipper detail", "velcro strap"],
    avoid: ["brand logos", "laces untied", "wrinkled", "dirty", "worn"],
  },
  character: {
    character: ["robot", "warrior", "wizard", "fox mascot", "space explorer", "ninja", "fairy", "demon", "pirate", "superhero"],
    style: ["anime", "cartoon", "realistic", "chibi", "comic book", "pixel art", "cel-shaded", "concept art"],
    outfit: ["streetwear", "armor", "robes", "futuristic suit", "casual", "fantasy gear", "school uniform", "cyberpunk"],
    pose: ["standing front", "action leap", "sitting casual", "fighting stance", "walking", "running", "floating", "crossed arms"],
    avoid: ["background", "extra limbs", "blurry", "low detail", "watermark"],
  },
  pattern: {
    subject: ["florals", "geometric shapes", "dots", "tropical leaves", "abstract waves", "skulls", "stars", "animal print", "paisley", "terrazzo"],
    style: ["hand-drawn", "digital", "block print", "watercolor", "minimal line", "vintage", "art deco", "organic"],
    mood: ["elegant", "playful", "bold", "calm", "whimsical", "luxurious", "retro", "modern"],
    density: ["sparse", "medium", "dense", "very dense", "scattered", "clustered"],
    avoid: ["visible repeat edge", "inconsistent spacing", "too many colors", "realistic elements"],
  },
  bookcover: {
    subject: ["mysterious door", "vast landscape", "lone figure", "ancient ruins", "city at night", "abstract shapes", "portal", "stormy sea"],
    style: ["cinematic", "illustrated", "photographic", "painterly", "graphic", "mixed media", "typographic", "collage"],
    genre: ["thriller", "sci-fi", "romance", "fantasy", "literary fiction", "horror", "mystery", "self-help"],
    composition: ["open top third", "centered subject", "full bleed", "vignette", "split design", "border frame"],
    avoid: ["title text", "author name", "typography", "barcode", "endorsement quotes"],
  },
  pin: {
    subject: ["cat face", "crystal", "ghost", "mushroom", "moon", "skull", "heart", "planet", "potion bottle", "gem"],
    style: ["kawaii", "hard enamel", "soft enamel", "vintage", "punk", "pastel", "gothic", "minimal"],
    mood: ["cute", "punk", "witchy", "dreamy", "edgy", "sweet", "mystical", "retro"],
    shape: ["circle", "die-cut", "star", "heart", "shield", "hexagon", "custom outline"],
    avoid: ["gradients", "tiny details", "more than 5 colors", "realistic shading", "text"],
  },
  carwrap: {
    design: ["geometric shards", "flames", "racing stripes", "camo pattern", "abstract flow", "tribal", "circuit board", "wave pattern"],
    style: ["motorsport", "luxury", "JDM", "drift", "street racing", "military", "minimal", "exotic"],
    vehicle: ["sedan", "SUV", "truck", "sports car", "van", "hatchback", "pickup", "coupe"],
    colors: ["black/red", "matte black", "chrome", "white/blue", "carbon fiber look", "gold accent"],
    coverage: ["full wrap", "half wrap", "quarter panels", "hood and roof", "side panels only", "accent stripes"],
  },
  meme: {
    subject: ["shocked cat", "confused dog", "smiling frog", "surprised pikachu style", "disappointed bird", "excited monkey", "tired sloth", "judgmental owl"],
    expression: ["shocked", "smug", "crying laughing", "confused", "disappointed", "excited", "tired", "angry"],
    style: ["cartoon", "photorealistic", "pixel art", "sketch", "chibi", "bold graphic", "sticker style"],
    context: ["plain white", "desk", "couch", "outdoor", "office", "kitchen", "blank void", "spotlight"],
  },
  mockup: {
    product: ["glass bottle", "tote bag", "coffee mug", "t-shirt", "phone case", "book", "packaging box", "candle"],
    scene: ["marble surface", "wood table", "concrete slab", "fabric backdrop", "nature setting", "studio", "shelf display", "hand holding"],
    style: ["editorial", "minimal ecommerce", "lifestyle", "luxury", "rustic", "modern", "clean studio", "artistic"],
    lighting: ["soft natural", "dramatic side", "studio flat", "golden hour", "backlit", "moody", "bright even", "rim light"],
  },
  jewelry: {
    piece: ["ring", "necklace", "bracelet", "earrings", "pendant", "brooch", "cuff", "anklet"],
    style: ["art deco", "minimalist", "bohemian", "vintage", "modern", "Gothic", "organic", "architectural"],
    material: ["18K gold", "sterling silver", "rose gold", "platinum", "brass", "titanium", "mixed metals", "white gold"],
    gemstones: ["diamond solitaire", "emerald cluster", "ruby", "sapphire", "opal", "pearl", "amethyst", "topaz"],
  },
  wallpaper: {
    subject: ["mountain range", "abstract fluid", "cosmic nebula", "forest canopy", "ocean waves", "desert dunes", "northern lights", "rain on glass"],
    style: ["photography", "digital art", "3D render", "illustration", "gradient", "minimalist", "surreal", "geometric"],
    mood: ["calm", "dramatic", "moody", "serene", "energetic", "mystical", "warm", "cold"],
    device: ["phone 9:16 portrait", "desktop 16:9 landscape", "tablet 4:3", "ultrawide 21:9", "phone 19.5:9", "dual monitor 32:9"],
  },
  threeD: {
    subject: ["sneaker", "car", "furniture", "robot", "weapon", "architecture", "jewelry", "product packaging"],
    style: ["photorealistic", "low poly", "stylized", "clay render", "wireframe", "toon shader", "PBR", "voxel"],
    material: ["matte plastic", "glass", "brushed metal", "ceramic", "wood", "carbon fiber", "leather", "stone"],
    lighting: ["studio HDRI", "dramatic rim light", "soft ambient", "neon accent", "natural outdoor", "volumetric"],
    camera: ["3/4 view", "isometric", "front elevation", "hero angle", "top down", "close-up detail"],
  },
  collection: {
    theme: ["zodiac signs", "four elements", "seasons", "emotions", "gemstones", "mythical creatures", "planets", "tarot cards"],
    subject: ["lion", "eagle", "dragon", "wolf", "phoenix", "serpent", "bear", "owl"],
    style: ["screenprint", "vector", "oil painting", "woodcut", "digital art", "watercolor", "line art"],
    colors: ["#000000 black, #FFD700 gold", "#1a1a2e navy, #e94560 red", "#2d3436 charcoal, #00b894 emerald", "monochrome", "earth tones"],
    unique: ["fire", "water", "earth", "air", "light", "shadow", "ice", "lightning"],
  },
} as const;

/** Get suggestion presets for a specific template + field combination */
export function getPresetsForField(
  templateId: string,
  fieldId: string,
): readonly string[] {
  const templatePresets = FIELD_PRESETS[templateId];
  if (!templatePresets) return [];
  return (templatePresets as Record<string, readonly string[]>)[fieldId] ?? [];
}
