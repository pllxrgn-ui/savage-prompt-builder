# Savage Prompt Builder — Codebase Knowledge Base

> **MANDATORY**: Read this file before starting any work. Update it after making structural changes.  
> **Last Updated**: March 13, 2026

**Project**: AI prompt engineering tool for generative image/video models (Nanobanana 2 primary, Midjourney, DALL·E, Stable Diffusion, Flux, Leonardo, Firefly, Ideogram, Replicate).  
**Tech Stack**: Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Magic UI · Framer Motion · Zustand 5 · Supabase · Drizzle ORM · Lucide icons

---

## Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [Data Files](#2-data-files)
3. [Zustand Stores](#3-zustand-stores)
4. [Components](#4-components)
5. [Hooks](#5-hooks)
6. [API Routes](#6-api-routes)
7. [Page Routes](#7-page-routes)
8. [Templates](#8-templates)
9. [Design System & Tokens](#9-design-system--tokens)
10. [Database Schema](#10-database-schema)
11. [Auth System](#11-auth-system)
12. [Types](#12-types)
13. [Packages](#13-packages)
14. [Key Dependencies](#14-key-dependencies)
15. [Environment Variables](#15-environment-variables)
16. [Design Conventions & Anti-Patterns](#16-design-conventions--anti-patterns)

---

## 1. Monorepo Structure

```
savage-prompt-builder/
├── apps/
│   └── web/                     # Next.js 16 app (main product)
│       ├── src/
│       │   ├── app/             # App Router pages + API routes
│       │   ├── components/      # React components (feature-based)
│       │   ├── db/              # Drizzle ORM schema + connection
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utilities, data, stores, services
│       │   │   ├── data/        # Static config data (13 files)
│       │   │   ├── store/       # Zustand stores (5 stores)
│       │   │   ├── ai/          # AI SDK integration
│       │   │   ├── image-gen/   # Image generation logic
│       │   │   ├── services/    # External service wrappers
│       │   │   └── supabase/    # Supabase client (server/browser)
│       │   ├── middleware.ts     # Auth + route gating
│       │   └── types/           # TypeScript type definitions
│       ├── design-system/       # Design system docs (MASTER.md + pages/)
│       ├── supabase/            # Supabase local config
│       └── public/              # Static assets
├── packages/
│   ├── prompt-engine/           # Pure TS prompt generation (no React)
│   └── mcp-server/              # MCP server for Claude integration (stub)
├── init/                        # Project docs & knowledge base (this file)
├── reports/                     # Session reports
└── stripe-cli/                  # Stripe CLI binary
```

**Workspace**: pnpm workspaces + Turbo  
**Build**: `pnpm dev` (dev), `pnpm build` (prod), `pnpm test` (vitest)

---

## 2. Data Files

Location: `apps/web/src/lib/data/`

All read-only static configuration. Imported via barrel `index.ts`.

| File | Key Exports | Purpose |
|------|-------------|---------|
| `templates.ts` | `TEMPLATES[]`, `getTemplateById()`, `getTemplatesByGroup()` | 20 template definitions across 5 groups |
| `template-groups.ts` | `TEMPLATE_GROUPS[]` | Categories: design-print, branding, art, product, other |
| `generators.ts` | `GENERATORS[]`, `getGeneratorById()` | 9 AI generators (Midjourney, DALL·E, SD, Flux, Leonardo, Firefly, Ideogram, NanoBanana, Replicate) |
| `palettes.ts` | `PALETTES[]`, `searchPalettes()`, `getPalettesByTag()`, `PALETTE_TAGS` | 60+ color palettes by tag (warm, cool, neon, pastel, earth, mono, retro, luxury, nature, tech, fantasy, film) |
| `keywords.ts` | `KEYWORDS[]` | 6 categories (quality, lighting, camera, mood, composition, style), 15+ keywords each |
| `phrases.ts` | `PHRASES[]` | 6 trending/boost phrases (trending on ArtStation, award winning, etc.) |
| `style-packs.ts` | `STYLE_PACKS[]` | 5+ themed style packs (cinematic portrait, moody landscape, neon noir, etc.) |
| `template-styles.ts` | `TEMPLATE_STYLES[]` | Per-template style suggestions by category |
| `accents.ts` | `ACCENTS[]` | 8 accent colors (orange, rose, violet, blue, cyan, emerald, amber, pink) |
| `field-presets.ts` | `FIELD_PRESETS[]` | Per-template field suggestion presets |
| `negative-presets.ts` | `NEGATIVE_PRESETS[]` | Per-template negative prompt keywords |
| `mockup-config.ts` | `MOCKUP_CONFIGS[]`, `getMockupConfig()` | 18 template mockup configs with items (Lucide icons), colors (hex swatches), displays |
| `image-gen-models.ts` | `IMAGE_GEN_MODELS[]` | Image gen model specs (max dimensions, supported ratios) |

---

## 3. Zustand Stores

Location: `apps/web/src/lib/store/`

All stores use `persist` middleware with localStorage. Access via selectors, not `useStore()` directly.

### builder-store.ts (key: `spb-builder`, version: 2)
```
State: activeTemplateId, templateFields, selectedStyles, selectedPalette,
  selectedKeywords, negativePrompt, selectedGenerator, selectedPhrases,
  mockup, garmentMode, referenceImageUrl, variables, variations,
  activeVariationIndex, undoStack, redoStack, customStyles

Actions: setTemplate, setField, toggleStyle, setPalette, toggleKeyword,
  setNegative, setGenerator, togglePhrase, loadRecipe, setMockup,
  setGarmentMode, addVariation, undo, redo, resetBuilder
```

### settings-store.ts (key: `spb-settings`, version: 1)
```
State: accent, theme, defaultGenerator, installedStylePacks[], customPhrases[]
Actions: setAccent, setTheme, toggleTheme, setDefaultGenerator
```

### history-store.ts
```
State: savedPrompts[], recipes[], projects[]
Actions: savePrompt, deletePrompt, toggleStar, saveRecipe, deleteRecipe
```

### auth-store.ts
```
State: user (AuthUser|null), isPro, isAuthenticated, devMode
Actions: login, logout, setDevMode, setPro
```

### ui-store.ts
```
State: sidebarCollapsed, activeDrawer, toasts[]
Actions: toggleSidebar, setDrawer, addToast, removeToast
```

---

## 4. Components

Location: `apps/web/src/components/`

### ui/ (~35 components)
**shadcn/ui primitives**: button, card, dialog, input, label, tabs, select, switch, separator, badge, dropdown-menu, slider, scroll-area, sheet, tooltip, accordion  
**Magic UI**: magic-card, shimmer-button, border-beam, blur-fade, marquee, number-ticker, animated-gradient-text, animated-shiny-text, typing-animation, grid-pattern, dot-pattern, circuit-traces, AmbientGlow  
**Custom**: LucideIcon (64 mapped icons), AccentPicker, AnimatedLayout (PageTransition, StaggerContainer, FadeUpItem), ProUpgradeCard, ThemeToggle, ToastProvider

### builder/ (18 components)
- `FieldInput.tsx` — Template field text inputs
- `TemplateCard.tsx` — Template selector with accent colors (GROUP_CARD_ACCENTS)
- `GarmentSelector.tsx` — Garment mode selector
- `StylesDrawer.tsx` — Style selection drawer
- `PalettePanel.tsx` — Color palette picker
- `KeywordsPanel.tsx` — Quality/lighting/camera keyword pills
- `NegativePanel.tsx` — Type-to-add chips + Quick Add presets (empty default)
- `PromptOutput.tsx` — Generated prompt display + copy
- `VariablesPanel.tsx` — Dynamic variable inputs
- `VariationTabs.tsx` — Variation switcher
- `UndoRedo.tsx` — History controls
- `BuilderActions.tsx` — Primary CTA buttons
- `SaveRecipeModal.tsx` — Recipe save dialog
- `AIStyleGenerator.tsx` — AI style enhancement
- `ReferenceImage.tsx` — Reference image uploader
- `MockupPanel.tsx` — Mockup settings (shadcn Select + Switch, Lucide icons, color swatches)
- `SuggestionChips.tsx` — Quick-select chips
- `PlatformDropdown.tsx` — Generator selector

### library/ (4 components)
PromptCard, RecipeCard, MediaGrid, DiffModal

### generate/ (1 component)
GenerateModal

### layout/ (4 components)
TopNav, Sidebar, TopBar, BottomNav

### auth/ (1 component)
AuthProvider (Supabase session wrapper)

---

## 5. Hooks

Location: `apps/web/src/hooks/`

- `useAuth()` — `{ user, isPro, isAuthenticated, login, logout, devMode }`
- `useKeyboardShortcuts()` — Keyboard bindings (Cmd+S, etc.)
- `use-pro-gate.ts` — Pro feature gating logic

---

## 6. API Routes

Location: `apps/web/src/app/api/`

| Route | Auth | Purpose |
|-------|------|---------|
| `/api/ai/polish/` | Required | Polish prompt with AI |
| `/api/ai/refine/` | Required | Refine/iterate prompt |
| `/api/ai/styles/` | Required | Generate style recommendations |
| `/api/ai/suggest/` | Required | Suggest full prompts from keywords |
| `/api/ai/variations/` | Required | Generate prompt variations |
| `/api/generate/` | Required | Main image generation endpoint |
| `/api/generate/[jobId]/` | Required | Poll generation status |
| `/api/media/` | Required | Upload to S3 |
| `/api/media/upload/` | Required | Presigned URL generation |
| `/api/auth/guest/` | Public | Guest session token creation |
| `/api/checkout/` | Required | Stripe checkout session |
| `/api/webhook/stripe/` | Webhook | Payment webhook |
| `/api/webhooks/nanobanana/` | Webhook | Generation callback |

---

## 7. Page Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Public | Landing page |
| `/login` | Public | Auth (Supabase OAuth + email + guest) |
| `/auth/callback` | Public | OAuth callback |
| `/home` | Protected | Dashboard + template showcase |
| `/builder` | Protected | Core prompt builder (single-step tabs with AnimatePresence) |
| `/generate` | Protected | Image generation results grid |
| `/library` | Protected | Saved prompts + recipes |
| `/settings` | Protected | User preferences + account |

---

## 8. Templates (20 Total)

**Design & Print**: clothing, sticker, pin, poster, album, collection  
**Branding**: brand  
**Art & Illustration**: tattoo, character, pattern, wallpaper, bookcover  
**Product**: sneaker, jewelry, threeD, carwrap  
**Other**: social, marketing, freestyle, portrait

Each template has: `id`, `name`, `icon`, `group`, `description`, `fields[]`, `defaultNegative?`, `tip?`

Each field has: `id`, `label`, `placeholder`, `required?`, `question?`, `color?`

---

## 9. Design System & Tokens

**Aesthetic**: "Warm Dark Elegance" — cinematic dark backgrounds, generous whitespace, orange accent warmth.

### Color Tokens (globals.css `@theme`)
```
bg-base: #09090B     | bg-1: #0F0F12      | bg-2: #16161A
bg-3: #1E1E24       | bg-input: #12121A
text-1: #F4F4F5     | text-2: #A1A1AA     | text-3: #71717A
border: rgba(255,255,255,0.06) | border-strong: rgba(255,255,255,0.12)
accent: #FF6B00      | accent-hover: #FF8533 | accent-muted: rgba(255,107,0,0.10)
accent2: #A78BFA     | accent-gold: #F5C842
glass: rgba(255,255,255,0.04) | glass-hover: rgba(255,255,255,0.07)
glass-border: rgba(255,255,255,0.08)
```

### Radius System
```
--radius-sm: 8px (chips, badges)
--radius-md: 12px (cards, inputs)
--radius-lg: 16px (panels)
--radius-xl: 24px (feature cards)
--radius-full: pills, nav, avatars
```

### Typography
```
font-heading: Plus Jakarta Sans (titles)
font-body: DM Sans (UI copy)
font-display: Space Grotesk (hero)
font-mono: SF Mono / Fira Code (prompt output)
```

### Icons
- **Lucide React only** — via `LucideIcon` component (`@/components/ui/LucideIcon`)
- 64 icons in ICON_MAP: User, Mountain, MapPin, Package, Brush, Star, Droplets, BookOpen, Hexagon, Monitor, Image, Grid3x3, Box, Layers, Building, PersonStanding, Waves, Eye, Grid2x2, Scissors, Camera, Palette, PenTool, Sparkles, Sailboat, Cpu, Flame, Zap, Type, Banana, Server, Shirt, Tag, Pin, FileText, Disc, Megaphone, Smartphone, UserRound, Footprints, Gem, Car, Link, Laugh, Printer, Wind, Crown, ShoppingBag, Backpack, Baby, ChefHat, Frame, Hand, Music, CreditCard, Stamp, Lock, Gift, Users, Armchair, Bike, Laptop, Tablet
- **NEVER use emojis as icons** — always use Lucide icons

### Key UI Patterns
- `cursor-pointer` on every clickable element
- `transition-colors duration-150` on all interactive elements
- `focus-visible:ring-2 focus-visible:ring-accent/50` (never bare `outline-none`)
- `cn()` from `@/lib/utils` for conditional classes
- `label-section` class for section labels (11px, uppercase, tracked)

---

## 10. Database Schema

Location: `apps/web/src/db/schema.ts` — Drizzle ORM + PostgreSQL

| Table | Key Columns | Purpose |
|-------|------------|---------|
| `users` | id, email, name, avatar, tier, stripeCustomerId | User accounts |
| `prompts` | id, userId, templateId, generator, promptText, fieldData (jsonb), styles, keywords, negative, rating, note, versionToken, parentId | Saved prompts |
| `recipes` | id, userId, name, description, templateId, fieldData (jsonb), styles, keywords, negative, generatorId | Reusable templates |
| `customStyles` | id, userId, name, content, templateId, category | User-created styles |
| `customPalettes` | id, userId, name, colors (jsonb), typeDesc, description | User-created palettes |
| `media` | id, userId, promptId, url, provider, model, metadata (jsonb), starred | Generated images |

---

## 11. Auth System

- **Supabase SSR** with cookie-based sessions
- **Middleware** (`src/middleware.ts`): route gating, guest token verification
- **Guest tokens**: HMAC-SHA256 signed, 24hr validity, via `/api/auth/guest`
- **requireAuth()**: API route helper (`src/lib/require-auth.ts`)
- **useAuth() hook**: client-side auth state from Zustand auth-store
- **Security**: Never expose `error.message` in API responses; validate all inputs with Zod

---

## 12. Types

Location: `apps/web/src/types/`

### template.ts
- `TemplateField`, `Template`, `TemplateGroupId`, `TemplateGroup`

### prompt.ts
- `GeneratorId` (9 generators), `Generator`, `PromptInput`, `BuiltPrompt`

### generation.ts
- `SavedPrompt`, `Recipe`, `Project`
- `Accent`, `Palette`, `KeywordCategory`, `StyleEntry`, `Phrase`
- `ImageGenModel`, `StylePack`
- `MockupItem` (id, label, prompt, icon?), `MockupColor` (id, label, value, hex?), `MockupDisplay` (id, label, value, icon?), `MockupConfig`

---

## 13. Packages

### packages/prompt-engine/
Pure TypeScript library — no React/Next.js dependencies.

```typescript
// Usage
import { buildPrompt } from "@spb/prompt-engine";
const result = buildPrompt({
  templateId: "clothing",
  fields: { subject: "skull", style: "screenprint" },
  styles: ["bold streetwear"],
  keywords: ["8K", "masterpiece"],
  negative: "blurry, text",
  generator: "nanobanana",
});
// → { positive, negative, parameters, full }
```

- 19 template builders (one per template type)
- 9 generator formatters (per-platform output formatting)
- Tested with Vitest

### packages/mcp-server/
MCP (Model Context Protocol) server for Claude Desktop integration.
- Currently stub — will expose: `build_prompt`, `list_templates`, `get_styles`, `get_palettes`
- Depends on `@spb/prompt-engine`

---

## 14. Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | Framework |
| react / react-dom | 19.2.3 | UI library |
| zustand | 5.0.11 | State management |
| @supabase/supabase-js | 2.99.0 | Auth + DB |
| tailwindcss | 4.x | Styling |
| framer-motion | 12.35.0 | Animations |
| lucide-react | 0.577.0 | Icons |
| zod | 4.3.6 | Validation |
| stripe | 20.4.1 | Payments |
| ai + @ai-sdk/* | 6.0.x | Vercel AI SDK |
| drizzle-orm | 0.45.1 | ORM |
| @aws-sdk/* | latest | S3 uploads |

---

## 15. Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Auth
GUEST_TOKEN_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Nanobanana
NEXT_PUBLIC_NANOBANANA_API_BASE=
NANOBANANA_API_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# AI
OPENAI_API_KEY=
```

---

## 16. Design Conventions & Anti-Patterns

### DO
- Use design token classes (`bg-bg-2`, `text-text-3`, `border-glass-border`)
- Use Lucide icons via `LucideIcon` component
- Use shadcn/ui components from `@/components/ui/`
- Use `cn()` for conditional classes
- Add `cursor-pointer` and hover states to all interactives
- Use `label-section` class for section headings
- Push side effects to API routes / edges
- Validate inputs with Zod at API boundaries

### NEVER
- Inline style attributes (except dynamic runtime values like color swatches)
- Emojis as icons (use Lucide)
- `bg-white`, `text-gray-*` (use token classes)
- `outline-none` without `focus-visible:ring-*`
- `scale-*` on hover (use opacity/border/shadow)
- Expose `error.message` in API responses
- Hardcoded user IDs
- Native `<select>` elements (use shadcn Select)

---

## Changelog

| Date | Changes |
|------|---------|
| 2026-03-13 | Initial creation. Emoji removal from mockup-config (→ Lucide icons + hex color swatches). MockupPanel upgraded to shadcn Select + Switch. LucideIcon expanded to 64 icons. |
