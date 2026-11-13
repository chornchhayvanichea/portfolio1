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
