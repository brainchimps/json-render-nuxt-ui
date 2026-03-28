/**
 * json-render component registry for the demo app.
 *
 * A registry maps component names from the catalog to actual Vue render
 * functions. This file uses the pre-built Nuxt UI components from the
 * `json-render-nuxt-ui` package as a base and extends them with a custom
 * `FancyHeader` to demonstrate how consumers add their own components.
 *
 * The catalog (what the AI knows about) lives in `./json-render-catalog.ts`.
 * The composable that wires this into the app is `~/composables/useJsonRender.ts`.
 *
 * NOTE: This file is intentionally separate from the catalog because the server
 * endpoint (`server/api/generate.post.ts`) imports the catalog to build the LLM
 * system prompt. Keeping Vue imports (`h`, `resolveComponent`, render functions)
 * out of the catalog avoids pulling them into the server bundle.
 */
import { defineRegistry } from "@json-render/vue";
import { h } from "vue";
import { nuxtUiComponents } from "json-render-nuxt-ui";
import { catalog } from "~/shared/json-render-catalog";

const gradientClasses: Record<string, string> = {
  sunset: "from-orange-500 via-pink-500 to-purple-500",
  ocean: "from-cyan-400 via-blue-500 to-indigo-600",
  forest: "from-green-400 via-emerald-500 to-teal-600",
};

const { registry } = defineRegistry(catalog, {
  components: {
    // Built-in Nuxt UI components: Card, Header, Button, Input
    ...nuxtUiComponents,

    // Custom component definition — shows how to extend the package with your own
    FancyHeader: ({ props }) =>
      h(
        "h2",
        {
          class: `text-2xl font-extrabold bg-gradient-to-r ${gradientClasses[props.gradient ?? "sunset"]} bg-clip-text text-transparent`,
        },
        props.text
      ),
  },
});

export { catalog, registry };
