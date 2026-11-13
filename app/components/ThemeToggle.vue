<script setup lang="ts">
import { nextTheme, type Theme } from "#shared/utils/theme";

function toggle() {
  const next = nextTheme(document.documentElement.dataset.theme as Theme);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be blocked; the theme still applies for this session.
  }
  document.documentElement.dataset.theme = next;
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    aria-label="Toggle color theme"
    @click="toggle"
  >
    <span class="icon-sun" aria-hidden="true">☀</span>
    <span class="icon-moon" aria-hidden="true">🌙</span>
  </button>
</template>
