<script setup lang="ts">
import { site } from "#shared/site.config";
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand">{{ site.name }}</NuxtLink>
    <nav class="site-nav" aria-label="Primary">
      <NuxtLink to="/">Projects</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/contact">Contact</NuxtLink>
      <ThemeToggle />
    </nav>
  </header>
</template>
