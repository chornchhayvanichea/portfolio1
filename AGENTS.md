# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

Personal portfolio built with Nuxt 4 (`app/` directory structure, Nuxt 4.6+). Static pages live in `app/pages/` (`index.vue`, `about.vue`, `contact.vue`, `projects/[slug].vue`). Project write-ups are Nuxt Content pages (`content/projects/*.md`) rendered by `app/pages/projects/[slug].vue` via `queryCollection('projects')`. Site identity, contact links, and the canonical base URL live in `shared/site.config.ts`.

## Commands

- Package manager: **pnpm** (only pnpm is locked; README shows npm/yarn/bun options but they are not used).
- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` / `pnpm preview` / `pnpm generate` — production build / preview / static generation
- `pnpm test` — Vitest suite (`vitest run`) covering SEO helpers, sitemap generation, and theme utilities
- `npx nuxt prepare` — generates `.nuxt/` TypeScript references (must run before any `tsc` / typecheck).

There is no lint, typecheck, or CI setup; `pnpm generate` + `pnpm test` + inspecting the generated HTML in `.output/public/` is the verification path.

## Verify rendered output, not build success

`pnpm dev`/`pnpm build` can succeed while pages render the wrong thing (missing content, stale title, dead link). After touching pages, content, SEO, or config, regenerate and inspect the actual HTML:

```bash
pnpm generate
grep -o "<title>[^<]*" .output/public/index.html
grep -c 'rel="canonical"' .output/public/about/index.html
grep -ro '<a [^>]*href="https://example.com[^"]*"' .output/public --include="*.html"  # must be empty
```

## Quirks

- `tsconfig.json` is only references into generated configs in `.nuxt/` (`tsconfig.app.json` etc.). Run `pnpm install` (postinstall runs `nuxt prepare`) or `npx nuxt prepare` before any tsc-based check.
- `pnpm-workspace.yaml` sets `allowBuilds: esbuild: false` — esbuild's postinstall script is intentionally not run.
- `@nuxt/content` uses `experimental.sqliteConnector: "native"` (Node ≥22.5) to avoid `better-sqlite3` build scripts that pnpm 10 blocks.
- `.data/`, `.nuxt/`, `.output/` are generated/gitignored; `.data/content` and `.data/kv` hold Nuxt Content's local database.
- `pnpm generate` emits `.output/public/__nuxt_content/projects/sql_dump.txt`; static hosting must serve the `__nuxt_content/` tree or project pages fail to hydrate their content.
- `https://example.com` is a single placeholder URL in `shared/site.config.ts`. Swap that one value before deploying — canonical URLs, Open Graph URLs, and `sitemap.xml` all follow it. It must never appear in a UI `<a href>`.
- `master` holds the initial baseline commit; feature work happens on branches such as `feature/portfolio`. The repo is no longer empty — don't assume there is no history.

## Strict SEO & Performance Rules (Mandatory for All Pages & Components)

- **Semantic HTML:** Every page must render a single `<h1>`, logical `<h2>`/`<h3>` hierarchy, and semantic landmarks (`<main>`, `<article>`, `<nav>`, `<footer>`).
- **Metadata & Open Graph:** Every route and content page must define unique `<title>`, `<meta name="description">`, canonical URL, and Open Graph / Twitter Card tags via `useSeoMeta()` / `useHead()`.
- **Structured Data (JSON-LD):** Include valid Schema.org JSON-LD (`Person` on home page, `SoftwareSourceCode` or `CreativeWork` on project pages).
- **Crawlability:** Maintain valid `sitemap.xml` and `robots.txt` (via `@nuxtjs/seo` or Nuxt server routes) excluding draft/private routes.
- **Images & Core Web Vitals:** Use explicit `width` and `height`, modern formats (WebP/AVIF), descriptive `alt` text, and `loading="lazy"` on below-the-fold images (never lazy-load the hero LCP image). Keep client-side JS minimal.
