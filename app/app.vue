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
