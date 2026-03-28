const vitest = Boolean(process.env.VITEST);

export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      enforcedAiModel: process.env.ENFORCE_AI_MODEL?.trim() || "",
    },
  },
  experimental: {
    // Vitest only: avoid `#app-manifest` resolution failures (Nuxt 4.4.x + @nuxt/test-utils).
    ...(vitest && { appManifest: false }),
  },
  build: {
    transpile: ["json-render-nuxt-ui"],
  },
});
