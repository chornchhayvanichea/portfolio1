export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  content: {
    experimental: { sqliteConnector: "native" }, // Node ≥22.5; avoids better-sqlite3 build scripts blocked by pnpm 10
  },
});
