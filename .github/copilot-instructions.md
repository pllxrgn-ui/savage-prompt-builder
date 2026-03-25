# Savage Prompt Builder — Copilot Instructions

This is the authoritative context file for GitHub Copilot in this workspace.
Read this completely before generating any code. These rules override default behavior.

---

## Codebase Knowledge (MANDATORY)

**Before starting any work**, read `init/CODEBASE-KNOWLEDGE.md` — the single source of truth for the entire codebase (data files, stores, components, types, API routes, design tokens, DB schema, auth, packages).

**After making structural changes** (new components, stores, data files, API routes, types, DB tables, design tokens, or package changes), update `init/CODEBASE-KNOWLEDGE.md` to reflect the changes.

---

## Project Overview

**Savage Prompt Builder** — AI prompt engineering tool for generative image/video models (Nanobanana 2 primary, Midjourney, DALL·E, Stable Diffusion). Users build custom prompts for clothing, brand, art, product design, tattoo, and video.

**Monorepo structure:**
- `apps/web` — Next.js 16 app (main product)
- `packages/prompt-engine` — Pure TS prompt generation logic
- `packages/mcp-server` — MCP server for tool integration

**Tech stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Magic UI · Framer Motion · Zustand 5 · Supabase · Drizzle ORM · Lucide icons · TypeScript strict

**Active Redesign:** See `SAVAGE-REDESIGN-PLAN.md` — full UI/UX overhaul in progress.

---

## Design Direction (Post-Redesign)

**Aesthetic:** Warm Dark Elegance — think Higgsfield × Artlist × Linear quality.
- Cinematic dark backgrounds, not cyberpunk
- Generous whitespace, breathable spacing
- Visual-first over text-heavy menus
- Orange warmth, not cold blue tech

**Full design system:** `apps/web/design-system/savage-prompt-builder/MASTER.md`
**CSS tokens:** `apps/web/src/app/globals.css`
**Page overrides:** `apps/web/design-system/savage-prompt-builder/pages/`

### Color Token Reference

```
bg-bg-base      → #09090B   (page background)
bg-bg-1         → #0F0F12   (panels, sidebar)
bg-bg-2         → #16161A   (cards, dropdowns)
bg-bg-3         → #1E1E24   (elevated surfaces)
bg-bg-input     → #12121A   (form inputs)
text-text-1     → #F4F4F5   (primary text)
text-text-2     → #A1A1AA   (secondary text)
text-text-3     → #71717A   (muted / labels)
border-border   → rgba(255,255,255,0.06)
border-border-strong → rgba(255,255,255,0.12)
bg-glass        → rgba(255,255,255,0.04)
bg-glass-hover  → rgba(255,255,255,0.07)
border-glass-border → rgba(255,255,255,0.08)
text-accent     → #FF6B00   (primary CTA — orange)
bg-accent       → #FF6B00
hover:bg-accent-hover → #FF8533
bg-accent-muted → rgba(255,107,0,0.10)
text-accent2    → #A78BFA   (AI / magic — violet)
text-accent-gold → #F5C842  (Pro tier — gold)
```

### Typography

```
font-heading  → Plus Jakarta Sans (titles, section headers)
font-body     → DM Sans (paragraphs, UI copy)
font-display  → Space Grotesk (hero, brand)
font-mono     → SF Mono / Fira Code (prompt output)
```

Use `.label-section` class for section labels (11px, uppercase, tracked, text-text-3).

### Radius

```
rounded-[var(--radius-sm)]   → 8px    (chips, badges)
rounded-[var(--radius-md)]   → 12px   (cards, inputs)
rounded-[var(--radius-lg)]   → 16px   (panels)
rounded-[var(--radius-xl)]   → 24px   (feature cards)
rounded-full                 → pills, nav, avatars
```

---

## UI Code Rules (MANDATORY)

### Interactions

1. **Every clickable element MUST have `cursor-pointer`** — no exceptions
2. **Every interactive element MUST have a hover state** — color, border, or shadow change
3. **All transitions: `transition-colors duration-150`** minimum. Use `transition-all` only when multiple properties change
4. **Never `transform: scale` on hover** — it shifts layout. Use opacity/border/shadow instead

### Focus & Accessibility

5. **Never use `outline-none` alone**. Always replace with: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`
6. **All icon-only buttons need `aria-label`**
7. **All images need `alt` text**
8. **Tab order must match visual order**

### Animation (Framer Motion)

9. Use `<PageTransition>`, `<StaggerContainer>`, `<FadeUpItem>` from `@/components/ui/AnimatedLayout` for standard patterns
10. No `animate-bounce` on decorative elements — only on loaders
11. No `animate-spin` except on loading indicators
12. Respect `prefers-reduced-motion` — Framer Motion handles this via `useReducedMotion`
13. Entry animations: `duration` max 300ms, no blocking delays

### Components

14. Use **shadcn/ui** components from `@/components/ui/` — never build form primitives from scratch
15. Use **Lucide icons** imported via `@/components/ui/LucideIcon` — never emoji as icons
16. Button variants: rounded-full by default for standalone buttons, rounded-[var(--radius-md)] in form contexts
17. `cn()` from `@/lib/utils` for conditional classes

---

## Component Quick Patterns

### Primary CTA Button
```tsx
<Button className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 transition-colors duration-150 cursor-pointer">
  Generate
</Button>
```

### Ghost/Secondary Button
```tsx
<Button variant="outline" className="border-glass-border text-text-2 hover:bg-glass hover:text-text-1 rounded-full transition-colors duration-150 cursor-pointer">
  Cancel
</Button>
```

### AI/Magic Button (violet)
```tsx
<Button className="bg-accent2/15 text-accent2 hover:bg-accent2/25 border border-accent2/20 rounded-full transition-all duration-150 cursor-pointer">
  <Sparkles className="w-4 h-4 mr-1.5" /> AI Enhance
</Button>
```

### Glass Card
```tsx
<div className="bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] p-4 hover:bg-glass-hover hover:border-glass-border-strong transition-colors duration-150 cursor-pointer">
```

### Active Tab Chip
```tsx
className={cn(
  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
  isActive
    ? "bg-accent/15 text-accent border border-accent/20"
    : "text-text-3 hover:text-text-1 hover:bg-glass cursor-pointer"
)}
```

### Input
```tsx
<Input className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent" />
```

### Section Label
```tsx
<p className="label-section">Section Title</p>
```

---

## Magic UI Components (install via shadcn)

Install with: `npx shadcn@latest add "https://magicui.design/r/<name>"` from `apps/web`

| Component | Path after install | Use Case |
|-----------|-------------------|---------|
| `MagicCard` | `@/components/ui/magic-card` | Template cards — spotlight hover |
| `ShimmerButton` | `@/components/ui/shimmer-button` | "Polish with AI" primary CTA |
| `BorderBeam` | `@/components/ui/border-beam` | Animated borders on highlighted cards / loading |
| `Marquee` | `@/components/ui/marquee` | Auto-scrolling showcase strip |
| `NumberTicker` | `@/components/ui/number-ticker` | Animated stats counters |
| `BlurFade` | `@/components/ui/blur-fade` | Section entrance animations |
| `AnimatedBeam` | `@/components/ui/animated-beam` | Home hero: prompt → API → output flow |
| `TypingAnimation` | `@/components/ui/typing-animation` | Hero tagline demo |
| `AnimatedGradientText` | `@/components/ui/animated-gradient-text` | "NEW" / "HOT" feature badges |

---

## Spacing & Radius (Post-Redesign)

### Spacing (Breathable — use these minimums)
- Sections: `py-20` (was `py-10`)
- Cards: `p-6` (was `p-4`)
- Grid gaps: `gap-6` (was `gap-4`)
- Max content width: `max-w-7xl`

### Radius (Post-Redesign — more rounded)
- Feature/template cards: `rounded-[var(--radius-xl)]` (24px)
- Inputs: `rounded-[var(--radius-md)]` (12px, unchanged)
- Modals/dialogs: `rounded-[var(--radius-xl)]` (24px)
- Buttons: `rounded-full` (unchanged)
- Section containers: `rounded-[var(--radius-lg)]` (16px)

---

## State Management

- **Zustand stores** in `src/lib/store/` — use selectors, not `useStore()` directly
- `useBuilderStore` — active template, fields, styles, palettes, keywords, negatives, mockup
- `useHistoryStore` — saved prompts, recipes
- `useSettingsStore` — theme, platform, preferences
- `useAuth()` hook from `src/hooks/useAuth.ts` — `{ user, isPro, isAuthenticated, logout }`

---

## File & Architecture Conventions

- Feature-based file organization: `components/builder/`, `components/library/`, etc.
- Page files in `app/(app)/[route]/page.tsx`
- All API routes under `app/api/[domain]/route.ts`
- Shared utilities in `lib/utils.ts`
- Data layer: `lib/data/` (static data files) + `db/schema.ts` (Drizzle schema)
- Pure business logic: `packages/prompt-engine/` (no React, no Next.js deps)

---

## Security Rules

- All API routes that touch user data MUST call `requireAuth()` from `@/lib/require-auth`
- Validate all user inputs with Zod schemas at API boundaries
- Never expose `error.message` from caught exceptions in API responses
- Guest tokens are HMAC-signed — use `/api/auth/guest` endpoint, never manual cookie creation
- No direct `supabase.auth.getUser()` from server without going through `createClient()`

---

## Anti-Patterns — NEVER Generate

| ❌ Never | ✅ Instead |
|----------|------------|
| `style={{ color: '#FF6B00' }}` | `className="text-accent"` |
| `bg-white` as default | `bg-bg-base` or `bg-bg-2` |
| `text-gray-400` | `text-text-3` |
| `border-white/10` in light mode | `border-gray-200` |
| `outline-none` alone | `outline-none focus-visible:ring-2 focus-visible:ring-accent/50` |
| `scale-105` on hover | `hover:bg-glass hover:border-glass-border-strong` |
| Emoji icons (🎨 🚀) | Lucide icons via `LucideIcon` |
| `#EC4899` pink as CTA | `bg-accent` orange as CTA |
| `animate-bounce` on icons | Only on loaders |
| Hardcoded `userId` constants | `supabase.auth.getUser()` |
| `error.message` in API response | Generic "Something went wrong" message |

---

## Page-Specific Notes

Detailed per-page design overrides live in:
`apps/web/design-system/savage-prompt-builder/pages/`

When building for a specific page, check there first.

### Pages Overview

| Route | Purpose | Key Pattern |
|-------|---------|-------------|
| `/home` | Dashboard / launchpad | Stats + template grid + showcase tiles |
| `/builder` | Core prompt builder | Left fields panel + right output + tab strip |
| `/generate` | Image generation | Full-bleed output grid, minimal chrome |
| `/library` | Saved prompts | Grid/list toggle, filter chips |
| `/settings` | User preferences | Section cards, switches, Pro badges |
| `/login` | Auth | Centered card, OAuth + email, guest option |

---

## Skills — Auto-Applied by Task Type

Skills are **always** applied automatically based on what you're working on — no need to explicitly request them. Read the SKILL.md before implementing whenever the task matches a trigger. Cap at 3 skills max per task.

For all UI work, always read and apply **all three**: `frontend-design` + `web-accessibility` + `ui-ux-pro-max`. These three always travel together for any component, page, or layout work.

For routine edits where the project's inline checklists fully cover the work, those checklists are used as a shortcut — the full SKILL.md is still available if deeper guidance is needed.

| Task Type | Skill(s) | Notes |
|-----------|----------|-------|
| Any UI component or page (new **or** edit) | `frontend-design` + `web-accessibility` + `ui-ux-pro-max` | Always — all three |
| Active redesign / design system work | `frontend-design` + `web-accessibility` + `ui-ux-pro-max` | All three |
| WCAG / a11y audit, ARIA, focus | `web-accessibility` + `frontend-design` | Always |
| Auth, API routes, input validation | `security-review` | Always — no exceptions |
| New Drizzle schema or migration | `database-design` | Always |
| Writing or updating tests | `unit-testing` | Always |
| Reviewing a PR or diff | `code-review` | Always |
| Performance / bundle analysis | `performance-optimization` | Always |
| React hooks, state, component patterns | `react-best-practices` | When relevant |

---

## Inline Skill Checklists (Always Available — No Read Needed)

These replace reading full SKILL.md files for routine work in this project.

### UI Checklist (from frontend-design + web-accessibility)
- [ ] `cursor-pointer` on every clickable element
- [ ] Hover state on every interactive element (color, border, or shadow change)
- [ ] `transition-colors duration-150` on all interactive elements
- [ ] `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50` — never bare `outline-none`
- [ ] `aria-label` on all icon-only buttons
- [ ] `alt` text on all images
- [ ] Semantic HTML (`button` not `div onClick`); ARIA only when native doesn't suffice
- [ ] Use design tokens (never hardcoded colors, never `bg-white`, never `text-gray-*`)
- [ ] Keyboard navigable — tab order matches visual order
- [ ] No `scale` transforms on hover — use opacity/border/shadow

### Security Checklist (from security-review)
- [ ] Every API route that reads/writes user data calls `requireAuth()`
- [ ] All user inputs validated with Zod at API boundary
- [ ] Never expose `error.message` in API responses
- [ ] No hardcoded secrets, API keys, or user IDs
- [ ] Parameterized queries only — no string interpolation in SQL
- [ ] Guest tokens via `/api/auth/guest` only — never manual cookies

### React Checklist (from react-best-practices)
- [ ] Use Zustand selectors, not `useStore()` directly
- [ ] Colocate state — don't lift higher than needed
- [ ] `useMemo`/`useCallback` only when profiled as necessary
- [ ] No `useEffect` to sync state — restructure data flow instead
- [ ] Extract shared logic into custom hooks when used 2+ times

---

## MCP Servers — When to Use

| Server | Tools Prefix | Use For |
|--------|-------------|---------|
| `context-mode` | `ctx_*` | Large command output (>50 lines), batch file reads, indexing web docs — see `30-context-mode.instructions.md` |
| `microsoft/playwright-mcp` | `mcp_microsoft_pla_*` | Browser testing, visual verification, UI debugging — invoke via Debugger agent |
| `shadcn-ui` | `mcp_shadcn-ui_*` | List/get shadcn components and blocks for installation |
| `21st-magic` | `mcp_21st-magic_*` | Component building, inspiration, logo search |

---

## Mandatory Session-End Checklist

Apply at the end of **every session** where meaningful work was done. No exceptions.

1. `pnpm tsc --noEmit` from `apps/web/` — confirm 0 errors
2. Update `/memories/repo/current-state-snapshot.md` — date, status, key files changed
3. Update `init/CODEBASE-KNOWLEDGE.md` — only if structure changed (new components, routes, packages)
4. Create `reports/YYYY-MM-DD.md` — match format of existing reports
5. `git add -A` → `git commit -m "..."` (Conventional Commits) → `git push`

> Only read full `progress-tracker` SKILL.md if this checklist is unclear or missing context.

---

## Agents — When to Invoke

Use these agents proactively — don't wait to be asked.

| Agent | When to Use |
|-------|------------|
| `Plan` | Start of any multi-step feature, redesign phase, or sprint planning |
| `Implementer` | Executing an approved plan with multiple files |
| `Reviewer` | Before committing — review own changes for correctness, security, performance |
| `Debugger` | TS errors, runtime bugs, visual regressions — also has Playwright MCP access |
| `Explore` | Codebase discovery, finding patterns, understanding unfamiliar code — prefer over manual search chains |
