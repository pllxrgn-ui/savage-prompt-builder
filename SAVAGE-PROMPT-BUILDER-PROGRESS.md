# Savage Prompt Builder — Progress Tracker
> Session workflow: **Read this file at the start of every session. Update it at the end.**

---

## Current Status
**Phase:** Phase 2 — Builder UI ✅ COMPLETE  
**Last updated:** 2026-03-07  
**Last session:** Completed Phase 2 (Steps 11-18) — all builder UI components, full end-to-end prompt building  
**Next session should start at:** Step 19 — History auto-save (Phase 3)

---

## Session Log

### 2026-03-06 — Session 1
**Completed:**
- Read and analyzed `SAVAGE-PROMPT-BUILDER-FEATURE-REFERENCE.md`
- Read and analyzed `SAVAGE-PROMPT-BUILDER-EXECUTIVE-SUMMARY.md`
- Read and audited `SBDPROTOTYPE (1).html` (design system, CSS vars)
- Read and audited `savage-prompt-builder-ui (1).jsx` (all data constants, buildPrompt, components)
- Produced full v2 architecture plan (stack, directory structure, DB schema, API routes, MCP server, 25 implementation steps)
- Created `SAVAGE-PROMPT-BUILDER-ARCHITECTURE-PLAN.md`
- Created `SAVAGE-PROMPT-BUILDER-PROGRESS.md` (this file)

**Key decisions:**
- 4 nav items (Home, Builder, Library, Settings) — NOT 10 tabs from feature reference
- pnpm monorepo: `apps/web` + `packages/prompt-engine` + `packages/mcp-server`
- Data constants: direct port from JSX, no redesign
- `buildPrompt()` is pure function → shared package, no React deps
- Offline-first: localStorage for free tier, Supabase for Pro

### 2026-03-06 — Session 2
**Completed:**
- Restructured steps: added Phase -1 (scaffolding), reordered to frontend-first
- Completed full Phase -1 scaffolding (see details above)

### 2026-03-06 — Session 3
**Completed:**
- Step 4 finalized (13 data constant files + barrel export; done in Session 2)
- **Step 5:** Prompt engine — `template-builders.ts` (20 builders), `generator-formats.ts` (9 formatters), `index.ts` (`buildPrompt()`) in `packages/prompt-engine/src/`
- **Step 6:** Vitest tests — 123 tests passing, 89 snapshots across 3 test files
- **Step 7:** Zustand stores — `builder-store`, `ui-store`, `settings-store`, `history-store` with persist middleware
- **Step 8:** App shell layout — `Sidebar.tsx` (collapsible), `BottomNav.tsx` (mobile), `ToastProvider.tsx`, `(app)/layout.tsx`
- **Step 9:** `ThemeToggle.tsx` + `AccentPicker.tsx` wired to settings-store → CSS vars
- **Step 10:** Route placeholder pages for `/home`, `/builder`, `/library`, `/settings` + root redirect

**Fixes applied:**
- Fixed KEYWORD_CATEGORIES → KEYWORDS export mismatch in `lib/data/index.ts`
- Added `@spb/prompt-engine` path alias in web `tsconfig.json` so TS resolves the package source directly
- Removed nested `apps/web/pnpm-workspace.yaml` (was causing `dev` to fail via turbo), merged config to root
- Dev server verified at localhost:3002 with Playwright screenshots

**Key decisions:**
- Settings page already includes live ThemeToggle + AccentPicker (functional components)
- App shell uses `md:` breakpoint for desktop sidebar vs mobile bottom nav
- Toast auto-dismiss at 3 seconds with slideIn animation
- Completed full Phase -1 scaffolding:
  - Installed pnpm 9.15.4 globally
  - Created monorepo root (`package.json`, `pnpm-workspace.yaml`, `turbo.json`)
  - Scaffolded Next.js 16 (got latest instead of 15) with App Router, Tailwind v4, TypeScript strict
  - Installed zustand@5, @tanstack/react-query@5, lucide-react, clsx
  - Created `@spb/prompt-engine` and `@spb/mcp-server` workspace packages
  - Created 21 frontend directories with .gitkeep placeholders
  - Verified all 4 workspace projects link correctly
  - Dev server boots clean on :3000
  - Removed duplicate lockfile from `apps/web/`

**Notes:**
- Got Next.js 16 instead of 15 (latest at time of scaffold) — compatible, no issues
- React 19.2.3 installed (19.2.4 available)
- Turbopack is the default bundler now (no webpack)
- `@/*` path alias already configured by create-next-app

### 2026-03-07 — Session 4
**Completed:**
- Created `phase-2/builder-ui` branch for safety
- **Step 11:** `TemplateCard` component + `LucideIcon` dynamic icon mapper + Home page with group filter tabs + template grid
- **Step 12:** `FieldInput` (text input wired to builder store) + `SuggestionChips` (field presets from data)
- **Step 13:** `StylesDrawer` with collapsible `DrawerSection` components grouped by category
- **Step 14:** `PalettePanel` — 108 palettes with live search, tag filter, color swatch previews
- **Step 15:** `KeywordsPanel` — 6-category keyword selector reusing `DrawerSection`
- **Step 16:** `NegativePanel` (textarea + template preset quick-adds) + `MockupPanel` (layer config per template)
- **Step 17:** `PromptOutput` — live prompt preview, generator dropdown, boost phrases, copy button with toast
- **Step 18:** Full builder page end-to-end: template picker → field inputs → tabbed panels (styles/palettes/keywords/negative/mockup) → sticky output → copy
- Build verified: all 8 static pages compile clean

**New files created:**
- `components/ui/LucideIcon.tsx` — dynamic icon name → component mapper
- `components/builder/TemplateCard.tsx` — clickable template card
- `components/builder/FieldInput.tsx` — labeled text input wired to store
- `components/builder/SuggestionChips.tsx` — preset chip buttons for fields
- `components/builder/StylesDrawer.tsx` — styles panel with collapsible categories
- `components/builder/PalettePanel.tsx` — searchable palette picker
- `components/builder/KeywordsPanel.tsx` — 6-category keyword selector
- `components/builder/NegativePanel.tsx` — negative prompt editor
- `components/builder/MockupPanel.tsx` — mockup layer configuration
- `components/builder/PromptOutput.tsx` — output panel with copy

**Key decisions:**
- Icon strings in data → resolved at render time via `LucideIcon` map component (30 icons)
- Builder uses tabbed panel layout (not all-panels-at-once) to keep the UI clean
- Two-column layout: left (fields + panels), right (sticky output) on desktop; stacked on mobile
- Default negative prompt auto-loads from template data when template is selected

---

## Implementation Steps

> Update checkboxes as each step completes. Add notes inline.
> **Scope: Frontend-first.** Backend phases deferred until frontend is solid.

---

### Phase -1 — Scaffolding (no code, just structure + deps)
> Goal: All folders exist, all deps installed, dev server boots with blank page.

- [x] **Step 0a:** Init monorepo root (`pnpm-workspace.yaml`, `turbo.json`, root `package.json`)
- [x] **Step 0b:** Scaffold Next.js 16 app (`pnpm create next-app apps/web` — App Router, Tailwind v4, TypeScript strict)
- [x] **Step 0c:** Install frontend deps into `apps/web` (`zustand@5`, `@tanstack/react-query@5`, `lucide-react`, `clsx`)
- [x] **Step 0d:** Create `packages/prompt-engine` folder + `package.json` + `tsconfig.json` + empty `src/index.ts`
- [x] **Step 0e:** Create `packages/mcp-server` folder + `package.json` + `tsconfig.json` + empty `src/index.ts`
- [x] **Step 0f:** Create all empty frontend folder scaffolds (21 directories with `.gitkeep`)
- [x] **Step 0g:** `pnpm install` — workspace links verified, dev server boots on :3000
- [x] **Step 0h:** tsconfig `@/*` path alias already configured by create-next-app

---

### Phase 0 — Design System + Data Layer (frontend foundation)
> Goal: CSS vars, fonts, all static data typed and importable. No UI yet.

- [x] **Step 1:** Design system setup (`globals.css` with all CSS vars from HTML prototype, dark + light themes)
- [x] **Step 2:** Tailwind config — extend with CSS var tokens (`bg-base`, `bg-1`, `accent`, etc.)
- [x] **Step 3:** Fonts setup (DM Sans via `next/font/google`, Courier New for mono)
- [x] **Step 4:** Migrate all 13 data constants to `lib/data/*.ts` (typed, `as const`)
- [x] **Step 5:** Migrate prompt engine to `packages/prompt-engine/src/` (`buildPrompt`, `templateBuilders`, `generatorFormats`)
- [x] **Step 6:** Prompt engine snapshot tests (Vitest — 123 tests passing, 89 snapshots)

---

### Phase 1 — State + App Shell (wiring before UI)
> Goal: Zustand stores work, app shell renders with sidebar/nav, routing works.

- [x] **Step 7:** Zustand stores (`builder-store`, `ui-store`, `settings-store`, `history-store`) with `persist` middleware
- [x] **Step 8:** App shell layout — `(app)/layout.tsx` with `Sidebar` + `BottomNav` + `ToastProvider`
- [x] **Step 9:** Theme toggle + accent picker (wire `settings-store` → CSS vars, FOAS prevention via inline script in layout)
- [x] **Step 10:** Route placeholders — `/home`, `/builder`, `/library`, `/settings` — all rendering with app shell

---

### Phase 2 — Builder UI (the main event)
> Goal: Full prompt-building flow works end-to-end in the browser, localStorage only.

- [x] **Step 11:** Home view — template picker grid + `TemplateCard` component, group filter tabs, `LucideIcon` mapper
- [x] **Step 12:** `FieldInput` + `SuggestionChips` — wired to `builder-store`, field presets auto-populate
- [x] **Step 13:** `StylesDrawer` + `DrawerSection` — collapsible categories, style chips with toggle
- [x] **Step 14:** `PalettePanel` — 108 palettes with search, tag filter, color swatch preview
- [x] **Step 15:** `KeywordsPanel` — 6-category keyword selector with `DrawerSection` reuse
- [x] **Step 16:** `NegativePanel` + `MockupPanel` — textarea + quick-add presets, layer config
- [x] **Step 17:** `PromptOutput` — live preview, copy with toast, generator dropdown, boost phrases
- [x] **Step 18:** Builder view complete — template picker → fields → tabbed panels → sticky output → copy

---

### Phase 3 — Library + Persistence (still frontend, localStorage)
> Goal: Saved prompts, recipes, history — all in localStorage for free tier.

- [ ] **Step 19:** `history-store` — auto-save built prompts to localStorage
- [ ] **Step 20:** Library view — saved prompts grid (`PromptCard`), search/filter
- [ ] **Step 21:** Recipe save/load — save builder config as recipe, restore from library
- [ ] **Step 22:** Settings view — accent picker, theme toggle, default generator, export/import data

---

### Phase 4 — Auth UI + Backend Integration (deferred — when frontend is solid)
> Goal: Login/signup pages, user profile, auth wiring, cloud sync, AI features.

- [ ] **Step 23:** Supabase setup (schema, RLS, Drizzle ORM)
- [ ] **Step 24:** Auth flows — backend (Google + GitHub OAuth, magic link, JWT in httpOnly cookie, session handling)
- [ ] **Step 24a:** Login / Signup page — `/login` route with OAuth buttons, magic link input, error states
- [ ] **Step 24b:** Auth middleware + `useAuth` hook — protect `(app)` routes, redirect unauthenticated to `/login`, show user avatar in sidebar
- [ ] **Step 24c:** User profile page — `/settings/account` section with avatar, username, email, linked providers, delete account
- [ ] **Step 24d:** Onboarding flow — post-signup welcome screen, pick default generator + accent, optional "import from localStorage" for existing free-tier data
- [ ] **Step 25:** Prompts CRUD API (`/api/prompts` routes) + cloud sync for Pro
- [ ] **Step 26:** AI routes (`/api/ai/polish`, `variations`, `suggest`, `styles`) — Pro only

---

### Phase 5 — Image Generation (deferred)
> Goal: Generate images from prompts via API.

- [ ] **Step 27:** Image generation API (`/api/generate` + SSE status polling)
- [ ] **Step 28:** `GeneratorSelector`, `GenerateButton`, `GenerationProgress` components
- [ ] **Step 29:** `ImageResultCard` + `MediaGrid` — display / gallery
- [ ] **Step 30:** Cloudflare R2 storage + proxy route

---

### Phase 6 — Pro Tier + MCP (deferred)
> Goal: Billing, gating, MCP server for Claude Desktop.

- [ ] **Step 31:** Stripe billing (checkout + webhook + subscription sync)
- [ ] **Step 32:** Pro gating (`useProGate` hook, upgrade modal)
- [ ] **Step 33:** MCP server (`packages/mcp-server` — all 8 tools)
- [ ] **Step 34:** Bulk generation (library bulk tab + API)

---

## Blockers & Open Questions

> Document blockers here. Remove when resolved.

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | NanoBanana Pro API docs | Open | Need API endpoint + auth format |
| 2 | Stripe price IDs | Open | Need to create products in Stripe dashboard |

---

## Key Files Reference

| File | Purpose |
|---|---|
| `SAVAGE-PROMPT-BUILDER-ARCHITECTURE-PLAN.md` | Full architecture plan — source of truth for all decisions |
| `SAVAGE-PROMPT-BUILDER-FEATURE-REFERENCE.md` | Complete feature/function reference |
| `SAVAGE-PROMPT-BUILDER-EXECUTIVE-SUMMARY.md` | Product overview, business model |
| `SBDPROTOTYPE (1).html` | Working prototype — source of truth for CSS design system |
| `savage-prompt-builder-ui (1).jsx` | React UI — source of truth for data constants + prompt engine |

---

## Session Workflow Convention

**Start of session:**
1. Read `SAVAGE-PROMPT-BUILDER-PROGRESS.md` (this file)
2. Read `SAVAGE-PROMPT-BUILDER-ARCHITECTURE-PLAN.md` if working on architecture decisions
3. Note which step to start from ("Next session should start at:" above)

**End of session:**
1. Check off completed steps
2. Update "Last updated" date
3. Update "Last session" summary
4. Update "Next session should start at:"
5. Add any new blockers or decisions to the relevant sections
