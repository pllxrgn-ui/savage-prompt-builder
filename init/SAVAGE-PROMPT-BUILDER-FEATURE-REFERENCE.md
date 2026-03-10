# SAVAGE PROMPT BUILDER — Complete Feature & Function Reference

**What this app is:** A prompt builder for AI image generators. Users pick a template, fill in fields, toggle styles/palettes/keywords, and the app assembles a formatted prompt they can copy into Midjourney, DALL·E, Stable Diffusion, Flux, Leonardo, Firefly, or Ideogram.

**Reference files:** Open `PROTOTYPE.html` in a browser to see everything working. Use `savage-prompt-builder.jsx` for the React UI direction.

---

## THE 10 VIEWS

The app has 10 views accessible from a tab bar at the top:

1. **Dashboard** — Home screen with stats, activity chart, quick actions, favorites, and analytics
2. **Builder** — The main prompt-building workspace (this is where users spend most of their time)
3. **Palettes** — Browse and create color palettes
4. **Keywords** — Browse and select keyword tags
5. **Generate** — Image generation interface (PRO feature)
6. **Media** — Gallery of generated images
7. **Bulk** — Batch prompt generation from a list of subjects
8. **Prompts** — Saved prompt history with search, filter, and actions
9. **Recipes** — Saved builder snapshots that restore entire setups
10. **Settings** — Account, theme, accent colors, style packs, phrases, data management

---

## DASHBOARD

The first thing users see. Shows an overview of their usage and quick ways to jump into building.

**Stats bar across the top — 4 cards:**
- Total prompts saved
- Total favorites (starred prompts)
- Most-used template name
- Average prompt rating

**14-day streak chart:** A bar chart showing how many prompts were saved each of the last 14 days. Bars have tooltips. Today's bar is highlighted.

**Quick start cards:** Clickable cards like "New Clothing Prompt", "Random Fill", "Last Prompt", "AI Generate". Each jumps you into the Builder with a specific setup.

**Quick prompt input:** A text box where you type a subject and hit Go — it opens the Builder with that subject pre-filled.

**Pinned favorites:** The 5 most recent starred prompts shown as small cards. Each has Copy and Load buttons.

**Active project spotlight:** Shows the currently selected project with its recent prompts listed. Each prompt has a Copy button.

**Workflow chains:** Step-by-step guides (like "Clothing Collection Flow") shown as cards with numbered steps you can copy.

**Prompt analytics (appears after 5+ saved prompts):**
- Top rated styles ranked by average star rating with a bar chart
- Generator performance comparison (which generator gets the best ratings)
- Stats: peak creative hour, % of prompts rated 4-5 stars, total iterations made, total images generated

---

## BUILDER

The core of the app. This is where prompts are constructed.

### Template selector
A horizontal scrollable row of 20 template buttons. Each shows an emoji, name, and description. Templates: Clothing, Social Media, Marketing, Brand/Logo, Collection, Freestyle, Album Cover, Poster/Flyer, Sticker/Patch, Wallpaper, Product Mockup, Tattoo Design, Sneaker Concept, Pattern/Texture, Character, Book/Zine, Enamel Pin, Car Wrap, Reaction/Meme, Jewelry. Users can also create custom templates.

Switching templates changes the field grid, available styles, mockup options, negative prompt presets, and suggestion chips.

### Garment selector (Clothing and Collection templates only)
Three-way toggle: Dark Garment / Light Garment / None. Dark garment tells the AI to use light/neon colors on dark fabric. Light garment tells it to use dark/saturated colors on light fabric. This text gets injected into the prompt.

### Mockup toggle and config
A toggle button to turn mockup mode on/off. When on, dropdown menus appear for:
- **Item:** What to put the design on (varies by template — T-Shirt, Hoodie, Tank Top for clothing; Vinyl Record, CD Case for album covers; Framed on Wall, Taped to Wall for posters; etc.)
- **Color:** Garment/product color (Black, White, Heather Gray, Navy, etc. — only for templates that have color options)
- **Display:** How to show it (Flat Lay, Ghost Mannequin, Male Model, On Hanger, etc. — only for templates that have display options)

Every template has its own unique set of mockup items. 18 templates have mockup support.

### Field grid
Each template defines 5-7 input fields. Each field has:
- A colored dot indicator
- A bold label (like SUBJECT, STYLE, MOOD, COLORS)
- A question hint (like "Main graphic?", "Art technique?")
- A text input with placeholder text
- **Suggestion chips:** As the user types, matching suggestions from a preset list appear as clickable chips below the input. Clicking a chip fills the field.

**Special case — Social Media template:** The first field is a dropdown with 40+ platform/format options (Instagram Feed Post, TikTok Video, YouTube Thumbnail, Facebook Story, LinkedIn Post, Pinterest Pin, Snapchat Story, Google Display ads, Email headers, Print on Demand sizes, etc.). Each option automatically injects the correct aspect ratio and pixel dimensions into the prompt.

### AI Style Generator (PRO feature)
Sits above the style list in the Builder. Has:
- A text input to describe a vibe (like "dark japanese ink, moody")
- 10 quick-fill chips for common vibes (dark moody cinematic, retro 70s sunset, cute kawaii pastel, etc.)
- A drag-and-drop mood board area for up to 6 images — uploaded images are sent to the AI as visual references
- A "Generate 3 Styles" button that calls the AI
- Results appear as 3 style cards, each with a name, content preview, Edit button, and "+ Add Style" button
- An "Add All Styles" button to add all 3 at once as active custom styles

### Style list
A collapsible section showing all available styles for the current template. Organized into:
- **Template preset styles:** Grouped by category (e.g., for Clothing: "Print Technique" category has Screenprint Classic, DTG Photo-Quality, Discharge Soft-Hand, etc.; "Graphic Aesthetic" category has Streetwear Bold, Vintage Band Tee, Skate Punk, etc.). Every template has its own preset styles — over 300 total across all templates.
- **Custom user styles:** Styles the user has created or added from AI generation or style packs.

Each style has a checkbox. Checking it activates the style — its content (a paragraph of style instructions) gets prepended to the prompt. Multiple styles can be active at once.

Users can add custom styles via a form with name and content fields. Custom styles can be edited and deleted. Preset styles cannot be deleted but can be toggled on/off.

### Negative prompt
A collapsible section with:
- A free-text textarea for typing negative terms
- Clickable preset buttons specific to the current template (e.g., Clothing presets: text, watermark, words, letters, human body, hands, fingers, face, blurry, low quality, etc.)
- Clicking a preset toggles it in/out of the negative text
- The negative prompt is handled differently by each generator format (Midjourney uses --no, DALL·E uses "Do not include:", Stable Diffusion has a separate negative field, etc.)

### Reference image
A collapsible section with:
- Upload button for a reference photo (max 10MB)
- Text input for a reference image URL
- When uploaded, shows a thumbnail preview with a clear button
- The reference gets added to the prompt: Midjourney gets `--sref URL`, others get "Style reference: URL" or "Use the attached reference image for style and composition guidance"

### Variables
A collapsible section for user-defined token replacement:
- Users add variables like `{BRAND}` = "SAVAGE" or `{SEASON}` = "Winter 2025"
- Every `{TOKEN}` in the final prompt output gets replaced with the variable's value
- Add/edit/delete for each variable

### Tattoo client mockup (Tattoo template only)
Extra section for uploading a client photo, selecting placement area, and skin tone for accurate tattoo mockup previews.

### Variations
A row of pill buttons (V1, V2, V3...) below the field grid. Each variation holds a separate set of field values while sharing the same template, styles, palettes, and settings. Users can maintain up to 10 variations to quickly compare different subjects with the same style setup. Add and delete buttons for managing variations.

### Action buttons below the field grid
- **Undo** — reverts the last field change
- **Redo** — re-applies an undone change
- **Clear Fields** — empties all fields (with confirmation)
- **Clear All Styles** — deactivates every style
- **Random Fill** — fills every field with a random value from the preset lists

### Generator selector
A row of 8 generator format buttons: Midjourney, DALL·E / ChatGPT, Stable Diffusion, Flux, Leonardo AI, Adobe Firefly, Ideogram, Raw. Each generator formats the prompt differently — different joining styles, different negative prompt handling, different suffixes. The active generator affects the live output.

### Prompt output area
Shows the assembled prompt updating in real time as users make changes. Contains:

**Badge row:** Small colored tags showing what's active — generator name, active style names, garment mode, mockup info, keyword count, palette count, reference photo indicator.

**Prompt text display:** Monospace font. In Raw mode, different parts are color-coded (purple for styles, green for garment/palette, orange for mockup, white for field content). In generator mode, shows the single formatted output.

**Word and character count** with a warning when exceeding the generator's character limit.

**Star toggle:** Click to star/unstar the current prompt.

**Score row:** 5 clickable stars for rating the prompt 1-5. Click the same star again to clear it.

**Note input:** A text field to add a note that gets saved with the prompt.

### Action buttons below the prompt output

**Copy row:**
- **COPY PROMPT** — main button, copies the full formatted prompt to clipboard
- **Generate Image** — sends prompt to the Image Generation view (PRO feature)

**Save row:**
- **Save** — saves the prompt plus all metadata to history
- **Iterate** — saves as a child of the last saved prompt, creating a version chain (v1 → v2 → v3)
- **Recipe** — opens a modal to save the entire builder setup as a reloadable snapshot
- **Project dropdown** — choose which project folder to save to

**AI Tools row (all PRO features):**
- **Polish** — sends the prompt to AI, returns one enhanced version
- **Variations** — sends the prompt to AI, returns 3 (or 5) alternative versions
- **Suggest** — AI analyzes filled fields and suggests values for empty fields as clickable chips

**Tools row:**
- **Copy Raw** — copies the prompt without style instructions
- **Random** — random fill all fields
- **Remix** — keeps the subject but shuffles styles, keywords, palettes, and possibly the generator
- **Share** — creates an encoded URL containing the prompt state, copies it to clipboard

### AI results panel
Appears below the action buttons when AI tools return results:
- **Polish results:** One enhanced prompt with Copy, Use This, and Save buttons
- **Variation results:** 3+ cards, each with a label, the full prompt, and Copy/Use/Save buttons
- **Suggest results:** Clickable suggestion chips that appear below each empty field
- "Use This" puts the AI result into the Freestyle template's subject field
- Re-polish and re-generate buttons for follow-up

---

## PALETTES VIEW

A full-page browser for color palettes.

**Category filter:** Horizontal row of category pills — All, Custom, Streetwear, Vintage, Nature, Luxury, Neon, Pastel, Mono, Seasonal, Cultural, Brand.

**Palette grid:** Cards in a responsive grid. Each card shows a 4-color swatch bar across the top, the palette name, and a description. 108 built-in palettes total (roughly 10-12 per category).

**Selection:** Click a palette to select it (accent border + glow). Click again to deselect. Multiple palettes can be active at once. Selected palettes inject their colors and type description into the prompt.

**Create palette button:** Opens a modal with name input, 5 color pickers (expandable to 10), type description input, and description input. Custom palettes appear under the "Custom" category and can be edited or deleted.

---

## KEYWORDS VIEW

A full-page keyword picker organized by category.

**6 categories:** Style (30 keywords like vector, ink wash, screenprint, watercolor), Mood (30 keywords like bold, aggressive, calm, serene), Technique (20 keywords like high contrast, double exposure, motion blur), Color (20 keywords like monochrome, earth tones, neon, pastel), Composition (20 keywords like centered, symmetrical, rule of thirds), Details (20 keywords like no text, transparent background, 4K, sharp focus).

Each keyword is a clickable chip. Selected keywords get a green accent. There's a "Selected Keywords" section at the top showing active keywords with × remove buttons. Selected keywords inject into the prompt as "Keywords: word1, word2, word3."

---

## IMAGE GENERATION VIEW (PRO)

A full-page interface for generating images from prompts.

**Left column:**
- Editable prompt textarea pre-filled from the Builder output
- "Reset to Builder" button to re-fill from current builder state
- "Clear" button
- **Model selector dropdown:** 8 models — NanoBanana Pro (default), Midjourney, DALL·E 3, Stable Diffusion XL, Flux Pro, Leonardo AI, Adobe Firefly, Ideogram
- **Image count:** Toggle pills for 1, 2, 3, or 4 images
- **Aspect ratio:** Toggle pills for common ratios (1:1, 4:5, 16:9, 9:16, 3:2, 2:3)
- **Aspect ratio reference table:** Full list of 40+ platform-specific aspect ratios with pixel dimensions and notes
- **Generate button**

**Right column:**
- Generated image display area
- Action buttons for each generated image: Download, Copy URL, Save to Media Gallery
- Recent generation history

---

## MEDIA GALLERY VIEW

Shows all images that have been generated and saved.

**Grid layout:** Responsive image grid. Each cell shows a thumbnail. Hovering shows template name, model used, timestamp, and prompt preview. Star toggle on each image.

**Detail view:** Clicking an image shows full size with all metadata — model, template, generator, palettes, styles, keywords, field values, timestamp. Action buttons: Copy Prompt, Open Image, Star, Delete.

---

## BULK MODE VIEW

Batch prompt generation for creating many prompts at once.

**Textarea:** Users paste a list of subjects, one per line (like "lion", "tiger", "eagle", "wolf").

**Generate All button:** Builds a separate prompt for each subject using the current template, styles, palettes, keywords, mockup settings, and generator format.

**Results:** Numbered list of generated prompts. Each has its own Copy button. "Copy All" button at the bottom copies every prompt separated by dividers.

---

## PROMPTS (HISTORY) VIEW

The saved prompt library with full search and filtering.

**Filters:**
- Project folder pills — filter by project
- Template filter dropdown — filter by which template was used
- Star filter — "All" or "★ Favs"
- Search input — searches prompt text and notes

**Prompt cards:** Each saved prompt displays:
- Timestamp, template name, generator name
- Star rating (if scored)
- Star toggle button
- Truncated prompt text with Expand/Collapse toggle
- Note text (if any, with 📝 icon)
- **Version chain info:** If the prompt was an iteration, shows a version badge (v2, v3), a clickable "↑ parent" link that scrolls to the parent prompt, and a "↓ N iterations" count showing how many child versions exist

**Card actions:**
- **Copy** — copies prompt text to clipboard
- **Load** — loads the prompt in the Builder (restores the template, field values, and generator)
- **Dup** — duplicates the entry with a new ID and timestamp
- **Diff** — select two prompts to compare word-by-word in a diff modal (words only in A shown red, only in B shown green, shared words counted)
- **Del** — deletes with confirmation

**Empty state:** "No saved prompts yet" message with guidance.

---

## RECIPES VIEW

Saved builder snapshots that restore an entire setup.

**Recipe cards** in a grid show:
- Template emoji and recipe name
- Description
- Date
- Preview of field values
- Badges for active style count, keyword count, palette count, generator name
- **Load in Builder** button
- Delete button

**What a recipe saves:** Everything — the template, all field values, which preset styles are active, custom styles, selected keywords, selected palettes, negative prompt, garment setting, mockup settings, variables, generator, and reference info.

**Load in Builder** restores every single piece of that state and switches to the Builder view. This is the most complex restore action in the app.

**Empty state:** Explanation of what recipes are and how to create one.

---

## SETTINGS VIEW

### Account section
- Tier badge showing Free or Pro with an avatar icon
- Plan description
- Upgrade/downgrade toggle button (for testing — in production this would connect to billing)
- List of Pro features with status indicators

### Appearance section
- **Theme toggle:** Dark / Light with immediate effect
- **Accent color picker:** 8 colored dots (Red, Orange, Purple, Green, Blue, Yellow, Pink, Cyan). Selected dot has a ring. Clicking changes the accent color across the entire app immediately.

### Style packs section
Installable bundles of curated styles. Each pack card shows the pack name, description, preview of included style names, and an Install button. Installing adds those styles to your custom styles. Shows "Installed ✓" after installing.

### Phrase library section
- **Built-in phrases:** Cards showing pre-written prompts you can copy and paste into ChatGPT to help with your image prompts (like "Build a prompt", "Refine it", "Get variations", "Fix problems", "Match a vibe", "Negative prompt help")
- **Custom phrases:** Users can add their own phrases with a name and text. Edit and delete supported.

### Data management section
- **Export All Data** — downloads a JSON file containing everything: history, recipes, styles, palettes, variables, phrases, media metadata, settings
- **Import Data** — opens a modal to paste exported JSON. Merges with existing data without creating duplicates.
- **Clear All Data** — nuclear option, deletes everything from storage with confirmation

### About section
- App name and version
- Usage stats (total prompts, favorites, recipes, custom styles, media)
- Keyboard shortcuts reference table

---

## TIER SYSTEM

**Free tier:** Full access to templates, fields, styles, palettes, keywords, negative prompts, mockups, variations, variables, history, recipes, bulk mode, export/import, themes, and all non-AI features.

**Pro tier (gated features):** AI Style Generator, AI Polish, AI Variations, AI Suggest, Image Generation.

When a free user clicks any Pro feature, an upgrade modal appears showing what Pro includes and an upgrade button.

For development/testing, there's a toggle in Settings to switch between Free and Pro.

---

## AI PROMPTING AGENT

The app includes a built-in AI agent trained in best practices for prompting across all supported image generators. This agent is the intelligence layer that makes Savage different from every other AI image tool. It doesn't just pass user input to a model — it optimizes everything to get the best possible result.

### What the agent knows

The agent's system prompt contains deep knowledge of prompt engineering best practices for every supported generator. It knows that Midjourney responds best to comma-separated descriptors with style keywords front-loaded. It knows DALL·E prefers natural language sentences and struggles with comma-heavy syntax. It knows Stable Diffusion benefits from weighted tokens and quality boosters. It knows Firefly needs prompts kept under 1500 characters. It knows which generators handle negative prompts natively and which need them rephrased as positive instructions. This knowledge is baked into everything the agent does.

The agent also knows the context of every template — what makes a good clothing graphic prompt vs. a good tattoo design prompt vs. a good album cover prompt. It understands production constraints (stickers need flat colors and thick outlines, patterns need to be seamless, clothing designs need transparent backgrounds).

### Prompt polishing

When the user clicks Polish, the agent rewrites their prompt using best practices specific to both the template type and the target generator. It doesn't just add adjectives — it restructures the prompt for optimal results. It tightens redundant phrasing, adds precise visual language, enhances lighting and composition direction, and formats everything to play to the specific generator's strengths. The polished prompt is shown alongside the original so the user can compare, copy, or apply it.

### Auto generator selection

The agent analyzes the user's prompt and creative intent, then recommends the best generator for the job. Photo-realistic product shots route to Flux or DALL·E. Stylized illustrations with specific art direction route to Midjourney. Seamless patterns route to Stable Diffusion. Designs that need readable text route to Ideogram. The agent explains its recommendation so the user understands why.

### Smart field suggestions

The agent goes beyond simple preset matching. It analyzes what the user has filled in so far — subject, style, mood — and suggests values for empty fields that create a cohesive creative direction. If the user entered "skull" as subject and "screenprint" as style, the agent might suggest "halftone dot shading, limited 3-color palette" for technique and "bold, raw, gritty" for mood because those complement the screenprint aesthetic. Suggestions appear as clickable chips below each empty field.

### Negative prompt optimization

The agent knows what each generator struggles with for each template type and auto-builds the optimal negative prompt. It doesn't just use a generic list — it considers the specific subject, style, and generator to craft targeted exclusions. A realistic portrait on DALL·E gets different negatives than a cartoon sticker on Stable Diffusion.

### Style combination advisor

When multiple styles are active, the agent checks for conflicts and compatibility. It warns when styles pull in opposite directions ("You have both 'Minimalist Mark' and 'Graffiti Wildstyle' active — these will fight each other") and suggests pairings that work well together. It can also recommend styles from the preset library that complement what the user has already selected.

### Iterative refinement

After an image is generated, the user can tell the agent what's wrong in plain language — "too dark", "the skull looks cartoonish, I wanted realistic", "needs more contrast", "the colors are muddy." The agent rewrites the prompt to fix the specific issue, explaining what it changed and why. This creates a fast feedback loop where each generation gets closer to the user's vision.

### Multi-prompt collection coherence

For users building collections or series (using the Collection template or generating multiple related pieces), the agent ensures visual consistency across prompts. It maintains the same style DNA, color relationships, and technique references while varying the subject, so a 5-piece t-shirt collection looks like it belongs together.

### Vibe-to-style generation

The AI Style Generator uses the agent to turn a vibe description ("dark japanese ink, moody, cinematic") or mood board images into 3 fully articulated style presets. Each preset is a detailed paragraph of style instructions that an AI image generator can use — not vague descriptions, but precise technique terms, color references, texture descriptions, and cultural/artistic references. The agent ensures each of the 3 styles is genuinely distinct and doesn't duplicate existing styles in the user's library.

### How it's implemented

The agent is powered by a large language model (GPT-4o-mini for speed-critical actions, GPT-4o or Claude for deeper analysis) called through the app's backend API. The intelligence comes from the system prompt — a 3,000-5,000 token instruction set containing all the prompt engineering knowledge, generator specs, template best practices, and output format rules. Each agent action (polish, suggest, auto-select, refine) sends a different user message with the same system prompt. Responses come back as structured JSON that the app parses and displays.

The system prompt is built from the same data that powers the rest of the app — template definitions, generator format rules, style descriptions, and field presets — so the agent's knowledge is always consistent with what the app itself does.

---

## PROMPT ENGINE — How Prompts Are Built

The prompt is assembled from multiple sources in this order:
1. Active style instructions (all checked styles' content paragraphs)
2. Garment text (if applicable)
3. Mockup text (if mockup is on)
4. Template field output (each template has its own function that combines field values)
5. Palette text (selected palette colors and descriptions)
6. Keywords text
7. Reference URL or photo note
8. Negative prompt (handled per generator)

Then the active generator format function processes everything — joining, adding suffixes, formatting negatives.

Then variables do token replacement.

The result updates live in the prompt output area.

---

## GENERATOR FORMATS

Each of the 8 generators handles prompt formatting differently:

- **Midjourney** — joins with commas, adds `--no [negatives]`, appends `--ar 1:1 --style raw --v 6.1`, max 6000 chars
- **DALL·E / ChatGPT** — joins with periods into natural sentences, negatives become "Do not include: [terms].", max 4000 chars
- **Stable Diffusion** — joins with commas, adds "masterpiece, best quality, highly detailed", separate negative field, max 10000 chars
- **Flux** — joins with periods, negatives become "Without: [terms].", max 10000 chars
- **Leonardo AI** — joins with commas, adds "high quality, detailed", separate negative field, max 4000 chars
- **Adobe Firefly** — truncates to 5 parts, negatives become "without [terms]", max 1500 chars
- **Ideogram** — joins with periods, negatives become "Exclude: [terms].", max 6000 chars
- **Raw** — no formatting, just joins parts with double newlines, max unlimited

Character count displays a warning when the prompt exceeds the active generator's limit.

---

## PERSISTENCE

All user data saves to localStorage automatically. This includes: custom styles, history, projects, variables, selected keywords, selected palettes, custom palettes, user phrases, current generator, installed style packs, recipes, media gallery, template style active states, theme, and accent color.

Data loads on app startup and saves after every meaningful state change.

---

## SHARING

The Share button encodes the current prompt, template, and active style names into a base64 URL hash. Opening that URL in a browser restores the state. Warning shown if the link exceeds 2000 characters.

---

## KEYBOARD SHORTCUTS

- **1-9** — Switch to tabs 1-9 (when not typing in an input)
- **0** — Switch to Settings
- **Ctrl+Shift+C / Cmd+Shift+C** — Copy the prompt
- **Ctrl+S / Cmd+S** — Save to history (prevents browser's save dialog)
- **Escape** — Close any open modal

---

## MODALS

The app uses modals for: Upgrade to Pro prompt, Save Recipe form, Import Data form, Create/Edit Custom Palette, Prompt Diff comparison, and Media detail view. All close with Escape or clicking outside.

---

## TOAST NOTIFICATIONS

Pop-up messages at the bottom-right for feedback: "Copied!", "Saved to history!", "Recipe saved!", "Fields cleared", etc. Auto-dismiss after 2.5 seconds. Color-coded by type: blue for info, green for success, yellow for warnings, red for errors.

---

## UNDO / REDO

Tracks the last 20 field value states. Undo reverts to the previous state. Redo re-applies. Both stacks clear when fields are reset.

---

## 20 TEMPLATES — What Each One Does

Each template has unique fields, a unique prompt builder function, unique preset styles, unique negative prompt presets, unique mockup items, and unique field suggestion presets.

1. **Clothing** — T-shirt/hoodie graphics. Fields: subject, style, mood, colors, background, avoid. Adds "isolated centered composition, print-ready, high detail, clean edges."
2. **Social Media** — IG, TikTok, FB posts. Has platform dropdown with 40+ format options that auto-inject aspect ratios.
3. **Marketing** — Ad visuals. Fields: product, headline, style, mood, colors, composition, avoid.
4. **Brand/Logo** — Logo design. Fields: brandname, subject, style, mood, composition, avoid. Adds "logo design, scalable, vector-ready."
5. **Collection** — Multi-piece series. Fields: theme, pieces, style, mood, colors, avoid. Has garment toggle.
6. **Freestyle** — Open-ended, any subject. Most flexible template.
7. **Album Cover** — Music artwork. Adds "square 1:1 format, album cover quality."
8. **Poster/Flyer** — Event promos. Adds "portrait orientation, print-ready, high impact."
9. **Sticker/Patch** — Die-cut designs. Adds "thick bold outlines, flat colors, die-cut ready, transparent background."
10. **Wallpaper** — Phone/desktop backgrounds. Fields include device dimension selector.
11. **Product Mockup** — Lifestyle product shots. Fields: product, scene, style, colors, lighting, avoid.
12. **Tattoo Design** — Ink concepts. Fields include placement, size, and client skin tone. Has special tattoo client mockup section.
13. **Sneaker Concept** — Shoe designs. Fields: silhouette, style, materials, colorway, details, avoid.
14. **Pattern/Texture** — Seamless tileable patterns. Adds "seamless tileable, fabric-ready, no visible edges."
15. **Character** — OCs and mascots. Adds "full body visible, character sheet, reference sheet quality."
16. **Book/Zine** — Cover art. Fields include genre and layout for title space.
17. **Enamel Pin** — Collectible pins. Adds "gold or silver metal outlines, flat enamel fills, pin-ready."
18. **Car Wrap** — Vehicle graphics. Fields: design, style, vehicle type, colors, coverage.
19. **Reaction/Meme** — Shareable reaction images. Adds "expressive, shareable, meme-ready."
20. **Jewelry** — Ring, necklace, bracelet designs. Fields: piece, style, material, gemstones, mood, avoid.

---

## DATA FILES IN THE DEV PACKAGE

These JSON files contain all the data the app uses:

- `templates.json` — All 20 template definitions
- `template-styles.json` — 300+ preset styles organized by template and category
- `field-presets.json` — Suggestion presets for every field of every template
- `palettes.json` — 108 color palettes
- `keywords.json` — 140+ keywords across 6 categories
- `negative-presets.json` — Template-specific negative prompt presets
- `mockup-config.json` — Mockup items, colors, and displays for 18 templates
- `generators.json` — 8 generator definitions
- `generator-formats.js` — Generator format functions
- `template-builders.js` — Template builder functions
- `image-gen-models.json` — 8 image generation models
- `system-prompts.json` — 4 AI system prompts (style generator, polish, variations, suggest)
- `style-packs.json` — 3 installable style bundles
- `phrases.json` — 6 GPT helper phrases
- `app-config.json` — App name, version, storage keys, accent colors
- `aspect-ratios.json` — 40+ platform-specific aspect ratios with pixel dimensions
- `workflow-chains.json` — Step-by-step workflow guides
- `design-system.json` — CSS variable definitions
