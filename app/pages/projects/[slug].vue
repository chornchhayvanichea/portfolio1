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
</script>

<template>
  <article class="project-page">
    <h1>{{ project!.title }}</h1>
    <ContentRenderer v-if="project" :value="project" />
  </article>
</template>
