<script setup lang="ts">
import { site } from "#shared/site.config";
</script>

<template>
  <footer class="site-footer">
    <a :href="site.github" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a :href="`mailto:${site.email}`">Email</a>
    <a v-if="site.resumeUrl" :href="site.resumeUrl">CV</a>
  </footer>
</template>
