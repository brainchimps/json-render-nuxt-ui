import { resolve } from "node:path";

const vitest = Boolean(process.env.VITEST);

const pkgSrc = resolve(__dirname, "../../packages/json-render-nuxt-ui/src");

export default defineNuxtConfig({
  compatibilityDate: "2026-03-28",
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],

  $development: {
    alias: {
      "json-render-nuxt-ui/catalog": resolve(pkgSrc, "catalog.ts"),
      "json-render-nuxt-ui": resolve(pkgSrc, "index.ts"),
    },
    vite: {
      optimizeDeps: {
        exclude: ["json-render-nuxt-ui"],
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "ai",
        "@ai-sdk/vue",
        "@json-render/vue",
        "zod",
        "@json-render/core",
        "@json-render/vue/schema",
      ],
    },
  },
  runtimeConfig: {
    public: {
      enforcedAiModel: process.env.ENFORCE_AI_MODEL?.trim() || "",
      imprintUrl: process.env.IMPRINT_URL?.trim() || "",
      privacyPolicyUrl: process.env.PRIVACY_POLICY_URL?.trim() || "",
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
