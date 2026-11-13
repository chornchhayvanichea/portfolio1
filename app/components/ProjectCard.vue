<script setup lang="ts">
defineProps<{
  path: string;
  title: string;
  description: string;
  stack: string[];
  repo?: string;
  demo?: string;
}>();
</script>

<template>
  <article class="card project-card">
    <h3 class="project-card__title">
      <NuxtLink :to="path">{{ title }}</NuxtLink>
    </h3>
    <p class="project-card__description">{{ description }}</p>
    <ul v-if="stack.length" class="tag-list" aria-label="Technologies used">
      <li v-for="tech in stack" :key="tech" class="tag">{{ tech }}</li>
    </ul>
    <div v-if="repo || demo" class="project-card__links">
      <a
        v-if="repo"
        :href="repo"
        target="_blank"
        rel="noopener noreferrer"
      >Repository</a>
      <a
        v-if="demo"
        :href="demo"
        target="_blank"
        rel="noopener noreferrer"
      >Live demo</a>
    </div>
  </article>
</template>
