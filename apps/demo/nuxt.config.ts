const vitest = Boolean(process.env.VITEST);

export default defineNuxtConfig({
  compatibilityDate: "2026-03-28",
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: [
        "ai",
        "@ai-sdk/vue",
        "@json-render/vue",
        "zod", 
        "@json-render/core",
        "@json-render/vue/schema"
      ],
    },
  },
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
