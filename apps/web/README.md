# SIDEKICK Prompt Builder — Web App

AI image prompt builder with 20 templates, 9 generator formats, and a dark-first design system.

## Tech Stack
- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS v4** with CSS var design tokens
- **Zustand 5** for state management (persist middleware)
- **TypeScript** strict mode
- **pnpm monorepo** (`apps/web` + `packages/prompt-engine` + `packages/mcp-server`)

## Getting Started

```bash
# From monorepo root
pnpm install
pnpm dev

# Or from apps/web directly
cd apps/web
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) — auto-redirects to `/home`.

## Project Structure
```
src/
  app/           # Next.js App Router routes
    (app)/       # Authenticated app shell (sidebar + bottom nav)
      home/      # Template picker
      builder/   # Prompt builder workspace
      library/   # Saved prompts & recipes
      settings/  # Theme, accent, generator config
  components/    # React components (builder/, layout/, ui/)
  lib/
    data/        # 13 typed data constant files
    store/       # Zustand stores (builder, ui, settings, history)
    prompt-engine/  # Re-export from @spb/prompt-engine
```

## Current Status
See [SAVAGE-PROMPT-BUILDER-PROGRESS.md](../../SAVAGE-PROMPT-BUILDER-PROGRESS.md) for full progress tracker.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
