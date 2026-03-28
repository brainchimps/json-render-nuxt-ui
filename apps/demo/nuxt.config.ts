const vitest = Boolean(process.env.VITEST);

export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  experimental: {
    // Vitest only: avoid `#app-manifest` resolution failures (Nuxt 4.4.x + @nuxt/test-utils).
    ...(vitest && { appManifest: false }),
  },
  build: {
    transpile: ["json-render-nuxt-ui"],
  },
});
