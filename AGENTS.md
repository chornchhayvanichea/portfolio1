# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

Personal portfolio built with Nuxt 4 (`app/` directory structure, Nuxt 4.6+). Content pages are driven by Nuxt Content (`content/*.md` rendered by the catch-all page `app/pages/[...slug].vue` via `queryCollection('content')`).

## Commands

- Package manager: **pnpm** (only pnpm is locked; README shows npm/yarn/bun options but they are not used).
- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` / `pnpm preview` / `pnpm generate` — production build / preview / static generation
- `npx nuxt prepare` — generates `.nuxt/` TypeScript references (must run before any `tsc` / typecheck).
- No test, lint, or CI setup exists yet. `pnpm build` plus a dev-server smoke test (`curl http://localhost:3000/...`) is the current verification path.

## Known gaps in the content setup (as of last verification)

The content pipeline is only half-wired; `pnpm dev`/`pnpm build` **succeed silently**, but content does not render:

1. `content.config.ts` imports `@nuxt/content`, but the package is **not** in `package.json`/`pnpm-lock.yaml`. Without it, Nuxt silently ignores `content.config.ts`.
2. `nuxt.config.ts` has no `modules` entry — `@nuxt/content` must be both installed (`pnpm add @nuxt/content`) and registered in `modules: [...]` to take effect.
3. `app/app.vue` still renders `<NuxtWelcome />` and has no `<NuxtPage />`, so every route serves the welcome page (watch for warning `NUXT_E4011` in the page payload) and `app/pages/[...slug].vue` never mounts.

Do not assume content routes work just because the dev server starts. If a task touches content rendering, verify the actual HTML output, not the build success.

## Quirks

- `tsconfig.json` is only references into generated configs in `.nuxt/` (`tsconfig.app.json` etc.). Run `pnpm install` (postinstall runs `nuxt prepare`) or `npx nuxt prepare` before any tsc-based check.
- `pnpm-workspace.yaml` sets `allowBuilds: esbuild: false` — esbuild's postinstall script is intentionally not run.
- `content/index.md` uses MDC component syntax (`::alert`), backed by `app/components/Alert.vue` / `Counter.vue` — Vue components usable directly in markdown.
- `.data/`, `.nuxt/`, `.output/` are generated/gitignored; `.data/kv` holds Nuxt Content's local database.
- Git repo is fresh: `master` has no commits yet (create an initial baseline commit before creating branches or git worktrees).

## Strict SEO & Performance Rules (Mandatory for All Pages & Components)

- **Semantic HTML:** Every page must render a single `<h1>`, logical `<h2>`/`<h3>` hierarchy, and semantic landmarks (`<main>`, `<article>`, `<nav>`, `<footer>`).
- **Metadata & Open Graph:** Every route and content page must define unique `<title>`, `<meta name="description">`, canonical URL, and Open Graph / Twitter Card tags via `useSeoMeta()` / `useHead()`.
- **Structured Data (JSON-LD):** Include valid Schema.org JSON-LD (`Person` on home page, `SoftwareSourceCode` or `CreativeWork` on project pages).
- **Crawlability:** Maintain valid `sitemap.xml` and `robots.txt` (via `@nuxtjs/seo` or Nuxt server routes) excluding draft/private routes.
- **Images & Core Web Vitals:** Use explicit `width` and `height`, modern formats (WebP/AVIF), descriptive `alt` text, and `loading="lazy"` on below-the-fold images (never lazy-load the hero LCP image). Keep client-side JS minimal.
