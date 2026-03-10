# Savage Prompt Builder — Frontend Implementation Plan
> **Scope:** Frontend only. All external calls go through `lib/services/*.ts` stubs. Backend dev replaces stubs with real API calls — zero UI changes needed.
>
> **Last updated:** 2026-03-09
>
> **Starting point:** Phases 0–2 complete (scaffolding, data layer, prompt engine, stores, app shell, full builder UI with 10 components). 127 tests passing, production build clean.

---

## Conventions

### Service abstraction pattern
Every feature that will eventually need a backend gets a service file:

```typescript
// lib/services/prompt-service.ts
import type { SavedPrompt } from '@/types';

// BACKEND: Replace with fetch('/api/prompts', ...) + auth header
export async function savePrompt(prompt: SavedPrompt): Promise<SavedPrompt> {
  const store = useHistoryStore.getState();
  store.savePrompt(prompt);
  return prompt;
}
```

Backend dev searches for `// BACKEND:` comments project-wide and replaces each stub.

### Pro gating pattern
All Pro features check a local `isPro` flag from settings-store:

```typescript
const { isPro } = useSettingsStore();
if (!isPro) return <ProUpgradeCard feature="AI Polish" />;
```

Backend dev replaces `isPro` with a real subscription check later.

### `// BACKEND:` marker guide
| Marker | Meaning |
|--------|---------|
| `// BACKEND: Replace with API call` | Swap localStorage logic for fetch() |
| `// BACKEND: Auth required` | Add auth header / session check |
| `// BACKEND: Pro only` | Gate behind subscription status from server |
| `// BACKEND: Needs real upload` | Replace base64/blob with R2 upload |

---

## What Already Exists (Phases 0–2)

| Area | Status | Details |
|------|--------|---------|
| **Monorepo** | ✅ Complete | pnpm workspaces, Turborepo, 3 packages |
| **Design system** | ✅ Complete | CSS vars (dark/light), Tailwind v4 tokens, DM Sans, accent hydration |
| **Data layer** | ✅ Complete | 13 data files, barrel export, 21 templates, 300+ styles, 108 palettes |
| **Prompt engine** | ✅ Complete | 21 template builders, 9 generator formats, `buildPrompt()` orchestrator |
| **Tests** | ✅ Complete | 127 tests, 89 snapshots (Vitest) |
| **Stores** | ✅ Complete | builder-store, ui-store, settings-store, history-store with persist |
| **App shell** | ✅ Complete | Sidebar (collapsible), BottomNav (mobile), ToastProvider, theme/accent |
| **Routes** | ✅ Complete | /home, /builder, /library (stub), /settings (partial) |
| **Builder UI** | ✅ Complete | TemplateCard, FieldInput, SuggestionChips, StylesDrawer, PalettePanel, KeywordsPanel, NegativePanel, MockupPanel, PromptOutput, LucideIcon |
| **Home page** | ✅ Complete | Template groups, filter tabs, template grid, quick actions |

---

## Phase A — Builder Completeness
> Goal: Every builder feature from the feature reference works in the UI.

### A1. Garment selector (Clothing + Collection templates)
**Files:** `components/builder/GarmentSelector.tsx`, builder page update
- Three-way toggle: Dark Garment / Light Garment / None
- Dark → injects "light/neon colors on dark fabric" into prompt
- Light → injects "dark/saturated colors on light fabric" into prompt
- Only visible when `templateId` is `clothing` or `collection`
- Add `garmentMode` to `builder-store` state (`'dark' | 'light' | null`)
- Wire into prompt engine: `template-builders.ts` already handles garment text — just need store ↔ UI binding

### A2. Social media platform dropdown
**Files:** `components/builder/PlatformDropdown.tsx`, update `FieldInput.tsx`
- Replace the first field's text input with a searchable dropdown when `templateId === 'social'`
- 40+ options from field-presets (Instagram Feed, TikTok Video, YouTube Thumbnail, etc.)
- Each option auto-injects aspect ratio + pixel dimensions into the prompt
- Use existing `FIELD_PRESETS.social` data
- Dropdown UI: search input at top, scrollable list, selected item shows as chip

### A3. Action buttons (Save / Reset / Iterate / Recipe / Random Fill)
**Files:** `components/builder/BuilderActions.tsx`, builder page update
- **Save** — calls `promptService.savePrompt()` → toast "Saved to history!"
- **Iterate** — saves as child of last saved prompt (version chain: v1 → v2 → v3)
- **Recipe** — opens modal to name + save entire builder state as recipe
- **Clear Fields** — empties all fields (with confirmation dialog)
- **Clear All Styles** — deactivates every style
- **Random Fill** — fills every field from preset lists randomly
- Place below field grid on left, and below prompt output on right

### A4. Undo / Redo
**Files:** `lib/store/builder-store.ts` update, `components/builder/UndoRedo.tsx`
- Track last 20 field states in an undo stack within builder-store
- `undo()` — pops last state, pushes current to redo stack
- `redo()` — pops redo stack, pushes current to undo stack
- Both stacks clear on `resetBuilder()`
- UI: two icon buttons (Undo / Redo) in the action bar, disabled when stack is empty
- Keyboard: Ctrl+Z / Ctrl+Shift+Z when not focused on an input

### A5. Reference image
**Files:** `components/builder/ReferenceImage.tsx`, builder-store update
- Upload button (max 10MB) + URL text input
- When uploaded: shows thumbnail preview with clear (×) button
- Store: add `referenceImageUrl: string | null` to builder-store
- Prompt injection: Midjourney → `--sref URL`, others → "Style reference: URL" or "Use the attached reference image"
- `// BACKEND: Needs real upload` — currently stores as object URL or pasted URL

### A6. Variables (token replacement)
**Files:** `components/builder/VariablesPanel.tsx`, builder-store update
- Users add variables like `{BRAND}` = "SAVAGE", `{SEASON}` = "Winter 2025"
- CRUD interface: add row (key + value), edit inline, delete with ×
- Store: add `variables: Record<string, string>` to builder-store
- After prompt is built, replace all `{TOKEN}` occurrences with variable values
- Show in a collapsible section below the field grid

### A7. Variations (V1, V2, V3…)
**Files:** `components/builder/VariationTabs.tsx`, builder-store update
- Pill buttons: V1, V2, V3, +, ×
- Each variation holds a separate set of field values
- Shared: template, styles, palettes, keywords, mockup, generator
- Up to 10 variations
- Store: add `variations: Record<string, Record<string, string>>[]` and `activeVariationIndex: number`
- Switching variation swaps `templateFields` in/out

---

## Phase A+ — Auth UI Shell
> Goal: Login page exists, dev can bypass it, user avatar shows in sidebar. No real auth.

### A+1. Auth store + useAuth hook
**Files:** `lib/store/auth-store.ts`, `hooks/useAuth.ts`
- State: `user: { id, name, email, avatarUrl } | null`, `isPro: boolean`, `isAuthenticated: boolean`
- Actions: `login(user)`, `logout()`, `setDevMode(on: boolean)`
- `useAuth()` hook returns `{ user, isPro, isAuthenticated, login, logout }`
- Persist to localStorage key `spb-auth`
- `// BACKEND: Replace with real Supabase Auth session check`
- Dev mode flag: when true, auto-sets `isAuthenticated: true` with a mock user

### A+2. Login page
**Files:** `app/login/page.tsx`
- Route: `/login` (outside `(app)` layout — no sidebar/nav)
- UI: centered card with app logo + name
- OAuth buttons (Google, GitHub) — disabled, show tooltip "Coming soon"
- Magic link email input — disabled, placeholder only
- **"Skip Login (Dev Mode)" button** — bold, accent-colored, fully functional
  - Sets dev mode, creates mock user `{ name: "Dev User", email: "dev@savage.app" }`
  - Redirects to `/home`
- `// BACKEND: Wire OAuth buttons to Supabase Auth`

### A+3. User avatar in sidebar + profile in settings
**Files:** update `Sidebar.tsx`, update `settings/page.tsx`
- **Sidebar:** Add user section at bottom of sidebar
  - Avatar circle (initials fallback if no image)
  - Username + "Free" / "Pro" badge
  - Logout icon button
  - When collapsed: just avatar circle
- **Settings page:** Add "Account" section at top
  - Avatar, username, email (read-only for now)
  - Pro/Free tier badge with toggle switch (dev mode)
  - `// BACKEND: Auth required — show real user data, link to Stripe portal`

---

## Phase B — Save & History Flow
> Goal: Prompts save to history, can be starred/scored/noted, recipes work.

### B1. Auto-save to history
**Files:** `hooks/useAutoSave.ts`, builder page update
- After user copies a prompt, auto-save to history-store
- Generate title from template name + first field value (e.g., "Clothing — Skull Rose")
- Save: full prompt text, all metadata (template, fields, styles, palette, keywords, negative, generator, mockup, phrases)
- Toast: "Saved to history"
- `// BACKEND: Replace with API call to /api/prompts`

### B2. Star, score, and note on saved prompts
**Files:** update `types/prompt.ts`, update `history-store.ts`
- Add to `SavedPrompt`: `starred: boolean`, `score: number | null` (1-5), `note: string`
- Star toggle: click to toggle starred status
- Score: 5 clickable stars below prompt in output panel
- Note: text input that saves with the prompt
- Update history-store actions: `toggleStar(id)`, `setScore(id, score)`, `setNote(id, note)`

### B3. Save / Iterate / Recipe actions
**Files:** `lib/services/prompt-service.ts`, `lib/services/recipe-service.ts`
- **Save**: creates new SavedPrompt in history-store
- **Iterate**: creates new prompt with `parentId` linking to the last saved prompt → builds version chain
  - Add `parentId: string | null` and `version: number` to SavedPrompt type
- **Recipe**: opens `SaveRecipeModal` — name input, then saves entire builder snapshot
  - Recipe captures: templateId, all fields, styles, palette, keywords, negative, generator, mockup, phrases, garment, variables
- **Project dropdown**: save to a named project folder
  - Add `projectId: string | null` to SavedPrompt
  - Add `projects: { id, name }[]` to history-store

### B4. Prompt variations (V1–V10)
**Files:** wire A7 variation tabs into save flow
- When saving, save the active variation index + all variation data
- When loading from library, restore all variations
- "Remix" button: keeps subject, shuffles styles/keywords/palettes/generator randomly

---

## Phase C — Library Page
> Goal: Saved prompts, recipes, and search/filter all work.

### C1. PromptCard component
**Files:** `components/library/PromptCard.tsx`
- Shows: timestamp, template name, generator badge, star rating, star toggle
- Truncated prompt text with expand/collapse
- Note text with 📝 icon (if present)
- Version chain badge (v2, v3) with "↑ parent" link
- Action buttons: Copy, Load (restores to builder), Dup (duplicate), Diff (select for compare), Delete

### C2. Library page — saved prompts tab
**Files:** `app/(app)/library/page.tsx`
- Tabs: Saved Prompts | Recipes | (future: Media)
- **Filters row:**
  - Project folder pills
  - Template filter dropdown
  - Star filter: All / ★ Favs Only
  - Search input (searches prompt text + notes)
- Prompt cards in chronological grid
- Empty state: "No saved prompts yet — build one in the Builder!"

### C3. RecipeCard + Recipes tab
**Files:** `components/library/RecipeCard.tsx`
- Shows: template icon, recipe name, description, date
- Preview of field values (first 3 fields truncated)
- Badges: style count, keyword count, palette, generator
- **Load in Builder** button: restores ENTIRE builder state (all fields, styles, palettes, keywords, negative, generator, mockup, phrases, garment, variables)
- Delete button with confirmation
- Empty state: "No recipes yet — save one from the Builder!"

### C4. Diff/compare modal
**Files:** `components/library/DiffModal.tsx`
- Select two prompts from the library to compare
- Side-by-side view with word-level diff highlighting
- Words only in A: red background
- Words only in B: green background
- Shared words: normal
- Stats: word count A, word count B, shared words count
- Close with Escape or clicking outside

---

## Phase D — Settings Completeness
> Goal: Every settings feature works (theme, accent, generator, pro toggle, styles, phrases, data).

### D1. Default generator selector
**Files:** update `settings/page.tsx`
- Dropdown or button row showing all 9 generators
- Selected generator becomes the default when starting a new prompt
- Already exists in settings-store (`defaultGenerator`) — just needs UI
- Wire: when builder resets, set `selectedGenerator` to `defaultGenerator`

### D2. Pro tier toggle (dev mode)
**Files:** update `settings/page.tsx`, `components/ui/ProUpgradeCard.tsx`
- Toggle switch: Free ↔ Pro in settings account section
- When Free: Pro features show `<ProUpgradeCard>` overlay with feature description + "Upgrade" button
- When Pro (dev mode): all features unlocked
- `ProUpgradeCard` component: reusable card shown over any Pro-gated feature
- `// BACKEND: Replace toggle with real Stripe subscription status`

### D3. Style packs manager
**Files:** update `settings/page.tsx`, `lib/services/style-service.ts`
- Grid of installable style pack cards
- Each card: pack name, description, preview of style names, Install button
- Install: adds pack styles to user's custom styles in builder-store
- Shows "Installed ✓" after installing
- Data source: `lib/data/style-packs.ts` (already exists)
- `// BACKEND: Replace with API for community style packs`

### D4. Phrase library
**Files:** update `settings/page.tsx`
- **Built-in phrases:** Cards from `lib/data/phrases.ts` — each has name, content, Copy button
  - 6 built-in: "Build a prompt", "Refine it", "Get variations", "Fix problems", "Match a vibe", "Negative prompt help"
- **Custom phrases:** User-created phrases with name + content
  - Add button → inline form (name input + textarea)
  - Edit + Delete on each custom phrase
  - Store: add `customPhrases: { id, name, content }[]` to settings-store
- `// BACKEND: Replace with /api/phrases CRUD`

### D5. Data management (export / import / clear)
**Files:** update `settings/page.tsx`, `lib/services/data-service.ts`
- **Export All Data**: downloads JSON file with everything (history, recipes, custom styles, palettes, variables, phrases, settings)
  - Collects from all stores, assembles into single JSON, triggers download
- **Import Data**: opens modal to paste or upload JSON
  - Validates structure, merges with existing data (no duplicates by ID)
  - Shows preview of what will be imported before confirming
- **Clear All Data**: nuclear option
  - Confirmation modal: "This will delete ALL your data. Type DELETE to confirm."
  - Clears all stores, resets to defaults

---

## Phase E — Custom Styles
> Goal: Users can create, edit, and delete their own styles.

### E1. Custom style CRUD
**Files:** `components/builder/CustomStyleForm.tsx`, update `StylesDrawer.tsx`, builder-store update
- **Create**: form with name input + content textarea
  - Content = the style instruction paragraph that gets prepended to the prompt
  - Created styles appear in a "Custom" category at the top of StylesDrawer
- **Edit**: click edit icon on custom style → inline editing (name + content)
- **Delete**: click × on custom style → confirmation → remove
- Store: add `customStyles: StyleEntry[]` to builder-store (persisted)
- Custom styles toggle on/off the same way preset styles do

### E2. AI style suggestion stub (Pro)
**Files:** `components/builder/AIStyleGenerator.tsx`
- Text input: "Describe a vibe..." (e.g., "dark japanese ink, moody")
- 10 quick-fill chips: dark moody cinematic, retro 70s sunset, cute kawaii pastel, etc.
- Mood board area: drag-and-drop up to 6 images (store as base64 for now)
- "Generate 3 Styles" button → shows loading spinner
- Results: 3 style cards, each with name, content preview, Edit, "+ Add Style"
- "Add All Styles" button → adds all 3 to custom styles
- `// BACKEND: Pro only — calls /api/ai/styles with vibe text + mood board images`
- **Stub implementation:** returns 3 hardcoded example styles after a 1.5s fake delay

---

## Phase F — Generate Page
> Goal: Image generation UI exists as a shell. Backend dev wires up real generation later.

### F1. Generate page layout
**Files:** `app/(app)/generate/page.tsx` (new route), update nav items
- Add "Generate" to nav items (5th item) — OR keep as 4 items with Generate accessible from Builder's "Generate Image" button
- **Decision:** Keep 4 nav items. Generate is a modal/drawer launched from Builder's "Generate Image" button.
- `components/generate/GenerateModal.tsx` — full-screen modal or slide-over panel

### F2. Image generation flow stubs
**Files:** `components/generate/GenerateModal.tsx`, `lib/services/generate-service.ts`
- **Left column:**
  - Editable prompt textarea (pre-filled from builder output)
  - "Reset to Builder" button
  - Model selector dropdown (8 models from `IMAGE_GEN_MODELS` data)
  - Image count toggle: 1, 2, 3, 4
  - Aspect ratio toggle: 1:1, 4:5, 16:9, 9:16, 3:2, 2:3
  - **Generate button** (Pro-gated)
- **Right column:**
  - Placeholder: "Generated images will appear here"
  - Loading state with progress bar
  - Result: image cards with Download, Copy URL, Save to Gallery actions
- `// BACKEND: Pro only — calls /api/generate, polls /api/generate/status/[jobId] via SSE`
- **Stub:** Shows a placeholder image after 2s fake delay with a "This is a placeholder" watermark

### F3. Media grid component
**Files:** `components/library/MediaGrid.tsx`
- Responsive image grid (2 cols mobile, 3 tablet, 4 desktop)
- Each cell: thumbnail, hover overlay with template name + model + timestamp
- Click: opens detail modal with full-size image + all metadata
- Actions: Copy Prompt, Download, Star, Delete
- Empty state: "No generated images yet"
- Data source: `// BACKEND: Replace with /api/media GET`

---

## Phase G — Backend-Ready Service Layer
> Goal: Clean interfaces for every external call. Backend dev has a clear contract.

### G1. Service interfaces + stubs
**Files:** Create all service files in `lib/services/`

| Service File | Methods | Stub Behavior |
|-------------|---------|---------------|
| `prompt-service.ts` | `savePrompt()`, `getPrompts()`, `deletePrompt()`, `updatePrompt()` | Read/write history-store |
| `recipe-service.ts` | `saveRecipe()`, `getRecipes()`, `deleteRecipe()`, `loadRecipe()` | Read/write history-store |
| `generate-service.ts` | `generateImage()`, `getJobStatus()` | Fake delay + placeholder image |
| `ai-service.ts` | `polishPrompt()`, `getVariations()`, `suggestFields()`, `generateStyles()` | Hardcoded mock responses after delay |
| `media-service.ts` | `getMedia()`, `deleteMedia()`, `uploadMedia()` | localStorage array of media items |
| `data-service.ts` | `exportData()`, `importData()`, `clearData()` | Collect/restore all store state |
| `auth-service.ts` | `login()`, `logout()`, `getSession()` | Mock user + localStorage flag |

Each method:
1. Has full TypeScript types for input and return
2. Has a `// BACKEND: ...` comment explaining the real implementation
3. Works with localStorage / in-memory data today

### G2. Wire services into stores + components
**Files:** Update stores and components to use service layer
- Replace direct store mutations in components with service calls
- Services internally call stores (for now)
- When backend dev replaces service internals with API calls, zero UI changes needed
- Example: `PromptCard` calls `promptService.deletePrompt(id)` instead of `useHistoryStore.getState().deletePrompt(id)`

---

## Phase H — Polish & Shortcuts
> Goal: Final UX polish, keyboard shortcuts, sharing, dashboard stats.

### H1. Keyboard shortcuts
**Files:** `hooks/useKeyboardShortcuts.ts`, wire into app layout
- `Ctrl+Shift+C` / `Cmd+Shift+C` → Copy prompt
- `Ctrl+S` / `Cmd+S` → Save to history (prevent browser save dialog)
- `Ctrl+Z` / `Cmd+Z` → Undo (when not in text input)
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` → Redo
- `Escape` → Close any open modal/drawer
- Only active when not typing in an input field
- Show shortcut hints in tooltips on action buttons

### H2. Share prompt
**Files:** `lib/services/share-service.ts`, update `PromptOutput.tsx`
- Encode: template, fields, styles, palette, keywords, generator → base64 URL hash
- "Share" button → copies URL to clipboard
- Receiving: `/builder?share=<encoded>` → decode and hydrate builder-store
- Warning toast if URL exceeds 2000 characters
- `// BACKEND: Replace with short URL service for long prompts`

### H3. Home dashboard stats
**Files:** update `home/page.tsx`
- **Stats bar** (4 cards across top):
  - Total prompts saved
  - Total favorites (starred)
  - Most-used template name
  - Average prompt rating
- **Quick prompt input**: text box + Go button → opens builder with subject pre-filled in Freestyle template
- **Pinned favorites**: 5 most recent starred prompts as mini-cards with Copy + Load buttons
- Data: all derived from history-store (no backend needed)
- Only show stats section after 1+ saved prompts

### H4. About & help section
**Files:** update `settings/page.tsx`
- App name + version
- Usage stats: total prompts, favorites, recipes, custom styles
- Keyboard shortcuts reference table
- Brief "how it works" text

---

## Type Additions Required

Add these to `types/prompt.ts` or `types/index.ts` as phases are implemented:

```typescript
// Phase A — Builder additions
interface BuilderState {
  // ... existing ...
  garmentMode: 'dark' | 'light' | null;
  referenceImageUrl: string | null;
  variables: Record<string, string>;
  variations: Record<string, string>[];
  activeVariationIndex: number;
  undoStack: Record<string, string>[];
  redoStack: Record<string, string>[];
}

// Phase A+ — Auth
interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isPro: boolean;
  isAuthenticated: boolean;
  isDevMode: boolean;
}

// Phase B — Save enhancements
interface SavedPrompt {
  // ... existing ...
  starred: boolean;
  score: number | null;   // 1-5
  note: string;
  parentId: string | null; // for version chains
  version: number;
  projectId: string | null;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

// Phase F — Generation
interface GenerationJob {
  id: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  promptText: string;
  model: string;
  aspectRatio: string;
  imageCount: number;
  results: GeneratedImage[];
  createdAt: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  model: string;
  promptId: string | null;
  starred: boolean;
  createdAt: string;
}
```

---

## Testing Plan

Each phase should add tests:

| Phase | Tests to Add |
|-------|-------------|
| A | GarmentSelector toggle behavior, undo/redo stack, variable replacement |
| A+ | Auth store login/logout, dev mode bypass |
| B | Auto-save hook, version chain (parentId), star/score/note mutations |
| C | PromptCard render + actions, RecipeCard load restores state, diff algorithm |
| D | Export produces valid JSON, import merges without duplicates, clear resets all stores |
| E | Custom style CRUD (add/edit/delete), styles persist across sessions |
| F | Generate modal renders, fake delay completes, media grid layout |
| G | Service stubs return correct types, service → store wiring works |
| H | Keyboard shortcuts fire correct actions, share encode/decode roundtrip |

---

## Acceptance Criteria

The frontend is **shippable** when:

- [ ] All 21 templates render correctly with all fields, styles, palettes, keywords, negative presets, and mockup configs
- [ ] Garment selector works for Clothing and Collection templates
- [ ] Social Media platform dropdown injects correct aspect ratios
- [ ] Undo/Redo tracks last 20 field states
- [ ] Reference image upload shows preview and injects into prompt
- [ ] Variables do token replacement in final prompt
- [ ] Variations (V1–V10) hold separate field sets
- [ ] Prompts can be saved, starred, scored, noted, and iterated (version chains)
- [ ] Recipes save and restore the COMPLETE builder state
- [ ] Library page has working search, filter by template/project/stars
- [ ] Diff modal compares two prompts word-by-word
- [ ] Settings: default generator, Pro toggle, style packs, phrase library, data export/import/clear
- [ ] Custom styles can be created, edited, and deleted
- [ ] AI features show Pro gate overlay for free users; stubs work for Pro users
- [ ] Generate modal shows placeholder flow
- [ ] Keyboard shortcuts work (Ctrl+C, Ctrl+S, Ctrl+Z, Escape)
- [ ] Share encodes/decodes builder state to URL
- [ ] Dashboard shows stats and pinned favorites
- [ ] Login page exists with dev bypass
- [ ] User avatar shows in sidebar
- [ ] All existing 127+ tests still pass
- [ ] Production build clean (zero errors)
- [ ] Every service file has `// BACKEND:` markers for the backend dev

---

## Phase Execution Order

Recommended order (each phase should end with a clean build + tests passing):

```
Phase A  — Builder Completeness     (7 steps)  ← START HERE
Phase A+ — Auth UI Shell            (3 steps)
Phase B  — Save & History Flow      (4 steps)
Phase C  — Library Page             (4 steps)
Phase D  — Settings Completeness    (5 steps)
Phase E  — Custom Styles            (2 steps)
Phase F  — Generate Page            (3 steps)
Phase G  — Backend-Ready Services   (2 steps)
Phase H  — Polish & Shortcuts       (4 steps)
                                    ─────────
                                    34 steps total
```

Phases A → B → C are sequential (each depends on the previous). Phases D, E, F can be done in any order after C. Phase G should be done after all features exist. Phase H is final polish.
