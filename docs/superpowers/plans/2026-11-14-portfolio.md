# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the honest, SEO-first, statically generated personal portfolio for Chorn Chhayvanichea on the Nuxt 4 + Nuxt Content base.

**Architecture:** Vue pages for Home/About/Contact, MDC markdown for project pages via a `projects` collection, hand-rolled design-token CSS, hand-rolled SEO (helpers in `shared/utils` consumed by pages and two prerendered Nitro routes for `/sitemap.xml` and `/robots.txt`). Pure logic lives in `shared/` so Vitest can test it without Nuxt runtime.

**Tech Stack:** Nuxt 4.6, Nuxt Content v3 (`sqliteConnector: 'native'`), Vitest, vanilla CSS. No UI/CSS frameworks, no SEO module suite.

**Spec:** `docs/superpowers/specs/2026-11-14-portfolio-design.md` (read it first; it carries the integrity rule and copy policy).

## Global Constraints

- **Integrity rule (hard):** Never claim production experience, commercial clients, deployed projects, or real users. No skill percentage bars.
- **New dependencies only:** `@nuxt/content`, `vitest`. Nothing else (no Tailwind, no @nuxtjs/seo, no UI libs).
- **Single source of truth:** all identity values in `shared/site.config.ts` exactly as pinned in Task 2. No other file hard-codes the domain, name, email, or GitHub URL.
- **Placeholder policy:** project links/screenshots/CV/OG image are placeholders or omitted (`resumeUrl: null` renders no CV link). UI links must NEVER point at `https://example.com` — that domain appears only in SEO meta/sitemap (it is the placeholder canonical base by design).
- **Styling:** system font stack (no webfonts), 1px card borders, ONE accent token, subtle CSS-only transitions only, dark/light via `data-theme` attribute. No animation libraries, no 3D.
- **SEO per page (AGENTS.md):** unique title + meta description + canonical + OG + Twitter tags on every route; JSON-LD `Person` on `/`, `SoftwareSourceCode` on project pages.
- **Deployment:** `pnpm generate`; every page must render correct content from static HTML alone.
- **Node requirement:** ≥22.5 (env has v26) — required for the native SQLite connector.
- **Commits:** conventional commits (`feat:`, `test:`, `chore:`), one commit per task.

## Review Focus

The failure modes below are not covered by any single task's unit tests; each line names the condition, the expected behavior, and the task whose check pins it.

1. **Silent content failure** — build succeeds but a route serves the Nuxt welcome page or empty shell (the AGENTS.md trap). Expect: every route's generated HTML contains its own title/content. Pinned by Task 1 (dev-server curl) and Task 8 (final HTML sweep over all routes).
2. **Dead/placeholder UI links** — footer, contact, or project cards linking to `example.com` or dead URLs. Expect: UI links point only at real internal routes, `mailto:`, `github.com/chornchhayvanichea`, or render nothing when unconfigured. Pinned by Task 8 grep of generated HTML.
3. **Wrong sitemap** — sitemap missing dynamic project slugs, using a hard-coded domain, or robots.txt lacking the Sitemap line. Expect: all 5 URLs (3 static + 2 projects) with `site.url` base. Pinned by Task 7 (generated sitemap/robots inspected).
4. **Theme flash (FOUC)** — dark-mode users see a white flash because the init script renders late or reads the wrong key. Expect: inline script in `<head>` of SSR HTML setting `data-theme` before body paint. Pinned by Task 4 (curl HTML head inspection).
5. **SQLite connector failure after install** — pnpm 10 blocks native build scripts; better-sqlite3 bindings missing. Expect: dev server boots cleanly with `sqliteConnector: 'native'`. Pinned by Task 1 (dev boot check).

---

### Task 1: Repair the content pipeline

**Files:**

- Modify: `package.json` (via `pnpm add`), `nuxt.config.ts`, `content.config.ts`, `app/app.vue`
- Create: `app/pages/projects/[slug].vue`, `content/projects/laundry-management-system.md`, `content/projects/portfolio-site.md`, `server/tsconfig.json`
- Delete: `app/pages/[...slug].vue`, `content/index.md`, `content/about.md`, `app/components/Counter.vue`, `app/components/Alert.vue`

**Interfaces:**

- Consumes: nothing.
- Produces: `projects` collection (source `content/projects/*.md`, `type: 'page'`); pages at `/projects/<slug>`; frontmatter fields `title`, `description` (built-in), `stack`, `featured`, `repo?`, `demo?`. `app/app.vue` renders `<NuxtPage />`.

- [ ] **Step 1: Install and register Nuxt Content**

```bash
pnpm add @nuxt/content
```

In `nuxt.config.ts` (keep existing `compatibilityDate`, `devtools`):

```ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  content: {
    experimental: { sqliteConnector: "native" }, // Node ≥22.5; avoids better-sqlite3 build scripts blocked by pnpm 10
  },
});
```

- [ ] **Step 2: Replace `content.config.ts` with the projects collection**

```ts
import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/*.md",
      schema: z.object({
        stack: z.array(z.string()).default([]),
        featured: z.number().default(99),
        repo: z.string().optional(),
        demo: z.string().optional(),
      }),
    }),
  },
});
```

- [ ] **Step 3: Write the two project markdown files**

`content/projects/laundry-management-system.md`:

```md
---
title: Laundry Management System
description: A full-stack application for managing laundromat operations — customers, orders, services, and payments — built with Go, Chi, Nuxt 4, and PostgreSQL.
stack: [Go, Chi, Nuxt 4, Vue 3, TypeScript, PostgreSQL, Docker]
featured: 1
---

<!-- PROSE PLACEHOLDER: owner expands this body later. Keep claims minimal (integrity rule). -->

## What it does

A full-stack application covering the core operations of a laundromat: customer records,
orders, services offered, and payments.

## How it is built

- Go backend with the Chi router exposing a REST API
- Nuxt 4 + Vue 3 frontend in TypeScript
- PostgreSQL for persistence
- Docker Compose for local orchestration
```

`content/projects/portfolio-site.md`:

```md
---
title: This Portfolio
description: The site you are reading — a statically generated Nuxt 4 portfolio with hand-rolled SEO, prerendered sitemap/robots routes, design tokens, and no client-side UI framework.
stack: [Nuxt 4, Vue 3, TypeScript, Nitro, Vitest]
featured: 2
---

<!-- PROSE PLACEHOLDER: owner expands this body later. -->

## How it is built

- Nuxt 4 statically generated with `pnpm generate`
- Hand-rolled SEO: per-page meta, JSON-LD, prerendered sitemap and robots routes
- Design tokens in plain CSS custom properties, dark/light theme without a color-mode library
```

- [ ] **Step 4: Create `server/tsconfig.json`** (per Content v3 server-usage docs)

```json
{ "extends": "../.nuxt/tsconfig.server.json" }
```

- [ ] **Step 5: Create `app/pages/projects/[slug].vue` and delete the catch-all**

Replace the existing `app/pages/[...slug].vue` with `app/pages/projects/[slug].vue`:

```vue
<script setup lang="ts">
const route = useRoute();

const { data: project } = await useAsyncData("project-" + route.path, () =>
  queryCollection("projects").path(route.path).first(),
);

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
    fatal: true,
  });
}

useSeoMeta({
  title: project.value.title,
  description: project.value.description,
});
</script>

<template>
  <article class="project-page">
    <h1>{{ project!.title }}</h1>
    <ContentRenderer v-if="project" :value="project" />
  </article>
</template>
```

(Upgraded SEO with canonical/OG/JSON-LD arrives in Task 6; this is the minimal wiring that proves the pipeline.)

Also delete: `content/index.md`, `content/about.md`, `app/components/Counter.vue`, `app/components/Alert.vue`.

- [ ] **Step 6: Fix `app/app.vue`** — replace `<NuxtWelcome />` with `<NuxtPage />` (keep `<NuxtRouteAnnouncer />`):

```vue
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
```

- [ ] **Step 7: Verify the pipeline serves content (do not trust the build)**

```bash
pnpm dev &   # then:
curl -s http://localhost:3000/projects/laundry-management-system | grep -o "Laundry Management System"
curl -s http://localhost:3000/projects/portfolio-site | grep -o "How it is built"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # expect 404 (no homepage yet)
```

Expected: both greps match; dev boot shows no SQLite binding error. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: repair content pipeline with projects collection and project pages"
```

---

### Task 2: Vitest + site config + SEO helpers (TDD)

**Files:**

- Create: `vitest.config.ts`, `shared/site.config.ts`, `shared/utils/seo.ts`, `test/seo.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces (auto-imported in app via `shared/utils/`, imported explicitly elsewhere):
  - `site` — the config object pinned below (from `#shared/site.config`)
  - `buildUrl(path: string): string` — `site.url` + path, no double slashes, always leading `/`
  - `pageSeo(input: { title: string; description: string; path: string; ogType?: 'website' | 'article'; suffix?: boolean }): { title: string; meta: Array<{ name?: string; property?: string; content: string }>; link: Array<{ rel: string; href: string }> }` — `suffix` (default `true`) controls appending ` — ${site.name}` to the title
  - `personJsonLd(): Record<string, unknown>`
  - `softwareJsonLd(p: { name: string; description: string; programmingLanguage: string[]; codeRepository?: string }): Record<string, unknown>`

- [ ] **Step 1: Install Vitest**

```bash
pnpm add -D vitest
```

`vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "#shared": fileURLToPath(new URL("./shared", import.meta.url)) },
  },
  test: { environment: "node" },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test**

`test/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { site } from "#shared/site.config";
import {
  buildUrl,
  pageSeo,
  personJsonLd,
  softwareJsonLd,
} from "#shared/utils/seo";

describe("site.config", () => {
  it("holds the pinned identity values", () => {
    expect(site.name).toBe("Chorn Chhayvanichea");
    expect(site.email).toBe("chornchhayvanichea@gmail.com");
    expect(site.github).toBe("https://github.com/chornchhayvanichea");
    expect(site.url).toBe("https://example.com"); // placeholder until a domain is deployed
    expect(site.jobTitle).toBe("Junior Full-Stack Software Developer");
    expect(site.location).toBe("Cambodia · Open to remote");
    expect(site.resumeUrl).toBeNull();
  });
});

describe("buildUrl", () => {
  it("joins the configured domain with the path", () => {
    expect(buildUrl("/")).toBe("https://example.com/");
    expect(buildUrl("/projects/laundry-management-system")).toBe(
      "https://example.com/projects/laundry-management-system",
    );
  });
});

describe("pageSeo", () => {
  const seo = pageSeo({
    title: "About",
    description: "About Chorn",
    path: "/about",
  });

  it("builds a unique title, description, canonical, and OG/Twitter tags", () => {
    expect(seo.title).toBe("About — Chorn Chhayvanichea");
    expect(seo.meta).toContainEqual({
      name: "description",
      content: "About Chorn",
    });
    expect(seo.link).toContainEqual({
      rel: "canonical",
      href: "https://example.com/about",
    });
    expect(seo.meta).toContainEqual({
      property: "og:title",
      content: "About — Chorn Chhayvanichea",
    });
    expect(seo.meta).toContainEqual({
      property: "og:type",
      content: "website",
    });
    expect(seo.meta).toContainEqual({
      property: "og:url",
      content: "https://example.com/about",
    });
    expect(seo.meta).toContainEqual({
      name: "twitter:card",
      content: "summary",
    });
  });

  it("honors ogType override", () => {
    expect(
      pageSeo({ title: "X", description: "Y", path: "/p", ogType: "article" })
        .meta,
    ).toContainEqual({ property: "og:type", content: "article" });
  });
});

describe("personJsonLd", () => {
  it("contains only truthful, configured fields", () => {
    expect(personJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Chorn Chhayvanichea",
      email: "mailto:chornchhayvanichea@gmail.com",
      url: "https://example.com/",
      jobTitle: "Junior Full-Stack Software Developer",
      address: { "@type": "PostalAddress", addressCountry: "KH" },
      sameAs: ["https://github.com/chornchhayvanichea"],
    });
  });
});

describe("softwareJsonLd", () => {
  it("builds SoftwareSourceCode with author, omitting codeRepository when unset", () => {
    const ld = softwareJsonLd({
      name: "P",
      description: "D",
      programmingLanguage: ["Go"],
    });
    expect(ld["@type"]).toBe("SoftwareSourceCode");
    expect(ld.author).toEqual({
      "@type": "Person",
      name: site.name,
      url: "https://example.com/",
    });
    expect(ld).not.toHaveProperty("codeRepository");
    const withRepo = softwareJsonLd({
      name: "P",
      description: "D",
      programmingLanguage: ["Go"],
      codeRepository: "https://github.com/x/y",
    });
    expect(withRepo.codeRepository).toBe("https://github.com/x/y");
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test`
Expected: FAIL — cannot resolve `#shared/site.config`.

- [ ] **Step 4: Implement `shared/site.config.ts` and `shared/utils/seo.ts`**

`shared/site.config.ts`:

```ts
export const site = {
  name: "Chorn Chhayvanichea",
  email: "chornchhayvanichea@gmail.com",
  github: "https://github.com/chornchhayvanichea",
  url: "https://example.com", // PLACEHOLDER — swap this single value once a domain is deployed
  jobTitle: "Junior Full-Stack Software Developer",
  location: "Cambodia · Open to remote",
  resumeUrl: null as string | null, // CV link renders only when set
};
```

`shared/utils/seo.ts`: implement the signatures above. Decisions the tests leave open: `pageSeo` composes `title` as `` `${title} — ${site.name}` ``; meta includes `og:title`, `og:description`, `og:type` (default `'website'`), `og:url`, `twitter:title`, `twitter:description`, `twitter:card: 'summary'`; no `og:image` (owner supplies assets later); `personJsonLd`/`softwareJsonLd` shapes are exactly as asserted.

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test`
Expected: PASS (all).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add site config and SEO helper utilities with tests"
```

---

### Task 3: Sitemap/robots helpers + Nitro routes (TDD)

**Files:**

- Create: `shared/utils/sitemap.ts`, `test/sitemap.test.ts`, `server/routes/sitemap.xml.ts`, `server/routes/robots.txt.ts`

**Interfaces:**

- Consumes: `site`, `buildUrl` (Task 2, imported relatively from server routes: `../../shared/utils/sitemap`), `queryCollection(event, 'projects')` (server auto-import from Content module).
- Produces:
  - `buildSitemapXml(locs: string[]): string` — full `<?xml …><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">…` document, one `<url><loc>` per entry
  - `buildRobotsTxt(sitemapUrl: string): string` — `User-agent: *\nAllow: /\n\nSitemap: <sitemapUrl>\n`
  - Prerenderable routes `/sitemap.xml` and `/robots.txt` (wired into `nitro.prerender` in Task 7)

- [ ] **Step 1: Write the failing test** — `test/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildRobotsTxt, buildSitemapXml } from "#shared/utils/sitemap";

describe("buildSitemapXml", () => {
  it("emits one loc per URL inside a valid urlset", () => {
    const xml = buildSitemapXml([
      "https://example.com/",
      "https://example.com/projects/x",
    ]);
    expect(xml).toContain("<?xml");
    expect(xml).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );
    expect(xml).toContain("<loc>https://example.com/</loc>");
    expect(xml).toContain("<loc>https://example.com/projects/x</loc>");
    expect(xml).toContain("</urlset>");
  });
});

describe("buildRobotsTxt", () => {
  it("references the sitemap cleanly", () => {
    expect(buildRobotsTxt("https://example.com/sitemap.xml")).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n",
    );
  });
});
```

- [ ] **Step 2: Run to verify failure** — `pnpm test` → FAIL (module not found).

- [ ] **Step 3: Implement `shared/utils/sitemap.ts`** — signatures above; XML is plain string building (no library).

- [ ] **Step 4: Create the two server routes**

`server/routes/sitemap.xml.ts` — dynamically reads project slugs from the collection:

```ts
import { buildSitemapXml } from "../../shared/utils/sitemap";
import { buildUrl } from "../../shared/utils/seo";

const staticPaths = ["/", "/about", "/contact"];

export default eventHandler(async (event) => {
  const projects = await queryCollection(event, "projects")
    .select("path")
    .all();
  const locs = [...staticPaths, ...projects.map((p) => p.path)].map(buildUrl);
  setHeader(event, "content-type", "application/xml");
  return buildSitemapXml(locs);
});
```

`server/routes/robots.txt.ts`:

```ts
import { buildRobotsTxt } from "../../shared/utils/sitemap";
import { buildUrl } from "../../shared/utils/seo";

export default eventHandler((event) => {
  setHeader(event, "content-type", "text/plain");
  return buildRobotsTxt(buildUrl("/sitemap.xml"));
});
```

- [ ] **Step 5: Run tests and verify routes in dev**

Run: `pnpm test` → PASS.
Then `pnpm dev &` and:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"   # expect 5 (3 static + 2 projects)
curl -s http://localhost:3000/robots.txt                       # expect Sitemap line with site.url
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: prerenderable sitemap and robots routes driven by content collection"
```

---

### Task 4: Design tokens, theme toggle, and global shell

**Files:**

- Create: `app/assets/css/main.css`, `shared/utils/theme.ts`, `test/theme.test.ts`, `app/components/ThemeToggle.vue`, `app/components/SiteHeader.vue`, `app/components/SiteFooter.vue`
- Modify: `nuxt.config.ts` (css entry), `app/app.vue` (shell)

**Interfaces:**

- Consumes: `site`, `resumeUrl` semantics (Task 2).
- Produces:
  - `type Theme = 'light' | 'dark'`; `resolveTheme(stored: string | null, system: Theme): Theme`; `nextTheme(current: Theme): Theme`; `themeInitScript: string` (inline head script: reads `localStorage['theme']`, falls back to `prefers-color-scheme`, sets `document.documentElement.dataset.theme`)
  - CSS tokens (single accent): light `--bg:#fafafa --fg:#111827 --muted:#6b7280 --border-color:#d1d5db --accent:#2563eb --accent-fg:#ffffff`; dark under `html[data-theme='dark']`: `--bg:#0a0a0a --fg:#f1f5f9 --muted:#94a3b8 --border-color:#27272a --accent:#60a5fa --accent-fg:#0a0a0a`; plus `--font-sans` (system stack), `--font-mono` (system mono stack), `--max-w:44rem`, spacing scale, `.card { border: 1px solid var(--border-color) }`, `body { color-scheme }` handled via `html { color-scheme: light }` / `dark`, subtle `transition: color .15s, background-color .15s` on themed elements only
- Global shell: `<SiteHeader />` / `<main><NuxtPage /></main>` / `<SiteFooter />`

- [ ] **Step 1: Write the failing theme test** — `test/theme.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { nextTheme, resolveTheme, themeInitScript } from "#shared/utils/theme";

describe("resolveTheme", () => {
  it("prefers a valid stored value, otherwise the system preference", () => {
    expect(resolveTheme("dark", "light")).toBe("dark");
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme(null, "dark")).toBe("dark");
    expect(resolveTheme("bogus", "light")).toBe("light");
  });
});

describe("nextTheme", () => {
  it("toggles", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});

describe("themeInitScript", () => {
  it("reads the same storage key and sets data-theme inline", () => {
    expect(themeInitScript).toContain("localStorage.getItem('theme')");
    expect(themeInitScript).toContain("dataset.theme");
    expect(themeInitScript).toContain("prefers-color-scheme");
  });
});
```

- [ ] **Step 2: Run to verify failure** — `pnpm test` → FAIL.

- [ ] **Step 3: Implement `shared/utils/theme.ts`** — signatures above; `themeInitScript` is a self-contained IIFE string (also writes nothing to storage — only the explicit toggle persists).

- [ ] **Step 4: Run to verify pass** — `pnpm test` → PASS.

- [ ] **Step 5: Write `app/assets/css/main.css`** — tokens exactly as pinned above, base typography (`h1` crisp large, `h2`/`h3` hierarchy), body max-width `var(--max-w)` centered, link/button styles using `--accent`, `.card` class, focus-visible outlines. Register in `nuxt.config.ts`: `css: ['~/assets/css/main.css']`.

- [ ] **Step 6: Create the components**

`ThemeToggle.vue`: `<button>` with `aria-label="Toggle color theme"`, short label (`☀` / `🌙` text is acceptable); click handler uses `nextTheme(document.documentElement.dataset.theme as Theme)`, persists to `localStorage['theme']`, updates `dataset.theme`. `SiteHeader.vue`: name → `/`, nav links `/` (Projects), `/about`, `/contact`, `<ThemeToggle />`. `SiteFooter.vue`: GitHub link (`site.github`), `mailto:site.email`, CV link only if `site.resumeUrl` (must render nothing while null).

- [ ] **Step 7: Build the shell in `app/app.vue`**

```vue
<script setup lang="ts">
import { themeInitScript } from "#shared/utils/theme";

useHead({
  htmlAttrs: { lang: "en" },
  script: [{ innerHTML: themeInitScript }],
});
</script>

<template>
  <div class="site">
    <SiteHeader />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>
```

- [ ] **Step 8: Verify theme renders without flash and shell shows**

```bash
pnpm dev &
curl -s http://localhost:3000/projects/laundry-management-system | grep -o "localStorage.getItem('theme')"
curl -s http://localhost:3000/projects/laundry-management-system | grep -o "Toggle color theme"
curl -s http://localhost:3000/projects/laundry-management-system | grep -o 'href="/about"'
```

Expected: the init-script string appears in the SSR HTML head; the toggle button (aria-label `Toggle color theme`) and nav link to `/about` render. Visual check in browser: toggle flips colors with no flash. Stop server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: design tokens, dark/light theme, global header/footer shell"
```

---

### Task 5: Homepage

**Files:**

- Create: `app/pages/index.vue`, `app/components/ProjectCard.vue`

**Interfaces:**

- Consumes: `site` (Task 2), `pageSeo`/`personJsonLd` (Task 2), `queryCollection('projects')`, CSS tokens (Task 4), shell (Task 4).
- Produces: `/` with hero, `#projects` section, stack section; `ProjectCard` props: `{ path: string; title: string; description: string; stack: string[]; repo?: string; demo?: string }`.

- [ ] **Step 1: Implement `app/pages/index.vue`**

Pinned copy (exact strings):

- `<title>` via `pageSeo({ title: 'Chorn Chhayvanichea — Junior Full-Stack Software Developer', suffix: false, ogType: 'website', path: '/', description: … })` so the final `<title>` is exactly `Chorn Chhayvanichea — Junior Full-Stack Software Developer` with no duplicated suffix. Description:
  `"Portfolio of Chorn Chhayvanichea — junior full-stack software developer in Cambodia, focused on Go, Vue 3, Nuxt 4, and PostgreSQL. Open to remote work."`
- Hero (single `<h1>` = site name): subtitle `site.jobTitle`, muted line `site.location`; CTA row: `mailto:` email button and GitHub link button (both real, no `example.com` links).
- Projects section `<h2>`: `queryCollection('projects').order('featured', 'ASC').all()` → `<ProjectCard>` per project, wrapped in `<NuxtLink :to="p.path">` title.
- Stack section `<h2>`: plain list of the spec's stack: `Go, Chi, REST APIs, PostgreSQL, SQL, TypeScript, JavaScript, Vue 3, Nuxt 4, Docker, Docker Compose, Git, Neovim, Arch Linux` (render as inline tags/badges — text only, no progress bars).
- Person JSON-LD via `useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(personJsonLd()) }] })`.

`ProjectCard.vue`: `.card` element — title (link to `path`), description, stack badges, and link rows only when `repo`/`demo` are set (omitted otherwise — placeholders render nothing, never dead links).

- [ ] **Step 2: Verify in dev**

```bash
pnpm dev &
curl -s http://localhost:3000/ | grep -o "<h1[^>]*>[^<]*"        # h1 = Chorn Chhayvanichea (single h1)
curl -s http://localhost:3000/ | grep -o "Laundry Management System"
curl -s http://localhost:3000/ | grep -o "application/ld+json"
```

Expected: single h1, project card rendered, JSON-LD present; no UI anchor links to the placeholder domain (`curl -s http://localhost:3000/ | grep -o '<a [^>]*href="https://example.com'` → no matches; `<link rel="canonical">` in the head is expected and fine).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: homepage with hero, featured projects, stack, and Person JSON-LD"
```

---

### Task 6: About, Contact, and project-page SEO upgrade

**Files:**

- Create: `app/pages/about.vue`, `app/pages/contact.vue`
- Modify: `app/pages/projects/[slug].vue`

**Interfaces:**

- Consumes: `pageSeo`, `softwareJsonLd`, `site` (Task 2); frontmatter fields (Task 1).

- [ ] **Step 1: Implement `app/pages/about.vue`**

- `pageSeo({ title: 'About', description: "About Chorn Chhayvanichea — junior full-stack developer interested in backend engineering, Go, Rust, and how software systems work internally.", path: '/about' })`
- Semantic `<article>` with single `<h1>` "About". Honest copy from spec facts only: junior full-stack developer, Cambodia, open to remote, stack overview, interests (backend engineering, Go, Rust, systems internals, Arch Linux + Neovim workflow). No invented history. `<!-- PROSE PLACEHOLDER -->` comment marks where the owner expands.

- [ ] **Step 2: Implement `app/pages/contact.vue`**

- `pageSeo({ title: 'Contact', description: "Contact Chorn Chhayvanichea — by email or GitHub. Based in Cambodia, open to remote opportunities.", path: '/contact' })`
- Content: prominent `mailto:` link, GitHub profile link, CV link only if `site.resumeUrl`. No forms (static site).

- [ ] **Step 3: Upgrade `app/pages/projects/[slug].vue` SEO**

Replace the Task-1 `useSeoMeta` block with:

```ts
useHead(
  pageSeo({
    title: project.value.title,
    description: project.value.description,
    path: route.path,
  }),
);
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(
        softwareJsonLd({
          name: project.value.title,
          description: project.value.description,
          programmingLanguage: project.value.stack,
          codeRepository: project.value.repo,
        }),
      ),
    },
  ],
});
```

(`pageSeo`/`softwareJsonLd` are auto-imported from `shared/utils/` in app context.)

- [ ] **Step 4: Verify in dev**

```bash
pnpm dev &
curl -s http://localhost:3000/about | grep -o 'rel="canonical" href="https://example.com/about"'
curl -s http://localhost:3000/contact | grep -o 'Contact — Chorn Chhayvanichea'
curl -s http://localhost:3000/projects/laundry-management-system | grep -o "SoftwareSourceCode"
```

Expected: all three match. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: about and contact pages, full SEO + JSON-LD on project pages"
```

---

### Task 7: Static generation wiring

**Files:**

- Modify: `nuxt.config.ts`, delete `public/robots.txt` (the route replaces it)

- [ ] **Step 1: Configure prerendering** in `nuxt.config.ts`:

```ts
nitro: {
  prerender: {
    crawlLinks: true,
    routes: ['/sitemap.xml', '/robots.txt'],
  },
},
```

- [ ] **Step 2: Delete `public/robots.txt`** (static file would shadow/conflict with the prerendered route).

- [ ] **Step 3: Generate and verify the SEO artifacts**

```bash
pnpm generate
grep -o "<loc>[^<]*</loc>" .output/public/sitemap.xml    # expect 5 URLs: /, /about, /contact, both /projects/* — dynamic slugs, example.com base
cat .output/public/robots.txt                            # expect Sitemap line
ls .output/public | grep -i "nuxt_content\|content"      # content DB dump artifacts present (client-side WASM queries need them)
```

If the last check finds no content dump files, consult the Nuxt Content v3 static-hosting docs and add the required prerender entries, then regenerate.

- [ ] **Step 4: Spot-check generated HTML serves real content**

```bash
grep -o "<h1[^>]*>[^<]*" .output/public/index.html
grep -o "Laundry Management System" .output/public/projects/laundry-management-system/index.html
grep -o "SoftwareSourceCode" .output/public/projects/laundry-management-system/index.html
```

Expected: homepage h1, project content, and JSON-LD all baked into static files.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: prerender sitemap and robots for static deployment"
```

---

### Task 8: Final verification sweep + AGENTS.md refresh

**Files:**

- Modify: `AGENTS.md`

- [ ] **Step 1: Full static sweep** — regenerate and check every route end-to-end:

```bash
pnpm generate
for r in "" about contact projects/laundry-management-system projects/portfolio-site; do
  f=".output/public/$r/index.html"; [ "$r" = "" ] && f=".output/public/index.html"
  grep -o "<title>[^<]*" "$f"
  grep -c 'rel="canonical"' "$f"
done
```

Expected: 5 unique titles (none is "Welcome to Nuxt!"), canonical on every page. Then:

```bash
grep -ro '<a [^>]*href="https://example.com[^"]*"' .output/public --include="*.html"   # expect NO matches — placeholder domain only in <link> meta/sitemap, never in UI anchors
grep -o "Welcome to Nuxt" .output/public/index.html || echo "clean"                      # expect clean
pnpm test                                                                                # expect all PASS
```

Also confirm: single `<h1>` per page; no skill-percentage bars anywhere; footer/contact links resolve to real destinations only.

- [ ] **Step 2: Update `AGENTS.md`** — it now contains stale guidance:
  - Remove/replace the "Known gaps in the content setup" section (pipeline is fixed) — keep the spirit as a one-line warning: verify actual HTML output, not build success.
  - Update Commands: add `pnpm test` (Vitest); correct "master has no commits" line; remove the `@nuxt/content`-missing warning.
  - Keep all other sections intact.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: refresh AGENTS.md after portfolio implementation"
```
