<script setup lang="ts">
import { site } from "#shared/site.config";

const { data: projects } = await useAsyncData("home-projects", () =>
  queryCollection("projects").order("featured", "ASC").all(),
);

const stack = [
  "Go",
  "Chi",
  "REST APIs",
  "PostgreSQL",
  "SQL",
  "TypeScript",
  "JavaScript",
  "Vue 3",
  "Nuxt 4",
  "Docker",
  "Docker Compose",
  "Git",
  "Neovim",
  "Arch Linux",
];

useHead({
  ...pageSeo({
    title: `${site.name} — ${site.jobTitle}`,
    description: `Portfolio of ${site.name} — junior full-stack software developer in Cambodia, focused on Go, Vue 3, Nuxt 4, and PostgreSQL. Open to remote work.`,
    path: "/",
    ogType: "website",
    suffix: false,
  }),
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(personJsonLd()),
    },
  ],
});
</script>

<template>
  <div class="home">
    <section class="hero" aria-labelledby="home-title">
      <h1 id="home-title">{{ site.name }}</h1>
      <p class="hero__subtitle">{{ site.jobTitle }}</p>
      <p class="hero__location">{{ site.location }}</p>
      <div class="cta-row">
        <a class="button" :href="`mailto:${site.email}`">Email me</a>
        <a
          class="button button--ghost"
          :href="site.github"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
      </div>
    </section>

    <section id="projects" aria-labelledby="projects-title">
      <h2 id="projects-title">Projects</h2>
      <div v-if="projects?.length" class="project-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.path"
          :path="project.path"
          :title="project.title"
          :description="project.description"
          :stack="project.stack"
          :repo="project.repo"
          :demo="project.demo"
        />
      </div>
    </section>

    <section class="stack" aria-labelledby="stack-title">
      <h2 id="stack-title">Stack</h2>
      <ul class="tag-list">
        <li v-for="tech in stack" :key="tech" class="tag">{{ tech }}</li>
      </ul>
    </section>
  </div>
</template>
