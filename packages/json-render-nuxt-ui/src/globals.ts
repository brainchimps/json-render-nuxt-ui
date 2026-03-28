import type { Component } from "vue";
import type { ComponentDefinition, NuxtUiComponentName } from "./catalog";

/**
 * Maps json-render catalog component names to the Nuxt UI global component
 * names they depend on at runtime via `resolveComponent()`.
 *
 * Components that only use native HTML elements (e.g. Header) have no entry.
 */
export const nuxtUiGlobalDeps: Readonly<
  Partial<Record<NuxtUiComponentName, readonly string[]>>
> = {
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
 * @param resolved Object mapping Nuxt UI component names (e.g. `UCard`) to
 *   their Vue component implementations — import these from `#components`.
 * @param catalogComponents The catalog component names to register globals for.
 *   Only the Nuxt UI globals required by these components are registered. Pass
 *   an array of names (`['Card', 'Button']`) or an object whose keys are names
 *   (e.g. `nuxtUiComponentDefinitions` or a custom subset).
 *
 * @example
 * ```ts
 * import { registerNuxtUiGlobals, nuxtUiComponentDefinitions } from "json-render-nuxt-ui";
 * import { UCard, UButton, UInput, USelect, UCheckbox, UTextarea, USwitch, UModal } from "#components";
 *
 * export default defineNuxtPlugin((nuxtApp) => {
 *   registerNuxtUiGlobals(
 *     nuxtApp,
 *     { UCard, UButton, UInput, USelect, UCheckbox, UTextarea, USwitch, UModal },
 *     nuxtUiComponentDefinitions,
 *   );
 * });
 * ```
 */
export function registerNuxtUiGlobals(
  nuxtApp: NuxtAppLike,
  resolved: Record<string, Component>,
  catalogComponents:
    | NuxtUiComponentName[]
    | Partial<Record<NuxtUiComponentName, ComponentDefinition>>,
): void {
  const filterKeys: NuxtUiComponentName[] = Array.isArray(catalogComponents)
    ? catalogComponents
    : (Object.keys(catalogComponents) as NuxtUiComponentName[]);

  const needed = new Map<string, NuxtUiComponentName>();
  for (const key of filterKeys) {
    const deps = nuxtUiGlobalDeps[key];
    if (deps) {
      for (const dep of deps) needed.set(dep, key);
    }
  }

  for (const [name, catalogName] of needed) {
    const comp = resolved[name];
    if (comp) {
      nuxtApp.vueApp.component(name, comp);
    } else {
      console.warn(
        `[json-render-nuxt-ui] Missing "${name}" — required by the "${catalogName}" component. ` +
          `Import it (import { ${name} } from "#components") and pass it ` +
          `to your registerNuxtUiGlobals() call.`,
      );
    }
  }
}
