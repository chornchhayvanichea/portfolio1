<script setup lang="ts">
import { site } from "#shared/site.config";

useHead(
  pageSeo({
    title: "About",
    description: `About ${site.name} — junior full-stack developer interested in backend engineering, Go, Rust, and how software systems work internally.`,
    path: "/about",
  }),
);
</script>

<template>
  <article class="prose-page">
    <h1>About</h1>

    <!-- PROSE PLACEHOLDER: the owner expands this page with personal background and goals. -->

    <p>
      I'm {{ site.name }}, a junior full-stack software developer based in
      Cambodia. I'm open to remote work and use this site to document what I
      build and learn.
    </p>

    <h2>What I work with</h2>
    <p>
      On the backend I work with Go and the Chi router to build REST APIs, backed
      by PostgreSQL and SQL. On the frontend I work with TypeScript, JavaScript,
      Vue 3, and Nuxt 4. Docker and Docker Compose cover local orchestration, and
      Git fits into an Arch Linux + Neovim workflow.
    </p>

    <h2>What I'm interested in</h2>
    <ul>
      <li>Backend engineering — how APIs and services are designed and built</li>
      <li>Go and Rust</li>
      <li>How software systems work internally</li>
      <li>An Arch Linux + Neovim development workflow</li>
    </ul>

    <p>
      I'm early in my career, so the projects on this site are learning projects
      rather than commercial experience.
    </p>
  </article>
</template>
