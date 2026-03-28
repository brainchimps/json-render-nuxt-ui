/**
 * json-render catalog for the demo app.
 *
 * A catalog describes the components an LLM can use when generating a JSON
 * spec. Each entry defines Zod-validated props and a plain-english description
 * that gets included in the system prompt via `catalog.prompt()`.
 *
 * This catalog spreads the standard Nuxt UI definitions from the
 * `json-render-nuxt-ui` package and adds a custom `FancyHeader` to show
 * how consumers extend the built-in set.
 *
 * The matching render functions live in `./json-render-registry.ts`.
 */
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/vue/schema";
import { nuxtUiComponentDefinitions } from "json-render-nuxt-ui/catalog";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    // Spread all built-in Nuxt UI components (Card, Header, Button, Input).
    // To cherry-pick, replace the spread with individual entries:
    //   Card: nuxtUiComponentDefinitions.Card,
    //   Button: nuxtUiComponentDefinitions.Button,
    ...nuxtUiComponentDefinitions,

    // Custom component
    FancyHeader: {
      props: z.object({
        text: z.string(),
        gradient: z
          .enum(["sunset", "ocean", "forest"])
          .optional(),
      }),
      description:
        "Decorative header with colorful gradient text. Use for eye-catching section titles or hero headings.",
    },
  },
  actions: {},
});
