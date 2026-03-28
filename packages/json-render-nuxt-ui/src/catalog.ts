import { z } from "zod";

/**
 * Type for a component definition.
 */
export type ComponentDefinition = {
  props: z.ZodType;
  slots?: string[];
  events?: string[];
  description: string;
  example?: Record<string, unknown>;
};

export const nuxtUiComponentDefinitions = {
  Card: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().nullable().optional(),
    }),
    slots: ["default"],
    description:
      "Container card with optional title and description. Renders children in the card body.",
  },
  Header: {
    props: z.object({
      text: z.string(),
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional(),
      description: z.string().nullable().optional(),
    }),
    description:
      "Section header text with configurable heading level and optional supporting description.",
  },
  Button: {
    props: z.object({
      label: z.string(),
      color: z
        .enum([
          "primary",
          "secondary",
          "success",
          "info",
          "warning",
          "error",
          "neutral",
        ])
        .optional(),
      variant: z
        .enum(["solid", "outline", "soft", "subtle", "ghost", "link"])
        .optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
      icon: z.string().optional(),
      loading: z.boolean().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Clickable button supporting Nuxt UI color/variant/size options. Emits press on click.",
    events: ["press"],
  },
  Input: {
    props: z.object({
      value: z.string().nullable().optional(),
      placeholder: z.string().optional(),
      type: z
        .enum(["text", "email", "password", "search", "tel", "url", "number"])
        .optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
      disabled: z.boolean().optional(),
      autofocus: z.boolean().optional(),
    }),
    description:
      "Text input field. Supports two-way binding via $bindState on value and emits change on input.",
    events: ["change"],
  },
} satisfies Record<string, ComponentDefinition>;

/**
 * Infer the props type for a Nuxt UI component by name.
 * Derives the TypeScript type directly from the Zod schema,
 * so component implementations stay in sync with catalog definitions.
 */
export type NuxtUiComponentName = keyof typeof nuxtUiComponentDefinitions;
export type NuxtUiProps<K extends NuxtUiComponentName> = z.output<
  (typeof nuxtUiComponentDefinitions)[K]["props"]
>;
