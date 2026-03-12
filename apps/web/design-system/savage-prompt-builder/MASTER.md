# Design System — Savage Prompt Builder
> **Source of truth for ALL UI work in this project.**
> When building a specific page, check `design-system/savage-prompt-builder/pages/[page].md` first.
> If a page file exists, its rules override this Master. Otherwise, use this exclusively.

**Updated:** 2026-03-12 (Redesign Plan v1)  
**Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Magic UI · Framer Motion · Lucide icons · Zustand  
**Style:** Warm Dark Elegance · AI Creative Studio · Commercial SaaS  
**Generated with:** ui-ux-pro-max skill (global)  
**Redesign Plan:** `SAVAGE-REDESIGN-PLAN.md` (root of repo)

---

## Identity

Savage Prompt Builder is a **warm-dark, elegant, commercial AI creative studio** for generating prompts for image/video models. The aesthetic is inspired by Higgsfield and Artlist — cinematic, clean, production-grade — but with our own identity.

- **Not** generic SaaS dashboard. Feels like a creative studio instrument.
- **Not** cyberpunk/neon. **Warm dark luxury** — deep blacks, orange warmth, Editorial type.
- **Not** text-heavy menus. **Visual-first** — icons, swatches, images over labels.
- Accent energy: **orange (#FF6B00)** — bold, warm, creative energy.
- AI moments: **violet (#A78BFA)** — magic, polish, intelligence.
- Premium: **gold (#F5C842)** — Pro tier, special features only.

### Design Adjectives (The "Feel Filter")
Every design decision must pass: **Elegant? Breathable? Commercial?**

### Competitor Insights (Do Not 1:1 Copy)
- **Higgsfield**: Moodboard in top nav, feature badges ("NEW"), dark, video-first, model carousel
- **Artlist**: "Create any video you can imagine", model showcase strip, trust logos, AI Toolkit concept

### Typography Upgrade (Phase 1)
| Role | Font | Old |
|------|------|-----|
| Display / Hero | **Clash Display** (Fontshare) | Space Grotesk |
| Heading | **Plus Jakarta Sans** | Plus Jakarta Sans (keep) |
| Body | **Inter** | DM Sans |
| Mono | **Fira Code** | SF Mono / Fira Code (keep) |

---

## Color Tokens

These map to CSS variables in `apps/web/src/app/globals.css`. Always use the CSS variable name in Tailwind classes, not hardcoded hex.

### Dark Mode (Default)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| `--bg-base` | `#09090B` | `bg-bg-base` | Page background |
| `--bg-1` | `#0F0F12` | `bg-bg-1` | Sidebar, panels |
| `--bg-2` | `#16161A` | `bg-bg-2` | Cards, dropdowns |
| `--bg-3` | `#1E1E24` | `bg-bg-3` | Elevated surfaces |
| `--bg-input` | `#12121A` | `bg-bg-input` | Form inputs |
| `--text-1` | `#F4F4F5` | `text-text-1` | Primary text |
| `--text-2` | `#A1A1AA` | `text-text-2` | Secondary text |
| `--text-3` | `#71717A` | `text-text-3` | Muted/label text |
| `--border` | `rgba(255,255,255,0.06)` | `border-border` | Default borders |
| `--border-strong` | `rgba(255,255,255,0.12)` | `border-border-strong` | Emphasized borders |
| `--accent` | `#FF6B00` | `text-accent`, `bg-accent` | Primary CTA, active state |
| `--accent-hover` | `#FF8533` | `hover:bg-accent-hover` | Accent hover |
| `--accent-muted` | `rgba(255,107,0,0.10)` | `bg-accent-muted` | Accent background tint |
| `--accent2` | `#A78BFA` | `text-accent2` | AI features, magic moments |
| `--accent-gold` | `#F5C842` | `text-accent-gold` | Pro/premium only |
| `--glass` | `rgba(255,255,255,0.04)` | `bg-glass` | Subtle hover state |
| `--glass-hover` | `rgba(255,255,255,0.07)` | `hover:bg-glass-hover` | Glass hover |
| `--glass-border` | `rgba(255,255,255,0.08)` | `border-glass-border` | Glass card border |

### Light Mode

Defined under `[data-theme="light"]`. Keep contrast ratios: text #18181B on #FAFAFA bg. Use `border-gray-200` — not `border-white/10` which is invisible.

---

## Typography

### Font Stack

| Role | Font | Tailwind | Notes |
|------|------|----------|-------|
| Heading | Plus Jakarta Sans | `font-heading` | Titles, section headers |
| Body | DM Sans | `font-body` | Paragraphs, UI copy |
| Display | Space Grotesk | `font-display` | Hero text, brand moments |
| Mono | SF Mono / Fira Code | `font-mono` | Prompt output, code |

### Type Scale Rules

- Headings: `font-heading font-semibold tracking-tight`
- Section labels: use `.label-section` class (11px, 600, 0.08em tracking, uppercase, `text-text-3`)
- Body: `font-body text-[15px] leading-relaxed`
- Prompt output: `font-mono text-sm text-text-1`
- Avoid `font-bold` on body text — use `font-medium` or `font-semibold` only

---

## Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Chips, badges, small inputs |
| `--radius-md` | `12px` | Standard cards, buttons |
| `--radius-lg` | `16px` | Panel headers, drawers |
| `--radius-xl` | `24px` | Feature cards, major layout panels |
| `--radius-full` | `9999px` | Pills, nav dots, avatars |

Use `rounded-[var(--radius-md)]` syntax in Tailwind v4.

---

## Shadows & Glow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.3)` | Subtle card lift in dark |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Cards, modals |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.5)` | Drawers, overlays |
| `--shadow-glow` | `0 0 24px rgba(255,107,0,0.12)` | Accent CTA glow — use sparingly |

---

## Component Patterns

### Buttons

```tsx
// Primary CTA — orange, bold call to action
<Button className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 transition-colors duration-150 cursor-pointer">
  Generate
</Button>

// Secondary — ghost with border
<Button variant="outline" className="border-glass-border text-text-2 hover:bg-glass hover:text-text-1 rounded-full transition-colors duration-150 cursor-pointer">
  Cancel
</Button>

// AI/Magic — violet accent
<Button className="bg-accent2/15 text-accent2 hover:bg-accent2/25 border border-accent2/20 rounded-full transition-colors duration-150 cursor-pointer">
  <Sparkles className="w-4 h-4 mr-1.5" /> AI Enhance
</Button>
```

**Rules:**
- All clickable elements: `cursor-pointer`
- All state changes: `transition-colors duration-150` minimum
- Never use `transform: translateY` on hover — it shifts layout
- Rounded: default is `rounded-full` for buttons, `rounded-[var(--radius-md)]` for cards

### Cards

```tsx
// Standard glass card
<div className="bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] p-4 hover:bg-glass-hover hover:border-glass-border-strong transition-colors duration-150 cursor-pointer">
  {children}
</div>

// Elevated card (active/selected)
<div className="bg-bg-3 border border-border-strong rounded-[var(--radius-lg)] p-4">
  {children}
</div>
```

### Inputs

```tsx
<Input className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] focus:border-accent focus:ring-1 focus:ring-accent/30" />
```

### Tabs / Segment Controls

```tsx
// Tab pill row (used in builder)
<button className={cn(
  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
  isActive
    ? "bg-accent/15 text-accent border border-accent/20"
    : "text-text-3 hover:text-text-1 hover:bg-glass cursor-pointer"
)}>
```

### Badges

```tsx
// Status badge
<Badge className="bg-accent-muted text-accent border-0 text-xs font-medium rounded-full px-2 py-0.5">
  Active
</Badge>

// Pro badge — gold
<Badge className="bg-accent-gold/15 text-accent-gold border-0 text-xs font-semibold rounded-full">
  PRO
</Badge>
```

### Drawers / Panels

- Background: `bg-bg-1 border-l border-glass-border`
- Header: `px-4 py-3 border-b border-glass-border`
- Scrollable body: `overflow-y-auto flex-1`
- Add `safe-area-bottom` class on mobile bottom panels

---

## Animation Rules

Using **Framer Motion**. Shared primitives in `components/ui/AnimatedLayout.tsx`.

| Pattern | Usage | Code |
|---------|-------|------|
| Page entry | All pages | `<PageTransition>` wrapper |
| Staggered lists | Template cards, library items | `<StaggerContainer>` + `<FadeUpItem>` |
| Slide-in | Drawers, panels | `initial: { x: 16, opacity: 0 }, animate: { x: 0, opacity: 1 }` |
| Spring | Interactive confirms | `type: 'spring', stiffness: 400, damping: 30` |

**Critical rules:**
- Always wrap with `@media (prefers-reduced-motion: reduce)` — use `motion.div` with `layoutId` only when needed
- No `animate-bounce` or `animate-spin` on decorative elements (only loading indicators)
- Transitions on interactive elements: `duration-150` to `duration-200` only
- Avoid animations that block input (no long entrance delays)

---

## Page-by-Page Identity

### `/home` — Dashboard / launchpad
- Pattern: AI-Driven Dynamic — show value immediately  
- Stats row at top (compact, `bg-bg-2` cards)  
- Template grid below with `StaggerContainer`
- Showcase tiles: gradient overlays on `bg-bg-3` — warm-to-dark

### `/builder` — Core product
- Single-page app feel with left panel (fields) + right output area  
- Tab strip for Styles / Palettes / Keywords / Negative / Mockup
- Prompt output area: mono font, `bg-bg-1`, copy/share actions
- Active template indicated with `text-accent` icon + border

### `/generate` — Image generation
- Full-bleed output grid, dark background, minimal chrome
- Generation loader: shimmer with `shadow-glow` pulse

### `/library` — Saved prompts
- Two-view: Grid / List toggle
- Filter chips row: `rounded-full` pills
- Item cards: compact, hover `border-glass-border-strong`

### `/settings` — Configuration
- Section cards with `bg-bg-2` + heading labels
- Switch components for toggles, Input for text values
- Destructive actions: `text-red-400` with confirm step

---

## UX Rules (from ui-ux-pro-max)

### Interaction Quality
- `cursor-pointer` on **every** clickable/tappable element — no exceptions
- Hover states must provide visual feedback (color, border, or shadow change)
- `transition-colors duration-150` minimum on all interactive elements
- `transition-all` only when multiple properties change; prefer `transition-colors`

### Focus & Accessibility
- Focus rings: `focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none`
- Never use just `outline-none` without providing a ring replacement
- Tab order must match visual order
- All icon-only buttons need `aria-label`
- All images need `alt` text

### Contrast (Light Mode)
- Body text minimum: `#475569` (slate-600) — never lighter
- Glass cards: `bg-white/80` minimum opacity
- Borders: `border-gray-200` — not `border-white/10`

### Loading States
- Skeleton placeholders (not spinners) for content areas
- `animate-pulse` on skeleton blocks only
- `animate-spin` only on loading indicators (spinner icons)
- Never animate decorative icons

### Layout
- Sticky nav height: account for it in `pt-` on page containers
- Mobile bottom bar: use `pb-16 md:pb-0` on main content
- Min tap target: `44px` on mobile (use `min-h-[44px]` on small buttons)

---

## Icons

Use **Lucide React** exclusively. Import via `@/components/ui/LucideIcon` wrapper.

- Size convention: `w-4 h-4` (16px) for inline, `w-5 h-5` (20px) for nav, `w-6 h-6` (24px) for feature
- Color: inherit from text color — use `text-accent` or `text-text-3` explicitly
- Never use emoji as icons
- Never mix icon sets

---

## Anti-Patterns — NEVER DO

| ❌ Don't | ✅ Do instead |
|----------|--------------|
| `bg-blue-500`, `text-white` hardcoded | Always use CSS variable tokens |
| `scale-105` on hover (layout shift) | `opacity`, `border-color`, `shadow` transitions |
| `outline-none` alone | `outline-none focus-visible:ring-2 focus-visible:ring-accent/50` |
| `animate-bounce` on icons | Only on loaders/spinners |
| Pink/purple CTA (#EC4899) | Orange `bg-accent` (#FF6B00) is the primary CTA |
| Light background (#FAFAFA) default | `bg-bg-base` (#09090B) is the default |
| Inline `style={{}}` for colors | CSS variables in globals.css |
| Generic `shadcn` defaults without theming | Always apply project tokens |
| `text-gray-400` | `text-text-3` (the token) |
| `border-white/10` in light mode | `border-gray-200` in light mode |

---

## Pre-Delivery Checklist

Before delivering any UI code:

- [ ] Every clickable element has `cursor-pointer`
- [ ] All transitions use `duration-150` or `duration-200`
- [ ] No emojis used as icons — Lucide only
- [ ] Colors from design token variables, not hardcoded
- [ ] Hover states provide visual feedback
- [ ] Focus states visible (`focus-visible:ring-*`)
- [ ] `prefers-reduced-motion` respected via Framer Motion defaults
- [ ] Responsive: 375px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] Dark mode: all custom CSS has variables in both `:root` and `[data-theme="light"]`
- [ ] Icon-only buttons have `aria-label`
