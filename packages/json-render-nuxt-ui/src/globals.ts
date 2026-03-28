import type { Component } from "vue";

/**
 * Maps json-render catalog component names to the Nuxt UI global component
 * names they depend on at runtime via `resolveComponent()`.
 *
 * Components that only use native HTML elements (e.g. Header) have no entry.
 */
export const nuxtUiGlobalDeps: Readonly<Record<string, readonly string[]>> = {
  Card: ["UCard"],
  Button: ["UButton"],
  Input: ["UInput"],
  Select: ["USelect"],
  Checkbox: ["UCheckbox"],
  Textarea: ["UTextarea"],
  Switch: ["USwitch"],
  Dialog: ["UModal", "UButton"],
};

type NuxtAppLike = {
  vueApp: { component(name: string, comp: Component): void };
};

function collectNeeded(
  catalogComponents?: string[] | Record<string, unknown>,
): Set<string> {
  const filterKeys = catalogComponents
    ? Array.isArray(catalogComponents)
      ? catalogComponents
      : Object.keys(catalogComponents)
    : Object.keys(nuxtUiGlobalDeps);

  const needed = new Set<string>();
  for (const key of filterKeys) {
    const deps = nuxtUiGlobalDeps[key];
    if (deps) {
      for (const dep of deps) needed.add(dep);
    }
  }
  return needed;
}

function applyGlobals(
  nuxtApp: NuxtAppLike,
  resolved: Record<string, unknown>,
  catalogComponents?: string[] | Record<string, unknown>,
): void {
  for (const name of collectNeeded(catalogComponents)) {
    const comp = resolved[name];
    if (comp) {
      nuxtApp.vueApp.component(name, comp as Component);
    }
  }
}

/**
 * Globally register the Nuxt UI components that json-render-nuxt-ui
 * needs at runtime.
 *
 * Nuxt auto-imports resolve `@nuxt/ui` components at compile time via
 * template transforms — they are NOT registered globally at runtime. The
 * json-render component registry uses Vue's `resolveComponent()`, so the
 * components it references must be registered on the Vue app instance.
 *
 * @param nuxtApp  The Nuxt app instance (from `defineNuxtPlugin` callback).
 * @param resolved Either a resolver function that returns the Nuxt component
 *   module (typically `() => import("#components")`), or a pre-built record
 *   mapping Nuxt UI names (e.g. `UCard`) to their implementations.
 * @param catalogComponents Optional filter. When provided, only the Nuxt UI
 *   globals required by these catalog component names are registered. Pass an
 *   array of names (`['Card', 'Button']`) or an object whose keys are names
 *   (e.g. `nuxtUiComponentDefinitions`). When omitted every known dependency
 *   is registered.
 *
 * @example
 * ```ts
 * import { registerNuxtUiGlobals, nuxtUiComponentDefinitions } from "json-render-nuxt-ui";
 *
 * export default defineNuxtPlugin(async (nuxtApp) => {
 *   await registerNuxtUiGlobals(
 *     nuxtApp,
 *     () => import("#components"),
 *     nuxtUiComponentDefinitions,
 *   );
 * });
 * ```
 */
export function registerNuxtUiGlobals(
  nuxtApp: NuxtAppLike,
  resolved: Record<string, unknown> | (() => Promise<Record<string, unknown>>),
  catalogComponents?: string[] | Record<string, unknown>,
): void | Promise<void> {
  if (typeof resolved === "function") {
    return resolved().then((mod) =>
      applyGlobals(nuxtApp, mod, catalogComponents),
    );
  }
  applyGlobals(nuxtApp, resolved, catalogComponents);
}
