# Design: Personal Developer Portfolio (portfolio2)

Date: 2026-11-14
Status: Approved approach — Approach A, "Lean vanilla"
Owner: Chorn Chhayvanichea

## Intent and why

Build a personal developer portfolio in this repo (Nuxt 4 + Nuxt Content starter) that presents Chorn as a **junior full-stack software developer with a backend/systems orientation**, based in Cambodia, open to remote work. The site's job: when recruiters, hiring managers, or freelance clients land on the homepage, they should immediately see the top 2–3 projects, a clear tech stack, and an effortless contact path. A secondary audience is fellow developers.

The portfolio is itself a demonstration of skill: SEO-first, statically generated, performance-obsessed, hand-rolled rather than framework-heavy.

### Integrity rule (hard constraint)

**Never portray Chorn as an experienced professional, and never claim production experience, commercial clients, deployed projects, or real users unless explicitly confirmed.** The Laundry Management System and the portfolio itself are presented honestly (e.g., "built by me", not "used by X customers"). No skill percentage bars anywhere (also a design anti-goal).

## Site configuration — single source of truth

All identity/domain values live in `app/site.config.ts` (exact location may be adjusted by the builder, but there is exactly one such file):

```ts
export const site = {
  name: 'Chorn Chhayvanichea',
  email: 'chornchhayvanichea@gmail.com',
  github: 'https://github.com/chornchhayvanichea',
  url: 'https://example.com',          // PLACEHOLDER — swap once a domain is deployed
  jobTitle: 'Junior Full-Stack Software Developer',
  location: 'Cambodia · Open to remote',
  resumeUrl: null,                     // unset — CV link renders only when non-null
}
```

Every SEO-critical surface (canonical URLs, JSON-LD, sitemap, OG tags, footer) reads from this file. No domain is hard-coded anywhere else.

Decisions (builder-check round):
- **Profiles:** GitHub + email only — confirmed by the owner. `sameAs` contains only the GitHub URL; no LinkedIn or other profiles exist to include.
- **Deploy shape:** assume a root-domain deploy (no subpath). The SEO helper joins URLs robustly; if a subpath deploy ever happens, it is a one-config change (`site.url` + Nuxt `baseURL`).
- **Noindex while on the placeholder domain:** not needed — the placeholder domain is not deployed/crawlable; all URLs simply become correct when the owner swaps the single value.

## Positioning content

- **Role:** Junior Full-Stack Software Developer; genuine interest in backend engineering, Go, Rust, and how software systems work internally.
- **Displayed stack:** TypeScript, JavaScript, Vue 3, Nuxt 4, Go, Chi, REST APIs, PostgreSQL, SQL, Docker, Docker Compose, Arch Linux, Git, Neovim.
- **Primary project:** Laundry Management System — Go, Nuxt 4, PostgreSQL; manages laundromat operations, customers, orders, services, payments. Presented as a real full-stack engineering effort, without user/production claims.
- **Second project:** this portfolio (self-referential; the SEO/static-gen work is the showcase).
- Project links (repo URL, demo URL) and the CV are **placeholders** for now, clearly marked, filled in later by the owner. Any placeholder link renders as "coming soon" or is omitted rather than pointing at a dead URL.

## Pages

| Route | Type | Purpose |
|---|---|---|
| `/` | Vue component | Hero (positioning one-liner, CTAs), featured projects (1px-bordered cards), stack list |
| `/projects/<slug>` | MDC markdown via Nuxt Content | Project details; frontmatter-driven SEO + links |
| `/about` | Vue component | Story, how you work (Arch Linux, Neovim, Go/Rust/systems interests), honest positioning |
| `/contact` | Vue component | Email (mailto), GitHub, CV if configured |
| `/sitemap.xml` | Prerendered Nitro server route | See SEO section |

The homepage is **not** markdown. Project pages are markdown so the owner can add/edit projects without touching components.

## Architecture (Approach A, as decided)

- **New dependencies only:** `@nuxt/content` and `vitest` (+ `@nuxt/test-utils`/`@vue/test-utils` if needed for component tests). No UI framework, no CSS framework, no SEO module suite.
- **Styling:** hand-rolled design-token CSS in custom properties — typography scale, spacing scale, single accent color (builder picks the hue; one token, trivially swappable), 1px borders, light/dark theme variables under `:root` and `.dark`. System font stack (no webfont download) with tuned letter-spacing for the editorial look. Subtle CSS-only transitions only.
- **Dark/light:** defaults to `prefers-color-scheme`; manual toggle sets a `.dark`/`.light` class on `<html>` persisted in localStorage via a tiny inline head script (no flash of wrong theme). `color-scheme` property updated accordingly.
- **Global shell:** header (name, nav, theme toggle) and footer (GitHub, email, CV if configured) in `app/app.vue` around `<NuxtPage />`.
- **Content collections:** `content.config.ts` defines a `projects` collection sourcing `content/projects/*.md` with a frontmatter schema: `title`, `description`, `stack: string[]`, `featured: number`, optional `repo`/`demo` URLs. Starter files `content/index.md`, `content/about.md` are removed. Starter demo components `Counter.vue` (and `Alert.vue` unless the markdown uses it) are removed.
- **Prerequisite fixes first (from AGENTS.md):** install + register `@nuxt/content` in `nuxt.config.ts`; replace `<NuxtWelcome />` with `<NuxtPage />` in `app/app.vue`. These are step 1 of the plan.

## SEO (per AGENTS.md mandatory rules)

- **Per page:** unique `<title>` and `meta description`, canonical URL (from `site.url` + route path), Open Graph + Twitter Card tags — via Nuxt auto-imported `useSeoMeta`/`useHead`. OG images may be plain (no og-image generation service) until the owner adds assets.
- **JSON-LD:** `Person` schema on `/` (name, email, url, sameAs → GitHub, jobTitle, address country Cambodia — only truthful fields). `SoftwareSourceCode` on project pages built from frontmatter (`programmingLanguage`, `author`, `name`, `description`, optional `codeRepository`); never asserts deployment/users.
- **Sitemap:** prerendered `/sitemap.xml` server route that **dynamically reads all project slugs from `queryCollection('projects')`** plus the static routes `/`, `/about`, `/contact`; every URL uses the domain from `site.config.ts`. Exact server-side query API for Content v3 is a plan/verification item (builder confirms against current Nuxt Content v3 docs).
- **robots.txt:** served as a prerendered Nitro route (`server/routes/robots.txt.ts`) that reads `site.config.ts` and emits `Sitemap: <site.url>/sitemap.xml` — a static `public/robots.txt` cannot read the config without hard-coding the domain, so the route approach is the decision (replaces the starter `public/robots.txt`).
- **Prerender/static:** deployment target is `pnpm generate`. Nitro prerender must cover all routes **and the Nuxt Content static-hosting requirements** (content database/DB dump endpoints per Content v3 docs — verification item). Every page must render correct content from the static HTML alone.
- **Images:** explicit width/height, descriptive alt, `loading="lazy"` below the fold, never lazy-loading the LCP hero. Modern formats when the owner supplies assets.

## Testing

- **Vitest** as the test runner, wired to `package.json` (`"test": "vitest run"`), set up **early** in the plan (per AGENTS.md TDD workflow).
- Unit tests target: `site.config.ts` integrity; SEO helper/builder functions; frontmatter schema validation; sitemap route output (slug list, domain, static routes, XML shape); theme toggle script behavior where testable.
- No end-to-end suite is required; static HTML spot-checks (`curl` on the generated output) cover rendering.

## Goals

1. Honest, credible junior-developer portfolio with working content pipeline.
2. SEO rules from AGENTS.md fully implemented and verifiable in the source.
3. Near-perfect Core Web Vitals on `pnpm generate` output.
4. Owner can add/edit project pages by editing markdown only.

## Non-goals

- No CMS, no admin UI, no comments, no analytics (owner may add later).
- No Tailwind/UnoCSS/UI component libraries.
- No blog section (not requested; projects only).
- No OG-image generation service.

## Anti-goals (what would make this a failure)

- Any claim of production/commercial experience or users (violates the integrity rule).
- Skill percentage bars, 3D effects, or animation libraries.
- A content pipeline that builds green but serves the Nuxt welcome page (the AGENTS.md silent-failure trap).
- SEO metadata that lies or overstates (e.g., claiming awards, clients).

## Approaches considered

- **A — Lean vanilla (chosen):** hand-rolled CSS + hand-rolled SEO on Nuxt Content. Trades extra plumbing code for zero client bloat, full control, and verifiable SEO in-source.
- **B — Batteries-included:** Tailwind + `@nuxtjs/seo`. Faster styling, battle-tested tooling, but heavier deps, larger CSS, and Tailwind isn't in the owner's stack.
- **C — Markdown-first everything:** homepage from markdown; awkward for the card/grid layout; rejected. The catch-all pattern survives only as the projects detail route.

## Content copy policy (owner supplies prose later)

Per the owner's instruction, structure ships first with honest, minimal copy written from the facts gathered in this document, and clearly-marked placeholders where the owner will add detail later:

- Project links (repo/demo), screenshots, CV PDF, headshot, and any deployment claims: placeholders or omitted (see per-page rules above).
- Hero one-liner and About-page narrative: short honest copy derived from the positioning facts (junior, backend-oriented, Cambodia, remote-open, stack, interests); the owner can edit prose in one place per page.
- Nothing may be invented beyond these confirmed facts (integrity rule).

## Left to the builder

- Accent color hue (single token), exact type scale, and other visual micro-decisions consistent with the editorial minimalism described.
- Exact server-side Content v3 query API and static-hosting prerender setup (verify against current docs, and prove it by inspecting generated output).
- File naming/organization details within `app/` consistent with Nuxt 4 conventions.
- Test granularity details within the constraints above.

## Builder-check decisions log (owner should skim these)

- robots.txt implemented as a prerendered Nitro route reading `site.config.ts` (not a static file) — the only way to keep the domain un-hard-coded; see SEO section.
- Root-domain deploy assumed; URL-joining centralized in the SEO helper.
- No `noindex` while the placeholder domain is unpublished (not crawlable).
- GitHub + email are the only profile links (owner-confirmed).
- No `og:image` shipped until the owner supplies assets; default Nuxt favicon stays until replaced.
