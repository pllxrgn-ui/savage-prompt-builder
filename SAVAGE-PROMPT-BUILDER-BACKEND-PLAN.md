# Savage Prompt Builder — Backend Implementation Plan
> A step-by-step checklist for building out the backend architecture, APIs, and cloud sync features for Savage Prompt Builder. 
> Keep track of your progress here as you move through Phases 4-6.

---

## 🏗️ Phase 4: Database & Authentication Structure

The foundation of the backend to handle users, sessions, and cloud syncing for Pro features.

### 1. Database Setup (Supabase & Drizzle)
- [x] Initialize Supabase project.
- [x] Configure Drizzle ORM in the Next.js backend (`apps/web`).
- [x] Define database schema for core tables:
  - `users` (id, email, name, avatar, tier, stripe_customer_id)
  - `prompts` (history of generated prompts, ratings, notes, project_id)
  - `recipes` (saved builder snapshots)
  - `custom_styles` (user-created style presets)
  - `custom_palettes` (user-created color palettes)
  - `media` (generated images metadata, urls, prompt references)
- [x] Implement Row Level Security (RLS) policies in Supabase so users can only access their own data.

### 2. Authentication Flows
- [x] Set up NextAuth.js or Supabase Auth.
- [x] Configure OAuth providers: Google and GitHub.
- [x] Configure Magic Link (email) authentication.
- [x] Create `/login` and `/signup` UI pages with auth state integration inside `apps/web`.
- [x] Implement secure session handling using standard httpOnly cookies or JWTs.
- [x] Set up an Auth Middleware to protect `(app)` dashboard routes and redirect unauthorized users.
- [x] Create simple onboarding flow (post-login) to migrate LocalStorage data to the Cloud for new users.

---

## 🧠 Phase 5: Core API Routes & Text AI (Agent)
Routing frontend interactions to the database and integrating the core intelligence layer via LLMs (OpenAI / Claude).

### 3. User Data APIs (CRUD endpoint)
Create standard Next.js API App Router endpoints (`/api/...`) inside `apps/web`.
- [x] `GET /api/user` — Fetch user profile, settings, and Pro status.
- [x] `GET/POST/PUT/DELETE /api/prompts` — Sync prompt history.
- [x] `GET/POST/PUT/DELETE /api/recipes` — Sync user recipes.
- [x] `GET/POST/PUT/DELETE /api/custom-styles` — Sync user custom styles.

### 4. AI Intelligent Agent Endpoints (LLM Proxy)
Create secure routes that read the `system-prompts.json` and pass user context to the Language Model. *These routes must be protected and gated for Pro users.*
- [x] `POST /api/ai/polish` — Rewrites and optimizes the user's draft prompt for the selected generator format.
- [x] `POST /api/ai/variations` — Generates 3-5 alternative prompt variations based on the current context.
- [x] `POST /api/ai/suggest` — Analyzes filled fields and recommends values for empty template fields.
- [x] `POST /api/ai/styles` — Takes a "vibe" text input and returns 3 formatted custom style presets.
- [x] `POST /api/ai/refine` — (Iterative Refinement) Takes plain-text feedback to fix the prompt (e.g., "Make it darker").

---

## 🎨 Phase 6: Image Generation & Asset Management
Connecting the app to actual image generation models and storing the results.

### 5. Image Generation API Integration
Set up the proxy routes to connect securely to NanoBanana Pro, Replicate, or direct provider APIs (Midjourney, DALL-E).
- [x] `POST /api/generate` — Sends the formatted prompt, generator model, count, and aspect ratio to the image generation provider.
- [x] Implement Polling or Webhook receivers to track generation status (Pending, Processing, Completed, Failed).
- [x] Stream progress updates back to the UI (using Server-Sent Events - SSE or simple polling).

### 6. Cloud Storage (Media Management)
- [x] Set up a Cloudflare R2 (or AWS S3) bucket for storing generated images.
- [x] `POST /api/media/upload` — Create a route to fetch the generated image from the provider URL, upload it to your R2 bucket, and return the secure storage URL.
- [x] `POST /api/media` — Save the resulting R2 image URL and full prompt metadata to the `media` database table.

---

## 💳 Phase 7: Monetization & Gating
Making sure the system correctly restricts Pro features to paying users.

### 7. Stripe Billing Integration
- [ ] Set up products in the Stripe Dashboard (Free & Pro tiers).
- [x] Create `POST /api/checkout` Stripe Checkout session generation.
- [x] Create `POST /api/webhook/stripe` Webhook handler for `checkout.session.completed` and `customer.subscription.deleted`.
- [x] Implement database logic for user `tier` updates on payment completion.
- [x] Create frontend `useProGate` hook to manage Pro state and trigger Stripe redirects.
- [x] Implement `useProGate` hook on the frontend to display Upgrade Modals when free users click AI or Generate actions.

---

## 🔌 Phase 8: Model Context Protocol (MCP) & Extensibility
Additional backend utility integration as required.

### 8. MCP Server (Claude Desktop Integration)
- [ ] Navigate to the `packages/mcp-server` workspace.
- [ ] Build out the 8 planned MCP tools to allow the Claude Desktop app to interact with the Savage Prompt Builder engine locally.

### 9. Advanced Endpoints
- [ ] Build the Bulk Processing backend service to handle iterating over an array of subjects and generating multiple prompts asynchronously to avoid timeout limits.
- [x] Set up the `/api/share` endpoint to generate short-URLs for encoded prompt states (if the base64 URL hashing gets too long).
