import { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from "react";
import {
  Home, Zap, BookOpen, Settings, Sun, Moon, ChevronLeft, ChevronRight,
  Sparkles, ArrowRight, Star, Clock, X, CheckCircle, AlertTriangle, Info,
  AlertCircle, Search, Copy, Undo2, Redo2, Trash2, Shuffle, ChevronDown,
  ChevronUp, Clipboard, Check, Lightbulb, Wand2, Save, RotateCw, BookMarked,
  Plus, Image, Eye, Loader2, Share2, Lock, Heart, ExternalLink, Layers,
  FileText, SlidersHorizontal, Download, Upload, Database, Keyboard,
  Palette, Tag, Filter, MoreHorizontal, Edit3, RefreshCw, GitBranch
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════════ */

const TEMPLATES = [
  { id: "clothing", name: "Clothing", description: "T-shirts, hoodies", emoji: "👕", fields: [
    { key: "subject", label: "SUBJECT", question: "Main graphic?", placeholder: "skull, lion, eagle...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Art technique?", placeholder: "screenprint, vector...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Vibe?", placeholder: "bold, dark, fierce...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#FFD700 gold, #000000 black", color: "#34D399" },
    { key: "background", label: "BACKGROUND", question: "Behind subject?", placeholder: "transparent, white...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, watermark...", color: "#FBBF24" },
  ], tip: "Select your platform and post type for the correct aspect ratio." },
  { id: "social", name: "Social Media", description: "IG, TikTok, FB", emoji: "📱", fields: [
    { key: "subject", label: "SUBJECT", question: "Image about?", placeholder: "brand pattern, flat lay...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Visual style?", placeholder: "modern minimal, editorial...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Feeling?", placeholder: "aspirational, energetic...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#6C5CE7 purple, #FFFFFF white", color: "#34D399" },
    { key: "composition", label: "COMPOSITION", question: "Layout?", placeholder: "centered, rule of thirds...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Leave out?", placeholder: "text, clutter...", color: "#FBBF24" },
  ], tip: "Select your platform and post type for the correct aspect ratio." },
  { id: "marketing", name: "Marketing", description: "Ads, banners, promos", emoji: "📣", fields: [
    { key: "product", label: "PRODUCT/SERVICE", question: "What are you promoting?", placeholder: "sneaker launch, app...", color: "#FF4D6D" },
    { key: "headline", label: "HEADLINE CONCEPT", question: "Key message vibe?", placeholder: "urgency, luxury reveal...", color: "#FF6B35" },
    { key: "style", label: "VISUAL STYLE", question: "Creative direction?", placeholder: "bold graphic, clean minimal...", color: "#A78BFA" },
    { key: "mood", label: "MOOD", question: "Emotional tone?", placeholder: "exciting, trustworthy...", color: "#34D399" },
    { key: "colors", label: "COLORS", question: "Brand colors?", placeholder: "brand colors or palette...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, logos, fine print...", color: "#FBBF24" },
  ], tip: "Leave text space in your composition." },
  { id: "brand", name: "Brand/Logo", description: "Brand marks", emoji: "✨", fields: [
    { key: "brandname", label: "BRAND NAME", question: "What's the brand called?", placeholder: "SAVAGE, APEX, NOIR...", color: "#F472B6" },
    { key: "subject", label: "SUBJECT", question: "Brand symbol?", placeholder: "phoenix, crown, lion...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Design style?", placeholder: "line art, emblem badge...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Brand feel?", placeholder: "premium, bold...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#000000 black, #C0A060 gold", color: "#34D399" },
    { key: "composition", label: "COMPOSITION", question: "Shape?", placeholder: "centered, circular...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, gradients...", color: "#FBBF24" },
  ], tip: "Keep it simple — logos need to work at favicon and billboard size." },
  { id: "threeD", name: "3D Model", description: "3D renders", emoji: "🧊", fields: [
    { key: "subject", label: "SUBJECT", question: "What object?", placeholder: "sneaker, car, furniture...", color: "#FF4D6D" },
    { key: "style", label: "RENDER STYLE", question: "3D aesthetic?", placeholder: "photorealistic, low poly...", color: "#FF6B35" },
    { key: "material", label: "MATERIAL", question: "Surface?", placeholder: "matte plastic, glass...", color: "#A78BFA" },
    { key: "lighting", label: "LIGHTING", question: "Light setup?", placeholder: "studio HDRI, dramatic rim...", color: "#34D399" },
    { key: "colors", label: "COLORS", question: "Color scheme?", placeholder: "white and chrome...", color: "#60A5FA" },
    { key: "camera", label: "CAMERA ANGLE", question: "Perspective?", placeholder: "3/4 view, isometric...", color: "#E879F9" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "flat shading, text...", color: "#FBBF24" },
  ], tip: "Specify material + lighting for photorealistic results." },
  { id: "jewelry", name: "Jewelry", description: "Rings, chains, gems", emoji: "💎", fields: [
    { key: "piece", label: "PIECE TYPE", question: "What jewelry?", placeholder: "ring, necklace...", color: "#FF4D6D" },
    { key: "style", label: "DESIGN STYLE", question: "Aesthetic?", placeholder: "art deco, minimalist...", color: "#FF6B35" },
    { key: "material", label: "MATERIAL", question: "Metal & finish?", placeholder: "18K gold, sterling silver...", color: "#A78BFA" },
    { key: "gemstones", label: "GEMSTONES", question: "Stones?", placeholder: "diamond solitaire...", color: "#34D399" },
    { key: "colors", label: "COLORS", question: "Color palette?", placeholder: "gold and emerald...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, skin...", color: "#FBBF24" },
  ], tip: "Specify exact metal finish and stone cut for best results." },
  { id: "collection", name: "Collection", description: "Matching series", emoji: "🔗", fields: [
    { key: "theme", label: "THEME", question: "Series concept?", placeholder: "zodiac, elements...", color: "#FF4D6D" },
    { key: "subject", label: "THIS PIECE", question: "This one?", placeholder: "lion, eagle...", color: "#FF6B35" },
    { key: "style", label: "LOCKED STYLE", question: "Same for ALL", placeholder: "screenprint, vector...", color: "#A78BFA" },
    { key: "colors", label: "LOCKED COLORS", question: "Same for ALL", placeholder: "#000000 black, #FFD700 gold", color: "#34D399" },
    { key: "details", label: "LOCKED DETAILS", question: "Rules for all", placeholder: "no text, transparent bg...", color: "#60A5FA" },
    { key: "unique", label: "UNIQUE ELEMENT", question: "What makes this one different?", placeholder: "fire, water...", color: "#FBBF24" },
  ], tip: "Lock everything except subject and unique element." },
  { id: "freestyle", name: "Freestyle", description: "Build your own", emoji: "🎨", fields: [
    { key: "subject", label: "SUBJECT", question: "What?", placeholder: "anything...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Look?", placeholder: "any style...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Feel?", placeholder: "any vibe...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "any colors...", color: "#34D399" },
    { key: "composition", label: "COMPOSITION", question: "Framing?", placeholder: "centered, wide...", color: "#60A5FA" },
    { key: "details", label: "DETAILS", question: "Extras?", placeholder: "4K, sharp focus...", color: "#FBBF24" },
  ], tip: "Use ChatGPT: 'Give me 3 variations of this prompt.'" },
  { id: "album", name: "Album Cover", description: "Music artwork", emoji: "💿", fields: [
    { key: "subject", label: "SUBJECT", question: "Album concept?", placeholder: "silhouette, cosmic void...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Art style?", placeholder: "cinematic, painted...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Mood?", placeholder: "moody, dreamy...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#0a0a0a black, #FFD700 gold", color: "#34D399" },
    { key: "genre", label: "GENRE FEEL", question: "Genre vibe?", placeholder: "hip-hop, indie...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, watermark...", color: "#FBBF24" },
  ], tip: "Square 1:1 always. Leave space for a title." },
  { id: "poster", name: "Poster/Flyer", description: "Events, promos", emoji: "📋", fields: [
    { key: "subject", label: "SUBJECT", question: "Poster about?", placeholder: "concert scene...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "bold graphic...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Energy?", placeholder: "high energy...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#FF0000 red, #000000 black", color: "#34D399" },
    { key: "composition", label: "LAYOUT", question: "Space for text?", placeholder: "text space top...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, date...", color: "#FBBF24" },
  ], tip: "Leave clear space for event details." },
  { id: "sticker", name: "Sticker/Patch", description: "Die-cut designs", emoji: "🏷️", fields: [
    { key: "subject", label: "SUBJECT", question: "Sticker of?", placeholder: "skull, ghost...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "kawaii, skate punk...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Vibe?", placeholder: "fun, edgy...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#FF6B6B red...", color: "#34D399" },
    { key: "shape", label: "SHAPE", question: "Outline shape?", placeholder: "circle, die-cut...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "gradients...", color: "#FBBF24" },
  ], tip: "Thick outlines + flat colors. Max 4-5 colors." },
  { id: "wallpaper", name: "Wallpaper", description: "Phone/desktop", emoji: "🖼️", fields: [
    { key: "subject", label: "SUBJECT", question: "Scene?", placeholder: "mountains, abstract...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "photography, digital...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Mood?", placeholder: "calm, dramatic...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#0a0a2e navy...", color: "#34D399" },
    { key: "device", label: "DEVICE", question: "Dimensions?", placeholder: "phone 9:16...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, busy center...", color: "#FBBF24" },
  ], tip: "Phone = 9:16, Desktop = 16:9. Keep center clean." },
  { id: "mockup", name: "Product Mockup", description: "Lifestyle scenes", emoji: "📦", fields: [
    { key: "product", label: "PRODUCT", question: "What product?", placeholder: "glass bottle...", color: "#FF4D6D" },
    { key: "scene", label: "SCENE", question: "Setting?", placeholder: "marble surface...", color: "#FF6B35" },
    { key: "style", label: "STYLE", question: "Photo style?", placeholder: "editorial, minimal...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#F5F5F5 white...", color: "#34D399" },
    { key: "lighting", label: "LIGHTING", question: "Light?", placeholder: "soft natural...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, logos...", color: "#FBBF24" },
  ], tip: "Specify exact surface and lighting direction." },
  { id: "tattoo", name: "Tattoo Design", description: "Ink concepts", emoji: "🖋️", fields: [
    { key: "subject", label: "SUBJECT", question: "Tattoo of?", placeholder: "skull, rose...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Tattoo style?", placeholder: "traditional, fine line...", color: "#FF6B35" },
    { key: "placement", label: "PLACEMENT", question: "Body area?", placeholder: "forearm, chest...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Ink colors?", placeholder: "black ink only...", color: "#34D399" },
    { key: "size", label: "SIZE", question: "Scale?", placeholder: "small 2-3in...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "color bg...", color: "#FBBF24" },
  ], tip: "White background always. Specify line weight." },
  { id: "sneaker", name: "Sneaker Concept", description: "Shoe designs", emoji: "👟", fields: [
    { key: "silhouette", label: "SILHOUETTE", question: "Shoe type?", placeholder: "low-top, high-top...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Design style?", placeholder: "futuristic, retro...", color: "#FF6B35" },
    { key: "materials", label: "MATERIALS", question: "Materials?", placeholder: "leather, mesh...", color: "#A78BFA" },
    { key: "colors", label: "COLORWAY", question: "Hex + name?", placeholder: "#000000 black...", color: "#34D399" },
    { key: "details", label: "DETAILS", question: "Special features?", placeholder: "gum sole, 3M...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "brand logos...", color: "#FBBF24" },
  ], tip: "Side profile gives the cleanest concept view." },
  { id: "pattern", name: "Pattern/Texture", description: "Seamless, tileable", emoji: "🔲", fields: [
    { key: "subject", label: "ELEMENTS", question: "Pattern elements?", placeholder: "florals, geometric...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "hand-drawn, digital...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Mood?", placeholder: "elegant, playful...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#1a1a4a navy...", color: "#34D399" },
    { key: "density", label: "DENSITY", question: "How packed?", placeholder: "sparse, medium...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "visible repeat edge...", color: "#FBBF24" },
  ], tip: "Always say 'seamless tileable' for clean repeats." },
  { id: "character", name: "Character", description: "OC, mascot design", emoji: "🧑‍🎨", fields: [
    { key: "character", label: "CHARACTER", question: "Who/what?", placeholder: "robot, warrior...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Art style?", placeholder: "anime, cartoon...", color: "#FF6B35" },
    { key: "outfit", label: "OUTFIT", question: "Wearing?", placeholder: "streetwear, armor...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#FF0000 red...", color: "#34D399" },
    { key: "pose", label: "POSE", question: "Pose?", placeholder: "standing front...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "background, extra limbs...", color: "#FBBF24" },
  ], tip: "'Character sheet' gets you reference views." },
  { id: "bookcover", name: "Book/Zine", description: "Cover art", emoji: "📖", fields: [
    { key: "subject", label: "CONCEPT", question: "Cover concept?", placeholder: "mysterious door...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "cinematic...", color: "#FF6B35" },
    { key: "genre", label: "GENRE", question: "Genre feel?", placeholder: "thriller, sci-fi...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#0a0a0a black...", color: "#34D399" },
    { key: "composition", label: "LAYOUT", question: "Title space?", placeholder: "open top third...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "title text...", color: "#FBBF24" },
  ], tip: "Leave clear space for title text." },
  { id: "pin", name: "Enamel Pin", description: "Collectible pins", emoji: "📌", fields: [
    { key: "subject", label: "SUBJECT", question: "Pin of?", placeholder: "cat face, crystal...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "kawaii, hard enamel...", color: "#FF6B35" },
    { key: "mood", label: "MOOD", question: "Vibe?", placeholder: "cute, punk...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Enamel fills?", placeholder: "max 3-4...", color: "#34D399" },
    { key: "shape", label: "SHAPE", question: "Pin shape?", placeholder: "circle, die-cut...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "gradients...", color: "#FBBF24" },
  ], tip: "Real pins max 4-5 colors. Keep it simple." },
  { id: "carwrap", name: "Car Wrap", description: "Vehicle graphics", emoji: "🚗", fields: [
    { key: "design", label: "DESIGN", question: "Wrap pattern?", placeholder: "geometric shards...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "motorsport, JDM...", color: "#FF6B35" },
    { key: "vehicle", label: "VEHICLE", question: "Vehicle type?", placeholder: "sedan, SUV...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "#000000 black...", color: "#34D399" },
    { key: "coverage", label: "COVERAGE", question: "How much?", placeholder: "full wrap...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, phone numbers...", color: "#FBBF24" },
  ], tip: "Side profile view gives the best preview." },
  { id: "meme", name: "Reaction/Meme", description: "Shareable images", emoji: "😂", fields: [
    { key: "subject", label: "SUBJECT", question: "Character?", placeholder: "shocked cat...", color: "#FF4D6D" },
    { key: "style", label: "STYLE", question: "Style?", placeholder: "cartoon...", color: "#FF6B35" },
    { key: "expression", label: "EXPRESSION", question: "Face?", placeholder: "shocked, smug...", color: "#A78BFA" },
    { key: "colors", label: "COLORS", question: "Hex + name?", placeholder: "bright saturated...", color: "#34D399" },
    { key: "context", label: "BACKGROUND", question: "Setting?", placeholder: "plain white...", color: "#60A5FA" },
    { key: "avoid", label: "AVOID", question: "Exclude?", placeholder: "text, captions...", color: "#FBBF24" },
  ], tip: "Exaggerate the expression — subtlety doesn't work." },
];

const FIELD_PRESETS = {"clothing":{"subject":["skull","lion","eagle","dragon","roses","snake","wolf","tiger","phoenix","samurai","angel wings","crown","flames","koi fish","panther","dagger"],"style":["screenprint","vector","hand-drawn illustration","vintage distressed","halftone","woodcut","stipple","stencil art","line art","engraving","risograph","cel-shaded"],"mood":["bold","dark","aggressive","elegant","raw","gritty","ethereal","fierce","powerful","mysterious","rebellious","edgy"],"background":["transparent background","solid white (#FFFFFF) background","solid black (#000000) background","off-white (#F5F5F5) background","none, isolated subject"],"avoid":["text","lettering","words","watermark","border","blurry edges","photorealism","gradient background"]},"social":{"subject":["brand pattern","flat lay","lifestyle shot","product closeup","quote card background","abstract gradient","team photo setup","food styling"],"style":["modern minimal","editorial","bold graphic","soft pastel","dark moody","vintage film","neon glow","hand-drawn"],"mood":["aspirational","energetic","calm","playful","professional","luxurious","authentic","inspiring"],"composition":["centered","rule of thirds","negative space left","text safe zone top","full bleed","symmetrical"],"avoid":["text","clutter","busy backgrounds","low contrast","tiny details","watermarks"]},"marketing":{"product":["sneaker launch","mobile app","SaaS dashboard","beauty product","food delivery","fitness program","online course","subscription box"],"headline":["urgency","luxury reveal","seasonal","discount","new arrival","limited edition","before/after","social proof"],"style":["bold graphic","clean minimal","lifestyle","editorial","retro","futuristic","organic","premium"],"mood":["exciting","trustworthy","exclusive","playful","professional","warm","energetic","sophisticated"],"avoid":["text","logos","fine print","busy backgrounds","low quality","stock photo feel"]},"brand":{"brandname":["SAVAGE","APEX","NOIR","ZENITH","ATLAS","PULSE","FORGE","EMBER","DRIFT","NOVA"],"subject":["phoenix","crown","lion","shield","mountain","wave","flame","compass","diamond","wolf"],"style":["line art","emblem badge","minimalist","lettermark","geometric","vintage seal","abstract","monogram"],"mood":["premium","bold","trustworthy","modern","timeless","innovative","luxurious","approachable"],"composition":["centered","circular","shield","horizontal lockup","stacked","icon + wordmark"],"avoid":["gradients","too many colors","tiny details","generic clipart","3D effects"]},"freestyle":{"subject":["cosmic landscape","underwater city","mechanical heart","floating island","neon jungle","crystal cave","time portal","dream sequence"],"style":["oil painting","digital art","watercolor","photo manipulation","pixel art","pencil sketch","collage","surrealism"],"mood":["ethereal","dark","whimsical","epic","peaceful","chaotic","nostalgic","futuristic"],"composition":["centered","panoramic","close-up","bird's eye","dutch angle","symmetrical","layered depth"],"details":["4K resolution","sharp focus","volumetric lighting","ray tracing","film grain","bokeh","god rays","lens flare"]},"album":{"subject":["silhouette figure","cosmic void","city skyline at night","abstract fluid","portrait with shadows","surreal landscape","neon lights","abandoned building"],"style":["cinematic","painted","collage","photography","minimalist","psychedelic","glitch art","double exposure"],"mood":["moody","dreamy","aggressive","melancholic","euphoric","dark","ethereal","raw"],"genre":["hip-hop","indie","R&B","electronic","rock","jazz","pop","ambient"],"avoid":["text","album title","artist name","watermark","low quality","generic stock"]},"poster":{"subject":["concert scene","hero pose","abstract explosion","crowd shot","dancer","cityscape","nature panorama","event collage"],"style":["bold graphic","Swiss grid","psychedelic","minimalist","grunge","art nouveau","constructivist","pop art"],"mood":["high energy","sophisticated","mysterious","celebratory","intense","dreamy","rebellious","elegant"],"composition":["text space top","text space bottom","full bleed","centered focal","split layout","diagonal flow"],"avoid":["text","date","venue name","sponsor logos","QR codes","small print"]},"sticker":{"subject":["skull","mushroom","ghost","cat face","pizza slice","crystal ball","alien","cactus","flame","rainbow"],"style":["kawaii","skate punk","retro","pixel art","chibi","pop art","gothic","doodle"],"mood":["fun","edgy","cute","spooky","chill","wild","sweet","dark"],"shape":["circle","die-cut","star","heart","rectangle","oval","custom outline","badge"],"avoid":["gradients","thin lines","too many colors","tiny details","realistic shading","background"]},"tattoo":{"subject":["skull","rose","dragon","snake","lion","geometric mandala","compass","feather","clock","butterfly"],"style":["traditional","fine line","blackwork","neo-traditional","Japanese","geometric","dotwork","watercolor","tribal","realism"],"placement":["forearm","chest","back","shoulder","calf","thigh","ribcage","neck","wrist","ankle"],"colors":["black ink only","black and grey","#8B0000 red accent","full color","black with gold","limited palette"],"avoid":["color background","blurry lines","too much detail","text","realistic skin"]},"sneaker":{"silhouette":["low-top","high-top","runner","boot","slide","platform","mid-top","slip-on"],"style":["futuristic","retro","minimal","chunky","techwear","luxury","streetwear","outdoor"],"materials":["leather","mesh","suede","canvas","nylon","patent leather","woven","recycled materials"],"colors":["black/white","all white","earth tones","neon accents","monochrome","pastel","metallic"],"details":["gum sole","3M reflective","visible air unit","translucent sole","co-branding space","zipper detail","velcro strap"],"avoid":["brand logos","laces untied","wrinkled","dirty","worn"]},"character":{"character":["robot","warrior","wizard","fox mascot","space explorer","ninja","fairy","demon","pirate","superhero"],"style":["anime","cartoon","realistic","chibi","comic book","pixel art","cel-shaded","concept art"],"outfit":["streetwear","armor","robes","futuristic suit","casual","fantasy gear","school uniform","cyberpunk"],"pose":["standing front","action leap","sitting casual","fighting stance","walking","running","floating","crossed arms"],"avoid":["background","extra limbs","blurry","low detail","watermark"]},"pattern":{"subject":["florals","geometric shapes","dots","tropical leaves","abstract waves","skulls","stars","animal print","paisley","terrazzo"],"style":["hand-drawn","digital","block print","watercolor","minimal line","vintage","art deco","organic"],"mood":["elegant","playful","bold","calm","whimsical","luxurious","retro","modern"],"density":["sparse","medium","dense","very dense","scattered","clustered"],"avoid":["visible repeat edge","inconsistent spacing","too many colors","realistic elements"]},"bookcover":{"subject":["mysterious door","vast landscape","lone figure","ancient ruins","city at night","abstract shapes","portal","stormy sea"],"style":["cinematic","illustrated","photographic","painterly","graphic","mixed media","typographic","collage"],"genre":["thriller","sci-fi","romance","fantasy","literary fiction","horror","mystery","self-help"],"composition":["open top third","centered subject","full bleed","vignette","split design","border frame"],"avoid":["title text","author name","typography","barcode","endorsement quotes"]},"pin":{"subject":["cat face","crystal","ghost","mushroom","moon","skull","heart","planet","potion bottle","gem"],"style":["kawaii","hard enamel","soft enamel","vintage","punk","pastel","gothic","minimal"],"mood":["cute","punk","witchy","dreamy","edgy","sweet","mystical","retro"],"shape":["circle","die-cut","star","heart","shield","hexagon","custom outline"],"avoid":["gradients","tiny details","more than 5 colors","realistic shading","text"]},"carwrap":{"design":["geometric shards","flames","racing stripes","camo pattern","abstract flow","tribal","circuit board","wave pattern"],"style":["motorsport","luxury","JDM","drift","street racing","military","minimal","exotic"],"vehicle":["sedan","SUV","truck","sports car","van","hatchback","pickup","coupe"],"colors":["black/red","matte black","chrome","white/blue","carbon fiber look","gold accent"],"coverage":["full wrap","half wrap","quarter panels","hood and roof","side panels only","accent stripes"]},"meme":{"subject":["shocked cat","confused dog","smiling frog","surprised pikachu style","disappointed bird","excited monkey","tired sloth","judgmental owl"],"expression":["shocked","smug","crying laughing","confused","disappointed","excited","tired","angry"],"style":["cartoon","photorealistic","pixel art","sketch","chibi","bold graphic","sticker style"],"context":["plain white","desk","couch","outdoor","office","kitchen","blank void","spotlight"]},"mockup":{"product":["glass bottle","tote bag","coffee mug","t-shirt","phone case","book","packaging box","candle"],"scene":["marble surface","wood table","concrete slab","fabric backdrop","nature setting","studio","shelf display","hand holding"],"style":["editorial","minimal ecommerce","lifestyle","luxury","rustic","modern","clean studio","artistic"],"lighting":["soft natural","dramatic side","studio flat","golden hour","backlit","moody","bright even","rim light"]},"jewelry":{"piece":["ring","necklace","bracelet","earrings","pendant","brooch","cuff","anklet"],"style":["art deco","minimalist","bohemian","vintage","modern","Gothic","organic","architectural"],"material":["18K gold","sterling silver","rose gold","platinum","brass","titanium","mixed metals","white gold"],"gemstones":["diamond solitaire","emerald cluster","ruby","sapphire","opal","pearl","amethyst","topaz"]},"wallpaper":{"subject":["mountain range","abstract fluid","cosmic nebula","forest canopy","ocean waves","desert dunes","northern lights","rain on glass"],"style":["photography","digital art","3D render","illustration","gradient","minimalist","surreal","geometric"],"mood":["calm","dramatic","moody","serene","energetic","mystical","warm","cold"],"device":["phone 9:16 portrait","desktop 16:9 landscape","tablet 4:3","ultrawide 21:9","phone 19.5:9","dual monitor 32:9"]}};

const GENERATORS = [
  { id: "nanoBananaPro", name: "🍌 NanoBanana Pro", maxLength: 8000, isDefault: true },
  { id: "midjourney", name: "Midjourney", maxLength: 6000 },
  { id: "dalle", name: "DALL·E / ChatGPT", maxLength: 4000 },
  { id: "sd", name: "Stable Diffusion", maxLength: 10000 },
  { id: "flux", name: "Flux", maxLength: 10000 },
  { id: "leonardo", name: "Leonardo AI", maxLength: 4000 },
  { id: "firefly", name: "Adobe Firefly", maxLength: 1500 },
  { id: "ideogram", name: "Ideogram", maxLength: 6000 },
  { id: "raw", name: "Raw", maxLength: 99999 },
];

const TEMPLATE_GROUPS = [
  { label: "Design & Print", ids: ["clothing", "sticker", "pin", "poster", "album"] },
  { label: "Branding", ids: ["brand", "marketing", "social"] },
  { label: "Art & Illustration", ids: ["tattoo", "character", "pattern", "wallpaper", "bookcover"] },
  { label: "Product", ids: ["sneaker", "jewelry", "threeD", "carwrap", "mockup"] },
  { label: "Other", ids: ["collection", "meme", "freestyle"] },
];

const ACCENTS = [
  { name: "Red", color: "#FF4D6D" }, { name: "Orange", color: "#FF6B35" },
  { name: "Purple", color: "#A78BFA" }, { name: "Green", color: "#34D399" },
  { name: "Blue", color: "#60A5FA" }, { name: "Yellow", color: "#FBBF24" },
  { name: "Pink", color: "#E879F9" }, { name: "Cyan", color: "#06B6D4" },
];


/* ── Phase 3 Data ── */
const TEMPLATE_STYLES = {"clothing":[{"category":"Print Technique","styles":[{"name":"Screenprint Classic","content":"Limited color screenprint aesthetic (2-4 colors). Halftone dot shading, visible ink layers, stacked registration feel...","defaultActive":false},{"name":"DTG Photo-Quality","content":"Clean direct-to-garment print style. Unlimited colors, smooth gradients, crisp edges, no halftone dots. Photo-quality...","defaultActive":false},{"name":"Discharge Soft-Hand","content":"Discharge print aesthetic. Soft, bleached-into-fabric feel. Muted tones, slightly faded, vintage soft-hand texture. F...","defaultActive":false},{"name":"Puff Print 3D","content":"3D puff print aesthetic. Raised, dimensional look. Bold simple shapes, thick outlines, limited color palette. Streetw...","defaultActive":false},{"name":"Embroidery Stitch","content":"Embroidered patch aesthetic. Thick thread texture, limited colors, visible stitch patterns. Varsity jacket or workwea...","defaultActive":false},{"name":"Sublimation All-Over","content":"Sublimation all-over print. Edge-to-edge coverage, bleeds past seams, full surface design. Vivid saturated color, fes...","defaultActive":false},{"name":"Vinyl Cut HTV","content":"Vinyl cut heat transfer aesthetic. Single or dual color only, clean hard edges, zero gradients. Bold simple shapes. C...","defaultActive":false},{"name":"Foil Metallic","content":"Metallic foil print aesthetic. Reflective gold, silver, or holographic finish. Luxury streetwear statement. Catches l...","defaultActive":false},{"name":"Distressed Vintage Wash","content":"Pre-worn vintage wash aesthetic. Cracked ink texture, faded pigment, sun-bleached feel. Looks like you have owned it ...","defaultActive":false}]},{"category":"Graphic Aesthetic","styles":[{"name":"Streetwear Bold","content":"Bold urban streetwear aesthetic. Heavy black outlines, distressed halftone texture, 90s hip-hop poster art. Dramatic ...","defaultActive":false},{"name":"Vintage Band Tee","content":"Vintage band tee aesthetic. Faded screenprint look, cracked ink texture, retro concert poster art. Worn-in, distresse...","defaultActive":false},{"name":"Skate Punk","content":"Skateboard punk aesthetic. Irreverent, hand-drawn, Thrasher energy. Bold, fast, slightly crude on purpose. DIY zine m...","defaultActive":false},{"name":"Tattoo Flash","content":"Traditional tattoo flash art on fabric. Roses, daggers, eagles, skulls. Bold black outlines, limited flat color fills...","defaultActive":false},{"name":"Anime Manga","content":"Japanese anime illustration style. Dynamic poses, expressive eyes, speed lines, vibrant color. Manga panel energy. We...","defaultActive":false},{"name":"Gothic Dark","content":"Dark gothic aesthetic. Skulls, occult symbols, blackletter influence, dark romanticism. Deep blacks, blood reds. All-...","defaultActive":false},{"name":"Retro 70s Sunset","content":"Retro 1970s aesthetic. Warm sunset gradients, racing stripes, retro chrome influence, earth-tone palette. Nostalgic, ...","defaultActive":false},{"name":"Y2K Chrome","content":"Y2K retro-futuristic aesthetic. Iridescent gradients, chrome effects, bubble shapes, metallic sheen. Early 2000s digi...","defaultActive":false},{"name":"Graffiti Wildstyle","content":"Graffiti wildstyle aesthetic. Spray paint drips, aerosol art energy, concrete wall textures, interlocking letter infl...","defaultActive":false},{"name":"Minimalist Mark","content":"Ultra-minimal graphic. One small design element, maximum negative space, clean placement. Expensive-feeling simplicit...","defaultActive":false},{"name":"Nature Outdoor","content":"Outdoor nature aesthetic. Mountain scenes, vintage national park poster feel, muted earth tones, hand-drawn illustrat...","defaultActive":false},{"name":"Preppy Heritage","content":"Preppy collegiate aesthetic. Varsity lettering, university crests, classic sport stripes, shield emblems. Ralph Laure...","defaultActive":false},{"name":"Luxury Fashion","content":"High fashion editorial aesthetic. Rich textures, gold foil energy, elegant detail. Deep blacks, champagne golds, marb...","defaultActive":false},{"name":"Hip-Hop Culture","content":"Hip-hop culture aesthetic. Heavy chains, drip imagery, iconic rap motifs, money and diamond themes. Bold, loud, unapo...","defaultActive":false},{"name":"Cartoon Mascot","content":"Character-driven cartoon mascot. Oversized head, exaggerated features, bold outlines, fun personality. Brandable at a...","defaultActive":false},{"name":"Acid Rave","content":"90s acid rave aesthetic. Smiley faces, trippy distortion, neon on black, warehouse party flyer energy. Psychedelic, u...","defaultActive":false},{"name":"Abstract Graphic","content":"Abstract graphic art. Geometric shapes, paint splatter, non-representational composition. Art-school-meets-streetwear...","defaultActive":false},{"name":"Retro Gaming","content":"Retro gaming pixel aesthetic. 8-bit and 16-bit characters, game UI elements, CRT scan lines. Pixel art nostalgia. Gam...","defaultActive":false},{"name":"Comic Book Pop","content":"Comic book pop art style. Bold outlines, Ben-Day dots, flat saturated colors, action panel energy. Roy Lichtenstein m...","defaultActive":false},{"name":"Botanical Illustration","content":"Botanical illustration style. Fine line drawings, watercolor-like fills, pressed flower feel. Delicate, feminine, org...","defaultActive":false},{"name":"Psychedelic Swirl","content":"Psychedelic swirl art. Melting forms, vibrant neon palette, optical illusions, 60s concert poster energy. Mind-expand...","defaultActive":false}]}],"social":[{"category":"Platform Format","styles":[{"name":"Feed Stopper Bold","content":"Scroll-stopping social media design. Ultra-high contrast, punchy saturation, bold composition designed to halt the sc...","defaultActive":false},{"name":"Story Vertical","content":"Instagram story aesthetic. 9:16 vertical composition, layered elements, swipeable energy. Trendy, fast, raw and authe...","defaultActive":false},{"name":"Carousel Slide","content":"Carousel slide design. Clean single-concept frame, consistent layout, designed to work in a swipeable series. Educati...","defaultActive":false},{"name":"Pinterest Pin","content":"Pinterest-optimized design. Tall vertical composition, aspirational, save-worthy. Warm tones, lifestyle feel, text sp...","defaultActive":false},{"name":"YouTube Thumbnail","content":"YouTube thumbnail style. Extreme contrast, exaggerated focal point, bold color blocking, zoomed-in subject. Designed ...","defaultActive":false}]},{"category":"Content Type","styles":[{"name":"Editorial Clean","content":"Clean editorial social media aesthetic. Magazine white space, elegant layout, refined typography influence. Polished,...","defaultActive":false},{"name":"UGC Authentic","content":"User-generated content aesthetic. Casual, slightly imperfect, natural lighting, real-world setting. Looks user-made, ...","defaultActive":false},{"name":"Flat Lay Product","content":"Flat lay product styling. Top-down arranged objects, organized grid, clean surface. Instagram shop aesthetic. Styled,...","defaultActive":false},{"name":"Moodboard Collage","content":"Moodboard collage aesthetic. Multi-image composition, mixed textures, layered cutouts, scrapbook energy. Pinterest bo...","defaultActive":false},{"name":"Quote Card","content":"Quote card design. Clean background, text-forward layout space, subtle texture or gradient. Built to hold a quote, st...","defaultActive":false},{"name":"Infographic Visual","content":"Infographic visual style. Data-driven, icon-based, sectioned layout, educational feel. Share-worthy knowledge bites. ...","defaultActive":false},{"name":"Behind the Scenes","content":"Behind-the-scenes aesthetic. Candid, workshop or studio vibe, process shots, raw and unpolished. Builds trust and tra...","defaultActive":false},{"name":"Before After Split","content":"Before and after composition. Side-by-side or slider layout, clear transformation, dramatic contrast between two stat...","defaultActive":false},{"name":"Announcement Hype","content":"Announcement hype design. Bold gradients, centered focal element, event-poster energy. Launch day, drop day, big reve...","defaultActive":false},{"name":"Testimonial Review","content":"Testimonial and review design. Soft background, spotlight on quote space, trust-building warmth. Stars, checkmarks, s...","defaultActive":false}]},{"category":"Brand Tone","styles":[{"name":"Luxury Minimal","content":"Luxury minimal social aesthetic. Black, white, and gold only. Massive white space, whisper-quiet elegance. Chanel and...","defaultActive":false},{"name":"Fun Playful","content":"Fun and playful brand aesthetic. Bright primaries, rounded shapes, confetti and doodle accents, youthful bounce. Duol...","defaultActive":false},{"name":"Corporate Trust","content":"Corporate trust aesthetic. Clean grid, navy, white, and grey palette, consistent spacing. LinkedIn-ready, B2B polishe...","defaultActive":false},{"name":"Streetwear Hype","content":"Streetwear hype social aesthetic. Dark background, neon accents, grunge textures, drop-culture urgency. Supreme and P...","defaultActive":false},{"name":"Earthy Organic","content":"Earthy organic brand aesthetic. Muted greens, kraft paper tones, hand-drawn elements, sustainability feel. Farmers ma...","defaultActive":false}]}],"marketing":[{"category":"Ad Styles","styles":[{"name":"Hero Product","content":"Hero product shot. Center frame, dramatic lighting, clean background, premium feel. Product is the star, everything e...","defaultActive":false},{"name":"Lifestyle Context","content":"Lifestyle advertising context. Product in use, aspirational setting, warm natural lighting. Shows the product in real...","defaultActive":false},{"name":"Bold Graphic","content":"Bold graphic advertising style. High contrast, strong colors, dynamic angles. Attention-grabbing, scroll-stopping vis...","defaultActive":false},{"name":"Minimal Clean","content":"Minimal clean ad aesthetic. Lots of white space, single focal point, sophisticated restraint. Premium, luxury brand f...","defaultActive":false},{"name":"Urgency Sale","content":"Urgency-driven ad visual. High energy, bright colors, dynamic composition. Creates excitement and FOMO. Fast-paced, a...","defaultActive":false},{"name":"Social Proof","content":"Social proof advertising style. Warm, authentic, community feel. Real-world context, trustworthy, testimonial-ready c...","defaultActive":false}]}],"brand":[{"category":"Logo Type","styles":[{"name":"Minimal Symbol","content":"Ultra-minimal brand symbol. Single clean shape, maximum negative space, works at any size from favicon to billboard. ...","defaultActive":false},{"name":"Emblem Badge","content":"Emblem badge brand style. Circular or shield frame, detailed inner elements, seal-of-quality authority. Vintage crest...","defaultActive":false},{"name":"Lettermark Monogram","content":"Lettermark monogram design. Initials only, custom interlocking letterforms, typographic craftsmanship. HBO, Chanel, L...","defaultActive":false},{"name":"Wordmark","content":"Wordmark brand design. Full brand name as the logo, custom letterforms, no symbol needed. Google, Coca-Cola, Supreme ...","defaultActive":false},{"name":"Combination Mark","content":"Combination mark identity. Symbol plus wordmark together, lockup composition, versatile usage. The most common brand ...","defaultActive":false},{"name":"Mascot Logo","content":"Mascot-based brand identity. Character-driven, expressive, personality-driven logo. KFC, Mailchimp, sports team energy.","defaultActive":false},{"name":"Abstract Mark","content":"Abstract geometric brand mark. Non-representational unique shape, hidden meaning in form. Pepsi, Airbnb, Spotify appr...","defaultActive":false}]},{"category":"Design Aesthetic","styles":[{"name":"Clean Modern","content":"Clean modern brand aesthetic. Geometric precision, sans-serif influence, flat color, contemporary. Tech startup, SaaS...","defaultActive":false},{"name":"Hand-Drawn Artisan","content":"Hand-drawn artisan brand aesthetic. Organic lines, slight imperfection, craft feel. Bakery, brewery, boutique. Warm a...","defaultActive":false},{"name":"Vintage Heritage","content":"Vintage heritage brand aesthetic. Aged texture, established-since feel, ornate detail, old-world craftsmanship. Looks...","defaultActive":false},{"name":"Luxury Refined","content":"Luxury refined brand aesthetic. Thin serifs, gold and black, elegant spacing, high-end materials implied. Jewelry, fa...","defaultActive":false},{"name":"Bold Streetwear","content":"Bold streetwear brand aesthetic. Thick heavy type influence, aggressive angles, high contrast. BAPE, Stussy, Palace e...","defaultActive":false},{"name":"Retro Throwback","content":"Retro throwback brand aesthetic. Specific era feel, 50s diner or 70s disco or 80s neon or 90s grunge. Nostalgic and i...","defaultActive":false},{"name":"Geometric Precision","content":"Geometric precision brand aesthetic. Mathematical grids, golden ratio construction, built from pure geometry. Bluepri...","defaultActive":false},{"name":"Line Art Minimal","content":"Line art minimal brand. Single continuous weight line, no fills, elegant simplicity. Architectural, refined, contempo...","defaultActive":false},{"name":"Grunge Raw","content":"Grunge raw brand aesthetic. Distressed, stamped, ink-splatter texture, imperfect edges. Punk, underground, anti-corpo...","defaultActive":false},{"name":"3D Dimensional","content":"3D dimensional brand mark. Depth, shadow, glossy surface, embossed or extruded look. App icon ready, modern tech polish.","defaultActive":false},{"name":"Stencil Military","content":"Stencil military brand aesthetic. Stenciled letterforms, utilitarian, rugged. Army surplus, workwear, industrial bran...","defaultActive":false}]}],"collection":[{"category":"Series Strategy","styles":[{"name":"Pixel-Locked Series","content":"Strict pixel-locked collection. Identical composition, palette, and style across every piece. Only the subject swaps....","defaultActive":false},{"name":"Theme Variations","content":"Theme variations collection. Same DNA but each piece explores the theme differently. Connected like chapters in a boo...","defaultActive":false},{"name":"Trading Card Set","content":"Trading card set format. Bordered frame, consistent layout template, collectible energy. Each piece fits the same vis...","defaultActive":false},{"name":"Flash Sheet Grid","content":"Flash sheet grid layout. Multiple small designs on one sheet, traditional tattoo flash arrangement. Each standalone b...","defaultActive":false},{"name":"Diptych Triptych","content":"Diptych or triptych composition. Two or three pieces designed to hang together as one. Gallery wall, split canvas feel.","defaultActive":false},{"name":"Color Story Series","content":"Color story series. Same composition, different colorway each piece. Warhol screen print logic. Palette is the variable.","defaultActive":false}]},{"category":"Visual Style","styles":[{"name":"Zodiac Celestial","content":"Zodiac celestial series aesthetic. Cosmic backgrounds, mystical symbols, star charts. Each sign gets unique elements ...","defaultActive":false},{"name":"Elements Nature","content":"Elemental nature series. Earth, water, fire, air. Elemental textures and palettes per piece. Natural forces as visual...","defaultActive":false},{"name":"Seasonal Rotation","content":"Seasonal rotation series. Spring, summer, fall, winter cycle. Each piece captures one season palette and mood. Calend...","defaultActive":false},{"name":"Streetwear Drop","content":"Streetwear drop capsule. Series designed as a capsule collection. Each piece wearable alone, deadly together. Hype br...","defaultActive":false},{"name":"Botanical Specimens","content":"Botanical specimen series. Scientific illustration, labeled specimens, consistent framing. Natural history museum qua...","defaultActive":false},{"name":"Portrait Series","content":"Portrait series format. Same framing and style, different subjects. Yearbook, wanted poster, or gallery portrait wall...","defaultActive":false},{"name":"Icon Set","content":"Icon set collection. Flat, consistent weight, same grid, same style rules across all pieces. App icon or infographic ...","defaultActive":false},{"name":"Tarot Deck","content":"Tarot deck series. Major arcana inspired, ornate bordered frames, mystical symbolism. Each card unique within the sys...","defaultActive":false}]}],"freestyle":[{"category":"Rendering Style","styles":[{"name":"Photorealistic","content":"Photorealistic rendering. Indistinguishable from a photograph. Perfect lighting, accurate materials, natural depth of...","defaultActive":false},{"name":"Digital Illustration","content":"Clean digital illustration. Smooth rendering, visible artist hand, concept art quality. Artstation portfolio level.","defaultActive":false},{"name":"Oil Painting","content":"Thick oil paint impasto style. Heavy brushstrokes, three-dimensional texture, rich saturated color. Van Gogh swirling...","defaultActive":false},{"name":"Watercolor Loose","content":"Loose watercolor painting style. Wet-on-wet bleeds, organic color pooling, paper showing through. Airy, spontaneous, ...","defaultActive":false},{"name":"Pencil Charcoal","content":"Raw pencil and charcoal style. Visible graphite strokes, gestural energy, sketchbook authenticity. Unfinished, immedi...","defaultActive":false},{"name":"Flat Vector","content":"Clean flat vector illustration. Solid colors, no gradients, geometric shapes. Crisp, scalable, modern infographic aes...","defaultActive":false},{"name":"3D Render","content":"3D render style. Cinema 4D or Blender look, smooth materials, studio lighting, glossy or matte surfaces. Clean and di...","defaultActive":false},{"name":"Pixel Art","content":"Pixel art retro style. Visible pixel grid, limited palette, 8-bit or 16-bit era. Nostalgic, charming, technically con...","defaultActive":false},{"name":"Ink Line Art","content":"Black ink line art. Varying line weight, crosshatch shading, pen and ink illustration precision. Clean and detailed.","defaultActive":false},{"name":"Collage Mixed Media","content":"Collage mixed media style. Cut paper, layered textures, found imagery, glue-visible edges. Handmade, tactile, art sch...","defaultActive":false}]},{"category":"Mood / Genre","styles":[{"name":"Surrealist Dream","content":"Surrealist dream logic. Impossible combinations, melting reality, dreamscape environments. Dali meets modern digital ...","defaultActive":false},{"name":"Dark Gothic","content":"Dark gothic aesthetic. Deep blacks, blood reds, ornate Victorian elements, cathedral shadows. Eerie, romantic, Tim Bu...","defaultActive":false},{"name":"Sci-Fi Futurism","content":"Sci-fi concept art. Futuristic vehicles, alien landscapes, space stations, advanced technology. Syd Mead meets Star W...","defaultActive":false},{"name":"Fantasy Epic","content":"Epic fantasy art. Dragons, enchanted forests, magical creatures, heroic warriors. Grand, mythological, awe-inspiring ...","defaultActive":false},{"name":"Cyberpunk Neon","content":"Cyberpunk neon aesthetic. Rain-slicked streets, holographic ads, neon pink and cyan, dystopian future. Blade Runner m...","defaultActive":false},{"name":"Vaporwave Retro","content":"Vaporwave aesthetic. Pastel gradients, Greek statues, retro computer graphics, Japanese text. 80s and 90s internet cu...","defaultActive":false},{"name":"Cottagecore Pastoral","content":"Cottagecore pastoral aesthetic. Wildflowers, warm bread, soft linens, gentle sunlight. Simple living, romantic, cozy.","defaultActive":false},{"name":"Abstract Expressionist","content":"Abstract expressionist. No recognizable forms, pure emotion through color and shape. Gestural brushstrokes, feeling o...","defaultActive":false},{"name":"Noir Cinematic","content":"Film noir aesthetic. High contrast black and white, dramatic shadows, venetian blind lighting. 1940s mystery tension.","defaultActive":false},{"name":"Tropical Maximalist","content":"Tropical maximalist style. Lush jungle, exotic birds, dense florals, overwhelming color. Henri Rousseau meets fashion...","defaultActive":false}]}],"album":[{"category":"Genre Aesthetic","styles":[{"name":"Hip-Hop Dark","content":"Dark hip-hop album cover. Moody, dramatic lighting, urban textures, cinematic. Luxury meets street. Heavy atmosphere ...","defaultActive":false},{"name":"RnB Smooth","content":"R&B album aesthetic. Warm tones, soft lighting, sensual mood. Golden hour, intimate, silk and velvet feel.","defaultActive":false},{"name":"Indie Dream Pop","content":"Indie dream pop album cover. Soft focus, analog film grain, nostalgic color grading. Lo-fi intimate beauty.","defaultActive":false},{"name":"Electronic EDM","content":"Electronic EDM album aesthetic. Neon geometry, digital glitch elements, futuristic pulse. Club-ready, pulsing energy.","defaultActive":false},{"name":"Punk Hardcore","content":"Punk hardcore album cover. Xerox texture, cut-paste collage, hand-scrawled chaos. Aggressive, DIY, deliberately ugly-...","defaultActive":false},{"name":"Jazz Soul Classic","content":"Classic jazz and soul album aesthetic. Blue Note Records influence, moody photography style, sophisticated minimal. C...","defaultActive":false},{"name":"Metal Heavy","content":"Metal album cover. Dark, intense, detailed illustration. Skulls, fire, gothic lettering influence. Brutal, loud, and ...","defaultActive":false},{"name":"Pop Bright","content":"Pop album cover. Vivid saturated colors, clean composition, high energy, glossy finish. Radio-friendly visual equival...","defaultActive":false},{"name":"Country Folk","content":"Country folk album aesthetic. Earthy tones, rural landscapes, vintage photography warmth. Honest, roots-connected, ha...","defaultActive":false},{"name":"Lo-Fi Bedroom","content":"Lo-fi bedroom album cover. Grainy, intimate, slightly messy. Bedroom studio energy, cassette tape nostalgia. Cozy and...","defaultActive":false},{"name":"Latin Reggaeton","content":"Latin reggaeton album aesthetic. Bold warm colors, tropical textures, high contrast glamour. Sensual, rhythmic, sun-d...","defaultActive":false},{"name":"Ambient Experimental","content":"Ambient experimental album cover. Abstract, atmospheric, minimal. Could be a texture, landscape, or pure color. Mood ...","defaultActive":false}]},{"category":"Production Style","styles":[{"name":"Photography Portrait","content":"Photography portrait album cover. Artist portrait, dramatic lighting, strong pose. The face is the cover. Classic app...","defaultActive":false},{"name":"Illustrated Art","content":"Illustrated album artwork. Hand-drawn or painted cover, no photography. Artistic, unique, collectible.","defaultActive":false},{"name":"Typography Only","content":"Typography-only album cover. No image, pure type design, color, and layout. The text is the art. Bold and minimal.","defaultActive":false},{"name":"Collage Layered","content":"Collage layered album cover. Mixed media, cut-paste photos, overlapping textures. Madlib, Avalanches energy.","defaultActive":false},{"name":"Abstract Minimal","content":"Abstract minimal album cover. Single shape, gradient, or texture. No obvious subject. Mystery and mood over literal i...","defaultActive":false},{"name":"Cinematic Widescreen","content":"Cinematic widescreen album cover. Movie-still composition, letterbox feel, epic scale, dramatic lighting. Concept alb...","defaultActive":false}]}],"poster":[{"category":"Poster Type","styles":[{"name":"Concert Gig","content":"Concert gig poster. High-energy, layered composition, electric colors. Makes you want to buy tickets immediately. Liv...","defaultActive":false},{"name":"Movie Film","content":"Movie film poster. Dramatic hero composition, cinematic lighting, epic scale. Hollywood blockbuster one-sheet energy.","defaultActive":false},{"name":"Event Party","content":"Event party flyer. Date-forward, venue-ready, nightlife energy. Club flyer meets designed poster. Bold and urgent.","defaultActive":false},{"name":"Product Launch","content":"Product launch poster. Hero product shot space, clean reveal composition, announcement energy. Apple keynote poster f...","defaultActive":false},{"name":"Protest Cause","content":"Protest cause poster. Bold single message, fist-in-the-air energy, high contrast, immediate read. Shepard Fairey infl...","defaultActive":false},{"name":"Gallery Exhibition","content":"Gallery exhibition poster. Sophisticated white space, fine art reproduction quality, refined cultural feel. Museum-wo...","defaultActive":false},{"name":"Sports Event","content":"Sports event poster. Dynamic action energy, bold angles, team color blocking, arena-scale impact. ESPN graphic feel.","defaultActive":false},{"name":"Conference Talk","content":"Conference talk poster. Professional, speaker-focused, clean info hierarchy. TED Talk meets tech summit branding.","defaultActive":false}]},{"category":"Design Style","styles":[{"name":"Swiss International","content":"Swiss international typographic poster style. Grid-based, clean geometry, Helvetica energy, red, black, and white. Mo...","defaultActive":false},{"name":"Psychedelic 60s","content":"1960s psychedelic concert poster. Swirling organic forms, vibrant clashing colors, melting shapes. Fillmore Ballroom ...","defaultActive":false},{"name":"Art Deco Glamour","content":"Art Deco poster glamour. Gold geometric patterns, symmetrical rays, 1920s luxury. Gatsby-era elegance, angular opulence.","defaultActive":false},{"name":"Constructivist Bold","content":"Constructivist bold poster. Soviet-era influence, diagonal composition, red and black, propaganda poster power. Rodch...","defaultActive":false},{"name":"Japanese Chirashi","content":"Japanese chirashi flyer style. Dense layered info, asymmetric composition, mixed type sizes, organized chaos. Beautif...","defaultActive":false},{"name":"Minimalist Single Image","content":"Minimalist single image poster. One powerful image, massive white space, whisper-quiet impact. Less is everything.","defaultActive":false},{"name":"Grunge Xerox","content":"Grunge xerox poster. Photocopied texture, torn edges, layered halftone, punk flyer DIY. Stapled-to-a-telephone-pole f...","defaultActive":false},{"name":"Neon on Dark","content":"Neon on dark poster. Glowing elements on black background, electric color, nightlife atmosphere. Late-night city energy.","defaultActive":false},{"name":"Retro Screenprint","content":"Retro screenprint poster. Limited color, visible registration, kraft paper or colored stock feel. Hand-pulled indie p...","defaultActive":false},{"name":"Illustrated Hand-Drawn","content":"Illustrated hand-drawn poster. Custom illustration hero, no photography, artistic one-of-a-kind. Gig poster and galle...","defaultActive":false}]}],"sticker":[{"category":"Production Type","styles":[{"name":"Die-Cut Vinyl","content":"Die-cut vinyl sticker. Custom outline shape, weatherproof, laptop and water bottle ready. Clean cut edge, durable mat...","defaultActive":false},{"name":"Holographic Foil","content":"Holographic foil sticker. Iridescent rainbow shift, metallic sheen, premium collectible. Eye-catching from every angle.","defaultActive":false},{"name":"Clear Transparent","content":"Clear transparent sticker. Printed on clear material, design floats on surface. No white border, seamless on any surf...","defaultActive":false},{"name":"Embroidered Patch","content":"Embroidered patch. Thread texture, merrow border, iron-on feel. Jacket-ready, tactile, premium craft. Thick and dimen...","defaultActive":false},{"name":"Woven Patch","content":"Woven patch. Fine thread detail, thinner than embroidered, tighter weave. Detailed designs, clothing label quality.","defaultActive":false},{"name":"Kiss-Cut Sheet","content":"Kiss-cut sticker sheet. Multiple stickers on one backing, peelable, collectible set format. Sticker pack energy.","defaultActive":false},{"name":"Puffy 3D Raised","content":"Puffy 3D raised sticker. Dimensional, squishy, playful texture. 90s sticker book nostalgia. Tactile and fun.","defaultActive":false}]},{"category":"Visual Style","styles":[{"name":"Kawaii Cute","content":"Kawaii cute sticker style. Big eyes, soft round shapes, pastel colors, adorable expressions. Japanese cute culture. M...","defaultActive":false},{"name":"Skate Punk","content":"Skateboard punk sticker aesthetic. Bold, slightly crude, high energy. Thick marker outlines, rebellious attitude. Sla...","defaultActive":false},{"name":"Retro Badge","content":"Retro badge sticker. Vintage shape, worn texture, classic Americana. Old suitcase or toolbox energy. Nostalgic and ch...","defaultActive":false},{"name":"Tattoo Flash","content":"Tattoo flash sticker. Traditional tattoo motifs, roses, daggers, snakes. Bold outlines, limited flat color. Sailor Je...","defaultActive":false},{"name":"Cartoon Character","content":"Cartoon character sticker. Mascot-style, exaggerated features, fun and brandable. Sticker for a phone case or laptop.","defaultActive":false},{"name":"Nature Outdoor","content":"Nature outdoor sticker. Mountains, trees, camping gear, national park badge feel. REI and Patagonia sticker vibe.","defaultActive":false},{"name":"Flat Minimal Icon","content":"Flat minimal icon sticker. Ultra-simple, one concept, 2-3 colors max. Reads at thumbnail size. Universally understood.","defaultActive":false},{"name":"Psychedelic Weird","content":"Psychedelic weird sticker. Melting eyeballs, mushrooms, impossible geometry. Trippy, strange, conversation starter.","defaultActive":false},{"name":"Food Drink","content":"Food and drink sticker. Illustrated food items, cute anthropomorphic snacks, coffee cups. Cafe culture and foodie ene...","defaultActive":false},{"name":"Gothic Dark","content":"Gothic dark sticker. Skulls, bats, moons, occult symbols. Black and red. Hot Topic sticker wall aesthetic.","defaultActive":false},{"name":"Motivational Quote","content":"Motivational quote sticker. Text-forward design, clean frame, single message. Laptop affirmation or water bottle mantra.","defaultActive":false}]}],"wallpaper":[{"category":"Device / Technical","styles":[{"name":"OLED True Black","content":"OLED-optimized dark wallpaper. True black background, minimal bright elements, battery-friendly. Subtle detail that r...","defaultActive":false},{"name":"Lock Screen Clean","content":"Lock screen optimized wallpaper. Clear center and top zone for clock widget, content pushed to edges and bottom. Func...","defaultActive":false},{"name":"Home Screen Minimal","content":"Home screen wallpaper. Muted, low-contrast, does not fight with app icons. Background that supports, not competes.","defaultActive":false},{"name":"Desktop Ultrawide","content":"Desktop ultrawide wallpaper. 21:9 or dual-monitor panoramic composition, no dead zones. Productivity backdrop with pr...","defaultActive":false},{"name":"Tablet iPad","content":"Tablet wallpaper. 4:3 balanced composition, works in portrait and landscape orientation. Balanced detail across rotat...","defaultActive":false}]},{"category":"Aesthetic Style","styles":[{"name":"Gradient Calm","content":"Smooth gradient wallpaper. Subtle color transitions, no hard edges, zen-like simplicity. Makes your device feel seren...","defaultActive":false},{"name":"Abstract Fluid","content":"Fluid abstract wallpaper. Swirling liquid colors, marble texture, organic flowing forms. Mesmerizing, premium, unique.","defaultActive":false},{"name":"Nature Epic","content":"Epic nature wallpaper. Grand landscape, dramatic sky, golden hour lighting. National Geographic quality. Awe-inspirin...","defaultActive":false},{"name":"Geometric Pattern","content":"Geometric pattern wallpaper. Repeating shapes, satisfying symmetry, architectural influence. Structured, modern beauty.","defaultActive":false},{"name":"Space Cosmic","content":"Space cosmic wallpaper. Nebulae, galaxies, star fields, planets. Deep space wonder. Dark and luminous.","defaultActive":false},{"name":"Cyberpunk City","content":"Cyberpunk city wallpaper. Neon-lit rain-slicked streets, holographic signs, dystopian skyline. Night city mood.","defaultActive":false},{"name":"Botanical Close-Up","content":"Botanical close-up wallpaper. Macro plant detail, leaf veins, flower petals, dew drops. Nature zoomed in. Calming and...","defaultActive":false},{"name":"Anime Scene","content":"Anime scene wallpaper. Studio Ghibli skies, lofi study girl vibes, anime landscape. Peaceful Japanese animation aesth...","defaultActive":false},{"name":"Brutalist Texture","content":"Brutalist texture wallpaper. Raw concrete, industrial surfaces, architectural minimalism. Moody, editorial, anti-pretty.","defaultActive":false},{"name":"Synthwave Grid","content":"Synthwave grid wallpaper. Chrome horizon grid, sunset gradient, palm silhouettes, retro future. 80s outrun aesthetic.","defaultActive":false},{"name":"Watercolor Soft","content":"Watercolor soft wallpaper. Gentle color washes, dreamy bleeds, delicate and airy. Soft, artistic, handmade feel.","defaultActive":false},{"name":"Dark Moody Texture","content":"Dark moody texture wallpaper. Deep tones, subtle grain, rich shadows, matte feel. Sophisticated dark mode companion.","defaultActive":false},{"name":"Isometric Tiny World","content":"Isometric tiny world wallpaper. Miniature scene from above, cute detailed diorama, playful intricate world. Delightful.","defaultActive":false}]}],"mockup":[{"category":"Photography Approach","styles":[{"name":"Studio White Cutout","content":"Studio white cutout product photography. Pure white background, no shadow or soft drop shadow. Amazon and e-commerce ...","defaultActive":false},{"name":"Flat Lay Overhead","content":"Flat lay overhead product shot. Top-down view, styled arrangement, organized grid around product. Instagram shop aest...","defaultActive":false},{"name":"Hero Angle Beauty","content":"Hero angle beauty shot. Low angle, dramatic single product, cinematic lighting, shallow depth of field. Ad campaign l...","defaultActive":false},{"name":"Lifestyle In-Use","content":"Lifestyle in-use product photography. Product in natural use setting, human context implied, warm natural light. Tell...","defaultActive":false},{"name":"Scale Context Shot","content":"Scale context product shot. Product shown next to everyday objects for size reference. Hands holding, on desk, in bag...","defaultActive":false},{"name":"360 Multi-Angle","content":"360 multi-angle product view. Multiple views of same product arranged together. All angles visible. Spec-sheet compre...","defaultActive":false},{"name":"Macro Detail","content":"Macro detail product shot. Extreme close-up on texture, stitching, material quality. Craftsmanship showcase. Zoom-in ...","defaultActive":false}]},{"category":"Surface / Setting","styles":[{"name":"Marble Luxury","content":"Marble luxury product surface. White or dark marble, dramatic side lighting, rich shadows. Premium, aspirational, exp...","defaultActive":false},{"name":"Wood Craft","content":"Wood and craft product surface. Warm wood table, artisan workshop feel, natural grain texture. Handmade, honest, smal...","defaultActive":false},{"name":"Concrete Industrial","content":"Concrete industrial product surface. Raw concrete slab, metal accents, moody directional light. Urban, modern, edgy.","defaultActive":false},{"name":"Nature Outdoor","content":"Nature outdoor product setting. Moss, stone, leaves, natural surfaces. Organic, sustainable brand positioning. Earth-...","defaultActive":false},{"name":"Fabric Textile","content":"Fabric textile product surface. Linen, velvet, or silk surface. Soft, tactile, fashion and beauty brand feel. Sensual...","defaultActive":false},{"name":"Colored Backdrop","content":"Colored backdrop product shot. Bold single-color paper sweep, punchy and graphic. Magazine editorial energy. Color-dr...","defaultActive":false},{"name":"Kitchen Food Scene","content":"Kitchen food scene product setting. Ingredients, cutting boards, cookware context. Food and beverage product natural ...","defaultActive":false},{"name":"Bathroom Wellness","content":"Bathroom wellness product setting. Steam, towels, tiles, plants. Skincare, wellness, self-care product context. Spa a...","defaultActive":false},{"name":"Desk Office","content":"Desk office product setting. Keyboard, notebook, coffee. Tech and stationery natural habitat. Productivity aesthetic.","defaultActive":false}]}],"jewelry":[{"category":"Photography Style","styles":[{"name":"Catalog Product Shot","content":"Professional jewelry catalog photography. Clean white background, studio three-point lighting, macro lens detail on m...","defaultActive":false},{"name":"Lifestyle Luxury","content":"Luxury lifestyle jewelry photography. Draped on velvet, marble surface, or alongside premium objects. Warm golden lig...","defaultActive":false},{"name":"Dramatic Dark","content":"Dark dramatic jewelry photography. Black background, single spotlight creating sparkle and shadow. High contrast, moo...","defaultActive":false},{"name":"Macro Gemstone Detail","content":"Extreme macro photography of gemstone and setting. Crystal clarity, visible facets and light refraction. Every detail...","defaultActive":false}]},{"category":"Design Aesthetic","styles":[{"name":"Art Deco","content":"Art deco jewelry design. Geometric patterns, symmetrical forms, stepped shapes, fan motifs. 1920s glamour, bold lines...","defaultActive":false},{"name":"Organic Nature","content":"Nature-inspired jewelry. Flowing botanical forms, leaves, vines, flowers cast in metal. Organic asymmetry, wearable s...","defaultActive":false},{"name":"Minimalist Modern","content":"Ultra-minimal modern jewelry. Clean geometric forms, no ornament, sculptural simplicity. Scandinavian design meets fi...","defaultActive":false},{"name":"Gothic Revival","content":"Gothic-inspired dark jewelry. Intricate metalwork, skulls, serpents, thorns, dark stones. Victorian mourning jewelry ...","defaultActive":false},{"name":"Celestial","content":"Celestial-themed jewelry. Stars, moons, constellations in precious metals. Ethereal, mystical, cosmic sparkle. Night ...","defaultActive":false},{"name":"Vintage Estate","content":"Vintage estate jewelry aesthetic. Antique patina, old-world craftsmanship, milgrain edges, hand-engraved details. Hei...","defaultActive":false}]}],"threeD":[{"category":"Render Style","styles":[{"name":"Photorealistic Product","content":"Photorealistic 3D product render. Studio lighting, accurate materials, ray-traced reflections. Commercial quality.","defaultActive":false},{"name":"Clay Render","content":"Matte clay render aesthetic. Single neutral color, no textures. Soft ambient occlusion. Sculptural, minimal.","defaultActive":false},{"name":"Low Poly Stylized","content":"Low polygon stylized 3D. Flat shading, geometric facets visible. Colorful, playful, modern game art.","defaultActive":false},{"name":"Isometric Flat","content":"Isometric 3D view, clean flat colors. Minimal shading, diagram-like precision.","defaultActive":false},{"name":"Neon Cyberpunk 3D","content":"Dark environment with neon-lit 3D object. Glowing edges, reflective surfaces, cyberpunk palette.","defaultActive":false},{"name":"Glass Morphism","content":"Frosted glass material 3D render. Translucent, refractive, light-catching. Modern UI-inspired.","defaultActive":false},{"name":"Wireframe Technical","content":"3D wireframe overlay on solid model. Engineering blueprint aesthetic. Technical precision.","defaultActive":false},{"name":"Floating Product","content":"3D object floating in clean void with soft shadow below. Dramatic lighting, Apple-style product reveal.","defaultActive":false}]},{"category":"Material Focus","styles":[{"name":"Chrome & Metal","content":"Polished chrome and metal. Mirror reflections, sharp specular highlights. Automotive luxury finish.","defaultActive":false},{"name":"Soft Matte","content":"Soft matte finish. Velvet-like quality, diffused light. Premium consumer electronics aesthetic.","defaultActive":false},{"name":"Raw Concrete","content":"Raw concrete brutalist material. Rough texture, exposed aggregate. Architectural visualization.","defaultActive":false},{"name":"Organic Wood","content":"Natural wood grain, warm tones. Visible grain pattern, sanded finish. Furniture aesthetic.","defaultActive":false}]}],"tattoo":[{"category":"Tattoo Style","styles":[{"name":"Traditional Old School","content":"Traditional American tattoo style. Bold black outlines, limited flat color palette, iconic motifs. Sailor Jerry linea...","defaultActive":false},{"name":"Neo-Traditional","content":"Neo-traditional tattoo style. Old school subjects with modern rendering. Rich color gradients, detailed shading, slig...","defaultActive":false},{"name":"Japanese Irezumi","content":"Japanese irezumi tattoo style. Flowing water, wind bars, cloud fills, koi, dragons, oni. Rich color, dynamic bodyflow...","defaultActive":false},{"name":"Blackwork Solid","content":"Blackwork solid tattoo. Pure black ink only, large filled areas, bold graphic shapes. High contrast, powerful, tribal...","defaultActive":false},{"name":"Dotwork Stipple","content":"Dotwork stipple tattoo. Image built entirely from dots, varying density for shading. Sacred geometry, mandalas, medit...","defaultActive":false},{"name":"Geometric Sacred","content":"Geometric sacred tattoo. Mathematical patterns, sacred geometry, platonic solids, Metatrons cube. Precise linework, s...","defaultActive":false},{"name":"Fine Line Single Needle","content":"Fine line single needle tattoo. Delicate thin lines, minimal shading, elegant simplicity. Modern, subtle, looks like ...","defaultActive":false},{"name":"Realism Portrait","content":"Realism portrait tattoo. Photorealistic rendering on skin. Perfect shading, accurate anatomy, looks like a photograph...","defaultActive":false},{"name":"Black and Grey","content":"Black and grey tattoo. No color, full greyscale range, smooth shading gradients. Chicano tradition, cinematic contrast.","defaultActive":false},{"name":"Watercolor","content":"Watercolor tattoo style. Soft color bleeds, paint splatter accents, no hard outlines. Looks like watercolor on skin. ...","defaultActive":false},{"name":"Trash Polka","content":"Trash polka tattoo. Black and grey realism combined with red graphic elements, splatter, smears, typographic collage....","defaultActive":false},{"name":"Illustrative","content":"Illustrative tattoo style. Looks like a book illustration on skin. Detailed linework with artistic shading, narrative...","defaultActive":false},{"name":"Sketch Rough","content":"Sketch rough tattoo. Visible construction lines left in, gestural energy, intentionally unfinished look. Raw, artisti...","defaultActive":false},{"name":"Tribal","content":"Tribal tattoo style. Bold black shapes, flowing organic curves, body-contouring design. Polynesian, Maori, or abstrac...","defaultActive":false},{"name":"Chicano","content":"Chicano tattoo style. Black and grey, religious iconography, script lettering influence, lowrider culture. LA street ...","defaultActive":false},{"name":"Woodcut Etching","content":"Woodcut etching tattoo. Looks like a medieval woodblock print. Parallel line shading, crosshatch, old engraving textu...","defaultActive":false},{"name":"Surrealist","content":"Surrealist tattoo. Impossible anatomy, dreamscape logic, Dali and Escher influence. Optical illusions, morphing forms...","defaultActive":false},{"name":"Ornamental","content":"Ornamental tattoo. Decorative patterns that follow body contours. Filigree, lace, mandala-adjacent but more flowing. ...","defaultActive":false},{"name":"Micro Tiny","content":"Micro tiny tattoo. Ultra-small detailed designs, finger, wrist, and ankle scale. Miniature precision, single-concept,...","defaultActive":false},{"name":"Ignorant Crude","content":"Ignorant style tattoo. Deliberately simple, childlike line quality, thick wobbly outlines. Anti-skill aesthetic. Char...","defaultActive":false}]},{"category":"Subject Approach","styles":[{"name":"Botanical Floral","content":"Botanical floral tattoo subject. Flowers, leaves, branches, botanical specimens. Delicate, organic, can be realistic ...","defaultActive":false},{"name":"Animal Wildlife","content":"Animal wildlife tattoo subject. Creatures realistic or stylized, wolves, snakes, birds, insects. Spirit animal energy...","defaultActive":false},{"name":"Skull Memento Mori","content":"Skull memento mori tattoo subject. Death imagery, skull variations, skeleton motifs. Mortality reminder, gothic beaut...","defaultActive":false},{"name":"Mythology Folklore","content":"Mythology folklore tattoo subject. Gods, demons, mythical beasts, cultural legends. Greek, Norse, Japanese, Hindu. Ep...","defaultActive":false},{"name":"Script Lettering","content":"Script lettering tattoo. Text-based design, custom lettering styles, gothic blackletter, cursive, typewriter, hand-dr...","defaultActive":false},{"name":"Cosmic Space","content":"Cosmic space tattoo subject. Planets, galaxies, astronauts, celestial bodies. Universe on skin. Mysterious, vast, won...","defaultActive":false},{"name":"Dark Horror","content":"Dark horror tattoo subject. Demons, monsters, creepy imagery, body horror. Unsettling beauty. Junji Ito meets tattoo ...","defaultActive":false},{"name":"Minimal Symbol","content":"Minimal symbol tattoo. One clean simple symbol, arrow, wave, mountain line, crescent. Small, meaningful, first-tattoo...","defaultActive":false}]}],"sneaker":[{"category":"Silhouette / Category","styles":[{"name":"Basketball High-Top","content":"Basketball high-top sneaker silhouette. Classic high-top, ankle support, court-ready. Jordan and Dunk DNA. Iconic, sp...","defaultActive":false},{"name":"Retro Runner","content":"Retro runner sneaker silhouette. 80s and 90s running shoe, vintage color blocking, suede and mesh. New Balance 550, S...","defaultActive":false},{"name":"Low-Top Clean","content":"Low-top clean sneaker silhouette. Minimal low profile, premium leather, tonal. Common Projects and Stan Smith simplic...","defaultActive":false},{"name":"Chunky Dad Shoe","content":"Chunky dad shoe silhouette. Exaggerated thick sole, multi-panel, bulky proportions. New Balance 990, Balenciaga Tripl...","defaultActive":false},{"name":"Slip-On Minimal","content":"Slip-on minimal sneaker silhouette. No laces, clean entry, laceless construction. Vans Slip-On to Fear of God level. ...","defaultActive":false},{"name":"Boot Hybrid","content":"Boot hybrid sneaker silhouette. Sneaker-boot crossover, higher cut, rugged sole, weather-ready. Duckboot, ACG, winter...","defaultActive":false},{"name":"Slide Sandal","content":"Slide sandal silhouette. Open-toe, pool slide, foam runner territory. Yeezy Slide, Nike Calm energy. Comfort-first de...","defaultActive":false},{"name":"Platform Stacked","content":"Platform stacked sneaker silhouette. Exaggerated midsole height, visible air or foam, elevated stance. Rick Owens ene...","defaultActive":false}]},{"category":"Design Aesthetic","styles":[{"name":"Hype Collab","content":"Hype collab sneaker aesthetic. Limited edition feel, co-branded details, premium materials, instant sell-out energy. ...","defaultActive":false},{"name":"Futuristic Tech","content":"Futuristic tech sneaker aesthetic. Avant-garde silhouette, unusual materials, experimental design. Looks from 2050. B...","defaultActive":false},{"name":"Heritage Classic","content":"Heritage classic sneaker aesthetic. Faithful to original design DNA, vintage colorway, retro materials. OG reissue en...","defaultActive":false},{"name":"Luxury Minimal","content":"Luxury minimal sneaker aesthetic. Monochrome, premium leather, understated branding. Bottega, The Row, quiet luxury o...","defaultActive":false},{"name":"Outdoor Trail","content":"Outdoor trail sneaker aesthetic. Aggressive tread, protective overlays, earth tones, GORE-TEX vibe. Salomon and Hoka ...","defaultActive":false},{"name":"Skateboard","content":"Skateboard sneaker aesthetic. Flat vulcanized sole, suede toecap, padded collar. Dunk SB and Vans Pro durability. Boa...","defaultActive":false},{"name":"Techwear Utility","content":"Techwear utility sneaker aesthetic. Webbing straps, toggle lacing, waterproof materials, modular look. ACRONYM meets ...","defaultActive":false},{"name":"Sustainable Eco","content":"Sustainable eco sneaker aesthetic. Recycled materials, earth tones, natural textures, visible eco-construction. Allbi...","defaultActive":false},{"name":"Deconstructed","content":"Deconstructed sneaker aesthetic. Exposed foam, raw edges, inside-out construction, unfinished on purpose. Maison Marg...","defaultActive":false},{"name":"Anime Custom Art","content":"Anime custom art sneaker aesthetic. Hand-painted look, character illustrations, full-coverage artwork on upper. Custo...","defaultActive":false}]}],"pattern":[{"category":"Pattern Type","styles":[{"name":"Seamless Tile","content":"Seamless tile pattern. Perfect edge-to-edge repeat, no visible seam. Standard fabric and wallpaper production format.","defaultActive":false},{"name":"Half-Drop Repeat","content":"Half-drop repeat pattern. Offset repeat avoiding obvious grid lines. More natural flow, diagonal rhythm. Professional...","defaultActive":false},{"name":"Border Stripe","content":"Border stripe pattern. Linear repeating band, horizontal or vertical. Ribbon, trim, border print application.","defaultActive":false},{"name":"Placement Print","content":"Placement print design. Not a repeat, single engineered design for specific garment placement. Chest, back panel, or ...","defaultActive":false},{"name":"Ditsy Scatter","content":"Ditsy scatter pattern. Tiny motifs scattered randomly, dense coverage, no obvious repeat direction. Small scale, all-...","defaultActive":false},{"name":"Toile Scene","content":"Toile scenic pattern. Large-scale scenic repeating illustration, single color on white. French countryside, narrative...","defaultActive":false}]},{"category":"Visual Style","styles":[{"name":"Botanical Floral","content":"Botanical floral pattern. Detailed flower illustrations, organic arrangement, vintage wallpaper influence. William Mo...","defaultActive":false},{"name":"Geometric Grid","content":"Geometric grid pattern. Mathematical shapes, strict grid, 2-3 colors max. Bauhaus influence. Clean, modern, satisfyin...","defaultActive":false},{"name":"Abstract Organic","content":"Abstract organic pattern. Fluid biomorphic shapes, natural asymmetry, mid-century modern influence. Sophisticated and...","defaultActive":false},{"name":"Animal Print","content":"Animal print pattern. Leopard, zebra, snake, or cow, realistic or stylized. Fashion staple, bold statement, always in...","defaultActive":false},{"name":"Tropical Hawaiian","content":"Tropical Hawaiian pattern. Palm leaves, hibiscus, monstera, plumeria. Aloha shirt energy, vacation vibes, lush and co...","defaultActive":false},{"name":"Paisley Bandana","content":"Paisley bandana pattern. Classic paisley motifs, bandana grid, teardrop shapes. Western, hip-hop, or heritage dependi...","defaultActive":false},{"name":"Camouflage","content":"Camouflage pattern. Military-derived, organic blotch shapes, concealment logic. Woodland, desert, urban, or fashion c...","defaultActive":false},{"name":"Plaid Tartan","content":"Plaid tartan pattern. Woven crosshatch lines, Scottish heritage, structured color blocks. Flannel, preppy, or punk de...","defaultActive":false},{"name":"Art Deco","content":"Art Deco pattern. Gold geometric motifs, fan shapes, symmetrical luxury. 1920s glamour in repeat form.","defaultActive":false},{"name":"Hand-Drawn Doodle","content":"Hand-drawn doodle pattern. Sketchy lines, casual illustration, marker or pen feel. Playful, youthful, handmade charm.","defaultActive":false},{"name":"Digital Glitch","content":"Digital glitch pattern. Pixel corruption, RGB shifts, data-moshed texture. Cyberpunk textile, modern and edgy.","defaultActive":false},{"name":"Damask Ornamental","content":"Damask ornamental pattern. Classic decorative motifs, symmetrical flourishes, wallpaper heritage. Elegant, formal, Eu...","defaultActive":false},{"name":"Terrazzo Speckle","content":"Terrazzo speckle pattern. Random stone chip fragments, scattered flecks, material texture. Memphis design adjacent, m...","defaultActive":false},{"name":"Ikat Woven","content":"Ikat woven pattern. Blurred-edge geometric, dye-resist technique look, handwoven textile tradition. Global craft, imp...","defaultActive":false}]}],"character":[{"category":"Art Style","styles":[{"name":"Anime Manga","content":"Anime manga character design. Large expressive eyes, dynamic hair, detailed costume. Shonen and seinen influence. Vib...","defaultActive":false},{"name":"Chibi Super-Deformed","content":"Chibi super-deformed character. Oversized head, tiny body, adorable proportions. Exaggerated expressions. Kawaii coll...","defaultActive":false},{"name":"Western Cartoon","content":"Western cartoon character. Simplified shapes, exaggerated features, bold outlines. Cartoon Network and Disney TV ener...","defaultActive":false},{"name":"Realistic Concept","content":"Realistic concept character. Proportional anatomy, detailed clothing, production quality. Movie and game concept art....","defaultActive":false},{"name":"Pixel Art Sprite","content":"Pixel art sprite character. Low-res, visible pixel grid, limited palette. Game sprite, retro RPG or platformer style.","defaultActive":false},{"name":"Comic Book","content":"Comic book character. Dynamic pose, ink lines, cel shading, panel-ready. Marvel, DC, or indie comic sequential art qu...","defaultActive":false},{"name":"Flat Vector","content":"Flat vector character. Simple geometric shapes, no outlines, solid colors. App mascot, UI character, modern brand ill...","defaultActive":false},{"name":"Painterly Illustrated","content":"Painterly illustrated character. Visible brushwork, rich color, art book quality. Storybook illustration or card game...","defaultActive":false},{"name":"3D Stylized","content":"3D stylized character. Pixar and Fortnite proportions, smooth rendered surfaces, toy-like. 3D animated movie quality.","defaultActive":false},{"name":"Graffiti Street","content":"Graffiti street character. Spray-can style, drips, urban wall aesthetic. Character as street art. KAWS and Futura inf...","defaultActive":false}]},{"category":"Character Type","styles":[{"name":"RPG Fantasy Hero","content":"RPG fantasy hero character. Armor, weapons, class-specific gear, adventure-ready. DnD and Final Fantasy influence. Ep...","defaultActive":false},{"name":"Sci-Fi Mech","content":"Sci-fi mech character. Power armor, cybernetic augments, futuristic gear. Space marine, android, mech pilot. Tech-for...","defaultActive":false},{"name":"Mascot Brand","content":"Mascot brand character. Friendly, memorable, simple enough for merch. Brandable at any size. Company character identity.","defaultActive":false},{"name":"Streetwear OC","content":"Streetwear OC character. Dripped out in hype brands, sneakers detailed, urban fashion showcase. Original character as...","defaultActive":false},{"name":"Monster Creature","content":"Monster creature character. Non-human design, original species, creature concept. Could be cute, scary, or alien. Wor...","defaultActive":false},{"name":"Villain Anti-Hero","content":"Villain anti-hero character. Dark design language, intimidating silhouette, edge and menace. Antagonist energy, cool ...","defaultActive":false},{"name":"Cute Animal","content":"Cute animal character. Anthropomorphic animal, big eyes, expressive, plushie-ready. Sticker, merch, and emoji potential.","defaultActive":false},{"name":"Historical Warrior","content":"Historical warrior character. Period-accurate armor or clothing, real-world culture reference. Samurai, knight, Vikin...","defaultActive":false},{"name":"Superhero","content":"Superhero character design. Cape, mask, emblem, dynamic power pose, secret identity energy. Original hero design.","defaultActive":false},{"name":"Chibi Mascot Lineup","content":"Chibi mascot lineup. Multiple chibi characters designed as a set, matching style, team or roster format. Collection-r...","defaultActive":false}]}],"bookcover":[{"category":"Genre Aesthetic","styles":[{"name":"Thriller Suspense","content":"Thriller suspense book cover. Dark, high contrast, ominous single element, negative space for title. Suspenseful, pag...","defaultActive":false},{"name":"Literary Fiction","content":"Literary fiction book cover. Artistic, metaphorical imagery, sophisticated palette. Suggests depth without being lite...","defaultActive":false},{"name":"Sci-Fi","content":"Sci-fi book cover. Vast cosmic scale, futuristic elements, dramatic lighting. Sweeping, imaginative, world-building o...","defaultActive":false},{"name":"Fantasy Epic","content":"Fantasy epic book cover. Magical landscapes, mythical creatures, enchanted atmosphere. Grand and inviting.","defaultActive":false},{"name":"Romance","content":"Romance book cover. Warm golden tones, intimate mood, soft focus. Beautiful and inviting. Emotional, heartfelt, sensual.","defaultActive":false},{"name":"Horror","content":"Horror book cover. Creeping dread, unsettling imagery, darkness encroaching. Stephen King shelf energy. Fear on first...","defaultActive":false},{"name":"Mystery Crime","content":"Mystery crime book cover. Moody urban setting, shadows, silhouettes, clue objects. Noir detective or true crime. Intr...","defaultActive":false},{"name":"Memoir Non-Fiction","content":"Memoir non-fiction book cover. Clean, confident, single powerful image or object. Credible, authoritative, bestseller...","defaultActive":false},{"name":"Poetry Collection","content":"Poetry collection book cover. Delicate, abstract, emotionally evocative. Single texture or image, maximum breathing r...","defaultActive":false},{"name":"Childrens Book","content":"Childrens book cover. Bright, warm, inviting illustration. Friendly characters, storybook wonder. Makes a kid reach f...","defaultActive":false},{"name":"YA Coming-of-Age","content":"YA coming-of-age book cover. Bold graphic design, silhouette or symbolic imagery, vibrant but emotional. Teen shelf s...","defaultActive":false},{"name":"Self-Help Business","content":"Self-help business book cover. Bold title space, single icon or metaphor, clean and confident. Airport bookshop power...","defaultActive":false}]},{"category":"Production Style","styles":[{"name":"Photography Cinematic","content":"Cinematic photography book cover. Single dramatic photograph, moody color grade, cinematic composition. Thriller and ...","defaultActive":false},{"name":"Illustrated Painted","content":"Illustrated painted book cover. Custom artwork, hand-drawn or digital painting hero image. Artistic, collectible, no ...","defaultActive":false},{"name":"Typography-Dominant","content":"Typography-dominant book cover. Title is the design, minimal or no imagery. Bold type, color, and layout do all the w...","defaultActive":false},{"name":"Graphic Symbolic","content":"Graphic symbolic book cover. Single bold graphic element or symbol, flat design, conceptual. Object tells the whole s...","defaultActive":false},{"name":"Collage Mixed Media","content":"Collage mixed media book cover. Layered cut-outs, mixed textures, handmade feel. Indie press, zine culture, anti-corp...","defaultActive":false},{"name":"Minimalist Object","content":"Minimalist object book cover. One small object centered on vast empty space. Quiet, literary, lets imagination fill t...","defaultActive":false},{"name":"Indie Zine DIY","content":"Indie zine DIY cover. Photocopied texture, lo-fi, hand-stapled aesthetic. Punk press, underground, counter-cultural.","defaultActive":false},{"name":"Retro Pulp","content":"Retro pulp book cover. Vintage paperback cover, lurid colors, dramatic illustration, aged paper feel. 50s and 60s pul...","defaultActive":false}]}],"pin":[{"category":"Production Type","styles":[{"name":"Hard Enamel","content":"Hard enamel pin. Smooth polished surface flush with metal lines. Premium, jewelry-like finish. Highest quality look.","defaultActive":false},{"name":"Soft Enamel","content":"Soft enamel pin. Recessed color areas, raised metal dividers you can feel. Classic pin look, tactile texture.","defaultActive":false},{"name":"Glitter Sparkle Fill","content":"Glitter sparkle enamel pin. Glitter mixed into enamel, sparkly surface, eye-catching. Magical, festive, premium variant.","defaultActive":false},{"name":"Glow-in-the-Dark","content":"Glow-in-the-dark enamel pin. Phosphorescent enamel, glows green or blue in darkness. Dual-mode design, surprise factor.","defaultActive":false},{"name":"Spinning Moving Part","content":"Spinning moving part pin. Element that rotates or dangles. Interactive, fidget-worthy, collectors premium.","defaultActive":false},{"name":"Lenticular Holographic","content":"Lenticular holographic pin. Color-shifting or image-changing surface. Holographic rainbow or flip between two images.","defaultActive":false},{"name":"Black Nickel Antique","content":"Black nickel antique finish pin. Dark metal finish instead of gold or silver. Moody, gothic, vintage aged feel.","defaultActive":false}]},{"category":"Visual Style","styles":[{"name":"Kawaii Cute","content":"Kawaii cute pin design. Rounded shapes, pastel fills, gold borders, adorable faces. Japanese cute culture. Backpack-r...","defaultActive":false},{"name":"Gothic Dark","content":"Gothic dark pin design. Skulls, moons, coffins, bats, occult symbols. Black nickel metal, red and purple fills. Battl...","defaultActive":false},{"name":"Witchy Celestial","content":"Witchy celestial pin design. Crystals, moons, stars, potions, tarot imagery. Mystical feminine energy. Etsy bestselle...","defaultActive":false},{"name":"Food Drink","content":"Food and drink pin design. Cute food items, coffee cups, pizza slices, boba tea. Anthropomorphic snacks. Foodie cultu...","defaultActive":false},{"name":"Nature Botanical","content":"Nature botanical pin design. Plants, mushrooms, flowers, insects, mountains. Outdoor adventure or cottagecore. Earthy...","defaultActive":false},{"name":"Animal Portrait","content":"Animal portrait pin design. Cats, dogs, frogs, birds, realistic or stylized. Pet culture, spirit animal, creature app...","defaultActive":false},{"name":"Pop Culture Homage","content":"Pop culture homage pin design. References without copying, genre symbols, trope icons, fandom-adjacent. Legally disti...","defaultActive":false},{"name":"Retro Vintage","content":"Retro vintage pin design. Aged aesthetic, classic Americana shapes, 50s through 70s nostalgia. Old gas station, trave...","defaultActive":false},{"name":"Punk Protest","content":"Punk protest pin design. Bold message, irreverent, attitude-first. Simple graphic, strong statement. Activism meets a...","defaultActive":false},{"name":"Minimalist Line","content":"Minimalist line pin design. Ultra-simple single line drawing, 1-2 enamel colors, maximum negative space. Subtle, eleg...","defaultActive":false},{"name":"Tattoo Flash","content":"Tattoo flash pin design. Traditional tattoo motifs on metal. Roses, daggers, hearts, banners. Sailor Jerry as a pin.","defaultActive":false},{"name":"Seasonal Holiday","content":"Seasonal holiday pin design. Christmas, Halloween, Valentine, etc. Limited edition seasonal collectible. Timely and g...","defaultActive":false},{"name":"Matching Set Series","content":"Matching set series pin design. Designed as part of a collection, consistent frame, size, and metal. Collect-them-all...","defaultActive":false}]}],"carwrap":[{"category":"Wrap Type","styles":[{"name":"Full Body Wrap","content":"Full body vehicle wrap. Complete coverage, seamless design across all panels. Maximum visual impact, rolling billboard.","defaultActive":false},{"name":"Half Wrap Partial","content":"Half wrap partial vehicle coverage. Design covers specific sections, hood, roof, rear quarter. Strategic placement, c...","defaultActive":false},{"name":"Accent Stripe Livery","content":"Accent stripe livery wrap. Racing stripes, side decals, rocker panel graphics. Classic motorsport heritage, clean and...","defaultActive":false},{"name":"Hood and Roof Only","content":"Hood and roof only vehicle wrap. Design concentrated on hood and roof panels. Aggressive but not overdone.","defaultActive":false},{"name":"Rear Statement","content":"Rear statement vehicle wrap. Design focused on tailgate, rear bumper, or back window. The view people see most in tra...","defaultActive":false}]},{"category":"Visual Style","styles":[{"name":"Race Livery","content":"Motorsport race livery wrap. Dynamic angular lines, sponsor placement areas, aggressive geometry. GT racing influence...","defaultActive":false},{"name":"Urban Camo","content":"Urban camo vehicle wrap. Angular geometric camouflage, city-inspired pattern, matte finish. Military meets street. St...","defaultActive":false},{"name":"Chrome Color Shift","content":"Chrome color shift vehicle wrap. Reflective mirror surface, color-shifting chameleon, liquid metal look. Show car, he...","defaultActive":false},{"name":"Matte Stealth","content":"Matte stealth vehicle wrap. Satin or matte monochrome, subtle accent lines, blacked-out. Understated luxury. Clean an...","defaultActive":false},{"name":"Itasha Anime","content":"Itasha anime vehicle wrap. Full character illustration, vibrant anime art, Japanese otaku culture. Bold, unapologetic...","defaultActive":false},{"name":"Abstract Geometric","content":"Abstract geometric vehicle wrap. Angular shapes, sharp lines, fragmented panels. Modern art on wheels. Aggressive wit...","defaultActive":false},{"name":"Gradient Fade","content":"Gradient fade vehicle wrap. Smooth color transition across body panels, subtle or dramatic. Two-tone without a hard l...","defaultActive":false},{"name":"Carbon Fiber Texture","content":"Carbon fiber texture vehicle wrap. Material simulation, carbon fiber, brushed metal, or wood grain. Added perceived m...","defaultActive":false},{"name":"Tribal Flame","content":"Tribal flame vehicle wrap. Classic hot rod flames, tribal curves, pinstripe heritage. Old school custom culture. Bold...","defaultActive":false},{"name":"Nature Landscape","content":"Nature landscape vehicle wrap. Scenic imagery across panels, mountains, forests, ocean. Adventure vehicle, overlander...","defaultActive":false},{"name":"Graffiti Street Art","content":"Graffiti street art vehicle wrap. Spray paint drips, wildstyle lettering energy, concrete textures. Urban art on a mo...","defaultActive":false},{"name":"Brand Commercial","content":"Brand commercial vehicle wrap. Business livery, logo placement, fleet branding, contact info zones. Professional, cle...","defaultActive":false},{"name":"Rusty Patina Faux","content":"Rusty patina faux vehicle wrap. Fake rust, weathered paint, barn-find simulation. Ratrod aesthetic on a clean car.","defaultActive":false},{"name":"Pixel Digital Camo","content":"Pixel digital camo vehicle wrap. Square-edged digital camouflage, modern military derived. Sharper than organic camo,...","defaultActive":false},{"name":"Luxury Two-Tone","content":"Luxury two-tone vehicle wrap. Upper and lower body split in two premium colors, clean divide line. Rolls-Royce herita...","defaultActive":false}]}],"meme":[{"category":"Meme Format","styles":[{"name":"Reaction Image","content":"Reaction image meme format. One clear exaggerated expression, close crop, dramatic lighting. Perfect response to drop...","defaultActive":false},{"name":"Object Labeling","content":"Object labeling meme format. Scene with 2-3 elements designed to be labeled. Me, My goals, Distraction format energy.","defaultActive":false},{"name":"Drake Format","content":"Drake format meme. Two-panel comparison, reject and approve structure. Top panel no, bottom panel yes. Universal judg...","defaultActive":false},{"name":"Expanding Brain","content":"Expanding brain meme format. Escalating sequence, each level more absurd. Increasing enlightenment and irony ladder.","defaultActive":false},{"name":"Distracted Boyfriend","content":"Distracted boyfriend meme format. Three-element scene with clear looking and jealousy dynamic. Wandering attention fo...","defaultActive":false},{"name":"Starter Pack","content":"Starter pack meme format. Grid of 4-6 objects and scenes that define a type. Cultural observation format.","defaultActive":false},{"name":"Before After","content":"Before and after meme format. Side by side transformation, dramatic contrast. Glow-up, ruined, or ironic comparison.","defaultActive":false},{"name":"This Is Fine","content":"This is fine meme format. Scene of calm person in chaotic or burning environment. Denial, coping, everything is defin...","defaultActive":false}]},{"category":"Tone / Vibe","styles":[{"name":"Classic Internet","content":"Classic internet meme style. Bold, simple, instantly readable. Impact font energy without the text. Universal, sharea...","defaultActive":false},{"name":"Wholesome","content":"Wholesome meme style. Warm, comforting, gentle humor. Soft colors, friendly faces. Makes people smile and forward to ...","defaultActive":false},{"name":"Cursed Image","content":"Cursed image meme style. Slightly unsettling, low quality on purpose, uncanny valley. Weird angle, strange lighting.","defaultActive":false},{"name":"Surreal Absurdist","content":"Surreal absurdist meme style. Dream-logic, impossible scenarios, deep-fried adjacent but artistic. Confusing in the b...","defaultActive":false},{"name":"Dark Humor","content":"Dark humor meme style. Gallows humor energy, unexpected punchline setup, slightly uncomfortable. Edgy but clever.","defaultActive":false},{"name":"Shitpost Low-Effort","content":"Shitpost low-effort meme style. Deliberately terrible quality, MS Paint energy, compressed to death. The low effort i...","defaultActive":false},{"name":"Dank Deep-Fried","content":"Dank deep-fried meme style. Oversaturated, lens flare, emoji overlay, JPEG artifacts cranked to max. Irony layers on ...","defaultActive":false},{"name":"Nostalgic Throwback","content":"Nostalgic throwback meme style. References specific era of internet culture, early YouTube, MySpace, Vine, Tumblr. Ge...","defaultActive":false},{"name":"Corporate Memphis Irony","content":"Corporate Memphis irony meme style. Uses bland corporate illustration style for absurd or dark content. The contrast ...","defaultActive":false},{"name":"Anime Reaction","content":"Anime reaction meme style. Exaggerated anime expression, manga panel energy, weeb culture reference. Specific fandom ...","defaultActive":false}]}]};

const PALETTES = [{"name":"Midnight Streets","colors":["#0a0a0a","#1a1a2e","#FF4D6D","#e0e0e0"],"description":"Dark with hot pink punch","category":"Streetwear","type":"deep black, dark navy, hot pink accent, off-white"},{"name":"Urban Concrete","colors":["#2d2d2d","#666666","#ff6b35","#f5f5f5"],"description":"Gray scale with orange pop","category":"Streetwear","type":"charcoal gray, medium gray, burnt orange, bright white"},{"name":"Trap Gold","colors":["#0d0d0d","#1a1a1a","#ffd700","#c0a000"],"description":"Black and gold luxury street","category":"Streetwear","type":"pure black, dark black, bright gold, antique gold"},{"name":"Blood Money","colors":["#1a0000","#8b0000","#ffd700","#f5f5f5"],"description":"Deep red gold and white","category":"Streetwear","type":"deep crimson black, blood red, gold, off-white"},{"name":"Neon Underground","colors":["#0a0a0a","#ff00ff","#00ffff","#ffff00"],"description":"Black with neon trio","category":"Streetwear","type":"black, magenta neon, cyan neon, yellow neon"},{"name":"Olive Military","colors":["#1a1f16","#4a5240","#8b9a6b","#d4c5a9"],"description":"Military surplus greens","category":"Streetwear","type":"dark olive, army green, sage, sand"},{"name":"Purple Reign","colors":["#1a0a2e","#4a1a6b","#a855f7","#e0d0ff"],"description":"Deep to light purple","category":"Streetwear","type":"dark purple, royal purple, bright violet, lavender"},{"name":"Ice Cold","colors":["#0a1a2e","#1a3a5c","#60a5fa","#e0f0ff"],"description":"Cool blue gradient","category":"Streetwear","type":"midnight blue, steel blue, bright blue, ice white"},{"name":"Rust Belt","colors":["#1a0e0a","#8b4513","#d2691e","#deb887"],"description":"Industrial warm browns","category":"Streetwear","type":"dark brown, saddle brown, rust orange, tan"},{"name":"Tokyo Drift","colors":["#0d0d0d","#ff0000","#ffffff","#333333"],"description":"JDM inspired","category":"Streetwear","type":"black, racing red, white, dark gray"},{"name":"Camo Stealth","colors":["#1a1a0a","#3a3a1a","#5a5a2a","#8a8a4a"],"description":"Dark camouflage","category":"Streetwear","type":"dark camo green, olive drab, forest camo, light camo"},{"name":"Chrome Future","colors":["#1a1a1a","#808080","#c0c0c0","#f0f0f0"],"description":"Metallic silver scale","category":"Streetwear","type":"dark chrome, gunmetal, silver, bright chrome"},{"name":"Faded Denim","colors":["#1a2a3a","#4a6a8a","#8aaaca","#d4dde6"],"description":"Worn blue jeans","category":"Vintage","type":"dark indigo, washed denim, faded blue, bleached white"},{"name":"Sepia Memories","colors":["#3a2a1a","#6a5030","#b08860","#e0d0b0"],"description":"Old photograph tones","category":"Vintage","type":"dark sepia, warm brown, golden tan, cream"},{"name":"70s Sunset","colors":["#4a1a0a","#c04020","#e08040","#f0c060"],"description":"Retro sunset gradient","category":"Vintage","type":"dark rust, burnt orange, warm amber, golden yellow"},{"name":"Cream Soda","colors":["#f5e6d0","#e0c0a0","#c09060","#6a4030"],"description":"Warm creamy tones","category":"Vintage","type":"cream, warm beige, caramel, chocolate brown"},{"name":"Old Hollywood","colors":["#1a1a1a","#4a4a4a","#c0c0c0","#f0e0c0"],"description":"B&W with gold tint","category":"Vintage","type":"black, charcoal, silver, warm white"},{"name":"Dusty Rose","colors":["#3a1a1a","#8a4050","#c08090","#e0c0c0"],"description":"Faded pink tones","category":"Vintage","type":"dark mauve, dusty rose, faded pink, blush"},{"name":"Harvest Moon","colors":["#2a1a0a","#6a4a20","#d4a040","#f0d080"],"description":"Autumn golds","category":"Vintage","type":"dark earth, golden brown, harvest gold, pale gold"},{"name":"Typewriter","colors":["#f0e8d8","#d0c8b8","#4a4a40","#1a1a18"],"description":"Aged paper and ink","category":"Vintage","type":"aged paper, warm gray, dark ink, near black"},{"name":"Woodstock","colors":["#d04020","#e08020","#40a040","#2060a0"],"description":"Psychedelic retro","category":"Vintage","type":"retro red, groovy orange, forest green, denim blue"},{"name":"Polaroid","colors":["#f8f4f0","#e0d8d0","#80a0a0","#304040"],"description":"Instant film tones","category":"Vintage","type":"off-white, warm gray, faded teal, dark green-gray"},{"name":"Vinyl Record","colors":["#0a0a0a","#1a1a1a","#d4a040","#f0e0c0"],"description":"Black vinyl gold label","category":"Vintage","type":"deep black, near black, gold, cream"},{"name":"Route 66","colors":["#b03020","#e0c080","#4080a0","#f0e8d0"],"description":"Americana road trip","category":"Vintage","type":"barn red, sandy gold, highway blue, desert white"},{"name":"Forest Floor","colors":["#1a2a0a","#2a4a1a","#6a8a4a","#a0c080"],"description":"Deep forest greens","category":"Nature","type":"dark forest, deep green, moss, light sage"},{"name":"Ocean Deep","colors":["#0a1a2a","#1a3a5a","#3a6a9a","#80b0d0"],"description":"Deep sea blues","category":"Nature","type":"abyss blue, deep ocean, sea blue, sky blue"},{"name":"Desert Sand","colors":["#f0e0c0","#d0b080","#a08050","#604020"],"description":"Warm desert tones","category":"Nature","type":"pale sand, warm sand, adobe, dark earth"},{"name":"Sunset Blaze","colors":["#ff4040","#ff8040","#ffc040","#ffe080"],"description":"Fiery sunset","category":"Nature","type":"fire red, bright orange, amber, golden yellow"},{"name":"Lavender Field","colors":["#e0d0f0","#b0a0d0","#8070b0","#504080"],"description":"Purple flower field","category":"Nature","type":"light lavender, soft purple, medium violet, deep purple"},{"name":"Coral Reef","colors":["#ff6b6b","#ffa07a","#20b2aa","#006b6b"],"description":"Warm coral meets teal","category":"Nature","type":"coral red, salmon, light teal, deep teal"},{"name":"Autumn Leaves","colors":["#8b0000","#d04000","#e08000","#ffc000"],"description":"Fall foliage","category":"Nature","type":"deep red, burnt orange, amber, golden"},{"name":"Mountain Air","colors":["#4a6a8a","#8aaaba","#c0d8e8","#f0f4f8"],"description":"Cool mountain blues","category":"Nature","type":"slate blue, light blue, pale blue, cloud white"},{"name":"Moss Stone","colors":["#3a3a2a","#6a6a4a","#9a9a7a","#c0c0a0"],"description":"Lichen and rock","category":"Nature","type":"dark stone, olive gray, sage green, pale moss"},{"name":"Tropical","colors":["#ff4d6d","#ff6b35","#fbbf24","#22c55e"],"description":"Bright tropical fruit","category":"Nature","type":"hot pink, mango orange, golden yellow, palm green"},{"name":"Glacier Ice","colors":["#e0f0ff","#b0d8f0","#60a0c0","#204060"],"description":"Frozen ice blues","category":"Nature","type":"ice white, pale blue, glacier blue, deep arctic"},{"name":"Volcanic","colors":["#1a0a0a","#4a0a0a","#ff4000","#ff8000"],"description":"Lava and obsidian","category":"Nature","type":"volcanic black, dark magma, bright lava, molten orange"},{"name":"Black Tie","colors":["#0a0a0a","#1a1a1a","#c0a060","#f0e0c0"],"description":"Black and champagne gold","category":"Luxury","type":"pure black, near black, champagne gold, cream"},{"name":"Marble Hall","colors":["#f0f0f0","#d0d0d0","#808080","#1a1a1a"],"description":"White marble and dark","category":"Luxury","type":"white marble, light gray, medium gray, onyx black"},{"name":"Rose Gold","colors":["#1a0a0a","#b07060","#d4a090","#f0d0c0"],"description":"Dark with rose gold","category":"Luxury","type":"deep black, rose gold, light rose gold, blush"},{"name":"Royal Navy","colors":["#0a0a2a","#1a1a4a","#c0a060","#f0e0c0"],"description":"Navy and gold crest","category":"Luxury","type":"deep navy, royal blue, antique gold, ivory"},{"name":"Emerald Elite","colors":["#0a1a0a","#1a4a2a","#40a060","#c0a060"],"description":"Rich green and gold","category":"Luxury","type":"dark forest, emerald green, bright emerald, gold"},{"name":"Onyx Pearl","colors":["#0a0a0a","#2a2a2a","#f0f0f0","#e0e0e0"],"description":"Black and white premium","category":"Luxury","type":"onyx black, dark charcoal, pearl white, soft white"},{"name":"Burgundy Wine","colors":["#2a0a10","#6a1a2a","#a02040","#d0a0a0"],"description":"Deep wine reds","category":"Luxury","type":"dark burgundy, wine red, crimson, dusty rose"},{"name":"Platinum","colors":["#1a1a1a","#4a4a4a","#a0a0a0","#e8e8e8"],"description":"Silver platinum scale","category":"Luxury","type":"dark platinum, medium gray, bright silver, platinum white"},{"name":"Velvet","colors":["#1a0020","#3a0050","#6a2090","#a050c0"],"description":"Rich velvet purples","category":"Luxury","type":"midnight purple, deep violet, rich purple, bright amethyst"},{"name":"Cognac","colors":["#1a0a00","#4a2a10","#8a5020","#c08040"],"description":"Rich leather tones","category":"Luxury","type":"espresso, dark cognac, warm cognac, light leather"},{"name":"Sapphire","colors":["#0a0a2a","#1a1a5a","#3030a0","#6060e0"],"description":"Deep blue gems","category":"Luxury","type":"midnight blue, dark sapphire, royal sapphire, bright sapphire"},{"name":"Mink","colors":["#1a1410","#3a302a","#6a5a50","#a09080"],"description":"Sophisticated neutrals","category":"Luxury","type":"dark mink, warm charcoal, taupe, light taupe"},{"name":"Cyberpunk","colors":["#0a0a1a","#ff00ff","#00ffff","#0a0a1a"],"description":"Magenta and cyan","category":"Neon","type":"black, neon magenta, neon cyan, dark"},{"name":"Electric Lime","colors":["#0a0a0a","#00ff00","#80ff00","#c0ff00"],"description":"Green neon spectrum","category":"Neon","type":"black, electric green, lime, yellow-green neon"},{"name":"Hot Wire","colors":["#0a0a0a","#ff0000","#ff4000","#ff8000"],"description":"Red to orange neon","category":"Neon","type":"black, neon red, neon orange-red, neon orange"},{"name":"UV Light","colors":["#0a0a1a","#4a00ff","#8a00ff","#ff00ff"],"description":"Ultraviolet spectrum","category":"Neon","type":"black, deep UV blue, bright violet, neon pink"},{"name":"Rave","colors":["#0a0a0a","#ff00ff","#ffff00","#00ff00"],"description":"Party neon trio","category":"Neon","type":"black, neon pink, neon yellow, neon green"},{"name":"Laser","colors":["#0a0a0a","#ff0040","#00ff80","#0080ff"],"description":"RGB laser beams","category":"Neon","type":"black, laser red, laser green, laser blue"},{"name":"Retrowave","colors":["#1a0030","#ff0080","#ff8000","#00d0ff"],"description":"Synthwave palette","category":"Neon","type":"dark purple, neon pink, neon orange, electric blue"},{"name":"Plasma","colors":["#0a0a1a","#6a00ff","#ff00aa","#ff0040"],"description":"Plasma energy","category":"Neon","type":"deep black, electric purple, hot magenta, neon red"},{"name":"Toxic","colors":["#0a1a0a","#00ff00","#80ff00","#ffff00"],"description":"Radioactive greens","category":"Neon","type":"dark, toxic green, acid green, neon yellow"},{"name":"Hologram","colors":["#e0f0ff","#ff80c0","#80e0ff","#c0ff80"],"description":"Light holographic","category":"Neon","type":"pearl white, holographic pink, holographic blue, holographic green"},{"name":"Cotton Candy","colors":["#ffb6c1","#b6d7ff","#fff0f5","#e6e6fa"],"description":"Soft pink and blue","category":"Pastel","type":"pastel pink, pastel blue, white pink, pale lavender"},{"name":"Spring Garden","colors":["#b8e6b8","#f0e68c","#ffb6c1","#e6e6fa"],"description":"Fresh spring pastels","category":"Pastel","type":"pastel green, soft yellow, blush pink, light lavender"},{"name":"Peaches Cream","colors":["#ffdab9","#ffe4c4","#fff5e6","#ffb6a0"],"description":"Warm peach tones","category":"Pastel","type":"peach, bisque, cream, soft coral"},{"name":"Baby Blue","colors":["#b0d4f1","#c4e0f9","#d8ecff","#e8f4ff"],"description":"Gentle blue range","category":"Pastel","type":"baby blue, light sky, pale blue, ice blue"},{"name":"Mint Chip","colors":["#a0e0c0","#c0f0d8","#e0fff0","#80c0a0"],"description":"Cool mint greens","category":"Pastel","type":"mint green, light mint, pale mint, sage mint"},{"name":"Lilac Dream","colors":["#c8a0d8","#d8b8e8","#e8d0f0","#f0e0f8"],"description":"Soft purple tones","category":"Pastel","type":"lilac, light purple, pale violet, whisper lavender"},{"name":"Butter","colors":["#fff8b0","#ffffd0","#f0e080","#e0d060"],"description":"Soft yellows","category":"Pastel","type":"butter yellow, pale yellow, soft gold, muted yellow"},{"name":"Blush","colors":["#f0c0c0","#f8d0d0","#ffe0e0","#fff0f0"],"description":"Warm pink range","category":"Pastel","type":"blush, light blush, pale pink, barely pink"},{"name":"Sorbet","colors":["#ffb0c0","#ffc0a0","#ffe0b0","#c0e0c0"],"description":"Mixed fruit pastels","category":"Pastel","type":"strawberry pink, melon orange, lemon cream, lime green"},{"name":"Cloud","colors":["#f0f0f0","#e8e8f0","#e0e0e8","#f8f8ff"],"description":"White gray whispers","category":"Pastel","type":"light cloud, blue-gray mist, pale gray, ghost white"},{"name":"True Black","colors":["#000000","#1a1a1a","#333333","#4d4d4d"],"description":"Dark monochrome","category":"Mono","type":"pure black, near black, dark gray, medium dark gray"},{"name":"True White","colors":["#ffffff","#f5f5f5","#e8e8e8","#d0d0d0"],"description":"Light monochrome","category":"Mono","type":"pure white, off-white, light gray, silver gray"},{"name":"Charcoal","colors":["#1a1a1a","#3a3a3a","#6a6a6a","#9a9a9a"],"description":"Dark to medium grays","category":"Mono","type":"charcoal, dark gray, medium gray, silver"},{"name":"Ink Black","colors":["#0a0a0a","#1a1a1a","#0a0a0a","#2a2a2a"],"description":"Near-black tones","category":"Mono","type":"ink black, jet black, deep black, soft black"},{"name":"Paper White","colors":["#fafafa","#f0f0f0","#e0e0e0","#c8c8c8"],"description":"Paper-like whites","category":"Mono","type":"bright white, soft white, pearl, light silver"},{"name":"Steel","colors":["#2a3040","#4a5060","#7a8090","#a0a8b0"],"description":"Blue-tinted grays","category":"Mono","type":"dark steel, steel gray, cool gray, light steel"},{"name":"Warm Gray","colors":["#2a2420","#4a4440","#7a7470","#a09890"],"description":"Brown-tinted grays","category":"Mono","type":"dark warm gray, medium warm, taupe gray, light warm"},{"name":"Silver Screen","colors":["#1a1a1a","#808080","#c0c0c0","#e8e8e8"],"description":"High contrast B&W","category":"Mono","type":"black, gray, silver, near white"},{"name":"Graphite","colors":["#2a2a2a","#4a4a4a","#6a6a6a","#8a8a8a"],"description":"Pencil lead tones","category":"Mono","type":"dark graphite, graphite, medium graphite, light graphite"},{"name":"Fog","colors":["#d0d0d0","#b8b8b8","#a0a0a0","#888888"],"description":"Mid-range grays","category":"Mono","type":"light fog, silver fog, gray fog, dark fog"},{"name":"Cherry Blossom","colors":["#ffb7c5","#ff8fa0","#e0607a","#8a2040"],"description":"Spring sakura","category":"Seasonal","type":"light cherry blossom, medium pink, deep rose, dark magenta"},{"name":"Summer Heat","colors":["#ff4040","#ff8040","#ffc040","#40c0ff"],"description":"Hot summer","category":"Seasonal","type":"hot red, bright orange, sunny yellow, pool blue"},{"name":"Fall Harvest","colors":["#8b4513","#d2691e","#daa520","#556b2f"],"description":"Autumn rich","category":"Seasonal","type":"brown, sienna, goldenrod, dark olive"},{"name":"Winter Frost","colors":["#e8f4ff","#b0d0e8","#6090b0","#304050"],"description":"Icy winter","category":"Seasonal","type":"frost white, ice blue, winter blue, dark storm"},{"name":"Spring Rain","colors":["#80c0a0","#a0d8c0","#c0e8d8","#e0fff0"],"description":"Fresh greens","category":"Seasonal","type":"rain green, soft sage, pale mint, fresh white"},{"name":"Golden Hour","colors":["#ff8040","#ffa060","#ffc080","#ffe0a0"],"description":"Sunset golden","category":"Seasonal","type":"deep golden, warm amber, soft gold, pale gold"},{"name":"Midnight Snow","colors":["#0a1020","#1a2040","#e0e8f0","#ffffff"],"description":"Night snow","category":"Seasonal","type":"midnight blue, dark navy, snow gray, pure white"},{"name":"Pumpkin Spice","colors":["#8b3000","#d06020","#e09040","#f0c080"],"description":"Fall flavor","category":"Seasonal","type":"dark pumpkin, burnt orange, spice, cream"},{"name":"Beach Day","colors":["#00b4d8","#48cae4","#f0e68c","#fff8e0"],"description":"Ocean and sand","category":"Seasonal","type":"ocean blue, bright aqua, sandy gold, cream"},{"name":"Holiday Red","colors":["#1a0000","#8b0000","#cc0000","#228b22"],"description":"Christmas classic","category":"Seasonal","type":"deep black-red, dark red, bright red, forest green"},{"name":"Kintsugi","colors":["#1a1a1a","#d4a040","#f0d080","#e0e0e0"],"description":"Japanese gold repair","category":"Cultural","type":"black ceramic, bright gold, pale gold, white ceramic"},{"name":"Terracotta","colors":["#8b4513","#cd853f","#deb887","#f5deb3"],"description":"Mediterranean clay","category":"Cultural","type":"dark clay, terracotta, light clay, wheat"},{"name":"Indigo Shibori","colors":["#0a0a3a","#1a1a6a","#4040a0","#f0f0f0"],"description":"Japanese dye","category":"Cultural","type":"deep indigo, dark blue, medium indigo, natural white"},{"name":"Marigold","colors":["#ff8c00","#ffa500","#ffd700","#8b0000"],"description":"Indian festival","category":"Cultural","type":"dark orange, bright orange, marigold gold, deep red"},{"name":"Nordic","colors":["#2c3e50","#34495e","#ecf0f1","#bdc3c7"],"description":"Scandinavian minimal","category":"Cultural","type":"dark slate, blue gray, off-white, silver"},{"name":"Moroccan","colors":["#0a4a6a","#c04020","#e0a040","#f0e0c0"],"description":"Marrakech tiles","category":"Cultural","type":"deep teal, terracotta red, saffron gold, sand"},{"name":"Wabi Sabi","colors":["#4a4a3a","#8a8a6a","#b0b090","#d0d0b0"],"description":"Imperfect beauty","category":"Cultural","type":"dark sage, muted olive, warm gray-green, pale sage"},{"name":"Aztec","colors":["#1a4a4a","#d04020","#e0a040","#40a080"],"description":"Mesoamerican bold","category":"Cultural","type":"deep teal, rust red, golden, jade green"},{"name":"Havana","colors":["#40a0a0","#e08060","#f0c080","#ffd0a0"],"description":"Cuban pastels","category":"Cultural","type":"teal, coral, warm peach, pale sand"},{"name":"Ukiyo-e","colors":["#1a3a5a","#4a7a9a","#c0d0e0","#f0e0c0"],"description":"Japanese woodblock","category":"Cultural","type":"dark blue, medium blue, pale blue, warm cream"},{"name":"Tech Minimal","colors":["#f5f5f5","#333333","#0071e3","#e0e0e0"],"description":"Clean tech aesthetic","category":"Brand","type":"white, dark gray, electric blue, light gray"},{"name":"Startup Energy","colors":["#6c5ce7","#a29bfe","#fd79a8","#ffeaa7"],"description":"Modern startup vibes","category":"Brand","type":"bold purple, light purple, pink, soft yellow"},{"name":"Organic Natural","colors":["#2d5016","#6b8e23","#daa520","#f5f5dc"],"description":"Farm to table","category":"Brand","type":"dark green, olive, golden, beige"},{"name":"Fitness Bold","colors":["#0a0a0a","#ff0040","#ffffff","#333333"],"description":"Gym energy","category":"Brand","type":"black, power red, white, dark gray"},{"name":"Spa Calm","colors":["#e8f5e9","#b2dfdb","#80cbc4","#4a7c7c"],"description":"Wellness retreat","category":"Brand","type":"pale green, light teal, medium teal, deep teal"},{"name":"Coffee Shop","colors":["#3e2723","#5d4037","#bcaaa4","#efebe9"],"description":"Warm cafe tones","category":"Brand","type":"dark espresso, coffee brown, latte, cream"},{"name":"Gaming","colors":["#0a0a0a","#00ff00","#ff0000","#0000ff"],"description":"RGB gaming","category":"Brand","type":"black, green RGB, red RGB, blue RGB"},{"name":"Real Estate","colors":["#1a3a2a","#2d6a4f","#b7e4c7","#d8f3dc"],"description":"Trust and growth","category":"Brand","type":"dark green, forest green, sage, light mint"},{"name":"Fashion Week","colors":["#000000","#ffffff","#c0a060","#808080"],"description":"Runway minimal","category":"Brand","type":"black, white, gold accent, gray"},{"name":"Kids Play","colors":["#ff6b6b","#feca57","#48dbfb","#ff9ff3"],"description":"Bright and fun","category":"Brand","type":"cherry red, sunny yellow, sky blue, bubblegum pink"}];

const KEYWORDS = {"Style":["vector","ink wash","screenprint","watercolor","flat illustration","3D render","photorealistic","collage","pixel art","line art","engraving","woodcut","risograph","halftone","cel-shaded","oil painting","charcoal","pencil sketch","neon sign","stained glass","embroidery","paper cut","linocut","stipple","art nouveau","art deco","bauhaus","ukiyo-e","pop art","cyberpunk"],"Mood":["bold","aggressive","calm","serene","moody","dark","bright","playful","elegant","raw","gritty","ethereal","nostalgic","futuristic","dreamy","intense","peaceful","chaotic","luxurious","minimal","dramatic","whimsical","mysterious","powerful","delicate","edgy","warm","cold","haunting","vibrant"],"Technique":["high contrast","soft lighting","dramatic shadows","backlighting","rim lighting","depth of field","double exposure","long exposure","tilt shift","glitch effect","motion blur","grain texture","noise texture","distressed","weathered","hand-drawn","geometric","organic shapes","splatter","drip effect"],"Color":["monochrome","earth tones","neon","pastel","muted","saturated","black and gold","black and white","warm tones","cool tones","jewel tones","candy colors","sepia","duotone","tricolor","gradient","iridescent","metallic","matte","holographic"],"Composition":["centered","symmetrical","asymmetrical","rule of thirds","close-up","full body","wide shot","overhead","profile","three-quarter view","diagonal","framed","floating","isolated","layered","tiled","seamless pattern","vignette","cropped","bleeding edge"],"Details":["no text","transparent background","high detail","4K","8K","clean edges","isolated subject","seamless pattern","print-ready","300 DPI","sharp focus","soft focus","bokeh","lens flare","light leak","film grain","vignette","drop shadow","embossed","foil stamp"]};

const NEGATIVE_PRESETS = {"clothing":{"label":"Clothing","presets":["text","watermark","words","letters","human body","hands","fingers","face","blurry","low quality","deformed","extra limbs","bad anatomy","pixelated","cropped","out of frame","ugly","duplicate"]},"brand":{"label":"Brand/Logo","presets":["text","realistic photo","3D render","gradients","busy background","multiple colors","thin lines","complex detail","pixelated","blurry","shadows","perspective distortion"]},"tattoo":{"label":"Tattoo","presets":["blurry lines","color bleeding","skin texture","realistic skin","shading errors","watermark","text","low resolution","jagged edges","asymmetric"]},"threeD":{"label":"3D Model","presets":["flat 2D","pixelated","text","watermark","low polygon artifacts","UV seams","blurry","noisy render","unrealistic scale","floating objects"]},"jewelry":{"label":"Jewelry","presets":["text","fingers","skin","mannequin","blurry","low quality","watermark","busy background","unrealistic proportions","floating stones","plastic looking"]},"social":{"label":"Social Media","presets":["text","watermark","blurry","low resolution","cropped","out of frame","busy background","cluttered","ugly borders","pixelated"]},"mockup":{"label":"Product Mockup","presets":["text","logos","hands","fingers","blurry","low quality","watermark","busy background","unrealistic lighting","floating products"]},"marketing":{"label":"Marketing","presets":["text","fine print","blurry","low quality","watermark","cluttered","confusing layout","too many elements","dark shadows","grainy"]},"collection":{"label":"Collection","presets":["text","watermark","inconsistent style","different lighting","mismatched colors","varying quality","blurry","cropped"]},"pattern":{"label":"Pattern","presets":["visible seams","non-repeating edges","text","watermark","blurry","asymmetric","gaps in pattern","color banding","low resolution"]},"_default":{"label":"General","presets":["text","watermark","blurry","low quality","deformed","extra limbs","bad anatomy","pixelated","cropped","out of frame","ugly","duplicate","disfigured","mutation"]}};

const MOCKUP_CONFIG = {"clothing":{"label":"Garment Mockup","items":[{"id":"t-shirt","label":"\ud83d\udc55 T-Shirt","prompt":"t-shirt"},{"id":"hoodie","label":"\ud83e\udde5 Hoodie","prompt":"hoodie"},{"id":"crewneck","label":"\ud83d\udc54 Crewneck","prompt":"crewneck sweatshirt"},{"id":"tank-top","label":"\ud83e\ude73 Tank Top","prompt":"tank top"},{"id":"long-sleeve","label":"\ud83e\udde3 Long Sleeve","prompt":"long sleeve shirt"},{"id":"crop-top","label":"\ud83d\udc57 Crop Top","prompt":"crop top"},{"id":"varsity","label":"\ud83c\udfc8 Varsity Jacket","prompt":"varsity jacket"},{"id":"polo","label":"\ud83d\udc55 Polo","prompt":"polo shirt"},{"id":"joggers","label":"\ud83e\ude72 Joggers","prompt":"joggers sweatpants"},{"id":"shorts","label":"\ud83e\ude73 Shorts","prompt":"athletic shorts"},{"id":"windbreaker","label":"\ud83e\udde5 Windbreaker","prompt":"windbreaker jacket"},{"id":"bomber","label":"\ud83e\udde5 Bomber Jacket","prompt":"bomber jacket"},{"id":"snapback","label":"\ud83e\udde2 Snapback Hat","prompt":"snapback hat"},{"id":"beanie","label":"\ud83c\udfbf Beanie","prompt":"beanie knit hat"},{"id":"tote-bag","label":"\ud83d\udc5c Tote Bag","prompt":"canvas tote bag"},{"id":"backpack","label":"\ud83c\udf92 Backpack","prompt":"backpack"},{"id":"dress","label":"\ud83d\udc57 Dress","prompt":"dress"},{"id":"skirt","label":"\ud83d\udc57 Skirt","prompt":"skirt"},{"id":"apron","label":"\ud83c\udf73 Apron","prompt":"apron"},{"id":"onesie","label":"\ud83d\udc76 Baby Onesie","prompt":"baby onesie"}],"colors":[{"id":"black","label":"\u2b1b Black","value":"black"},{"id":"white","label":"\u2b1c White","value":"white"},{"id":"heather-gray","label":"\ud83e\ude76 Heather Gray","value":"heather gray"},{"id":"navy","label":"\ud83d\udfe6 Navy","value":"navy blue"},{"id":"red","label":"\ud83d\udfe5 Red","value":"red"},{"id":"forest-green","label":"\ud83d\udfe9 Forest Green","value":"forest green"},{"id":"cream","label":"\ud83d\udfe8 Cream","value":"cream"},{"id":"tan","label":"\ud83d\udfeb Tan","value":"tan"},{"id":"pink","label":"\ud83e\ude77 Pink","value":"pink"},{"id":"purple","label":"\ud83d\udfe3 Purple","value":"purple"},{"id":"royal-blue","label":"\ud83d\udd35 Royal Blue","value":"royal blue"},{"id":"charcoal","label":"\u25fc\ufe0f Charcoal","value":"charcoal gray"},{"id":"olive","label":"\ud83e\uded2 Olive","value":"olive green"},{"id":"burgundy","label":"\ud83c\udf77 Burgundy","value":"burgundy"},{"id":"mustard","label":"\ud83d\udfe1 Mustard","value":"mustard yellow"},{"id":"coral","label":"\ud83e\udeb8 Coral","value":"coral"}],"displays":[{"id":"flat-lay","label":"Flat Lay","value":"flat lay on surface"},{"id":"ghost","label":"Ghost Mannequin","value":"ghost mannequin invisible model"},{"id":"male","label":"Male Model","value":"worn by male model standing"},{"id":"female","label":"Female Model","value":"worn by female model standing"},{"id":"hanger","label":"On Hanger","value":"hanging on hanger against wall"},{"id":"folded","label":"Folded","value":"folded neatly on surface"},{"id":"lifestyle","label":"Lifestyle Shot","value":"worn casually in lifestyle street setting"}]},"collection":{"label":"Garment Mockup","items":[{"id":"t-shirt","label":"\ud83d\udc55 T-Shirt","prompt":"t-shirt"},{"id":"hoodie","label":"\ud83e\udde5 Hoodie","prompt":"hoodie"},{"id":"tank-top","label":"\ud83e\ude73 Tank Top","prompt":"tank top"},{"id":"crewneck","label":"\ud83d\udc54 Crewneck","prompt":"crewneck sweatshirt"},{"id":"long-sleeve","label":"\ud83e\udde3 Long Sleeve","prompt":"long sleeve shirt"},{"id":"snapback","label":"\ud83e\udde2 Snapback Hat","prompt":"snapback hat"},{"id":"tote-bag","label":"\ud83d\udc5c Tote Bag","prompt":"canvas tote bag"}],"colors":[{"id":"black","label":"\u2b1b Black","value":"black"},{"id":"white","label":"\u2b1c White","value":"white"},{"id":"heather-gray","label":"\ud83e\ude76 Heather Gray","value":"heather gray"},{"id":"navy","label":"\ud83d\udfe6 Navy","value":"navy blue"},{"id":"cream","label":"\ud83d\udfe8 Cream","value":"cream"},{"id":"charcoal","label":"\u25fc\ufe0f Charcoal","value":"charcoal gray"}],"displays":[{"id":"flat-lay","label":"Flat Lay","value":"flat lay on surface"},{"id":"ghost","label":"Ghost Mannequin","value":"ghost mannequin invisible model"},{"id":"lineup","label":"Side by Side","value":"displayed side by side as a matching set"}]},"sticker":{"label":"Sticker Display","items":[{"id":"die-cut","label":"\ud83c\udff7\ufe0f Die-Cut Single","prompt":"individual die-cut sticker on white surface"},{"id":"sheet","label":"\ud83d\udcc4 Sticker Sheet","prompt":"sticker sheet with multiple stickers arranged in grid"},{"id":"laptop","label":"\ud83d\udcbb On Laptop Lid","prompt":"sticker applied to laptop lid among other stickers"},{"id":"bottle","label":"\ud83e\uddf4 On Water Bottle","prompt":"sticker applied to water bottle"},{"id":"skateboard","label":"\ud83d\udef9 On Skateboard","prompt":"sticker applied to skateboard deck"},{"id":"phone-case","label":"\ud83d\udcf1 On Phone Case","prompt":"sticker applied to phone case"},{"id":"notebook","label":"\ud83d\udcd3 On Notebook","prompt":"sticker applied to notebook cover"},{"id":"bumper","label":"\ud83d\ude97 Bumper Sticker","prompt":"bumper sticker applied to car bumper"}],"colors":[],"displays":[]},"poster":{"label":"Poster Display","items":[{"id":"framed","label":"\ud83d\uddbc\ufe0f Framed on Wall","prompt":"framed poster hanging on wall in modern room"},{"id":"taped","label":"\ud83d\udccb Taped to Wall","prompt":"poster taped to wall with tape corners, urban setting"},{"id":"held","label":"\ud83e\udd32 Held in Hands","prompt":"poster held in two hands at eye level"},{"id":"rolled","label":"\ud83d\udcdc Rolled Print","prompt":"rolled poster partially unrolled on table"},{"id":"billboard","label":"\ud83c\udfd7\ufe0f Billboard","prompt":"poster as billboard advertisement on building"},{"id":"bus-stop","label":"\ud83d\ude8f Bus Stop","prompt":"poster in bus stop advertising display"},{"id":"gallery","label":"\ud83d\uddbc\ufe0f Gallery Wall","prompt":"poster in gallery exhibition on white wall with spotlight"}],"colors":[],"displays":[]},"album":{"label":"Album Display","items":[{"id":"vinyl","label":"\ud83d\udcbf Vinyl Record","prompt":"vinyl record with album art sleeve, partially pulled out"},{"id":"cd","label":"\ud83d\udcc0 CD Case","prompt":"CD jewel case with album art, front facing"},{"id":"streaming","label":"\ud83c\udfb5 Streaming Player","prompt":"music streaming app player UI showing album art on phone screen"},{"id":"cassette","label":"\ud83d\udcfc Cassette Tape","prompt":"cassette tape with album art label"},{"id":"vinyl-shelf","label":"\ud83d\udcda In Record Store","prompt":"vinyl record in record store bin being browsed"}],"colors":[],"displays":[]},"sneaker":{"label":"Sneaker Display","items":[{"id":"floating","label":"\ud83d\udc5f Floating","prompt":"sneaker floating in air at dramatic angle"},{"id":"on-foot","label":"\ud83e\uddb6 On Foot","prompt":"sneaker worn on foot, street setting"},{"id":"shelf","label":"\ud83d\uddc4\ufe0f Display Shelf","prompt":"sneaker on illuminated display shelf"},{"id":"box","label":"\ud83d\udce6 With Box","prompt":"sneaker next to open shoebox"},{"id":"pair","label":"\ud83d\udc5f\ud83d\udc5f Pair Side by Side","prompt":"pair of sneakers side by side on clean surface"},{"id":"exploded","label":"\ud83d\udca5 Exploded View","prompt":"sneaker exploded view showing materials and layers"}],"colors":[],"displays":[]},"tattoo":{"label":"Tattoo Placement","items":[{"id":"arm","label":"\ud83d\udcaa Upper Arm","prompt":"tattoo on upper arm bicep area"},{"id":"forearm","label":"\ud83e\uddbe Forearm","prompt":"tattoo on inner forearm"},{"id":"sleeve","label":"\ud83e\uddbe Full Sleeve","prompt":"tattoo as full arm sleeve"},{"id":"back","label":"\ud83d\udd19 Back","prompt":"tattoo centered on upper back"},{"id":"chest","label":"Chest","prompt":"tattoo on chest"},{"id":"leg","label":"\ud83e\uddb5 Thigh","prompt":"tattoo on thigh"},{"id":"calf","label":"\ud83e\uddb5 Calf","prompt":"tattoo on calf"},{"id":"hand","label":"\u270b Hand","prompt":"tattoo on back of hand"},{"id":"neck","label":"Neck","prompt":"tattoo on side of neck"},{"id":"ribs","label":"Ribs","prompt":"tattoo on ribcage side"}],"colors":[],"displays":[]},"brand":{"label":"Logo Application","items":[{"id":"business-card","label":"\ud83d\udcb3 Business Card","prompt":"logo printed on business card on desk"},{"id":"storefront","label":"\ud83c\udfea Storefront Sign","prompt":"logo on storefront signage, street view"},{"id":"letterhead","label":"\ud83d\udcdd Letterhead","prompt":"logo on letterhead and stationery set"},{"id":"apparel","label":"\ud83d\udc55 Embroidered on Apparel","prompt":"logo embroidered on clothing chest area"},{"id":"screen","label":"\ud83d\udda5\ufe0f Website/App","prompt":"logo displayed on website header and mobile app"},{"id":"packaging","label":"\ud83d\udce6 Product Packaging","prompt":"logo on product packaging box"},{"id":"stamp","label":"\ud83d\udd16 Stamp/Seal","prompt":"logo as embossed stamp or wax seal"},{"id":"neon","label":"\ud83d\udca1 Neon Sign","prompt":"logo as illuminated neon sign on dark wall"},{"id":"vehicle","label":"\ud83d\ude97 On Vehicle","prompt":"logo on vehicle door as fleet branding"}],"colors":[],"displays":[]},"wallpaper":{"label":"Screen Display","items":[{"id":"iphone","label":"\ud83d\udcf1 iPhone","prompt":"wallpaper displayed on iPhone screen, phone on desk"},{"id":"android","label":"\ud83d\udcf1 Android Phone","prompt":"wallpaper displayed on Android phone screen"},{"id":"desktop","label":"\ud83d\udda5\ufe0f Desktop Monitor","prompt":"wallpaper displayed on desktop monitor, desk setup"},{"id":"laptop","label":"\ud83d\udcbb Laptop Screen","prompt":"wallpaper displayed on MacBook screen"},{"id":"tablet","label":"\ud83d\udccb iPad/Tablet","prompt":"wallpaper displayed on tablet screen"},{"id":"lockscreen","label":"\ud83d\udd12 Lock Screen","prompt":"wallpaper as lock screen with time and date overlay"}],"colors":[],"displays":[]},"bookcover":{"label":"Book Display","items":[{"id":"standing","label":"\ud83d\udcd6 Standing Upright","prompt":"book standing upright showing front cover"},{"id":"stacked","label":"\ud83d\udcda Stacked","prompt":"book on top of stack of books"},{"id":"held","label":"\ud83e\udd32 Held in Hands","prompt":"book held open in hands, reading pose"},{"id":"table","label":"\ud83e\udeb5 On Coffee Table","prompt":"book lying on coffee table in living room"},{"id":"shelf","label":"\ud83d\udcda On Bookshelf","prompt":"book on bookshelf among other books, spine and cover visible"},{"id":"window","label":"\ud83e\ude9f By Window","prompt":"book by window with natural light, cozy reading setting"}],"colors":[],"displays":[]},"pin":{"label":"Pin Display","items":[{"id":"jacket","label":"\ud83e\udde5 On Denim Jacket","prompt":"enamel pin on denim jacket lapel"},{"id":"backpack","label":"\ud83c\udf92 On Backpack","prompt":"enamel pin on backpack strap"},{"id":"card","label":"\ud83c\udccf On Backing Card","prompt":"enamel pin on branded backing card, retail ready"},{"id":"collection","label":"\ud83d\udccc Pin Board","prompt":"enamel pin as part of collection on cork board"},{"id":"hat","label":"\ud83e\udde2 On Hat","prompt":"enamel pin on baseball cap"},{"id":"close-up","label":"\ud83d\udd0d Close-Up Detail","prompt":"enamel pin extreme close-up showing metal and enamel detail"}],"colors":[],"displays":[]},"carwrap":{"label":"Vehicle Display","items":[{"id":"sedan","label":"\ud83d\ude97 Sedan","prompt":"full car wrap on sedan, three-quarter angle view"},{"id":"suv","label":"\ud83d\ude99 SUV","prompt":"full car wrap on SUV, three-quarter angle view"},{"id":"sports","label":"\ud83c\udfce\ufe0f Sports Car","prompt":"full car wrap on sports car, dramatic angle"},{"id":"van","label":"\ud83d\ude90 Van","prompt":"full car wrap on van, side view showing full design"},{"id":"truck","label":"\ud83d\udefb Truck","prompt":"full car wrap on pickup truck"},{"id":"motorcycle","label":"\ud83c\udfcd\ufe0f Motorcycle","prompt":"custom paint job on motorcycle, full bike visible"}],"colors":[],"displays":[]},"pattern":{"label":"Pattern Display","items":[{"id":"fabric","label":"\ud83e\uddf5 Draped Fabric","prompt":"pattern applied to draped fabric swatch"},{"id":"pillow","label":"\ud83d\udecb\ufe0f Throw Pillow","prompt":"pattern applied to throw pillow on sofa"},{"id":"garment","label":"\ud83d\udc55 Allover Print Shirt","prompt":"pattern as allover print on t-shirt"},{"id":"wallpaper-room","label":"\ud83c\udfe0 Room Wallpaper","prompt":"pattern as room wallpaper in interior setting"},{"id":"tile","label":"\ud83d\udd32 Tiled Seamless","prompt":"pattern shown as seamless repeating tile grid"},{"id":"curtain","label":"\ud83e\ude9f Curtain","prompt":"pattern on hanging curtain by window"},{"id":"wrapping","label":"\ud83c\udf81 Gift Wrapping","prompt":"pattern as gift wrapping paper on wrapped box"}],"colors":[],"displays":[]},"character":{"label":"Character Display","items":[{"id":"sheet","label":"\ud83d\udccb Character Sheet","prompt":"character turnaround sheet showing front side and back views"},{"id":"action","label":"\u26a1 Action Pose","prompt":"character in dynamic action pose"},{"id":"portrait","label":"\ud83d\uddbc\ufe0f Portrait","prompt":"character portrait bust shot, shoulders up"},{"id":"scene","label":"\ud83c\udf06 In Scene","prompt":"character in environment scene, full body visible"},{"id":"lineup","label":"\ud83d\udc65 Group Lineup","prompt":"character standing in lineup with other characters for scale"}],"colors":[],"displays":[]},"marketing":{"label":"Ad Mockup","items":[{"id":"phone-ad","label":"\ud83d\udcf1 Phone Ad","prompt":"smartphone showing ad"},{"id":"billboard","label":"\ud83c\udfd7\ufe0f Billboard","prompt":"billboard advertisement"},{"id":"laptop-ad","label":"\ud83d\udcbb Laptop Screen","prompt":"laptop screen showing ad"},{"id":"bus-stop","label":"\ud83d\ude8f Bus Stop Ad","prompt":"bus stop advertisement panel"},{"id":"magazine-ad","label":"\ud83d\udcf0 Magazine Ad","prompt":"magazine page advertisement"},{"id":"banner","label":"\ud83c\udff7\ufe0f Web Banner","prompt":"web banner advertisement"}],"colors":[],"displays":[]},"social":{"label":"Social Media Display","items":[{"id":"phone-feed","label":"\ud83d\udcf1 In Feed on Phone","prompt":"social media post displayed on phone screen in feed"},{"id":"story","label":"\ud83d\udcf2 As Story","prompt":"social media story displayed on phone screen, vertical format"},{"id":"grid","label":"\ud83d\udcca Grid Preview","prompt":"image shown as part of 9-photo grid layout on phone"},{"id":"desktop-feed","label":"\ud83d\udda5\ufe0f Desktop Feed","prompt":"social media post on desktop browser feed"},{"id":"ad","label":"\ud83d\udce2 As Paid Ad","prompt":"image as sponsored social media advertisement with engagement metrics"}],"colors":[],"displays":[]},"meme":{"label":"Meme Display","items":[{"id":"phone-text","label":"\ud83d\udcf1 In Text Message","prompt":"meme image shown in text message conversation on phone screen"},{"id":"social-share","label":"\ud83d\udcac Shared in Feed","prompt":"meme as shared post in social media feed with reactions"},{"id":"group-chat","label":"\ud83d\udc65 In Group Chat","prompt":"meme shared in group chat on phone screen"}],"colors":[],"displays":[]}};


/* ── Template builders (prompt generation per template) ── */
const IMAGE_GEN_MODELS = [{"id":"nanobananaPro","name":"NanoBanana Pro","emoji":"🍌","default":true},{"id":"midjourney","name":"Midjourney","emoji":"🌌"},{"id":"dalle","name":"DALL·E 3","emoji":"🎨"},{"id":"stableDiffusion","name":"Stable Diffusion XL","emoji":"🔮"},{"id":"flux","name":"Flux Pro","emoji":"⚡"},{"id":"leonardo","name":"Leonardo AI","emoji":"🦁"},{"id":"firefly","name":"Adobe Firefly","emoji":"🔥"},{"id":"ideogram","name":"Ideogram","emoji":"💡"}];

const STYLE_PACKS = {"Streetwear Starter":{"description":"3 streetwear styles ready to go","styles":[{"name":"Street Raw","content":"Bold urban streetwear. Heavy outlines, distressed halftone, 90s hip-hop poster art. Dramatic lighting."},{"name":"Street Neon","content":"Neon urban glow. Bright colors on black, glowing edges, night city aesthetic. Electric and modern."},{"name":"Street Vintage","content":"Vintage urban. Faded screenprint on dark fabric, retro hip-hop, old school boom box era. Worn and authentic."}]},"Brand Designer":{"description":"3 brand identity styles","styles":[{"name":"Brand Minimal","content":"Ultra-clean brand design. Geometric, max negative space, 2 colors. Scalable at any size."},{"name":"Brand Luxury","content":"Premium brand aesthetic. Gold foil, rich textures, elegant serif influence. Refined and expensive."},{"name":"Brand Bold","content":"Bold brand mark. Heavy weight, thick strokes, impossible to ignore. Maximum impact."}]},"Dark Fantasy":{"description":"3 dark fantasy art styles","styles":[{"name":"Dark Ink","content":"Japanese ink wash meets dark fantasy. Flowing strokes, atmospheric fog, monochrome drama."},{"name":"Gothic Ornate","content":"Ornate gothic detail. Cathedral-level intricacy, dark romanticism, Victorian shadows."},{"name":"Dark Digital","content":"Digital dark fantasy. Precise rendering, dramatic lighting, epic dark atmosphere. Game concept art quality."}]}};

const PHRASES = [{"label":"Build a prompt","prompt":"Write me an image generation prompt for [describe what you want]."},{"label":"Refine it","prompt":"Refine this prompt to be more specific and vivid."},{"label":"Get variations","prompt":"Give me 5 variations of this prompt in different styles."},{"label":"Fix problems","prompt":"The image came out too [problem]. Rewrite the prompt to fix this."},{"label":"Match a vibe","prompt":"Rewrite this prompt to feel more like [brand/artist/aesthetic]."},{"label":"Negative prompt help","prompt":"Suggest negative prompts to prevent common issues with [type of image]."}];

/* ══════════════════════════════════════════════════════════════════
   STATE HELPERS — History, Recipes, Settings (in-memory for artifact)
   ══════════════════════════════════════════════════════════════════ */
let _nextHistoryId = 1;
const genId = () => `h_${Date.now()}_${_nextHistoryId++}`;

const templateBuilders = {
  clothing: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " design"); if (v.style) p.push(v.style + " style"); if (v.mood) p.push(v.mood + " mood"); p.push("isolated centered composition"); if (v.colors) p.push("colors: " + v.colors); if (v.background) p.push(v.background); p.push("print-ready, high detail, clean edges"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  social: v => { let p = []; p.push(v.subject || "[SUBJECT]"); if (v.style) p.push(v.style); if (v.mood) p.push(v.mood + " tone"); if (v.colors) p.push("colors: " + v.colors); if (v.composition) p.push(v.composition + " composition"); p.push("social media ready, 1:1 square aspect ratio, high quality"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  marketing: v => { let p = []; if (v.product) p.push("marketing visual for " + v.product); else p.push("[PRODUCT/SERVICE] marketing visual"); if (v.headline) p.push(v.headline + " messaging concept"); if (v.style) p.push(v.style + " visual style"); if (v.mood) p.push(v.mood + " emotional tone"); if (v.colors) p.push("colors: " + v.colors); p.push("advertising quality, commercial grade, attention-grabbing"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  brand: v => { let p = []; const bn = v.brandname || "[BRAND NAME]"; p.push('"' + bn + '" brand logo design'); p.push((v.subject || "[SUBJECT]") + " as the central brand mark symbol"); if (v.style) p.push(v.style + " design style"); if (v.mood) p.push(v.mood + " aesthetic"); if (v.colors) p.push("colors: " + v.colors); if (v.composition) p.push(v.composition + " layout"); p.push('the text "' + bn + '" must be prominently displayed, transparent background, scalable, vector quality'); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  threeD: v => { let p = []; p.push("3D render of " + (v.subject || "[SUBJECT]")); if (v.style) p.push(v.style + " 3D style"); if (v.material) p.push(v.material + " material"); if (v.lighting) p.push(v.lighting + " lighting"); if (v.colors) p.push("colors: " + v.colors); if (v.camera) p.push(v.camera + " camera angle"); p.push("high-quality 3D render, octane render quality, 8K detail"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  jewelry: v => { let p = []; p.push((v.piece || "[PIECE TYPE]") + " jewelry design"); if (v.style) p.push(v.style + " style"); if (v.material) p.push(v.material + " metal"); if (v.gemstones) p.push("featuring " + v.gemstones); if (v.colors) p.push("colors: " + v.colors); p.push("professional jewelry photography, studio lighting, macro detail"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  collection: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " design"); if (v.style) p.push(v.style + " style"); p.push("part of " + (v.theme || "[THEME]") + " series"); if (v.colors) p.push("colors: " + v.colors); if (v.unique) p.push("featuring " + v.unique); if (v.details) p.push(v.details); p.push("consistent composition, series-ready"); return p.join(", "); },
  freestyle: v => { let p = []; p.push(v.subject || "[SUBJECT]"); if (v.style) p.push(v.style + " style"); if (v.mood) p.push(v.mood); if (v.colors) p.push("colors: " + v.colors); if (v.composition) p.push(v.composition + " composition"); if (v.details) p.push(v.details); return p.join(", "); },
  album: v => { let p = []; p.push(v.subject || "[SUBJECT]"); if (v.style) p.push(v.style); if (v.mood) p.push(v.mood + " atmosphere"); if (v.genre) p.push(v.genre + " aesthetic"); if (v.colors) p.push("colors: " + v.colors); p.push("square 1:1, album cover quality, cinematic lighting"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  poster: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " poster design"); if (v.style) p.push(v.style); if (v.mood) p.push(v.mood + " energy"); if (v.colors) p.push("colors: " + v.colors); if (v.composition) p.push(v.composition); p.push("portrait orientation, print-ready, high impact"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  sticker: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " sticker design"); if (v.style) p.push(v.style + " style"); if (v.mood) p.push(v.mood); if (v.colors) p.push("limited palette: " + v.colors); if (v.shape) p.push(v.shape + " shape"); p.push("thick outlines, flat colors, die-cut ready, transparent background"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  wallpaper: v => { let p = []; p.push(v.subject || "[SUBJECT]"); if (v.style) p.push(v.style); if (v.mood) p.push(v.mood + " atmosphere"); if (v.colors) p.push("colors: " + v.colors); p.push((v.device || "phone 9:16 portrait") + " aspect ratio"); p.push("wallpaper, high resolution"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  mockup: v => { let p = []; p.push("product photography of " + (v.product || "[PRODUCT]")); if (v.scene) p.push("on " + v.scene); if (v.style) p.push(v.style + " photography"); if (v.colors) p.push("color scheme: " + v.colors); if (v.lighting) p.push(v.lighting + " lighting"); p.push("commercial quality, professional product shot"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  tattoo: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " tattoo design"); if (v.style) p.push(v.style + " tattoo style"); if (v.placement) p.push("designed for " + v.placement); if (v.size) p.push(v.size + " scale"); if (v.colors) p.push("ink: " + v.colors); p.push("clean white background, crisp lines, tattoo flash sheet quality"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  sneaker: v => { let p = []; p.push((v.silhouette || "[SILHOUETTE]") + " sneaker concept"); if (v.style) p.push(v.style + " design"); if (v.materials) p.push(v.materials + " materials"); if (v.colors) p.push("colorway: " + v.colors); if (v.details) p.push("featuring " + v.details); p.push("side profile, white background, sharp detail"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  pattern: v => { let p = []; p.push("seamless tileable pattern"); p.push((v.subject || "[ELEMENTS]") + " motif"); if (v.style) p.push(v.style + " technique"); if (v.mood) p.push(v.mood + " feel"); if (v.colors) p.push("colors: " + v.colors); if (v.density) p.push(v.density + " density"); p.push("seamless repeat, fabric-ready, no visible edges"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  character: v => { let p = []; p.push((v.character || "[CHARACTER]") + " character design"); if (v.style) p.push(v.style + " style"); if (v.outfit) p.push("wearing " + v.outfit); if (v.colors) p.push("color scheme: " + v.colors); if (v.pose) p.push(v.pose + " pose"); p.push("full body, character sheet, clean background"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  bookcover: v => { let p = []; p.push((v.subject || "[CONCEPT]") + " book cover artwork"); if (v.style) p.push(v.style); if (v.genre) p.push(v.genre + " genre aesthetic"); if (v.colors) p.push("colors: " + v.colors); if (v.composition) p.push(v.composition + " for title placement"); p.push("portrait, editorial quality, high detail"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  pin: v => { let p = []; p.push((v.subject || "[SUBJECT]") + " enamel pin design"); if (v.style) p.push(v.style); if (v.mood) p.push(v.mood + " vibe"); if (v.colors) p.push("enamel colors: " + v.colors); if (v.shape) p.push(v.shape + " shape"); p.push("gold metal outlines, flat enamel fills, white background"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  carwrap: v => { let p = []; p.push((v.design || "[DESIGN]") + " vehicle wrap"); p.push("on " + (v.vehicle || "[VEHICLE]")); if (v.style) p.push(v.style + " aesthetic"); if (v.colors) p.push("colors: " + v.colors); if (v.coverage) p.push(v.coverage); p.push("side profile, showroom quality"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
  meme: v => { let p = []; p.push(v.subject || "[SUBJECT]"); if (v.expression) p.push("with " + v.expression + " expression"); if (v.style) p.push(v.style + " style"); if (v.colors) p.push("colors: " + v.colors); if (v.context) p.push(v.context + " background"); p.push("expressive, shareable, reaction image quality, meme-ready"); if (v.avoid) p.push("--no " + v.avoid); return p.join(", "); },
};

const generatorFormats = {
  nanoBananaPro: (parts, neg) => { let p = "Create an image: " + parts.join(". ").replace(/\.\./g, "."); if (neg) p += " Do not include: " + neg + "."; p += " High quality, detailed, professional result."; return p; },
  midjourney: (parts, neg) => { let p = parts.join(", "); if (neg) p += " --no " + neg; return p + " --ar 1:1 --style raw --v 6.1"; },
  dalle: (parts, neg) => { let p = parts.join(". ").replace(/\.\./g, "."); if (neg) p += " Do not include: " + neg + "."; return p; },
  sd: (parts) => parts.join(", ") + ", masterpiece, best quality, highly detailed",
  flux: (parts, neg) => { let p = parts.join(". ").replace(/\.\./g, "."); if (neg) p += " Without: " + neg + "."; return p; },
  leonardo: (parts) => parts.join(", ") + ", high quality, detailed",
  firefly: (parts, neg) => { let short = parts.slice(0, 5).join(", "); if (neg) short += " without " + neg; return short; },
  ideogram: (parts, neg) => { let p = parts.join(". ").replace(/\.\./g, "."); if (neg) p += " Exclude: " + neg + "."; return p; },
  raw: (parts, neg) => { let p = parts.join(", "); if (neg) p += ", --no " + neg; return p; },
};

/* ── Prompt engine ── */
function buildPrompt(input) {
  const { templateIndex, generatorId, fieldValues, styleStates = {}, customStyles = [], selectedKeywords = [], selectedPalettes = [], customPalettes = [], negativePrompt = "", referenceImageUrl = "", garment = null, mockup = false, mockupItem = "", mockupColor = "black", mockupDisplay = "flat lay", variables = [] } = input;
  const tpl = TEMPLATES[templateIndex];
  if (!tpl) return { combined: "", raw: "", wordCount: 0, charCount: 0, hasContent: false, overLimit: false, activeStyleNames: [] };
  const gen = GENERATORS.find(g => g.id === generatorId) || GENERATORS[GENERATORS.length - 1];

  // 1. Active styles
  const tplStyles = TEMPLATE_STYLES[tpl.id] || [];
  const activePresets = [];
  tplStyles.forEach((cat, ci) => { cat.styles.forEach((s, si) => { if (styleStates[tpl.id]?.[ci]?.[si]) activePresets.push({ name: s.name, content: s.content }); }); });
  const activeCustom = customStyles.filter(s => s.active);
  const allActive = [...activePresets, ...activeCustom];
  const styTxt = allActive.map(s => s.content).join("\n\n");
  const activeStyleNames = allActive.map(s => s.name);

  // 2. Garment
  let garTxt = "";
  if (garment && (tpl.id === "clothing" || tpl.id === "collection")) garTxt = `Design for ${garment} garment. Isolated graphic, no full garment shown. The design should contrast well on a ${garment} background.`;

  // 3. Mockup
  let mockTxt = "";
  if (mockup && mockupItem) mockTxt = `Professional product photography of ${mockupItem} in ${mockupColor}, ${mockupDisplay} view, clean studio lighting, commercial product shot.`;

  // 4. Template builder
  const builder = templateBuilders[tpl.id];
  const fp = builder ? builder(fieldValues) : Object.values(fieldValues).filter(Boolean).join(", ");

  // 5. Palettes
  const allPals = [...PALETTES, ...customPalettes.map(p => ({ ...p, description: "", category: "Custom" }))];
  const palObjs = selectedPalettes.map(n => allPals.find(p => p.name === n)).filter(Boolean);
  const palTxt = palObjs.length ? "Color palette: " + palObjs.map(p => p.colors.join(", ") + " (" + p.type + ")").join(" + ") : "";

  // 6. Keywords
  const kwTxt = selectedKeywords.length ? "Keywords: " + selectedKeywords.join(", ") + "." : "";

  // 7-8. Reference
  let refTxt = "";
  if (referenceImageUrl) refTxt = generatorId === "midjourney" ? "--sref " + referenceImageUrl : "Style reference: " + referenceImageUrl;

  // Build parts
  const parts = [];
  if (styTxt) parts.push(styTxt);
  if (garTxt) parts.push(garTxt);
  if (mockTxt) parts.push(mockTxt);
  parts.push(fp);
  if (palTxt) parts.push(palTxt);
  if (kwTxt) parts.push(kwTxt);
  if (refTxt) parts.push(refTxt);
  const rawParts = parts.filter(p => p !== styTxt || !styTxt);

  let combined = "", raw = "";
  const negStr = negativePrompt;
  if (gen.id === "raw") { combined = parts.join("\n\n"); raw = rawParts.join("\n\n"); }
  else {
    const formatFn = generatorFormats[gen.id];
    if (formatFn) {
      const noMatch = fp.match(/--no\s+(.+)$/);
      let avoidStr = noMatch ? noMatch[1] : "";
      if (negStr) avoidStr = avoidStr ? avoidStr + ", " + negStr : negStr;
      const cleanParts = parts.map(p => p.replace(/,\s*--no\s+.*$/, ""));
      const cleanRaw = rawParts.map(p => p.replace(/,\s*--no\s+.*$/, ""));
      combined = formatFn(cleanParts, avoidStr);
      raw = formatFn(cleanRaw, avoidStr);
    } else { combined = parts.join(", "); raw = rawParts.join(", "); }
  }

  // Variable substitution
  variables.forEach(v => { combined = combined.replaceAll(`{${v.token}}`, v.value); raw = raw.replaceAll(`{${v.token}}`, v.value); });

  const hasContent = Object.values(fieldValues).some(v => v?.trim()) || allActive.length > 0 || garment || mockup || selectedKeywords.length > 0 || selectedPalettes.length > 0 || !!referenceImageUrl;
  const words = combined.trim() ? combined.trim().split(/\s+/).length : 0;
  return { combined, raw, wordCount: words, charCount: combined.length, hasContent, overLimit: gen.id !== "raw" && combined.length > gen.maxLength, generatorMaxLen: gen.maxLength, activeStyleNames };
}

/* ══════════════════════════════════════════════════════════════════
   TOAST SYSTEM
   ══════════════════════════════════════════════════════════════════ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />)}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const colors = { success: { bg: "var(--success-bg)", border: "var(--success)", icon: <CheckCircle size={16} /> }, warn: { bg: "var(--warn-bg)", border: "var(--warn)", icon: <AlertTriangle size={16} /> }, error: { bg: "#1a0a0a", border: "#ef4444", icon: <AlertCircle size={16} /> }, info: { bg: "var(--info-bg)", border: "var(--info)", icon: <Info size={16} /> } };
  const c = colors[toast.type] || colors.info;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, color: "var(--text-1)", fontSize: 13, fontWeight: 500, animation: "toastSlide 0.3s ease-out", minWidth: 240, maxWidth: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
      <span style={{ color: c.border, flexShrink: 0 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{toast.msg}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "var(--text-4)", cursor: "pointer", padding: 2 }}><X size={14} /></button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SIDEBAR + NAV
   ══════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "builder", label: "Builder", icon: Zap },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ view, setView, collapsed, setCollapsed, theme, setTheme }) {
  return (
    <aside style={{ width: collapsed ? 68 : 240, minWidth: collapsed ? 68 : 240, height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-1)", borderRight: "1px solid var(--border-1)", transition: "width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ padding: collapsed ? "20px 0" : "20px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", minHeight: 70 }}>
        {collapsed ? <span style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)", fontFamily: "'DM Sans', system-ui" }}>S</span> : (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', system-ui" }}><span style={{ color: "var(--accent)" }}>S</span><span style={{ color: "var(--text-1)" }}>AVAGE</span></div>
            <div style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 500, marginTop: 2 }}>Prompt Builder</div>
          </div>
        )}
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", top: 24, right: -1, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: "0 6px 6px 0", cursor: "pointer", color: "var(--text-4)", transition: "color 0.15s", zIndex: 2 }}>{collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</button>
      <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = view === item.id; const Icon = item.icon;
          return (<button key={item.id} onClick={() => setView(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "11px 0" : "11px 14px", justifyContent: collapsed ? "center" : "flex-start", background: active ? "var(--accent)" : "transparent", color: active ? "#fff" : "var(--text-3)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 500, transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden" }} onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text-1)"; } }} onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; } }}><Icon size={18} />{!collapsed && <span>{item.label}</span>}</button>);
        })}
      </nav>
      <div style={{ padding: collapsed ? "16px 8px" : "16px 12px", borderTop: "1px solid var(--border-1)", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "10px 0" : "10px 14px", justifyContent: collapsed ? "center" : "flex-start", background: "transparent", color: "var(--text-3)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text-1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}{!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: collapsed ? "8px 0" : "8px 14px", justifyContent: collapsed ? "center" : "flex-start", whiteSpace: "nowrap", overflow: "hidden" }}>
          <span style={{ background: "linear-gradient(135deg, var(--accent), #a78bfa)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: 1, textTransform: "uppercase" }}>FREE</span>
          {!collapsed && <span style={{ fontSize: 12, color: "var(--text-4)" }}>Current Tier</span>}
        </div>
      </div>
    </aside>
  );
}

function BottomNav({ view, setView }) {
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: "var(--bg-1)", borderTop: "1px solid var(--border-1)", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100, backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {NAV_ITEMS.map(item => { const active = view === item.id; const Icon = item.icon; return (<button key={item.id} onClick={() => setView(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: active ? "var(--accent)" : "var(--text-4)", transition: "color 0.15s", padding: "6px 16px" }}><Icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: 0.4 }}>{item.label}</span></button>); })}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME VIEW
   ══════════════════════════════════════════════════════════════════ */
function TemplateCard({ template, onClick, isFreestyle }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, padding: 20, background: "var(--bg-2)", border: `1px ${isFreestyle ? "dashed" : "solid"} ${h ? "var(--accent)" : isFreestyle ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s cubic-bezier(.4,0,.2,1)", transform: h ? "translateY(-3px)" : "translateY(0)", boxShadow: h ? "0 12px 40px rgba(0,0,0,0.25)" : "var(--card-shadow, none)", position: "relative", overflow: "hidden" }}>
      {isFreestyle && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, color: "var(--accent)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}><Sparkles size={10} /> From Scratch</div>}
      <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: h ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "var(--bg-3)", transition: "background 0.2s" }}>{template.emoji}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.3 }}>{template.name}</div>
        <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 3, lineHeight: 1.4 }}>{template.description}</div>
      </div>
    </button>
  );
}

function HomeView({ setView, setBuilderTemplate, toast }) {
  const [quickText, setQuickText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const handleTemplateClick = (t) => { const idx = TEMPLATES.findIndex(x => x.id === t.id); setBuilderTemplate(idx >= 0 ? idx : 0); toast(`Selected "${t.name}" — opening Builder`, "success"); setView("builder"); };
  const handleQuickStart = () => { if (quickText.trim()) { setBuilderTemplate(TEMPLATES.findIndex(t => t.id === "freestyle")); toast("Quick start — opening Freestyle Builder", "success"); setView("builder"); } };
  const filteredGroups = TEMPLATE_GROUPS.map(group => ({ ...group, templates: group.ids.map(id => TEMPLATES.find(t => t.id === id)).filter(t => t && (t.name.toLowerCase().includes(searchFilter.toLowerCase()) || t.description.toLowerCase().includes(searchFilter.toLowerCase()))) })).filter(g => g.templates.length > 0);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ paddingTop: 64, paddingBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, color: "var(--text-1)", lineHeight: 1.15, letterSpacing: -0.8, fontFamily: "'DM Sans', system-ui", marginBottom: 12 }}>What are you creating today<span style={{ color: "var(--accent)" }}>?</span></h1>
        <p style={{ fontSize: 15, color: "var(--text-3)", maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.6 }}>Pick a template to start building your prompt, or type a quick idea below</p>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 14, padding: "4px 4px 4px 16px" }}>
            <Sparkles size={16} style={{ color: "var(--text-4)", flexShrink: 0 }} />
            <input value={quickText} onChange={e => setQuickText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleQuickStart()} placeholder="Quick idea — a neon skull on a skateboard..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-1)", fontSize: 14, padding: "12px 0", fontFamily: "inherit" }} />
            <button onClick={handleQuickStart} style={{ background: quickText.trim() ? "var(--accent)" : "var(--bg-3)", color: quickText.trim() ? "#fff" : "var(--text-4)", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>Go <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 360, margin: "0 auto 32px", position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)" }} />
        <input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Filter templates..." style={{ width: "100%", background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 10, padding: "10px 14px 10px 38px", color: "var(--text-1)", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingBottom: 80 }}>
        {filteredGroups.map(group => (
          <section key={group.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", letterSpacing: 1.5, textTransform: "uppercase" }}>{group.label}</h2>
              <div style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {group.templates.map(t => <TemplateCard key={t.id} template={t} isFreestyle={t.id === "freestyle"} onClick={() => handleTemplateClick(t)} />)}
            </div>
          </section>
        ))}
      </div>
      <section style={{ paddingBottom: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", letterSpacing: 1.5, textTransform: "uppercase" }}>Recent Work</h2>
          <div style={{ flex: 1, height: 1, background: "var(--border-1)" }} />
        </div>
        <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--bg-2)", borderRadius: 16, border: "1px dashed var(--border-2)" }}>
          <Clock size={28} style={{ color: "var(--text-5)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>Your saved prompts will appear here.</p>
          <p style={{ fontSize: 13, color: "var(--text-5)", marginTop: 4 }}>Start by picking a template above.</p>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   BUILDER VIEW
   ══════════════════════════════════════════════════════════════════ */
function SuggestionChips({ suggestions, value, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {suggestions.slice(0, 10).map((s, i) => {
        const active = value?.toLowerCase().includes(s.toLowerCase());
        return (
          <button key={i} onClick={() => onSelect(s)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 500, background: active ? "var(--accent-bg)" : "var(--bg-3)", color: active ? "var(--accent)" : "var(--text-3)", border: `1px solid ${active ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 7, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }} onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--text-4)"; }} onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border-1)"; }}>{s}</button>
        );
      })}
    </div>
  );
}

function FieldInput({ field, value, onChange, presets }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 4, height: 16, borderRadius: 2, background: field.color, flexShrink: 0 }} />
        <label style={{ fontSize: 11, fontWeight: 700, color: field.color, letterSpacing: 1.2, textTransform: "uppercase" }}>{field.label}</label>
        <span style={{ fontSize: 11, color: "var(--text-5)", fontStyle: "italic" }}>{field.question}</span>
      </div>
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%", background: "var(--bg-input)", border: `1px solid ${focused ? field.color + "88" : "var(--border-1)"}`, borderRadius: 10, padding: "10px 14px", color: "var(--text-1)", fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
      />
      <SuggestionChips suggestions={presets} value={value} onSelect={s => onChange(value ? value + ", " + s : s)} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PHASE 3 — DRAWER COMPONENTS
   ══════════════════════════════════════════════════════════════════ */

function DrawerSection({ title, badge, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", fontSize: 13, fontWeight: 600, transition: "color 0.15s" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          {title}
          {badge != null && badge > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", background: "var(--accent-bg)", padding: "2px 7px", borderRadius: 6 }}>{badge}</span>}
        </span>
        {open ? <ChevronUp size={15} style={{ color: "var(--text-4)" }} /> : <ChevronDown size={15} style={{ color: "var(--text-4)" }} />}
      </button>
      {open && <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border-1)" }}>{children}</div>}
    </div>
  );
}

function StylesDrawer({ templateId, styleStates, setStyleStates, customStyles, setCustomStyles }) {
  const [search, setSearch] = useState("");
  const [expandedCats, setExpandedCats] = useState({});
  const [addingStyle, setAddingStyle] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");

  const categories = TEMPLATE_STYLES[templateId] || [];
  const states = styleStates[templateId] || [];

  const toggleStyle = (ci, si) => {
    const newStates = { ...styleStates };
    if (!newStates[templateId]) newStates[templateId] = categories.map(c => c.styles.map(() => false));
    const catArr = [...(newStates[templateId][ci] || categories[ci].styles.map(() => false))];
    catArr[si] = !catArr[si];
    newStates[templateId] = [...newStates[templateId]];
    newStates[templateId][ci] = catArr;
    setStyleStates(newStates);
  };

  const toggleCat = (ci) => setExpandedCats(p => ({ ...p, [ci]: !p[ci] }));

  const activeCount = categories.reduce((sum, cat, ci) => sum + (states[ci] || []).filter(Boolean).length, 0) + customStyles.filter(s => s.active).length;

  const addCustom = () => {
    if (!newName.trim() || !newContent.trim()) return;
    setCustomStyles(prev => [...prev, { name: newName, content: newContent, active: true }]);
    setNewName(""); setNewContent(""); setAddingStyle(false);
  };

  return (
    <DrawerSection title="Styles" badge={activeCount} icon={<Wand2 size={15} />} defaultOpen={activeCount > 0}>
      <div style={{ paddingTop: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search styles..." style={{ width: "100%", padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 12, outline: "none", marginBottom: 12, fontFamily: "inherit" }} />

        {categories.map((cat, ci) => {
          const catStates = states[ci] || cat.styles.map(() => false);
          const catActive = catStates.filter(Boolean).length;
          const filtered = cat.styles.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0) return null;
          const isExp = expandedCats[ci] !== undefined ? expandedCats[ci] : catActive > 0;

          return (
            <div key={ci} style={{ marginBottom: 8 }}>
              <button onClick={() => toggleCat(ci)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 12, fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isExp ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  {cat.category}
                </span>
                <span style={{ fontSize: 10, color: catActive > 0 ? "var(--accent)" : "var(--text-5)" }}>({catActive}/{cat.styles.length})</span>
              </button>
              {isExp && filtered.map((s, si) => {
                const origIdx = cat.styles.indexOf(s);
                const isActive = catStates[origIdx];
                return (
                  <button key={si} onClick={() => toggleStyle(ci, origIdx)} style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", margin: "2px 0", background: isActive ? "var(--accent-bg)" : "transparent", border: `1px solid ${isActive ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "transparent"}`, borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isActive ? "var(--accent)" : "var(--border-2)"}`, background: isActive ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
                      {isActive && <Check size={10} style={{ color: "#fff" }} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? "var(--text-1)" : "var(--text-2)" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{s.content.slice(0, 90)}{s.content.length > 90 ? "..." : ""}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Custom Styles */}
        <div style={{ borderTop: "1px solid var(--border-1)", marginTop: 8, paddingTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Custom Styles</div>
          {customStyles.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4, borderRadius: 6, background: s.active ? "var(--accent-bg)" : "transparent", cursor: "pointer" }} onClick={() => setCustomStyles(prev => prev.map((x, j) => j === i ? { ...x, active: !x.active } : x))}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${s.active ? "var(--accent)" : "var(--border-2)"}`, background: s.active ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.active && <Check size={8} style={{ color: "#fff" }} />}
              </div>
              <span style={{ fontSize: 12, color: "var(--text-2)", flex: 1 }}>{s.name}</span>
              <button onClick={e => { e.stopPropagation(); setCustomStyles(prev => prev.filter((_, j) => j !== i)); }} style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer", padding: 2 }}><X size={12} /></button>
            </div>
          ))}
          {addingStyle ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Style name" style={{ padding: "8px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Style content..." rows={3} style={{ padding: "8px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setAddingStyle(false)} style={{ padding: "6px 12px", background: "var(--bg-3)", border: "none", borderRadius: 6, color: "var(--text-3)", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                <button onClick={addCustom} style={{ padding: "6px 12px", background: "var(--accent)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save Style</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingStyle(true)} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "6px 0" }}>+ Add Style</button>
          )}
        </div>
      </div>
    </DrawerSection>
  );
}

function PalettesDrawer({ selectedPalettes, setSelectedPalettes, customPalettes, setCustomPalettes }) {
  const [creating, setCreating] = useState(false);
  const [newPalName, setNewPalName] = useState("");
  const [newPalColors, setNewPalColors] = useState(["#FF4D6D", "#A78BFA", "#34D399"]);
  const [newPalType, setNewPalType] = useState("");

  const toggle = (name) => setSelectedPalettes(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const grouped = {};
  PALETTES.forEach(p => { (grouped[p.category] = grouped[p.category] || []).push(p); });

  const savePalette = () => {
    if (!newPalName.trim()) return;
    setCustomPalettes(prev => [...prev, { name: newPalName, colors: newPalColors, type: newPalType || "custom", category: "Custom" }]);
    setNewPalName(""); setNewPalColors(["#FF4D6D", "#A78BFA", "#34D399"]); setNewPalType(""); setCreating(false);
  };

  return (
    <DrawerSection title="Palettes" badge={selectedPalettes.length} icon={<span style={{ fontSize: 14 }}>🎨</span>}>
      <div style={{ paddingTop: 12, maxHeight: 400, overflowY: "auto" }}>
        {Object.entries(grouped).map(([cat, pals]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{cat} ({pals.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pals.map(p => {
                const sel = selectedPalettes.includes(p.name);
                return (
                  <button key={p.name} onClick={() => toggle(p.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: sel ? "var(--accent-bg)" : "transparent", border: `1px solid ${sel ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                      {p.colors.slice(0, 6).map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: "1px solid rgba(255,255,255,0.1)" }} />)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: sel ? "var(--text-1)" : "var(--text-2)" }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Custom palettes */}
        {customPalettes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Custom</div>
            {customPalettes.map((p, i) => {
              const sel = selectedPalettes.includes(p.name);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", background: sel ? "var(--accent-bg)" : "transparent", border: `1px solid ${sel ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 6, cursor: "pointer", marginBottom: 4 }} onClick={() => toggle(p.name)}>
                  <div style={{ display: "flex", gap: 2 }}>{p.colors.map((c, j) => <div key={j} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />)}</div>
                  <span style={{ fontSize: 11, color: "var(--text-2)", flex: 1 }}>{p.name}</span>
                  <button onClick={e => { e.stopPropagation(); setCustomPalettes(prev => prev.filter((_, j) => j !== i)); setSelectedPalettes(prev => prev.filter(n => n !== p.name)); }} style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer", padding: 2 }}><X size={12} /></button>
                </div>
              );
            })}
          </div>
        )}

        {/* Create palette */}
        {creating ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, background: "var(--bg-3)", borderRadius: 8, marginTop: 8 }}>
            <input value={newPalName} onChange={e => setNewPalName(e.target.value)} placeholder="Palette name" style={{ padding: "7px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {newPalColors.map((c, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <input type="color" value={c} onChange={e => setNewPalColors(prev => prev.map((x, j) => j === i ? e.target.value : x))} style={{ width: 32, height: 32, borderRadius: 6, border: "none", cursor: "pointer", padding: 0 }} />
                  {newPalColors.length > 2 && <button onClick={() => setNewPalColors(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "var(--bg-1)", border: "1px solid var(--border-2)", color: "var(--text-4)", fontSize: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>}
                </div>
              ))}
              {newPalColors.length < 10 && <button onClick={() => setNewPalColors(prev => [...prev, "#888888"])} style={{ width: 32, height: 32, borderRadius: 6, border: "1px dashed var(--border-2)", background: "none", color: "var(--text-4)", cursor: "pointer", fontSize: 16 }}>+</button>}
            </div>
            <input value={newPalType} onChange={e => setNewPalType(e.target.value)} placeholder="Description (e.g. warm earth tones)" style={{ padding: "7px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCreating(false)} style={{ padding: "6px 12px", background: "var(--bg-2)", border: "none", borderRadius: 6, color: "var(--text-3)", fontSize: 11, cursor: "pointer" }}>Cancel</button>
              <button onClick={savePalette} style={{ padding: "6px 12px", background: "var(--accent)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save Palette</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreating(true)} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "6px 0", marginTop: 4 }}>+ Create Palette</button>
        )}
      </div>
    </DrawerSection>
  );
}

function KeywordsDrawer({ selectedKeywords, setSelectedKeywords }) {
  const toggle = (kw) => setSelectedKeywords(prev => prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]);
  return (
    <DrawerSection title="Keywords" badge={selectedKeywords.length} icon={<span style={{ fontSize: 14 }}>🏷️</span>}>
      <div style={{ paddingTop: 12 }}>
        {Object.entries(KEYWORDS).map(([cat, words]) => (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {words.map(w => {
                const sel = selectedKeywords.includes(w);
                return (
                  <button key={w} onClick={() => toggle(w)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: sel ? 600 : 400, background: sel ? "var(--accent)" : "var(--bg-3)", color: sel ? "#fff" : "var(--text-3)", border: `1px solid ${sel ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 6, cursor: "pointer", transition: "all 0.15s" }}>{w}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DrawerSection>
  );
}

function NegativePromptDrawer({ templateId, negativePrompt, setNegativePrompt }) {
  const presets = (NEGATIVE_PRESETS[templateId] || NEGATIVE_PRESETS._default).presets;
  const activeTerms = negativePrompt.split(",").map(s => s.trim()).filter(Boolean);

  const togglePreset = (p) => {
    if (activeTerms.includes(p)) setNegativePrompt(activeTerms.filter(t => t !== p).join(", "));
    else setNegativePrompt([...activeTerms, p].join(", "));
  };

  return (
    <DrawerSection title="Negative Prompt" badge={activeTerms.length} icon={<span style={{ fontSize: 14 }}>🚫</span>}>
      <div style={{ paddingTop: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
          {presets.map(p => {
            const sel = activeTerms.includes(p);
            return (
              <button key={p} onClick={() => togglePreset(p)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: sel ? 600 : 400, background: sel ? "rgba(239,68,68,0.12)" : "var(--bg-3)", color: sel ? "#ef4444" : "var(--text-3)", border: `1px solid ${sel ? "rgba(239,68,68,0.3)" : "var(--border-1)"}`, borderRadius: 6, cursor: "pointer", transition: "all 0.15s" }}>{p}</button>
            );
          })}
        </div>
        <textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="text, watermark, blurry, low quality..." rows={3} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
      </div>
    </DrawerSection>
  );
}

function AdvancedDrawer({ templateId, garment, setGarment, mockup, setMockup, mockupItem, setMockupItem, mockupColor, setMockupColor, mockupDisplay, setMockupDisplay, refUrl, setRefUrl, variables, setVariables }) {
  const mc = MOCKUP_CONFIG[templateId];
  const showGarment = templateId === "clothing" || templateId === "collection";
  const [addingVar, setAddingVar] = useState(false);
  const [varToken, setVarToken] = useState("");
  const [varValue, setVarValue] = useState("");

  const addVar = () => {
    if (!varToken.trim() || !varValue.trim()) return;
    setVariables(prev => [...prev, { token: varToken.replace(/\s/g, ""), value: varValue }]);
    setVarToken(""); setVarValue(""); setAddingVar(false);
  };

  const selStyle = { padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit", width: "100%" };

  return (
    <DrawerSection title="Advanced" badge={null} icon={<Settings size={15} />}>
      <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Garment */}
        {showGarment && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Garment Color</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ val: "dark", label: "🖤 Dark" }, { val: "light", label: "🤍 Light" }].map(g => (
                <button key={g.val} onClick={() => setGarment(garment === g.val ? null : g.val)} style={{ flex: 1, padding: "8px 12px", background: garment === g.val ? "var(--accent-bg)" : "var(--bg-3)", color: garment === g.val ? "var(--accent)" : "var(--text-3)", border: `1px solid ${garment === g.val ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>{g.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Mockup */}
        {mc && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase" }}>Mockup</span>
              <button onClick={() => setMockup(!mockup)} style={{ width: 40, height: 22, borderRadius: 11, background: mockup ? "var(--accent)" : "var(--border-2)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 2, left: mockup ? 20 : 2, transition: "left 0.2s" }} />
              </button>
            </div>
            {mockup && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mc.items?.length > 0 && <select value={mockupItem} onChange={e => setMockupItem(e.target.value)} style={selStyle}><option value="">Select item...</option>{mc.items.map((it, i) => <option key={i} value={it.prompt}>{it.label}</option>)}</select>}
                {mc.colors?.length > 0 && <select value={mockupColor} onChange={e => setMockupColor(e.target.value)} style={selStyle}><option value="">Color...</option>{mc.colors.map((c, i) => <option key={i} value={c.value}>{c.label}</option>)}</select>}
                {mc.displays?.length > 0 && <select value={mockupDisplay} onChange={e => setMockupDisplay(e.target.value)} style={selStyle}><option value="">Display...</option>{mc.displays.map((d, i) => <option key={i} value={d.value}>{d.label}</option>)}</select>}
              </div>
            )}
          </div>
        )}

        {/* Variables */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Variables</div>
          {variables.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: "var(--accent)", fontFamily: "monospace" }}>{`{${v.token}}`}</span>
              <span style={{ color: "var(--text-4)" }}>→</span>
              <span style={{ color: "var(--text-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.value}</span>
              <button onClick={() => setVariables(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer", padding: 2 }}><X size={12} /></button>
            </div>
          ))}
          {addingVar ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              <input value={varToken} onChange={e => setVarToken(e.target.value)} placeholder="token (e.g. brand)" style={{ padding: "7px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <input value={varValue} onChange={e => setVarValue(e.target.value)} placeholder="value (e.g. Nike)" style={{ padding: "7px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setAddingVar(false)} style={{ padding: "5px 10px", background: "var(--bg-3)", border: "none", borderRadius: 6, color: "var(--text-3)", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                <button onClick={addVar} style={{ padding: "5px 10px", background: "var(--accent)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingVar(true)} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "4px 0" }}>+ Add Variable</button>
          )}
        </div>

        {/* Reference URL */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Reference Image URL</div>
          <input value={refUrl} onChange={e => setRefUrl(e.target.value)} placeholder="https://example.com/reference.jpg" style={{ width: "100%", padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
        </div>
      </div>
    </DrawerSection>
  );
}

function BadgeRow({ prompt, generatorId, selectedPalettes, selectedKeywords, garment, mockup, mockupItem, refUrl }) {
  const gen = GENERATORS.find(g => g.id === generatorId);
  const badges = [];
  if (gen) badges.push(gen.name);
  if (prompt.activeStyleNames?.length > 0) prompt.activeStyleNames.slice(0, 3).forEach(n => badges.push(n));
  if (prompt.activeStyleNames?.length > 3) badges.push(`+${prompt.activeStyleNames.length - 3} styles`);
  if (garment) badges.push(garment === "dark" ? "🖤 Dark" : "🤍 Light");
  if (mockup && mockupItem) badges.push("📷 Mockup");
  if (selectedPalettes.length > 0) badges.push(`🎨 ${selectedPalettes.length} palette${selectedPalettes.length > 1 ? "s" : ""}`);
  if (selectedKeywords.length > 0) badges.push(`${selectedKeywords.length} keywords`);
  if (refUrl) badges.push("📎 Ref");

  if (badges.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
      {badges.map((b, i) => (
        <span key={i} style={{ padding: "3px 8px", fontSize: 10, fontWeight: 500, color: "var(--text-3)", background: "var(--bg-3)", border: "1px solid var(--border-1)", borderRadius: 6 }}>{b}</span>
      ))}
    </div>
  );
}

function BuilderView({ templateIndex, setTemplateIndex, toast, isMobile, history, setHistory, recipes, setRecipes, projects, setProjects, tier, setView }) {
  const [generatorId, setGeneratorId] = useState("nanoBananaPro");
  const [fieldValues, setFieldValues] = useState({});
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(!isMobile);

  // Phase 3 state
  const [styleStates, setStyleStates] = useState({});
  const [customStyles, setCustomStyles] = useState([]);
  const [selectedPalettes, setSelectedPalettes] = useState([]);
  const [customPalettes, setCustomPalettes] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [garment, setGarment] = useState(null);
  const [mockupOn, setMockupOn] = useState(false);
  const [mockupItem, setMockupItem] = useState("");
  const [mockupColor, setMockupColor] = useState("black");
  const [mockupDisplay, setMockupDisplay] = useState("flat lay");
  const [refUrl, setRefUrl] = useState("");
  const [variables, setVariables] = useState([]);

  // Phase 4 state
  const [promptScore, setPromptScore] = useState(0);
  const [promptNote, setPromptNote] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [currentProject, setCurrentProject] = useState("All Prompts");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showImageGen, setShowImageGen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastSavedId, setLastSavedId] = useState(null);

  const tpl = TEMPLATES[templateIndex] || TEMPLATES[0];
  const presets = FIELD_PRESETS[tpl.id] || {};

  // Reset fields on template change
  useEffect(() => { setFieldValues({}); setUndoStack([]); setRedoStack([]); setNegativePrompt(""); setGarment(null); setMockupOn(false); setRefUrl(""); const mc = MOCKUP_CONFIG[tpl.id]; if (mc) { setMockupItem(mc.items?.[0]?.prompt || ""); setMockupColor(mc.colors?.[0]?.value || "black"); setMockupDisplay(mc.displays?.[0]?.value || "flat lay"); } }, [templateIndex]);

  const prompt = useMemo(() => buildPrompt({ templateIndex, generatorId, fieldValues, styleStates, customStyles, selectedKeywords, selectedPalettes, customPalettes, negativePrompt, referenceImageUrl: refUrl, garment, mockup: mockupOn, mockupItem, mockupColor, mockupDisplay, variables }), [templateIndex, generatorId, fieldValues, styleStates, customStyles, selectedKeywords, selectedPalettes, customPalettes, negativePrompt, refUrl, garment, mockupOn, mockupItem, mockupColor, mockupDisplay, variables]);

  const setField = (key, value) => {
    setUndoStack(prev => [...prev.slice(-19), JSON.stringify(fieldValues)]);
    setRedoStack([]);
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, JSON.stringify(fieldValues)]);
    setFieldValues(JSON.parse(undoStack[undoStack.length - 1]));
    setUndoStack(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, JSON.stringify(fieldValues)]);
    setFieldValues(JSON.parse(redoStack[redoStack.length - 1]));
    setRedoStack(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (Object.values(fieldValues).some(v => v?.trim())) {
      setUndoStack(prev => [...prev, JSON.stringify(fieldValues)]);
      setRedoStack([]);
    }
    setFieldValues({});
    toast("Fields cleared", "info");
  };

  const handleRandomFill = () => {
    setUndoStack(prev => [...prev, JSON.stringify(fieldValues)]);
    setRedoStack([]);
    const newValues = {};
    tpl.fields.forEach(f => {
      const opts = presets[f.key];
      if (opts && opts.length > 0) newValues[f.key] = opts[Math.floor(Math.random() * opts.length)];
    });
    setFieldValues(newValues);
    toast("Random fill applied!", "success");
  };

  const handleCopy = async () => {
    if (!prompt.combined) return;
    try { await navigator.clipboard.writeText(prompt.combined); setCopied(true); toast("Prompt copied to clipboard!", "success"); setTimeout(() => setCopied(false), 2000); } catch { toast("Failed to copy", "error"); }
  };

  const getBuilderSnapshot = () => ({ templateId: tpl.id, templateIndex, generatorId, fieldValues: { ...fieldValues }, styleStates: JSON.parse(JSON.stringify(styleStates)), customStyles: [...customStyles], selectedKeywords: [...selectedKeywords], selectedPalettes: [...selectedPalettes], negativePrompt, garment, mockup: mockupOn, mockupItem, mockupColor, mockupDisplay, variables: [...variables], customPalettes: [...customPalettes] });

  const handleSave = () => {
    const entry = { id: genId(), prompt: prompt.combined, score: promptScore, note: promptNote, project: currentProject, template: tpl.name, templateEmoji: tpl.emoji, generator: GENERATORS.find(g => g.id === generatorId)?.name || "Raw", timestamp: Date.now(), starred: false, version: 1, parentId: null, ...getBuilderSnapshot() };
    setHistory(prev => [entry, ...prev]);
    setLastSavedId(entry.id);
    toast("Saved to history!", "success");
  };

  const handleIterate = () => {
    const parentId = lastSavedId || (history.length > 0 ? history[0].id : null);
    const parent = parentId ? history.find(h => h.id === parentId) : null;
    const version = parent ? (parent.version || 1) + 1 : 1;
    const entry = { id: genId(), prompt: prompt.combined, score: promptScore, note: promptNote, project: currentProject, template: tpl.name, templateEmoji: tpl.emoji, generator: GENERATORS.find(g => g.id === generatorId)?.name || "Raw", timestamp: Date.now(), starred: false, version, parentId, ...getBuilderSnapshot() };
    setHistory(prev => [entry, ...prev]);
    setLastSavedId(entry.id);
    toast(`Iteration v${version} saved!`, "success");
  };

  const handleRemix = () => {
    setUndoStack(prev => [...prev, JSON.stringify(fieldValues)]);
    setRedoStack([]);
    const newValues = { ...fieldValues };
    tpl.fields.forEach(f => {
      const opts = presets[f.key];
      if (opts && opts.length > 0 && Math.random() > 0.5) newValues[f.key] = opts[Math.floor(Math.random() * opts.length)];
    });
    setFieldValues(newValues);
    toast("Remixed!", "success");
  };

  const handleShare = async () => {
    try {
      const state = btoa(JSON.stringify({ t: templateIndex, g: generatorId, f: fieldValues }));
      const url = `${window.location.origin}${window.location.pathname}?state=${state}`;
      await navigator.clipboard.writeText(url);
      toast("Share link copied!", "success");
    } catch { toast("Failed to create share link", "error"); }
  };

  const handleSaveRecipe = (name, desc) => {
    const recipe = { id: genId(), name, description: desc, timestamp: Date.now(), templateEmoji: tpl.emoji, ...getBuilderSnapshot() };
    setRecipes(prev => [recipe, ...prev]);
    setShowRecipeModal(false);
    toast("Recipe saved!", "success");
  };

  const requirePro = (cb) => { if (tier !== "pro") { setShowUpgrade(true); return; } cb(); };

  const handleAiPolish = () => requirePro(() => {
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const enhanced = prompt.combined.replace(/,/g, ', ').replace(/\s+/g, ' ').trim() + ", masterful technique, exceptional detail, professional quality";
      setAiResult({ type: "polish", results: [{ label: "Polished", text: enhanced }] });
      setAiLoading(false);
    }, 1200);
  });

  const handleAiVariations = () => requirePro(() => {
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const base = prompt.combined;
      setAiResult({ type: "variations", results: [
        { label: "Dark & Moody", text: base + ", dramatic noir lighting, deep shadows, cinematic tension" },
        { label: "Vibrant Pop", text: base + ", vivid saturated colors, bold pop art energy, eye-catching" },
        { label: "Ethereal Dream", text: base + ", soft dreamy glow, pastel ethereal atmosphere, gentle light" },
      ]});
      setAiLoading(false);
    }, 1500);
  });

  const handleAiSuggest = () => requirePro(() => {
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const emptyFields = tpl.fields.filter(f => !fieldValues[f.key]?.trim());
      const suggestions = {};
      emptyFields.forEach(f => {
        const opts = presets[f.key];
        if (opts && opts.length >= 3) suggestions[f.key] = [opts[0], opts[Math.floor(opts.length / 2)], opts[opts.length - 1]];
      });
      setAiResult({ type: "suggest", suggestions });
      setAiLoading(false);
    }, 1000);
  });

  // Template selector scroll ref
  const tplScrollRef = useRef(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Top Bar: Template + Generator selectors */}
      <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
        {/* Template pills */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Template</div>
          <div ref={tplScrollRef} style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {TEMPLATES.map((t, i) => (
              <button key={t.id} onClick={() => setTemplateIndex(i)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: templateIndex === i ? "var(--accent)" : "var(--bg-2)", color: templateIndex === i ? "#fff" : "var(--text-3)", border: `1px solid ${templateIndex === i ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: templateIndex === i ? 700 : 500, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>{t.emoji}</span> {t.name}
              </button>
            ))}
          </div>
        </div>
        {/* Generator pills */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Generator</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
              {GENERATORS.map(g => (
                <button key={g.id} onClick={() => setGeneratorId(g.id)} style={{ padding: "6px 12px", background: generatorId === g.id ? "var(--accent-bg)" : "var(--bg-2)", color: generatorId === g.id ? "var(--accent)" : "var(--text-4)", border: `1px solid ${generatorId === g.id ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: generatorId === g.id ? 700 : 500, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setBulkMode(!bulkMode)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: bulkMode ? "var(--accent-bg)" : "var(--bg-2)", color: bulkMode ? "var(--accent)" : "var(--text-4)", border: `1px solid ${bulkMode ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, marginBottom: 4 }}>
            <Layers size={13} /> Bulk
          </button>
        </div>
      </div>

      {/* Split Panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", borderTop: "1px solid var(--border-1)" }}>
        {/* LEFT: Fields */}
        <div style={{ flex: isMobile ? "none" : "1 1 55%", overflow: "auto", padding: 20, minWidth: 0 }}>
          {/* Template tip */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "var(--accent-bg)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: 10, marginBottom: 20 }}>
            <Lightbulb size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{tpl.tip}</span>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tpl.fields.map(f => (
              <FieldInput key={f.key} field={f} value={fieldValues[f.key]} onChange={v => setField(f.key, v)} presets={presets[f.key]} />
            ))}
          </div>

          {/* Actions: Undo / Redo / Clear / Random */}
          <div style={{ display: "flex", gap: 8, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-1)", flexWrap: "wrap" }}>
            {[
              { label: "Undo", icon: Undo2, action: handleUndo, disabled: undoStack.length === 0 },
              { label: "Redo", icon: Redo2, action: handleRedo, disabled: redoStack.length === 0 },
              { label: "Clear", icon: Trash2, action: handleClear, disabled: !Object.values(fieldValues).some(v => v?.trim()) },
              { label: "Random", icon: Shuffle, action: handleRandomFill, disabled: false },
            ].map(btn => {
              const Icon = btn.icon;
              return (
                <button key={btn.label} onClick={btn.action} disabled={btn.disabled} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--bg-2)", color: btn.disabled ? "var(--text-6)" : "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 8, cursor: btn.disabled ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.15s", opacity: btn.disabled ? 0.5 : 1 }}>
                  <Icon size={14} /> {btn.label}
                </button>
              );
            })}
          </div>

          {/* Phase 3 Drawers */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <StylesDrawer templateId={tpl.id} styleStates={styleStates} setStyleStates={setStyleStates} customStyles={customStyles} setCustomStyles={setCustomStyles} />
            <PalettesDrawer selectedPalettes={selectedPalettes} setSelectedPalettes={setSelectedPalettes} customPalettes={customPalettes} setCustomPalettes={setCustomPalettes} />
            <KeywordsDrawer selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} />
            <NegativePromptDrawer templateId={tpl.id} negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt} />
            <AdvancedDrawer templateId={tpl.id} garment={garment} setGarment={setGarment} mockup={mockupOn} setMockup={setMockupOn} mockupItem={mockupItem} setMockupItem={setMockupItem} mockupColor={mockupColor} setMockupColor={setMockupColor} mockupDisplay={mockupDisplay} setMockupDisplay={setMockupDisplay} refUrl={refUrl} setRefUrl={setRefUrl} variables={variables} setVariables={setVariables} />
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        {isMobile ? (
          /* Mobile: collapsible bottom sheet */
          <div style={{ borderTop: "1px solid var(--border-1)", background: "var(--bg-1)" }}>
            <button onClick={() => setShowPreview(!showPreview)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "none", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Clipboard size={15} /> Live Preview</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--text-4)" }}>{prompt.wordCount}w / {prompt.charCount}c</span>
                {showPreview ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
            </button>
            {showPreview && <PromptPreview prompt={prompt} generatorId={generatorId} onCopy={handleCopy} copied={copied} selectedPalettes={selectedPalettes} selectedKeywords={selectedKeywords} garment={garment} mockup={mockupOn} mockupItem={mockupItem} refUrl={refUrl} promptScore={promptScore} setPromptScore={setPromptScore} promptNote={promptNote} setPromptNote={setPromptNote} onSave={handleSave} onIterate={handleIterate} onShowRecipe={() => setShowRecipeModal(true)} onRemix={handleRemix} onShare={handleShare} onPolish={handleAiPolish} onVariations={handleAiVariations} onSuggest={handleAiSuggest} onShowImageGen={() => requirePro(() => setShowImageGen(!showImageGen))} showImageGen={showImageGen} aiResult={aiResult} setAiResult={setAiResult} aiLoading={aiLoading} tier={tier} currentProject={currentProject} setCurrentProject={setCurrentProject} projects={projects} setProjects={setProjects} setField={setField} bulkMode={bulkMode} />}
          </div>
        ) : (
          /* Desktop: sticky right panel */
          <div style={{ flex: "0 0 42%", maxWidth: 520, borderLeft: "1px solid var(--border-1)", display: "flex", flexDirection: "column", background: "var(--bg-1)" }}>
            <PromptPreview prompt={prompt} generatorId={generatorId} onCopy={handleCopy} copied={copied} selectedPalettes={selectedPalettes} selectedKeywords={selectedKeywords} garment={garment} mockup={mockupOn} mockupItem={mockupItem} refUrl={refUrl} promptScore={promptScore} setPromptScore={setPromptScore} promptNote={promptNote} setPromptNote={setPromptNote} onSave={handleSave} onIterate={handleIterate} onShowRecipe={() => setShowRecipeModal(true)} onRemix={handleRemix} onShare={handleShare} onPolish={handleAiPolish} onVariations={handleAiVariations} onSuggest={handleAiSuggest} onShowImageGen={() => requirePro(() => setShowImageGen(!showImageGen))} showImageGen={showImageGen} aiResult={aiResult} setAiResult={setAiResult} aiLoading={aiLoading} tier={tier} currentProject={currentProject} setCurrentProject={setCurrentProject} projects={projects} setProjects={setProjects} setField={setField} bulkMode={bulkMode} />
          </div>
        )}
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={() => { setShowUpgrade(false); }} />}
      {showRecipeModal && <SaveRecipeModal onClose={() => setShowRecipeModal(false)} onSave={handleSaveRecipe} tpl={tpl} />}
    </div>
  );
}

function PromptPreview({ prompt, generatorId, onCopy, copied, selectedPalettes, selectedKeywords, garment, mockup, mockupItem, refUrl, promptScore, setPromptScore, promptNote, setPromptNote, onSave, onIterate, onShowRecipe, onRemix, onShare, onPolish, onVariations, onSuggest, onShowImageGen, showImageGen, aiResult, setAiResult, aiLoading, tier, currentProject, setCurrentProject, projects, setProjects, setField, bulkMode }) {
  const gen = GENERATORS.find(g => g.id === generatorId);
  const [imgModel, setImgModel] = useState("nanobananaPro");
  const [imgCount, setImgCount] = useState(1);
  const [imgAspect, setImgAspect] = useState("1:1");
  const [newProject, setNewProject] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);

  const s = { sectionLabel: { fontSize: 10, fontWeight: 700, color: "var(--text-5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }, btn: (active) => ({ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: active ? "var(--accent-bg)" : "var(--bg-2)", color: active ? "var(--accent)" : "var(--text-3)", border: `1px solid ${active ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.15s" }), smallBtn: { display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: "var(--bg-2)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 500 }, proBadge: { fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "var(--accent2)", color: "#fff", letterSpacing: 0.5 } };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 20, overflow: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", letterSpacing: 1.2, textTransform: "uppercase" }}>Your Prompt</div>
          <div style={{ fontSize: 11, color: "var(--text-5)", marginTop: 3 }}>{gen?.name || "Raw"} format</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: prompt.overLimit ? "#ef4444" : "var(--text-4)", fontWeight: prompt.overLimit ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>
            {prompt.wordCount}w · {prompt.charCount}c{gen && gen.maxLength < 99999 && ` / ${gen.maxLength}`}
          </span>
          {prompt.overLimit && <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", background: "#1a0505", padding: "2px 6px", borderRadius: 4 }}>OVER</span>}
        </div>
      </div>

      {/* Badge row */}
      <BadgeRow prompt={prompt} generatorId={generatorId} selectedPalettes={selectedPalettes || []} selectedKeywords={selectedKeywords || []} garment={garment} mockup={mockup} mockupItem={mockupItem} refUrl={refUrl} />

      {/* Prompt text */}
      <div style={{ padding: 16, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, fontSize: 13, lineHeight: 1.7, color: prompt.hasContent ? "var(--text-1)" : "var(--text-5)", fontFamily: "'DM Mono', 'SF Mono', monospace", wordBreak: "break-word", minHeight: 140, whiteSpace: "pre-wrap", overflowY: "auto", marginBottom: 12 }}>
        {prompt.hasContent ? prompt.combined : "Your prompt will appear here as you fill in the fields..."}
      </div>

      {/* Star Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setPromptScore(promptScore === n ? 0 : n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: n <= promptScore ? "var(--accent)" : "var(--text-6)", fontSize: 18, transition: "all 0.15s" }}>★</button>
        ))}
        <span style={{ fontSize: 11, color: "var(--text-5)" }}>Rate this prompt</span>
      </div>

      {/* Note Input */}
      <input value={promptNote} onChange={e => setPromptNote(e.target.value)} placeholder="Add a note..." style={{ width: "100%", padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-2)", fontSize: 12, marginBottom: 12, outline: "none" }} />

      {/* Copy Prompt */}
      <button onClick={onCopy} disabled={!prompt.hasContent} style={{ width: "100%", padding: "13px 20px", background: prompt.hasContent ? "var(--accent)" : "var(--bg-3)", color: prompt.hasContent ? "#fff" : "var(--text-5)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: prompt.hasContent ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", letterSpacing: 0.3, opacity: prompt.hasContent ? 1 : 0.6, marginBottom: 8 }}>
        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Prompt</>}
      </button>

      {/* Generate Image */}
      <button onClick={onShowImageGen} style={{ width: "100%", padding: "13px 20px", background: "linear-gradient(135deg, var(--accent2), #7c3aed)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
        <Image size={16} /> Generate Image <span style={s.proBadge}>PRO</span>
      </button>

      {/* Image Gen Panel */}
      {showImageGen && (
        <div style={{ padding: 16, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Image Generator</span>
            <span style={s.proBadge}>PRO</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={s.sectionLabel}>Model</div>
            <select value={imgModel} onChange={e => setImgModel(e.target.value)} style={{ width: "100%", padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-2)", fontSize: 12 }}>
              {IMAGE_GEN_MODELS.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={s.sectionLabel}>Images</div>
              <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4].map(n => <button key={n} onClick={() => setImgCount(n)} style={{ ...s.btn(imgCount === n), flex: 1, justifyContent: "center", padding: "6px 0" }}>{n}</button>)}</div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={s.sectionLabel}>Aspect</div>
              <div style={{ display: "flex", gap: 4 }}>{["1:1", "16:9", "9:16", "4:3"].map(r => <button key={r} onClick={() => setImgAspect(r)} style={{ ...s.btn(imgAspect === r), flex: 1, justifyContent: "center", padding: "6px 0", fontSize: 10 }}>{r}</button>)}</div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, var(--accent2), #7c3aed)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Image size={15} /> Generate
          </button>
          <p style={{ fontSize: 10, color: "var(--text-5)", marginTop: 8, textAlign: "center" }}>Connect a backend API to enable generation</p>
        </div>
      )}

      {/* ── Save ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={s.sectionLabel}>Save</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <button onClick={onSave} disabled={!prompt.hasContent} style={{ ...s.smallBtn, opacity: prompt.hasContent ? 1 : 0.5 }}><Save size={13} /> Save</button>
          <button onClick={onIterate} disabled={!prompt.hasContent} style={{ ...s.smallBtn, opacity: prompt.hasContent ? 1 : 0.5 }}><RotateCw size={13} /> Iterate</button>
          <button onClick={onShowRecipe} style={s.smallBtn}><BookMarked size={13} /> Recipe</button>
        </div>
        {/* Project dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--text-5)" }}>Project:</span>
          <select value={currentProject} onChange={e => { if (e.target.value === "__new__") setShowNewProject(true); else setCurrentProject(e.target.value); }} style={{ flex: 1, padding: "5px 8px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-3)", fontSize: 11 }}>
            {projects.map(p => <option key={p} value={p}>{p}</option>)}
            <option value="__new__">+ Add Project</option>
          </select>
          {showNewProject && (
            <div style={{ display: "flex", gap: 4 }}>
              <input value={newProject} onChange={e => setNewProject(e.target.value)} placeholder="Name" style={{ padding: "4px 8px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 6, color: "var(--text-2)", fontSize: 11, width: 100 }} />
              <button onClick={() => { if (newProject.trim()) { setProjects(p => [...p, newProject.trim()]); setCurrentProject(newProject.trim()); setNewProject(""); setShowNewProject(false); } }} style={{ ...s.smallBtn, padding: "4px 8px" }}><Check size={12} /></button>
            </div>
          )}
        </div>
      </div>

      {/* ── AI Tools ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={s.sectionLabel}>AI Tools</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={onPolish} disabled={aiLoading || !prompt.hasContent} style={s.smallBtn}><Sparkles size={13} /> Polish <span style={s.proBadge}>PRO</span></button>
          <button onClick={onVariations} disabled={aiLoading || !prompt.hasContent} style={s.smallBtn}><Shuffle size={13} /> Variations <span style={s.proBadge}>PRO</span></button>
          <button onClick={onSuggest} disabled={aiLoading} style={s.smallBtn}><Wand2 size={13} /> Suggest <span style={s.proBadge}>PRO</span></button>
        </div>
      </div>

      {/* ── Tools ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={s.sectionLabel}>Tools</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={onCopy} disabled={!prompt.hasContent} style={s.smallBtn}><FileText size={13} /> Copy Raw</button>
          <button onClick={onRemix} style={s.smallBtn}><RefreshCw size={13} /> Remix</button>
          <button onClick={onShare} disabled={!prompt.hasContent} style={s.smallBtn}><Share2 size={13} /> Share</button>
        </div>
      </div>

      {/* ── AI Results ── */}
      {aiLoading && (
        <div style={{ padding: 20, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, textAlign: "center" }}>
          <Loader2 size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 8 }}>AI is thinking...</p>
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {aiResult && !aiLoading && (
        <div style={{ padding: 14, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>
              {aiResult.type === "polish" && "✨ Polished Result"}
              {aiResult.type === "variations" && `🔀 ${aiResult.results.length} Variations`}
              {aiResult.type === "suggest" && "✨ Suggestions"}
            </span>
            <button onClick={() => setAiResult(null)} style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer" }}><X size={14} /></button>
          </div>

          {(aiResult.type === "polish" || aiResult.type === "variations") && aiResult.results.map((r, i) => (
            <div key={i} style={{ padding: 10, background: "var(--bg-3)", borderRadius: 8, marginBottom: 8, fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{r.text}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button onClick={async () => { try { await navigator.clipboard.writeText(r.text); } catch {} }} style={s.smallBtn}><Copy size={11} /> Copy</button>
              </div>
            </div>
          ))}

          {aiResult.type === "suggest" && Object.entries(aiResult.suggestions).map(([key, opts]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, textTransform: "capitalize" }}>{key}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {opts.map((opt, i) => (
                  <button key={i} onClick={() => { setField(key, opt); }} style={{ ...s.smallBtn, fontSize: 10 }}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MODALS
   ══════════════════════════════════════════════════════════════════ */
function ModalOverlay({ children, onClose }) {
  return (<div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(4px)" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-1)", borderRadius: 16, border: "1px solid var(--border-1)", maxWidth: 440, width: "100%", maxHeight: "90vh", overflow: "auto", padding: 28 }}>{children}</div>
  </div>);
}

function UpgradeModal({ onClose, onUpgrade }) {
  return (<ModalOverlay onClose={onClose}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, fontFamily: "'DM Sans', system-ui" }}>Upgrade to Pro</h2>
      <p style={{ fontSize: 13, color: "var(--text-4)", marginBottom: 20, lineHeight: 1.6 }}>Unlock powerful AI features:</p>
      <div style={{ textAlign: "left", marginBottom: 24 }}>
        {["✨ AI Style Generator", "✨ Polish — enhance your prompts", "🔀 Variations — 3 alternatives", "✨ Suggest — auto-fill empty fields", "🎨 Image Generation"].map(f => (
          <div key={f} style={{ padding: "6px 0", fontSize: 13, color: "var(--text-2)" }}>{f}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "var(--bg-2)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Maybe Later</button>
        <button onClick={onUpgrade} style={{ flex: 1, padding: "12px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Upgrade to Pro</button>
      </div>
    </div>
  </ModalOverlay>);
}

function SaveRecipeModal({ onClose, onSave, tpl }) {
  const [name, setName] = useState(`${tpl.name} Recipe`);
  const [desc, setDesc] = useState("");
  return (<ModalOverlay onClose={onClose}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 16, fontFamily: "'DM Sans', system-ui" }}>Save Recipe</h2>
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 4 }}>Recipe Name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 13 }} />
    </div>
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 4 }}>Description</label>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="My go-to setup for..." rows={3} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-1)", fontSize: 13, resize: "vertical" }} />
    </div>
    <p style={{ fontSize: 11, color: "var(--text-5)", marginBottom: 16, lineHeight: 1.5 }}>Saves: template, all fields, active styles, keywords, palettes, negative prompt, mockup settings, variables</p>
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "var(--bg-2)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
      <button onClick={() => onSave(name, desc)} style={{ flex: 1, padding: "12px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Save Recipe</button>
    </div>
  </ModalOverlay>);
}

function DiffModal({ onClose, a, b }) {
  const wordsA = new Set((a?.prompt || "").split(/\s+/));
  const wordsB = new Set((b?.prompt || "").split(/\s+/));
  const onlyA = [...wordsA].filter(w => !wordsB.has(w));
  const onlyB = [...wordsB].filter(w => !wordsA.has(w));
  const shared = [...wordsA].filter(w => wordsB.has(w));
  return (<ModalOverlay onClose={onClose}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 16, fontFamily: "'DM Sans', system-ui" }}>Prompt Diff</h2>
    {onlyA.length > 0 && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>Only in A ({onlyA.length})</div><div style={{ fontSize: 12, color: "var(--accent)", lineHeight: 1.6 }}>{onlyA.join(" ")}</div></div>}
    {onlyB.length > 0 && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>Only in B ({onlyB.length})</div><div style={{ fontSize: 12, color: "var(--success)", lineHeight: 1.6 }}>{onlyB.join(" ")}</div></div>}
    <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-5)", marginBottom: 4 }}>Shared ({shared.length})</div><div style={{ fontSize: 12, color: "var(--text-5)", lineHeight: 1.6 }}>{shared.slice(0, 50).join(" ")}{shared.length > 50 ? "..." : ""}</div></div>
    <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: "10px", background: "var(--bg-2)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Close</button>
  </ModalOverlay>);
}

/* ══════════════════════════════════════════════════════════════════
   LIBRARY VIEW
   ══════════════════════════════════════════════════════════════════ */
function LibraryView({ history, setHistory, recipes, setRecipes, setView, setBuilderTemplate, toast }) {
  const [tab, setTab] = useState("prompts");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [projFilter, setProjFilter] = useState("All Prompts");
  const [diffA, setDiffA] = useState(null);
  const [diffB, setDiffB] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  const projects = [...new Set(["All Prompts", ...history.map(h => h.project).filter(Boolean)])];

  const filteredHistory = useMemo(() => {
    let items = [...history];
    if (search) items = items.filter(h => h.prompt?.toLowerCase().includes(search.toLowerCase()));
    if (projFilter !== "All Prompts") items = items.filter(h => h.project === projFilter);
    if (sortBy === "oldest") items.reverse();
    if (sortBy === "starred") items.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));
    if (sortBy === "rated") items.sort((a, b) => (b.score || 0) - (a.score || 0));
    return items;
  }, [history, search, projFilter, sortBy]);

  const timeAgo = (ts) => { const d = Date.now() - ts; if (d < 60000) return "just now"; if (d < 3600000) return `${Math.floor(d / 60000)}m ago`; if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`; return `${Math.floor(d / 86400000)}d ago`; };

  const handleDiff = (entry) => {
    if (!diffA) { setDiffA(entry); toast("Select second prompt for diff", "info"); }
    else if (diffA.id === entry.id) { setDiffA(null); }
    else { setDiffB(entry); setShowDiff(true); }
  };

  const handleLoadInBuilder = (entry) => {
    const idx = TEMPLATES.findIndex(t => t.id === entry.templateId);
    if (idx >= 0) setBuilderTemplate(idx);
    setView("builder");
    toast("Loaded in Builder!", "success");
  };

  const handleLoadRecipe = (recipe) => {
    const idx = TEMPLATES.findIndex(t => t.id === recipe.templateId);
    if (idx >= 0) setBuilderTemplate(idx);
    setView("builder");
    toast("Recipe loaded!", "success");
  };

  const tabStyle = (active) => ({ padding: "8px 16px", background: active ? "var(--accent-bg)" : "transparent", color: active ? "var(--accent)" : "var(--text-4)", border: `1px solid ${active ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500, display: "flex", alignItems: "center", gap: 6 });
  const cardStyle = { padding: 16, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 12, marginBottom: 10, boxShadow: "var(--card-shadow)" };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px", width: "100%" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, fontFamily: "'DM Sans', system-ui", color: "var(--text-1)" }}>📚 Library</h1>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab("prompts")} style={tabStyle(tab === "prompts")}>Prompts ({history.length})</button>
        <button onClick={() => setTab("recipes")} style={tabStyle(tab === "recipes")}>Recipes ({recipes.length})</button>
        <button onClick={() => setTab("gallery")} style={tabStyle(tab === "gallery")}>Gallery (0)</button>
      </div>

      {/* PROMPTS TAB */}
      {tab === "prompts" && (<>
        {/* Search + filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-5)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..." style={{ width: "100%", padding: "8px 8px 8px 32px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-2)", fontSize: 12 }} />
          </div>
          <select value={projFilter} onChange={e => setProjFilter(e.target.value)} style={{ padding: "8px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-3)", fontSize: 12 }}>
            {projects.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "8px 10px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-3)", fontSize: 12 }}>
            <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="starred">Starred</option><option value="rated">Highest Rated</option>
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Clipboard size={40} style={{ color: "var(--text-6)", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-3)", marginBottom: 6 }}>No saved prompts yet</p>
            <p style={{ fontSize: 13, color: "var(--text-5)", marginBottom: 16 }}>Build a prompt and hit Save to see it here</p>
            <button onClick={() => setView("builder")} style={{ padding: "10px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Go to Builder</button>
          </div>
        ) : filteredHistory.map(entry => {
          const children = history.filter(h => h.parentId === entry.id);
          return (
            <div key={entry.id} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{entry.templateEmoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{entry.template}</span>
                  <span style={{ fontSize: 11, color: "var(--text-5)" }}>· {entry.generator}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {entry.score > 0 && <span style={{ fontSize: 11, color: "var(--accent)" }}>{"★".repeat(entry.score)}{"☆".repeat(5 - entry.score)}</span>}
                  <button onClick={() => setHistory(prev => prev.map(h => h.id === entry.id ? { ...h, starred: !h.starred } : h))} style={{ background: "none", border: "none", cursor: "pointer", color: entry.starred ? "var(--warn)" : "var(--text-6)", fontSize: 16 }}>{entry.starred ? "★" : "☆"}</button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{entry.prompt}</div>
              {entry.note && <div style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 8 }}>📝 {entry.note}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-5)" }}>{timeAgo(entry.timestamp)}</span>
                {entry.version > 1 && <span style={{ fontSize: 10, padding: "1px 6px", background: "var(--success-bg)", color: "var(--success)", borderRadius: 4, fontWeight: 600 }}>v{entry.version}</span>}
                {entry.parentId && <span style={{ fontSize: 10, color: "var(--text-5)" }}>↑ parent</span>}
                {children.length > 0 && <span style={{ fontSize: 10, color: "var(--text-5)" }}>↓ {children.length} iterations</span>}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={async () => { try { await navigator.clipboard.writeText(entry.prompt); toast("Copied!", "success"); } catch {} }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--bg-3)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}><Copy size={11} /> Copy</button>
                <button onClick={() => handleLoadInBuilder(entry)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}><ArrowRight size={11} /> Load</button>
                <button onClick={() => { setHistory(prev => [{ ...entry, id: genId(), timestamp: Date.now() }, ...prev]); toast("Duplicated!", "success"); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--bg-3)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}><Clipboard size={11} /> Dup</button>
                <button onClick={() => handleDiff(entry)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: diffA?.id === entry.id ? "var(--accent-bg)" : "var(--bg-3)", color: diffA?.id === entry.id ? "var(--accent)" : "var(--text-3)", border: `1px solid ${diffA?.id === entry.id ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 6, cursor: "pointer", fontSize: 11 }}><GitBranch size={11} /> Diff</button>
                <button onClick={() => { if (confirm("Delete this prompt?")) setHistory(prev => prev.filter(h => h.id !== entry.id)); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--bg-3)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}><Trash2 size={11} /></button>
              </div>
            </div>
          );
        })}
      </>)}

      {/* RECIPES TAB */}
      {tab === "recipes" && (<>
        {recipes.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <BookMarked size={40} style={{ color: "var(--text-6)", marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-3)", marginBottom: 6 }}>No recipes yet</p>
            <p style={{ fontSize: 13, color: "var(--text-5)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 16px" }}>Recipes save your entire builder setup — template, fields, styles, everything. Build something and save it as a recipe.</p>
          </div>
        ) : recipes.map(recipe => (
          <div key={recipe.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{recipe.templateEmoji}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{recipe.name}</span>
            </div>
            {recipe.description && <p style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 8 }}>{recipe.description}</p>}
            <div style={{ fontSize: 10, color: "var(--text-5)", marginBottom: 10 }}>{timeAgo(recipe.timestamp)}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {recipe.selectedKeywords?.length > 0 && <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--info-bg)", color: "var(--info)", borderRadius: 4 }}>🏷️ {recipe.selectedKeywords.length} keywords</span>}
              {recipe.selectedPalettes?.length > 0 && <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--accent2-bg)", color: "var(--accent2)", borderRadius: 4 }}>🎨 {recipe.selectedPalettes.length} palettes</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleLoadRecipe(recipe)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}><ArrowRight size={13} /> Load in Builder</button>
              <button onClick={() => { if (confirm("Delete this recipe?")) setRecipes(prev => prev.filter(r => r.id !== recipe.id)); }} style={{ padding: "8px 12px", background: "var(--bg-3)", color: "var(--text-4)", border: "1px solid var(--border-1)", borderRadius: 8, cursor: "pointer", fontSize: 12 }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </>)}

      {/* GALLERY TAB */}
      {tab === "gallery" && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Image size={40} style={{ color: "var(--text-6)", marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-3)", marginBottom: 6 }}>No generated images yet</p>
          <p style={{ fontSize: 13, color: "var(--text-5)" }}>Generate an image from the Builder to see it here</p>
        </div>
      )}

      {showDiff && diffA && diffB && <DiffModal onClose={() => { setShowDiff(false); setDiffA(null); setDiffB(null); }} a={diffA} b={diffB} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SETTINGS VIEW (Full)
   ══════════════════════════════════════════════════════════════════ */
function SettingsView({ theme, setTheme, accent, setAccent, tier, setTier, history, recipes, toast }) {
  const [installedPacks, setInstalledPacks] = useState([]);
  const [userPhrases, setUserPhrases] = useState([]);
  const [newPhrase, setNewPhrase] = useState("");

  const handleExport = () => {
    const data = JSON.stringify({ history, recipes, settings: { theme, accent, tier }, exportDate: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `savage-prompt-builder-export-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast("Data exported!", "success");
  };

  const s = { section: { marginBottom: 36 }, label: { fontSize: 12, fontWeight: 700, color: "var(--text-3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }, card: { padding: 14, background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 10, marginBottom: 8 } };

  return (<div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'DM Sans', system-ui", color: "var(--text-1)" }}>Settings</h1>
    <p style={{ fontSize: 14, color: "var(--text-4)", marginBottom: 40, lineHeight: 1.6 }}>Customize your experience.</p>

    {/* Account */}
    <section style={s.section}>
      <h3 style={s.label}>Account</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: tier === "pro" ? "linear-gradient(135deg, var(--accent2), #7c3aed)" : "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {tier === "pro" ? "⭐" : "👤"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{tier === "pro" ? "Pro Plan" : "Free Plan"}</div>
          <div style={{ fontSize: 12, color: "var(--text-4)" }}>{tier === "pro" ? "All features unlocked" : "Basic features"}</div>
        </div>
      </div>
      <button onClick={() => setTier(tier === "pro" ? "free" : "pro")} style={{ padding: "10px 20px", background: tier === "pro" ? "var(--bg-2)" : "var(--accent)", color: tier === "pro" ? "var(--text-3)" : "#fff", border: `1px solid ${tier === "pro" ? "var(--border-1)" : "var(--accent)"}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
        {tier === "pro" ? "Switch to Free" : "Upgrade to Pro"}
      </button>
    </section>

    {/* Appearance */}
    <section style={s.section}>
      <h3 style={s.label}>Appearance</h3>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[{ val: "dark", label: "Dark", icon: Moon }, { val: "light", label: "Light", icon: Sun }].map(opt => { const active = theme === opt.val; const Icon = opt.icon; return (<button key={opt.val} onClick={() => setTheme(opt.val)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", background: active ? "var(--accent)" : "var(--bg-2)", color: active ? "#fff" : "var(--text-3)", border: `1px solid ${active ? "var(--accent)" : "var(--border-1)"}`, borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s" }}><Icon size={17} /> {opt.label}</button>); })}
      </div>
      <h4 style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", marginBottom: 10 }}>Accent Color</h4>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {ACCENTS.map(a => (<button key={a.name} onClick={() => setAccent(a.color)} style={{ width: 40, height: 40, borderRadius: 12, background: a.color, border: accent === a.color ? "3px solid var(--text-1)" : "3px solid transparent", cursor: "pointer", transition: "all 0.15s", outline: accent === a.color ? `2px solid ${a.color}` : "none", outlineOffset: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }} title={a.name}>{accent === a.color ? "✓" : ""}</button>))}
      </div>
    </section>

    {/* Style Packs */}
    <section style={s.section}>
      <h3 style={s.label}>Style Packs</h3>
      {Object.entries(STYLE_PACKS).map(([name, pack]) => {
        const installed = installedPacks.includes(name);
        return (
          <div key={name} style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{name}</span>
              <button onClick={() => { if (!installed) { setInstalledPacks(p => [...p, name]); toast("Style pack installed!", "success"); } }} style={{ padding: "5px 12px", background: installed ? "var(--success-bg)" : "var(--accent-bg)", color: installed ? "var(--success)" : "var(--accent)", border: `1px solid ${installed ? "var(--success)" : "var(--accent)"}`, borderRadius: 6, cursor: installed ? "default" : "pointer", fontSize: 11, fontWeight: 600 }}>
                {installed ? "Installed ✓" : "Install"}
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 4 }}>{pack.description}</p>
            <p style={{ fontSize: 11, color: "var(--text-5)" }}>{pack.styles.map(st => st.name).join(", ")}</p>
          </div>
        );
      })}
    </section>

    {/* Phrase Library */}
    <section style={s.section}>
      <h3 style={s.label}>Phrase Library</h3>
      {PHRASES.map((p, i) => (
        <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{p.label}</span><div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>{p.prompt.slice(0, 80)}...</div></div>
          <button onClick={async () => { try { await navigator.clipboard.writeText(p.prompt); toast("Copied!", "success"); } catch {} }} style={{ padding: "5px 10px", background: "var(--bg-3)", color: "var(--text-3)", border: "1px solid var(--border-1)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}><Copy size={12} /></button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <input value={newPhrase} onChange={e => setNewPhrase(e.target.value)} placeholder="Add custom phrase..." style={{ flex: 1, padding: "8px 12px", background: "var(--bg-input)", border: "1px solid var(--border-1)", borderRadius: 8, color: "var(--text-2)", fontSize: 12 }} />
        <button onClick={() => { if (newPhrase.trim()) { setUserPhrases(p => [...p, newPhrase.trim()]); setNewPhrase(""); toast("Phrase added!", "success"); } }} style={{ padding: "8px 12px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}><Plus size={14} /></button>
      </div>
      {userPhrases.map((p, i) => (
        <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{p}</span>
          <button onClick={() => setUserPhrases(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-5)", cursor: "pointer" }}><X size={14} /></button>
        </div>
      ))}
    </section>

    {/* Data Management */}
    <section style={s.section}>
      <h3 style={s.label}>Data Management</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={handleExport} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "var(--bg-2)", color: "var(--text-2)", border: "1px solid var(--border-1)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}><Download size={15} /> Export All</button>
        <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "var(--bg-2)", color: "var(--text-2)", border: "1px solid var(--border-1)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}><Upload size={15} /> Import</button>
      </div>
      <button onClick={() => { if (confirm("Clear ALL data? This cannot be undone.")) toast("All data cleared", "info"); }} style={{ width: "100%", padding: "12px", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
        <Trash2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> Clear All Data
      </button>
    </section>

    {/* About */}
    <section style={s.section}>
      <h3 style={s.label}>About</h3>
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>Savage Prompt Builder</div>
        <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 8 }}>React Build — Phase 4+5</div>
        <div style={{ fontSize: 12, color: "var(--text-4)", lineHeight: 1.8 }}>
          Prompts saved: {history.length} · Recipes: {recipes.length}
        </div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>Keyboard Shortcuts</div>
        <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 2 }}>
          <code style={{ background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>⌘⇧C</code> Copy prompt · <code style={{ background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>⌘S</code> Save · <code style={{ background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>⌘Z</code> Undo · <code style={{ background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>Esc</code> Close modal · <code style={{ background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>1-4</code> Navigate views
        </div>
      </div>
    </section>
  </div>);
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#FF4D6D");
  const [isMobile, setIsMobile] = useState(false);
  const [builderTemplate, setBuilderTemplate] = useState(0);
  const [history, setHistory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [projects, setProjects] = useState(["All Prompts"]);
  const [tier, setTier] = useState("free");
  const [onboarded, setOnboarded] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);

  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 768); check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check); }, []);
  useEffect(() => { if (theme === "light") document.documentElement.classList.add("light"); else document.documentElement.classList.remove("light"); document.body.style.background = "var(--bg-base)"; document.body.style.color = "var(--text-1)"; }, [theme]);
  useEffect(() => { document.documentElement.style.setProperty("--accent", accent); const r = parseInt(accent.slice(1, 3), 16), g = parseInt(accent.slice(3, 5), 16), b = parseInt(accent.slice(5, 7), 16); document.documentElement.style.setProperty("--accent-bg", `rgba(${r},${g},${b},0.08)`); }, [accent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const inInput = tag === "input" || tag === "textarea" || tag === "select";
      if (e.key === "Escape") { /* modals handle their own close */ return; }
      if (inInput) {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "c") { e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); }
      if (e.key === "1") setView("home");
      if (e.key === "2") setView("builder");
      if (e.key === "3") setView("library");
      if (e.key === "4") setView("settings");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToastProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&family=DM+Mono:wght@300;400;500&display=swap');
        :root { --bg-base:#0d0d0d;--bg-1:#111;--bg-2:#141414;--bg-3:#1a1a1a;--bg-input:#0e0e14;--border-1:#2a2a2a;--border-2:#333;--border-3:#222;--border-4:#1e1e1e;--text-1:#fff;--text-2:#ccc;--text-3:#888;--text-4:#666;--text-5:#555;--text-6:#444;--accent:#ff4d6d;--accent-bg:#1a0a10;--accent-hover:#e83d5e;--accent2:#a78bfa;--accent2-bg:#0e0e14;--success:#22c55e;--success-bg:#0a1a0a;--warn:#fbbf24;--warn-bg:#1a1800;--info:#34d399;--info-bg:#0a1a0a;--card-shadow:none; }
        .light { --bg-base:#f5f5f5;--bg-1:#fff;--bg-2:#fff;--bg-3:#f0f0f0;--bg-input:#fafaff;--border-1:#e0e0e0;--border-2:#ccc;--border-3:#ddd;--border-4:#eee;--text-1:#111;--text-2:#333;--text-3:#666;--text-4:#888;--text-5:#999;--text-6:#bbb;--accent-bg:#fff0f3;--accent-hover:#d63a56;--accent2-bg:#f5f0ff;--success-bg:#f0fdf4;--warn-bg:#fffbeb;--info-bg:#ecfdf5;--card-shadow:0 1px 3px rgba(0,0,0,0.08); }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans','Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;background:var(--bg-base);color:var(--text-1)}
        ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border-2);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:var(--text-4)}
        input:focus,textarea:focus,select:focus{outline:none}
        @keyframes toastSlide{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <AppContent view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} isMobile={isMobile} builderTemplate={builderTemplate} setBuilderTemplate={setBuilderTemplate} history={history} setHistory={setHistory} recipes={recipes} setRecipes={setRecipes} projects={projects} setProjects={setProjects} tier={tier} setTier={setTier} onboarded={onboarded} setOnboarded={setOnboarded} onboardStep={onboardStep} setOnboardStep={setOnboardStep} />
    </ToastProvider>
  );
}

function AppContent({ view, setView, collapsed, setCollapsed, theme, setTheme, accent, setAccent, isMobile, builderTemplate, setBuilderTemplate, history, setHistory, recipes, setRecipes, projects, setProjects, tier, setTier, onboarded, setOnboarded, onboardStep, setOnboardStep }) {
  const toast = useToast();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {!isMobile && <Sidebar view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} theme={theme} setTheme={setTheme} />}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: view === "builder" ? "hidden" : "auto", paddingBottom: isMobile && view !== "builder" ? 80 : 0 }}>
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--border-1)", position: view === "builder" ? "relative" : "sticky", top: 0, background: "var(--bg-1)", zIndex: 50, backdropFilter: "blur(20px)", flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "'DM Sans', system-ui" }}><span style={{ color: "var(--accent)" }}>S</span><span style={{ color: "var(--text-1)" }}>AVAGE</span></span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {tier === "pro" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "var(--accent2)", color: "#fff" }}>PRO</span>}
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-3)" }}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
            </div>
          </div>
        )}
        <div style={{ flex: 1, animation: "fadeUp 0.3s ease-out", display: "flex", flexDirection: "column", overflow: view === "builder" ? "hidden" : "visible" }} key={view}>
          {view === "home" && <HomeView setView={setView} setBuilderTemplate={setBuilderTemplate} toast={toast} />}
          {view === "builder" && <BuilderView templateIndex={builderTemplate} setTemplateIndex={setBuilderTemplate} toast={toast} isMobile={isMobile} history={history} setHistory={setHistory} recipes={recipes} setRecipes={setRecipes} projects={projects} setProjects={setProjects} tier={tier} setView={setView} />}
          {view === "library" && <LibraryView history={history} setHistory={setHistory} recipes={recipes} setRecipes={setRecipes} setView={setView} setBuilderTemplate={setBuilderTemplate} toast={toast} />}
          {view === "settings" && <SettingsView theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} tier={tier} setTier={setTier} history={history} recipes={recipes} toast={toast} />}
        </div>
      </main>
      {isMobile && <BottomNav view={view} setView={setView} />}

      {/* Onboarding */}
      {!onboarded && view === "home" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(3px)" }}>
          <div style={{ background: "var(--bg-1)", borderRadius: 20, border: "1px solid var(--border-1)", maxWidth: 440, width: "100%", padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{["🎨", "✏️", "📋"][onboardStep]}</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, fontFamily: "'DM Sans', system-ui" }}>
              {["Pick a Template", "Fill in Your Idea", "Copy Your Prompt"][onboardStep]}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-4)", marginBottom: 24, lineHeight: 1.6 }}>
              {[
                "Each template is built for a specific type of design — clothing, logos, tattoos, and more.",
                "Suggestions help you get started fast. Fill in your subject, style, mood, and more.",
                "Your prompt builds in real time. Hit Copy when you're ready to use it."
              ][onboardStep]}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === onboardStep ? "var(--accent)" : "var(--border-2)" }} />)}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setOnboarded(true)} style={{ padding: "10px 20px", background: "transparent", color: "var(--text-4)", border: "none", cursor: "pointer", fontSize: 13 }}>Skip</button>
              <button onClick={() => { if (onboardStep < 2) setOnboardStep(s => s + 1); else setOnboarded(true); }} style={{ padding: "10px 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                {onboardStep < 2 ? "Next" : "Done!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
