import {
  registerNuxtUiGlobals,
  nuxtUiComponentDefinitions,
} from "json-render-nuxt-ui";

export default defineNuxtPlugin(async (nuxtApp) => {
  await registerNuxtUiGlobals(
    nuxtApp,
    () => import("#components"),
    nuxtUiComponentDefinitions,
  );
});
