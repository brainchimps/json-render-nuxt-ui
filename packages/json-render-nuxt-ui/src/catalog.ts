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
  Select: {
    props: z.object({
      value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
      items: z
        .array(
          z.union([
            z.string(),
            z.object({
              label: z.string(),
              value: z.union([z.string(), z.number(), z.boolean()]),
              disabled: z.boolean().optional(),
            }),
          ])
        )
        .optional(),
      placeholder: z.string().optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Select input with item list and optional two-way binding via $bindState on value.",
    events: ["change"],
  },
  Checkbox: {
    props: z.object({
      checked: z.boolean().nullable().optional(),
      label: z.string().optional(),
      description: z.string().nullable().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Checkbox control with optional label/description and two-way binding via $bindState on checked.",
    events: ["change"],
  },
  Textarea: {
    props: z.object({
      value: z.string().nullable().optional(),
      placeholder: z.string().optional(),
      rows: z.number().int().positive().optional(),
      autoresize: z.boolean().optional(),
      maxrows: z.number().int().positive().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Multiline text input supporting rows/autoresize and two-way binding via $bindState on value.",
    events: ["change"],
  },
  Switch: {
    props: z.object({
      checked: z.boolean().nullable().optional(),
      label: z.string().optional(),
      description: z.string().nullable().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Boolean toggle switch with optional label/description and two-way binding via $bindState on checked.",
    events: ["change"],
  },
  Dialog: {
    props: z.object({
      open: z.boolean().optional(),
      title: z.string().optional(),
      description: z.string().nullable().optional(),
      confirmLabel: z.string().optional(),
      cancelLabel: z.string().optional(),
      confirmColor: z
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
      confirmVariant: z
        .enum(["solid", "outline", "soft", "subtle", "ghost", "link"])
        .optional(),
      closeOnConfirm: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Modal dialog wrapper with optional title/description and cancel/confirm actions.",
    events: ["openChange", "confirm", "cancel"],
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
