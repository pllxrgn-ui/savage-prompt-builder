# Savage Prompt Builder — Full UI/UX Redesign Plan
**Created:** 2026-03-12  
**Status:** IN PLANNING  
**Priority:** P0 — All visual surfaces being overhauled  

---

## 1. Vision & Design Direction

### What We're Building
A premium, elegant AI creative studio — the go-to prompt engineering tool for creators, designers, and brands generating images with Nanobanana 2 and beyond. Not a dev tool, not a chatbot. A **creative instrument**.

### Reference Analysis
- **Higgsfield.ai** — Feature-rich dark cinematic UI, video-first, prominent "NEW" feature badges in nav, Moodboard in top nav, model carousel, community-driven explore feed
- **Artlist.io** — Commercial polish, "Create any video you can imagine" hero, multi-model showcase strip (incl. Nano Banana), trust logos row, clean structured toolkit concept

### What We Take (Not 1:1)
| Them | Our Version |
|-----|------------|
| Higgsfield's moodboard-in-nav | Mood Board as first step in every workflow |
| Artlist's model showcase strip | "Powered by" strip showing Nanobanana 2 + upcoming models |
| Artlist's toolkit concept | Our Builder IS the toolkit — make it feel as polished |
| Higgsfield's feature badges | "NEW" / "HOT" badges on Prompt Polish, Video Gen, Tattoo Overlay |
| Both: Dark cinematic hero | Large dark hero with animated prompt demo or generation reel |
| Artlist's trust logos | User creation showcase gallery (social proof via output) |

### Design Adjectives (The "Feel Filter")
> Every design decision must pass: **Is it Elegant? Is it Breathable? Is it Commercial?**

- **Elegant** — generous whitespace, refined type, no clutter
- **Breathable** — high line-height, spacing between sections, nothing cramped
- **Commercial** — looks like a product people pay for, not an open-source side project
- **Visual-first** — icons, images, and output previews before walls of text
- **Warm-dark** — NOT cold/cyberpunk. Dark but warm. Orange glow, not neon green.

---

## 2. Design System Overhaul

### Typography (New)
| Role | Font | Notes |
|------|------|-------|
| Display / Hero | **Clash Display** or **Cabinet Grotesk** | Bold, editorial, unique personality |
| Heading | **Plus Jakarta Sans** (keep) | H1–H3, clean |
| Body | **Inter** (swap from DM Sans) | More neutral, widely legible |
| Mono | **Fira Code** | Prompt output |

*Install via `next/font` local or CDN — Clash Display available via Fontshare*

### Color System (Refined)
Keep all existing tokens but add a richer gradient vocabulary:

```css
/* New additions to globals.css */
--bg-hero: #050507;           /* Even deeper than bg-base for hero sections */
--accent-warm: #FF4500;       /* Deeper orange variant for dark backgrounds */

/* Gradient presets */
--gradient-hero: radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.12) 0%, transparent 70%);
--gradient-card-hover: linear-gradient(135deg, rgba(255,107,0,0.05), transparent);
--gradient-silk: linear-gradient(180deg, #0F0F12 0%, #09090B 100%);
```

### Spacing (More Breathable)
- Section vertical rhythm: `py-20` minimum (currently `py-10`)
- Card padding: `p-6` (currently `p-4`)
- Content max-width: `max-w-7xl` (wider than current `max-w-6xl`)
- Component gap: `gap-6` for grids (currently `gap-4`)

### Radius (More Rounded)
- Default card: `2xl` (24px) — up from `lg` (16px)
- Input: `xl` (20px)  
- Button: stays `full` (pills) 
- Modal: `3xl` (32px)

### Magic UI Components to Add
| Component | Use Case |
|-----------|---------|
| `AnimatedBeam` | Home hero — show prompt → Nanobanana API → output flow |
| `BorderBeam` | Primary CTA buttons, Prompt Polish card border |
| `MagicCard` | Template cards — spotlight hover effect |
| `ShimmerButton` | "Polish with AI" primary action |
| `BlurFade` | Page section entrances |
| `NumberTicker` | Stats (prompts generated, users, templates) |
| `TextAnimate` / `TypingAnimation` | Hero tagline animation |
| `Particles` | Hero background subtle particles |
| `Meteors` | Empty state backgrounds |
| `AnimatedGradientText` | Feature badges like "NEW" / "Powered by NB2" |
| `Marquee` | Scrolling showcase of generated outputs |

---

## 3. Information Architecture Overhaul

### New Navigation Structure

**TopNav** (Desktop — horizontal, sticky, blurred backdrop):
```
SAVAGE   |  [Builder] [Generate] [Library] [Moodboard]   |   [Prompt Polish ✨HOT] [Upgrade] [Avatar]
```

**Feature badges** visible on nav items:
- "AI" badge on Prompt Polish
- "NEW" badge on Video when launched
- Remove "/home" — landing IS the home, go direct to Builder from logo

**MobileTabBar** — Icon-only (no labels on mobile, tooltip on long-press):
- Wand2 (Builder)
- Sparkles (Generate)
- Grid (Moodboard)
- BookOpen (Library)
- User (Profile)

### URL Structure (no changes needed, just UX)
- `/` — NEW marketing landing page (currently routes to `/home`)
- `/home` — authenticated dashboard (keep)
- `/builder` — builder (keep)
- `/generate` — generate (keep)
- `/moodboard` — NEW page
- `/library` — keep
- `/settings` — keep

---

## 4. Page Redesigns (Priority Order)

### P0 — Global Shell

**TopNav**
- Frosted glass background: `backdrop-blur-xl bg-bg-base/80 border-b border-glass-border`
- Logo: Wordmark "SAVAGE" in Clash Display, weight 700
- Nav links: spacing `gap-1` → `gap-0.5` tighter, add feature badges
- Prompt Polish becomes a standalone nav item with `BorderBeam` border animation
- Avatar dropdown: larger, `w-9 h-9` images, show usage quota pill

**Layout Shell**
- Increase main content padding: `px-6 md:px-12 lg:px-20`
- Reduce inner max-width constraint — sections own their widths
- Footer: Add minimal footer to app (currently none) — links + credits

---

### P0 — `/home` — Dashboard

**Hero Block (above fold)**
```
[Animated hero area — typing prompt demo]
  "Turn rough ideas into →"
  [animated typing: "a streetwear tee..." → polished prompt]
  [Polish with AI] button  ← ShimmerButton with BorderBeam
  [Open Builder →] ghost button
```

**Model Strip** (below hero, horizontal scroll on mobile)
```
Powered by:  [ Nanobanana 2 ✓ ] [ Flux (soon) ] [ SDXL (soon) ]
```

**Stats Row** (NumberTicker animated on enter)
```
[12,847 prompts generated]   [21 templates]   [400+ styles]
```

**Moodboard Quick-Start** (NEW — prominent)
- A visual "Start from a mood" grid: 6 aesthetic cards (Cyberpunk / Editorial / Streetwear / Art Nouveau / Minimalist / Cinematic)  
- Clicking one pre-loads the Moodboard with that aesthetic as starting reference

**Template Grid**
- MagicCard spotlight on hover
- Larger cards: `aspect-[4/3]` with gradient preview area
- Show count badge: "21 templates"
- Group filter pill row (visual icons + label)

**Showcase Marquee** (bottom, auto-scrolling)
- Real generated outputs as proof of quality
- `Marquee` component, two rows, opposite directions

---

### P0 — `/builder` — Core Builder

This is the most critical redesign.

**Layout**: Shift from single-page vertical scroll to **two-panel desktop layout**:
```
[Left: Workflow Steps Sidebar] | [Right: Output + Context Panel]
```

**Left Panel — Workflow Steps (NEW)**
Not tabs anymore. A **vertical step indicator** showing the workflow:

```
① Mood & Reference    ← FIRST (moved to top per requirements)
② Template
③ Fields & Details
④ Styles
⑤ Colors / Palette
⑥ Keywords
⑦ Negative Prompts
⑧ Mockup (if applicable)
```

Each step:
- Icon + label
- Completion dot (filled when has value)
- Click to expand/collapse its panel
- Active step has `border-l-2 border-accent` indicator

**Step 1 — Mood & Reference (MOVED TO TOP)**
- ImageUpload area for reference photo
- Style Mood grid: visual icon cards (no text menus)
- Platform selector: icon grid (Instagram square, TikTok 9:16, etc.) — no dropdown

**Step 3 — Fields**
- Cleaner layout with question-prompt helper text
- Input `rounded-xl` with floating labels
- Auto-suggest chips below each field

**Styles Panel**
- Card grid instead of list
- Each style has a small visual swatch (gradient preview matching the style mood)
- Active styles shown as pills at top of section
- AIStyleGenerator more prominent — full width card at top

**Right Panel — Output**
- Larger, more prominent prompt output area
- `font-mono` output with line-height 1.8, padding 24px
- **Prompt Polish CTA** — full-width shimmered button below output
  - Shows before/after diff when polished
- Copy / Share / Save actions in floating pill row above output
- Variation tabs redesigned as horizontal swipe-able cards (mobile) or `grid-cols-3` (desktop)
- "Generate Now" primary action: large gradient button, `rounded-2xl`, orange glow

**Tattoo Template — Specialized Mockup (NEW feature)**
When `activeTemplateId === 'tattoo'`:
- Additional step appears: "Client Photo Overlay"
- Upload client photo → AI or manual overlay canvas
- Simple position/scale controls for placing the tattoo design
- Export as mockup image

---

### P1 — `/generate` — Image Generation

**Layout**
- Remove all left-panel UI when generation is in progress
- Full-screen dark canvas with generation grid
- Control toolbar floats at bottom (pill-shaped, glassmorphic)

**Video Generation Toggle (NEW)**
- Mode switcher at top: `[Image] [Video]` pill toggle
- When "Video" selected: show duration selector (3s / 5s / 10s)
- Show Nanobanana 2 video model badge
- Output: video player card in grid

**Output Grid**
- Cards: `rounded-2xl`, no border — shadow only
- Each card: hover reveals download / save / share / "use as reference" actions
- Loading state: skeleton with `BorderBeam` animated border

---

### P1 — `/moodboard` — NEW Page

**Purpose**: Visual inspiration board that feeds into the Builder workflow

**Layout**
- Pinterest-style masonry grid of saved reference images
- Top bar: "Add Reference" (URL paste or file upload), "New Board"
- Each image: tag with moods/styles, can be dragged to Builder

**Integration**
- When entering Builder with a moodboard active → reference images auto-load into Step 1
- MoodBoard items get AI-analyzed to suggest styles

---

### P2 — `/library` — Saved Prompts

**Redesign**
- List/grid toggle (keep)
- Card redesign: prompt preview as styled quote, platform badge, copy button
- Filter chips: Template / Platform / Date / Starred
- Bulk select + export

---

### P2 — `/login` — Auth Page

**Redesign**
- Split layout: left = animated showcase (rotating output images), right = auth form
- Dark background, orange accent CTA
- Social proof: "Join X creators"
- Guest mode: more prominent (currently buried)

---

## 5. New Feature Specs

### Feature 1: Prompt Polish (PRIMARY VALUE PROP)

**Where it appears:**
1. Home page hero — the main input
2. Builder output panel — full-width CTA
3. Library — "Re-polish" action on saved prompts
4. Dedicated keyboard shortcut: `⌘P`

**UX Flow:**
1. User has a rough prompt OR output from builder
2. Clicks "Polish with AI" (ShimmerButton, prominent)
3. Loading state: `BorderBeam` spinner on output card, "Analyzing..." text
4. Result shown as diff: `[removed text in red]` `[added text in green]`
5. Accept / Reject / Tweak options
6. Optional: AI explains WHY each change was made (collapsible)

**Visual Design:**
- The Polish button is never hidden — always accessible
- Color: `bg-accent-gold` (gold = premium feel, not just orange)
- Badge: "AI" with violet glow

### Feature 2: Mood Board (WORKFLOW STEP 1)

**Applies to:** ALL templates (not just some)

**Components:**
- Reference image upload (drag-drop, URL, or camera on mobile)
- Style mood tiles: 12 visual tiles with gradient swatches
- "Extract palette from image" button → auto-fills Color Palette step

### Feature 3: Tattoo Client Overlay

**Trigger:** Only shows when `activeTemplateId === 'tattoo'`

**UX:**
1. After generating tattoo design → "Preview on Client" button appears in output
2. Upload or take photo of body area
3. Simple overlay canvas: place, scale, rotate the tattoo PNG
4. Export as PNG or share directly

**Tech:** Canvas API or `konva.js` — lightweight, no AI needed for basic placement

### Feature 4: Video Generation

**Trigger:** Mode selector in Generate page, plus builder flag

**Models for MVP:** Nanobanana 2 (primary per requirement)
**UI:**
- Same builder workflow, last step adds: Duration / Motion Style / Camera Move
- Output: fullscreen autoplay video cards with download
- Show model badge: "Nanobanana 2" prominently

### Feature 5: Icon-Based Platform Selector

Replace the current text dropdown for platform (Instagram, TikTok, etc.) with:
- Icon grid: Each platform shows its logo icon in a `rounded-xl` card
- Active: `border-accent` + `bg-accent/10`
- Includes: Instagram (1:1), Instagram Story (9:16), TikTok (9:16), X (16:9), Pinterest (2:3), Poster (A4)

---

## 6. Implementation Phases

### Phase 1 — Foundation Refresh (2–3 days)
*No feature changes, just visual quality*

- [ ] Upgrade typography: Install Clash Display via Fontshare, update globals.css and layout.tsx
- [ ] Spacing tokens: Increase all section padding, card padding, grid gaps
- [ ] Radius tokens: Add `radius-2xl`, `radius-3xl` to globals.css, apply to cards/inputs
- [ ] Add gradient tokens to globals.css (--gradient-hero, --gradient-card-hover)
- [ ] Install Magic UI components: `npx shadcn@latest add ...` for MagicCard, BorderBeam, Marquee, BlurFade, NumberTicker, ShimmerButton, TypingAnimation
- [ ] Update all existing cards to use `MagicCard` and `rounded-2xl`
- [ ] TopNav: glass blur backdrop, Prompt Polish as nav item with badge
- [ ] MobileTabBar: icon-only with badge support

### Phase 2 — Home Page Rebuild (1–2 days)
- [ ] Hero section: TypingAnimation prompt demo, ShimmerButton
- [ ] Model strip: Nanobanana 2 + future models
- [ ] NumberTicker stats row
- [ ] Moodboard quick-start grid (visual aesthetic tiles)
- [ ] MagicCard for template grid
- [ ] Marquee showcase strip (placeholder images for now)

### Phase 3 — Builder Redesign (3–4 days)
- [ ] Workflow step sidebar (vertical stepper)
- [ ] Move Mood & Reference to Step 1
- [ ] Icon-based platform selector
- [ ] Style cards with gradient swatches
- [ ] Prompt Polish CTA in output panel (ShimmerButton + BorderBeam)
- [ ] Variation tabs redesign
- [ ] "Generate Now" button redesign
- [ ] Tattoo: Conditional client overlay panel placeholder

### Phase 4 — Generate Page (1–2 days)
- [ ] Image/Video mode switcher
- [ ] Output grid: `rounded-2xl`, hover actions
- [ ] BorderBeam loading state on cards
- [ ] Video output: player card
- [ ] Floating control toolbar (bottom pill)

### Phase 5 — New Pages (2–3 days)
- [ ] Moodboard page (`/moodboard`)
- [ ] Library redesign
- [ ] Login split layout

### Phase 6 — Feature Deep-dive (3–5 days)
- [ ] Prompt Polish full flow (diff view, AI explain)
- [ ] Tattoo overlay canvas
- [ ] Video generation API integration
- [ ] Moodboard → Builder integration

---

## 7. Magic UI Installation Commands

```bash
# From apps/web directory
npx shadcn@latest add "https://magicui.design/r/magic-card"
npx shadcn@latest add "https://magicui.design/r/shimmer-button"
npx shadcn@latest add "https://magicui.design/r/marquee"
npx shadcn@latest add "https://magicui.design/r/number-ticker"
npx shadcn@latest add "https://magicui.design/r/blur-fade"
npx shadcn@latest add "https://magicui.design/r/animated-beam"
npx shadcn@latest add "https://magicui.design/r/animated-gradient-text"
npx shadcn@latest add "https://magicui.design/r/typing-animation"
npx shadcn@latest add "https://magicui.design/r/meteors"
npx shadcn@latest add "https://magicui.design/r/particles"
```

---

## 8. Files That Will Change (Scope)

### Definitely Changing
- `src/app/globals.css` — tokens, typography, spacing
- `src/app/layout.tsx` — font imports
- `src/components/layout/TopNav.tsx` — full rebuild
- `src/app/(app)/home/page.tsx` — full rebuild
- `src/app/(app)/builder/page.tsx` — layout overhaul
- `src/components/builder/PromptOutput.tsx` — Polish CTA
- `src/components/builder/StylesDrawer.tsx` → `StylesPanel.tsx`
- `src/components/builder/GarmentSelector.tsx` → `PlatformSelector.tsx`
- `src/app/(app)/generate/page.tsx` — mode switcher + grid
- `src/app/(app)/login/page.tsx` — split layout

### New Files
- `src/components/ui/magic-card.tsx`
- `src/components/ui/shimmer-button.tsx`
- `src/components/ui/marquee.tsx`
- `src/components/ui/number-ticker.tsx`
- `src/components/ui/blur-fade.tsx`
- `src/components/ui/animated-beam.tsx`
- `src/components/ui/animated-gradient-text.tsx`
- `src/components/ui/typing-animation.tsx`
- `src/components/builder/MoodReference.tsx` (Step 1)
- `src/components/builder/WorkflowStepper.tsx`
- `src/components/builder/PlatformSelector.tsx`
- `src/components/builder/TattooOverlay.tsx`
- `src/app/(app)/moodboard/page.tsx`

---

## 9. Design Constraints

1. **No regressions** — all existing features must still work after visual overhaul
2. **Tests still pass** — `packages/prompt-engine` tests are untouched
3. **Security maintained** — `requireAuth()`, HMAC signing, input validation stay
4. **Performance** — Magic UI animations use `will-change: transform` and must respect `prefers-reduced-motion`
5. **Mobile-first** — everything works at 375px before scaling up

---

## 10. Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1. Foundation Refresh | ⬜ Not Started | — | — |
| 2. Home Page Rebuild | ⬜ Not Started | — | — |
| 3. Builder Redesign | ⬜ Not Started | — | — |
| 4. Generate Page | ⬜ Not Started | — | — |
| 5. New Pages | ⬜ Not Started | — | — |
| 6. Feature Deep-dive | ⬜ Not Started | — | — |

---

*This plan is the source of truth for the redesign. Update the Progress Tracking table and page notes as work is done.*
