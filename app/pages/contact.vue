<script setup lang="ts">
import { site } from "#shared/site.config";

useHead(
  pageSeo({
    title: "Contact",
    description: `Contact ${site.name} — by email or GitHub. Based in Cambodia, open to remote opportunities.`,
    path: "/contact",
  }),
);
</script>

<template>
  <article class="prose-page">
    <h1>Contact</h1>

    <p>
      The best way to reach me is by email, or you can find my work on GitHub.
    </p>

    <div class="cta-row">
      <a class="button" :href="`mailto:${site.email}`">{{ site.email }}</a>
      <a
        class="button button--ghost"
        :href="site.github"
        target="_blank"
        rel="noopener noreferrer"
      >GitHub</a>
      <a v-if="site.resumeUrl" class="button button--ghost" :href="site.resumeUrl">CV</a>
    </div>

    <p>Based in Cambodia and open to remote opportunities.</p>
  </article>
</template>
