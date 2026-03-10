# Savage Prompt Builder — Architecture Plan v2
> Last updated: 2026-03-06 | Status: Phase 1 complete (Steps 0–10). Next: Phase 2 — Builder UI.

---

## Table of Contents
1. [Stack](#stack)
2. [Architecture Diagram](#architecture-diagram)
3. [Directory Structure](#directory-structure)
4. [Frontend Routes](#frontend-routes)
5. [State Architecture (Zustand)](#state-architecture)
6. [Prompt Engine Migration](#prompt-engine-migration)
7. [Data Layer Migration](#data-layer-migration)
8. [Component Inventory](#component-inventory)
9. [Design System](#design-system)
10. [Backend API Routes](#backend-api-routes)
11. [Database Schema](#database-schema)
12. [MCP Server](#mcp-server)
13. [Dev MCP Config](#dev-mcp-config)
14. [Implementation Steps](#implementation-steps)
15. [Edge Cases & Risks](#edge-cases--risks)
16. [Testing Plan](#testing-plan)
17. [Observability](#observability)
18. [Rollout Phases](#rollout-phases)
19. [Acceptance Criteria](#acceptance-criteria)

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR for marketing pages; RSC + client components for app shell |
| Styling | Tailwind CSS v4 | Direct CSS var migration from prototype; utility-first |
| UI Primitives | shadcn/ui (selective) | Dialog, DropdownMenu, Tooltip, Badge only — nothing heavy |
| State (local) | Zustand + persist | Builder state, accent, theme; survives refresh; offline-first |
| State (server) | TanStack Query v5 | AI responses, prompt history, media library; auto-invalidation |
| Auth | Supabase Auth | Google + GitHub OAuth + magic link; JWT in httpOnly cookie |
| Database | Supabase Postgres | RLS per user; Drizzle ORM for type-safe queries |
| File Storage | Cloudflare R2 | Generated images + reference photo uploads; signed URL proxy |
| AI (text) | OpenAI GPT-4o-mini / GPT-4o | Polish, Variations, Suggest, Style Generator; Pro only |
| Image Gen | NanoBanana Pro (primary), Replicate (Flux/SD/SDXL), DALL·E 3, Leonardo, Firefly, Ideogram | Midjourney = copy-only (no API) |
| Billing | Stripe | Pro subscriptions + Customer Portal; webhook syncs to DB |
| Deployment | Vercel | Edge functions, Preview deploys, ISR for static pages |
| MCP (custom) | @modelcontextprotocol/sdk (Node.js) | Expose SPB to Claude Desktop |
| Dev MCP tools | Supabase + Stripe + Cloudflare + GitHub + Filesystem MCPs | Accelerate local dev |
| Monorepo | pnpm workspaces | `apps/web`, `packages/prompt-engine`, `packages/mcp-server` |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Client (Next.js 16 App Router)                         │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌────────┐ │
│  │  /home   │  │ /builder  │  │/library  │  │/settings│ │
│  └──────────┘  └───────────┘  └──────────┘  └────────┘ │
│       └─────────────┬────────────────────────┘          │
│                 Zustand Store                           │
│         (builder, ui, history, settings)                │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP / SSE
┌────────────────────▼────────────────────────────────────┐
│  Next.js API Routes (/api/*)                            │
│  /ai/polish  /ai/variations  /ai/suggest                │
│  /ai/styles  /generate  /prompts (CRUD)                 │
│  /media  /stripe/webhook  /r2/proxy                     │
└──────┬────────────────────────────────┬─────────────────┘
       │                                │
┌──────▼──────────┐          ┌──────────▼──────────────┐
│  OpenAI API     │          │  Image Gen APIs          │
│  GPT-4o-mini    │          │  NanoBanana Pro          │
│  (Pro only)     │          │  Replicate / DALL·E 3    │
└─────────────────┘          │  Leonardo / Ideogram      │
                             └──────────┬───────────────┘
                                        │ store result
┌────────────────────────────┐ ┌────────▼───────────────┐
│  Supabase                  │ │  Cloudflare R2          │
│  Auth + Postgres           │ │  Images + Uploads       │
│  RLS per user              │ │  Signed URL proxy       │
└────────────────────────────┘ └────────────────────────┘

┌────────────────────────────────────────────────┐
│  Custom MCP Server (Node.js process)           │
│  Tools: build_prompt, list_templates,          │
│  get_styles, get_palettes, polish_prompt,      │
│  save_prompt, get_history, generate_image      │
└────────────────────────────────────────────────┘
```

---

## Directory Structure

```
savage-prompt-builder/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (marketing)/
│       │   │   └── page.tsx              # Landing page
│       │   ├── (app)/
│       │   │   ├── layout.tsx            # App shell (Sidebar + BottomNav)
│       │   │   ├── home/page.tsx
│       │   │   ├── builder/page.tsx
│       │   │   ├── library/page.tsx
│       │   │   └── settings/page.tsx
│       │   └── api/
│       │       ├── ai/
│       │       │   ├── polish/route.ts
│       │       │   ├── variations/route.ts
│       │       │   ├── suggest/route.ts
│       │       │   └── styles/route.ts
│       │       ├── generate/route.ts
│       │       ├── generate/status/[jobId]/route.ts   # SSE stream
│       │       ├── prompts/route.ts
│       │       ├── prompts/[id]/route.ts
│       │       ├── media/route.ts
│       │       ├── media/[id]/route.ts
│       │       ├── stripe/webhook/route.ts
│       │       └── r2/proxy/[...path]/route.ts
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   └── BottomNav.tsx
│       │   ├── builder/
│       │   │   ├── TemplateCard.tsx
│       │   │   ├── FieldInput.tsx
│       │   │   ├── SuggestionChips.tsx
│       │   │   ├── StylesDrawer.tsx
│       │   │   ├── DrawerSection.tsx
│       │   │   ├── PalettePanel.tsx
│       │   │   ├── KeywordsPanel.tsx
│       │   │   ├── NegativePanel.tsx
│       │   │   └── MockupPanel.tsx
│       │   ├── generate/
│       │   │   ├── GeneratorSelector.tsx
│       │   │   ├── GenerateButton.tsx
│       │   │   ├── ImageResultCard.tsx
│       │   │   └── GenerationProgress.tsx
│       │   ├── library/
│       │   │   ├── PromptCard.tsx
│       │   │   ├── RecipeCard.tsx
│       │   │   └── MediaGrid.tsx
│       │   └── ui/
│       │       ├── ToastProvider.tsx
│       │       ├── CopyButton.tsx
│       │       ├── AccentPicker.tsx
│       │       └── ThemeToggle.tsx
│       ├── lib/
│       │   ├── data/
│       │   │   ├── templates.ts          # TEMPLATES (20 entries)
│       │   │   ├── field-presets.ts      # FIELD_PRESETS
│       │   │   ├── generators.ts         # GENERATORS (9)
│       │   │   ├── template-groups.ts    # TEMPLATE_GROUPS (5)
│       │   │   ├── accents.ts            # ACCENTS (8)
│       │   │   ├── template-styles.ts    # TEMPLATE_STYLES (300+)
│       │   │   ├── palettes.ts           # PALETTES (108)
│       │   │   ├── keywords.ts           # KEYWORDS (6 categories)
│       │   │   ├── negative-presets.ts   # NEGATIVE_PRESETS
│       │   │   ├── mockup-config.ts      # MOCKUP_CONFIG
│       │   │   ├── image-gen-models.ts   # IMAGE_GEN_MODELS (8)
│       │   │   ├── style-packs.ts        # STYLE_PACKS
│       │   │   └── phrases.ts            # PHRASES (6 built-in)
│       │   ├── prompt-engine/
│       │   │   ├── index.ts              # buildPrompt() main export
│       │   │   ├── template-builders.ts  # templateBuilders (20 functions)
│       │   │   └── generator-formats.ts  # generatorFormats (9 formatters)
│       │   ├── store/
│       │   │   ├── builder-store.ts      # Zustand: active template, fields, styles
│       │   │   ├── ui-store.ts           # Zustand: sidebar, drawers, toasts
│       │   │   ├── settings-store.ts     # Zustand: accent, theme, defaults
│       │   │   └── history-store.ts      # Zustand: local prompt history (free tier)
│       │   ├── db/
│       │   │   ├── schema.ts             # Drizzle schema (all tables)
│       │   │   ├── client.ts             # Supabase + Drizzle client
│       │   │   └── migrations/
│       │   ├── ai/
│       │   │   ├── openai.ts             # Shared OpenAI client
│       │   │   ├── polish.ts             # Polish prompt logic
│       │   │   ├── variations.ts         # Variations logic
│       │   │   └── suggest.ts            # Field suggestion logic
│       │   ├── image-gen/
│       │   │   ├── nanobanana.ts         # NanoBanana Pro API client
│       │   │   ├── replicate.ts          # Replicate client + SSE status
│       │   │   ├── dalle.ts              # DALL·E 3 client
│       │   │   └── router.ts             # Route to correct provider
│       │   ├── stripe/
│       │   │   ├── client.ts
│       │   │   └── webhook.ts
│       │   └── r2/
│       │       ├── client.ts
│       │       └── upload.ts
│       ├── hooks/
│       │   ├── usePromptBuilder.ts       # Combines store + buildPrompt()
│       │   ├── useGenerate.ts            # Mutation + SSE polling
│       │   ├── useHistory.ts             # Local OR cloud history
│       │   └── useProGate.ts             # Check Pro tier, show upgrade modal
│       └── types/
│           ├── prompt.ts
│           ├── template.ts
│           └── generation.ts
├── packages/
│   ├── prompt-engine/                    # Shared pure TS, no React deps
│   │   ├── src/index.ts
│   │   └── package.json
│   └── mcp-server/
│       ├── src/
│       │   ├── index.ts                  # MCP server entry
│       │   └── tools/
│       │       ├── build-prompt.ts
│       │       ├── list-templates.ts
│       │       ├── get-styles.ts
│       │       ├── get-palettes.ts
│       │       ├── polish-prompt.ts
│       │       ├── save-prompt.ts
│       │       ├── get-history.ts
│       │       └── generate-image.ts
│       └── package.json
├── .mcp.json                             # Dev MCP server configs
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Frontend Routes

| Route | View | Description |
|---|---|---|
| `/` | Landing | Marketing page, SSR, no auth required |
| `/(app)/home` | Home | Template picker grid, recent prompts, quick actions |
| `/(app)/builder` | Builder | Main prompt builder; template-driven form; output panel |
| `/(app)/library` | Library | Saved prompts, recipes, media gallery, bulk history |
| `/(app)/settings` | Settings | Accent picker, theme, default generator, API keys, Pro |

> **Note:** Palettes, Keywords, and Negative Presets are panel/drawer sections WITHIN Builder — not top-level routes. This matches the JSX implementation (4 nav items), not the 10-tab feature reference.

---

## State Architecture

### Builder Store (`builder-store.ts`)
```typescript
interface BuilderStore {
  // Template selection
  activeTemplateId: string | null
  templateFields: Record<string, string>        // fieldId → value
  selectedStyles: string[]
  selectedPalette: string | null
  selectedKeywords: string[]
  negativePrompt: string
  selectedGenerator: GeneratorId
  
  // Computed (derived via buildPrompt())
  builtPrompt: string
  
  // Actions
  setTemplate: (id: string) => void
  setField: (fieldId: string, value: string) => void
  toggleStyle: (style: string) => void
  setPalette: (palette: string | null) => void
  toggleKeyword: (kw: string) => void
  setNegative: (value: string) => void
  setGenerator: (id: GeneratorId) => void
  resetBuilder: () => void
}
```

### UI Store (`ui-store.ts`)
```typescript
interface UIStore {
  sidebarCollapsed: boolean
  activeDrawer: 'styles' | 'palettes' | 'keywords' | 'negative' | 'mockup' | null
  toasts: Toast[]
  upgradeModalOpen: boolean
  
  toggleSidebar: () => void
  setDrawer: (drawer: UIStore['activeDrawer']) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setUpgradeModal: (open: boolean) => void
}
```

### Settings Store (`settings-store.ts`)
```typescript
interface SettingsStore {
  accent: AccentId               // persisted to localStorage
  theme: 'dark' | 'light'        // persisted to localStorage
  defaultGenerator: GeneratorId  // persisted to localStorage
  customApiKeys: Record<string, string>  // encrypted at rest
  
  setAccent: (id: AccentId) => void
  setTheme: (theme: 'dark' | 'light') => void
  setDefaultGenerator: (id: GeneratorId) => void
  setApiKey: (provider: string, key: string) => void
}
```

---

## Prompt Engine Migration

The `buildPrompt()` function and all `templateBuilders` / `generatorFormats` from the JSX file are **pure functions with zero React deps**. Migration plan:

1. Extract to `packages/prompt-engine/src/`
2. Convert JSX/JS → TypeScript (add types, no logic changes)
3. Export from `packages/prompt-engine` package
4. Import in both `apps/web` and `packages/mcp-server`
5. Write unit tests for all 20 `templateBuilders` and all 9 `generatorFormats`

**Critical invariant:** `buildPrompt(input)` must produce identical output before and after migration. Snapshot tests will enforce this.

---

## Data Layer Migration

All constants from `savage-prompt-builder-ui (1).jsx` → `apps/web/lib/data/*.ts`:

| Constant | Entries | Target File |
|---|---|---|
| `TEMPLATES` | 20 | `templates.ts` |
| `FIELD_PRESETS` | per-template/field | `field-presets.ts` |
| `GENERATORS` | 9 | `generators.ts` |
| `TEMPLATE_GROUPS` | 5 | `template-groups.ts` |
| `ACCENTS` | 8 | `accents.ts` |
| `TEMPLATE_STYLES` | 300+ | `template-styles.ts` |
| `PALETTES` | 108 | `palettes.ts` |
| `KEYWORDS` | 6 categories | `keywords.ts` |
| `NEGATIVE_PRESETS` | per-template | `negative-presets.ts` |
| `MOCKUP_CONFIG` | per-template | `mockup-config.ts` |
| `IMAGE_GEN_MODELS` | 8 | `image-gen-models.ts` |
| `STYLE_PACKS` | installable bundles | `style-packs.ts` |
| `PHRASES` | 6 built-in | `phrases.ts` |

**Rule:** No restructuring. Copy the data verbatim, add TypeScript types, add `as const`.

---

## Component Inventory

### Port directly from JSX (rename, add types, keep logic)
- `ToastProvider` / `ToastItem` / `useToast` → `components/ui/ToastProvider.tsx`
- `Sidebar` (collapsible 240px ↔ 68px) → `components/layout/Sidebar.tsx`
- `BottomNav` (fixed bottom, 4 items, mobile) → `components/layout/BottomNav.tsx`
- `TemplateCard` → `components/builder/TemplateCard.tsx`
- `HomeView` → `app/(app)/home/page.tsx`
- `FieldInput` → `components/builder/FieldInput.tsx`
- `SuggestionChips` → `components/builder/SuggestionChips.tsx`
- `DrawerSection` → `components/builder/DrawerSection.tsx`
- `StylesDrawer` → `components/builder/StylesDrawer.tsx`

### Build new
- `GeneratorSelector` — dropdown/tabs to switch generator
- `GenerateButton` — handles Midjourney edge case (copy vs generate)
- `ImageResultCard` — shows generated image + metadata
- `GenerationProgress` — SSE progress indicator for Replicate
- `PalettePanel` — 108 palettes grid with search
- `KeywordsPanel` — 6-category keyword selector
- `NegativePanel` — negative prompt management
- `MockupPanel` — mockup overlay composer
- `PromptCard` — saved prompt in library
- `RecipeCard` — saved recipe in library
- `MediaGrid` — generated images gallery
- `AccentPicker` — 8 accent color selector
- `CopyButton` — copy with toast feedback
- `ProGateModal` — upgrade prompt for Pro features

---

## Design System

CSS variables from `SBDPROTOTYPE (1).html` → `tailwind.config.ts` + `globals.css`:

### Dark Theme (default)
```css
--bg-base: #0D0D0D
--bg-1: #111111
--bg-2: #141414
--bg-3: #1a1a1a
--bg-input: #0e0e14
--accent: #FF4D6D        /* default accent (overridable per user) */
--accent2: #A78BFA
--success: #22C55E
--warn: #FBBF24
--info: #34D399
--mockup: #FF6B35
--text-1: #ffffff
--text-2: #a1a1aa
--text-3: #52525b
--border: rgba(255,255,255,0.06)
--surface: rgba(255,255,255,0.04)
```

### Light Theme
```css
--bg-base: #f5f5f5
--bg-1: #ffffff
--bg-2: #f0f0f0
--bg-3: #e8e8e8
--bg-input: #ffffff
--text-1: #111111
--text-2: #52525b
--text-3: #a1a1aa
--border: rgba(0,0,0,0.08)
```

### Fonts
```css
--font-body: system-ui, 'Segoe UI', sans-serif
--font-heading: 'DM Sans', system-ui, sans-serif
--font-mono: 'Courier New', monospace   /* prompt output */
```

### Accent Hydration
Set `--accent` on `document.documentElement` in a `<script>` tag in `<head>` (before hydration) to avoid FOAS (Flash of Accent Style):
```html
<script>
  const accent = localStorage.getItem('spb-accent') || '#FF4D6D';
  document.documentElement.style.setProperty('--accent', accent);
</script>
```

---

## Backend API Routes

### AI Routes (Pro tier only — check `subscription.status === 'active'`)

| Route | Method | Description |
|---|---|---|
| `/api/ai/polish` | POST | Takes `{ prompt, generator }`, returns polished version |
| `/api/ai/variations` | POST | Takes `{ prompt, count }`, returns N variations array |
| `/api/ai/suggest` | POST | Takes `{ templateId, fieldId, context }`, returns suggestions[] |
| `/api/ai/styles` | POST | Takes `{ templateId, description }`, generates style entries |

### Image Generation

| Route | Method | Description |
|---|---|---|
| `/api/generate` | POST | Start generation job; returns `{ jobId }` |
| `/api/generate/status/[jobId]` | GET | SSE stream: `{ status, progress, imageUrl? }` |

### CRUD

| Route | Method | Description |
|---|---|---|
| `/api/prompts` | GET, POST | List/create saved prompts |
| `/api/prompts/[id]` | GET, PUT, DELETE | Manage single prompt |
| `/api/media` | GET | List generated media |
| `/api/media/[id]` | GET, DELETE | Manage single media item |
| `/api/stripe/webhook` | POST | Stripe events → sync `subscriptions` table |
| `/api/r2/proxy/[...path]` | GET | Authenticated proxy to R2 signed URL |

---

## Database Schema

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions (synced from Stripe webhook)
CREATE TABLE subscriptions (
  id                   TEXT PRIMARY KEY,  -- Stripe subscription ID
  user_id              UUID REFERENCES profiles(id),
  status               TEXT NOT NULL,     -- active | canceled | past_due
  price_id             TEXT,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- Saved Prompts
CREATE TABLE prompts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id),
  title        TEXT,
  content      TEXT NOT NULL,             -- final built prompt string
  template_id  TEXT,                      -- TEMPLATES[].id
  generator_id TEXT,                      -- GENERATORS[].id
  field_data   JSONB,                     -- { fieldId: value }
  styles       TEXT[],
  palette      TEXT,
  keywords     TEXT[],
  negative     TEXT,
  is_public    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Recipes (saved builder configurations without output)
CREATE TABLE recipes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id),
  title        TEXT NOT NULL,
  template_id  TEXT,
  field_data   JSONB,
  styles       TEXT[],
  palette      TEXT,
  keywords     TEXT[],
  negative     TEXT,
  generator_id TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Generated Media
CREATE TABLE media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id),
  prompt_id       UUID REFERENCES prompts(id),
  r2_key          TEXT NOT NULL,            -- path in R2 bucket
  generator_id    TEXT,
  model           TEXT,
  width           INTEGER,
  height          INTEGER,
  seed            BIGINT,
  generation_meta JSONB,                    -- full provider response
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Bulk Jobs
CREATE TABLE bulk_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  status      TEXT DEFAULT 'pending',       -- pending | running | done | failed
  input_data  JSONB,                        -- array of prompt configs
  results     JSONB,                        -- array of results
  created_at  TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Custom Style Packs (user-created/installed)
CREATE TABLE style_packs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  name        TEXT NOT NULL,
  template_id TEXT,
  styles      JSONB NOT NULL,
  is_public   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Phrase Library
CREATE TABLE phrases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  content     TEXT NOT NULL,
  category    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

**RLS Policy Rule:** Every table has `user_id = auth.uid()` policies for SELECT/INSERT/UPDATE/DELETE.

---

## MCP Server

Location: `packages/mcp-server/src/`  
Transport: stdio (for Claude Desktop) or SSE (for web clients)

### Tools

| Tool | Input | Output | Notes |
|---|---|---|---|
| `build_prompt` | `{ templateId, fields, styles?, palette?, keywords?, generator }` | `{ prompt: string }` | Uses shared prompt-engine package |
| `list_templates` | `{ group?: string }` | `{ templates: Template[] }` | Filterable by group |
| `get_styles` | `{ templateId, category? }` | `{ styles: string[] }` | 300+ available |
| `get_palettes` | `{ search?: string }` | `{ palettes: Palette[] }` | 108 available |
| `polish_prompt` | `{ prompt, generator }` | `{ polished: string }` | Calls OpenAI; requires OPENAI_API_KEY |
| `save_prompt` | `{ prompt, title, templateId, generator }` | `{ id: string }` | Requires auth; calls web API |
| `get_history` | `{ limit?, offset? }` | `{ prompts: Prompt[] }` | Requires auth; calls web API |
| `generate_image` | `{ prompt, generator, width?, height? }` | `{ jobId: string, imageUrl?: string }` | Async for Replicate; sync for DALL·E 3 |

---

## Dev MCP Config

`.mcp.json` at repo root:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--supabase-url", "${SUPABASE_URL}", "--service-role-key", "${SUPABASE_SERVICE_ROLE_KEY}"]
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe@latest", "--api-key", "${STRIPE_SECRET_KEY}"]
    },
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@latest"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest", "./apps/web/lib", "./packages"]
    },
    "spb-local": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "env": {
        "SPB_API_URL": "http://localhost:3000",
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    }
  }
}
```

---

## Implementation Steps

> Steps are ordered by dependency. Each step has a clear deliverable and is independently verifiable.

| # | Step | Deliverable | Notes |
|---|---|---|---|
| 1 | Init monorepo | `pnpm-workspace.yaml`, `turbo.json`, root `package.json` | pnpm workspaces + Turborepo |
| 2 | Scaffold Next.js app | `apps/web` with App Router, Tailwind v4, TypeScript strict | `create-next-app` then customize |
| 3 | Design system setup | `globals.css` with all CSS vars; `tailwind.config.ts` tokens | Verbatim from prototype |
| 4 | Fonts setup | DM Sans via `next/font`, Courier New for mono | Google Fonts + `<link>` |
| 5 | Migrate data constants | All 13 files in `lib/data/*.ts` | Direct port from JSX, add types |
| 6 | Migrate prompt engine | `packages/prompt-engine/src/` with `buildPrompt()`, `templateBuilders`, `generatorFormats` | Pure TS, no React |
| 7 | Prompt engine tests | Snapshot tests for all 20 builders × 9 formatters | Ensure output parity |
| 8 | Zustand stores | `builder-store`, `ui-store`, `settings-store`, `history-store` | With `persist` middleware |
| 9 | App shell layout | `(app)/layout.tsx` with `Sidebar` + `BottomNav` | Port from JSX |
| 10 | Home view | `home/page.tsx` with template grid and recents | Port `HomeView` from JSX |
| 11 | `FieldInput` + `SuggestionChips` | Port from JSX; wire to builder store | Key builder UX |
| 12 | `StylesDrawer` + `DrawerSection` | Port from JSX; wire to builder store | Drawer panel system |
| 13 | `PalettePanel` + `KeywordsPanel` | Build new; wire to builder store | 108 palettes, 6 categories |
| 14 | Builder view complete | Full builder build + output panel with copy | End-to-end prompt building |
| 15 | Supabase setup | Schema migrations in Drizzle; RLS policies | Auth + DB ready |
| 16 | Auth flows | Google + GitHub OAuth; magic link; session handling | Supabase Auth |
| 17 | Prompts CRUD API | `/api/prompts` routes + DB queries | Save/load prompts |
| 18 | Library view | Saved prompts grid; recipe list; media gallery | Needs auth |
| 19 | AI routes | `/api/ai/*` routes with Pro check; OpenAI calls | Pro only |
| 20 | Image generation | `/api/generate` + SSE status; NanoBanana + Replicate | Core feature |
| 21 | Media storage | Cloudflare R2 upload + proxy route | Store generated images |
| 22 | Stripe billing | Checkout + webhook + Pro gating | `useProGate()` hook |
| 23 | Settings view | Accent, theme, default generator, API keys, Pro portal | Personalization |
| 24 | MCP server | `packages/mcp-server` with all 8 tools | Claude Desktop integration |
| 25 | Bulk generation | `/library` bulk tab + `/api/generate/bulk` | Pro feature |

---

## Edge Cases & Risks

| # | Issue | Mitigation |
|---|---|---|
| 1 | **Midjourney no API** | `generator === 'midjourney'` → hide Generate button, show "Copy for Midjourney" only |
| 2 | **Accent FOAS** | Inline `<script>` in `<head>` reads localStorage and sets CSS var before paint |
| 3 | **Replicate async** | SSE stream from `/api/generate/status/[jobId]`; client polls with exponential backoff |
| 4 | **Free tier offline** | All data in Zustand + `persist`; SQL queries behind `isAuthenticated` guard |
| 5 | **Large TEMPLATE_STYLES** | Code-split `template-styles.ts`; lazy-load in StylesDrawer (not on initial paint) |
| 6 | **Stripe webhook replay** | Idempotency check: `WHERE id = stripeSubscriptionId` before upsert |
| 7 | **R2 signed URL expiry** | Proxy route re-signs on each request; client never stores raw R2 URL |
| 8 | **Custom API key security** | Store encrypted with `crypto.subtle` in localStorage; never sent to server |

---

## Testing Plan

### Unit (Vitest)
- `buildPrompt()` with all 20 templates × 9 generators = 180 snapshot tests
- Each `templateBuilder` in isolation
- Each Zustand store action
- `useProGate()` hook behavior

### Integration (Vitest + MSW)
- AI route with mocked OpenAI responses
- Generate route with mocked Replicate/NanoBanana
- CRUD routes with Supabase test DB

### Component (Vitest + React Testing Library)
- `FieldInput` renders and triggers store updates
- `SuggestionChips` click behavior
- `StylesDrawer` open/close/select
- `CopyButton` shows toast on copy

### E2E (Playwright)
- Full builder flow: select template → fill fields → add styles → copy prompt
- Auth: sign in → save prompt → see in library
- Generate: fill builder → generate → see result in media gallery
- Settings: change accent → see CSS var update immediately

---

## Observability

- **Vercel Analytics** — page views, Web Vitals
- **Sentry** — client + server error tracking; set `SENTRY_DSN` env var
- **Supabase Dashboard** — query performance, auth events
- **Custom events** — `track('prompt_built', { templateId, generator })` via a thin wrapper around `window.plausible` or PostHog
- **Rate limiting** — upstash/ratelimit on all AI routes (10 req/min free, 100 req/min Pro)

---

## Rollout Phases

| Phase | Scope | Gate |
|---|---|---|
| 0 | Monorepo + design system + data migration | Internal only |
| 1 | Builder MVP (no auth, localStorage only) | Internal dog-food |
| 2 | Auth + Supabase sync + Library view | Closed beta (100 users) |
| 3 | Image generation (NanoBanana + DALL·E 3) | Open beta |
| 4 | Pro tier (AI agent + Replicate + full gen) | Stripe billing live |
| 5 | MCP server + Claude Desktop integration | Public launch |
| 6 | Bulk generation + API access | Post-launch |

---

## Acceptance Criteria

- [ ] `buildPrompt()` output is byte-for-byte identical to JSX prototype for all 20 templates
- [ ] All 9 generator formats produce the correct syntax with no regression
- [ ] Accent color change takes effect without page reload
- [ ] Prompt builds in < 50ms (no AI call involved)
- [ ] Free tier works 100% offline (localStorage only, no network calls)
- [ ] Pro gating: non-Pro user clicking AI feature sees upgrade modal, not error
- [ ] Image generation returns result or error within 30s for DALL·E 3
- [ ] Replicate SSE stream shows progress at minimum every 5s or closes with result
- [ ] Midjourney selector shows copy-only UI (no generate button)
- [ ] Saved prompts survive Supabase Auth session refresh
- [ ] Stripe webhook processes `customer.subscription.updated` idempotently
- [ ] R2 proxy route returns 401 for unauthenticated requests
- [ ] MCP server `build_prompt` tool produces same output as web `buildPrompt()`
- [ ] Lighthouse score: Performance > 90, Accessibility > 95 on Builder view

---

*This document is the source of truth for architecture decisions. Update it when decisions change. See `SAVAGE-PROMPT-BUILDER-PROGRESS.md` for implementation status.*
