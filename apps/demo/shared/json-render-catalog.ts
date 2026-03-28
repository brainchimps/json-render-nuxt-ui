import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/vue/schema";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    Panel: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable().optional(),
      }),
      slots: ["default"],
      description:
        "Container with a title and optional description. Use as a top-level layout block.",
    },
    Text: {
      props: z.object({
        content: z.string(),
        tone: z.enum(["default", "muted"]).optional(),
      }),
      description: "Text paragraph or short sentence.",
    },
    Stat: {
      props: z.object({
        label: z.string(),
        value: z.string(),
      }),
      description: "Key/value statistic display.",
    },
    Tag: {
      props: z.object({
        label: z.string(),
      }),
      description: "Small badge-like label.",
    },
  },
  actions: {},
});

export const JSON_RENDER_TEST_PROMPT =
  'Return ONLY valid JSON (no markdown fences). Build a compact "Weekend plan" UI using components Panel, Text, Stat, and Tag. Include one Panel with a title, 2 Text items, 2 Stat rows, and 2 Tag items.';
