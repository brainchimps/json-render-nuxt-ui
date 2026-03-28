import {
  registerNuxtUiGlobals,
  nuxtUiComponentDefinitions,
} from "json-render-nuxt-ui";
import {
  UCard,
  UButton,
  UInput,
  USelect,
  UCheckbox,
  UTextarea,
  USwitch,
  UModal,
} from "#components";

export default defineNuxtPlugin((nuxtApp) => {
  registerNuxtUiGlobals(
    nuxtApp,
    { UCard, UButton, UInput, USelect, UCheckbox, UTextarea, USwitch, UModal },
    nuxtUiComponentDefinitions,
  );
});
