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
  Stack: {
    props: z.object({
      gap: z.enum(["none", "xs", "sm", "md", "lg", "xl"]).optional(),
    }),
    slots: ["default"],
    description:
      "Vertical flex container that spaces children evenly. Use as the top-level wrapper or to group elements with consistent vertical rhythm.",
  },
  Row: {
    props: z.object({
      gap: z.enum(["none", "xs", "sm", "md", "lg", "xl"]).optional(),
      align: z.enum(["start", "center", "end", "stretch"]).optional(),
      justify: z.enum(["start", "center", "end", "between", "around"]).optional(),
      wrap: z.boolean().optional(),
    }),
    slots: ["default"],
    description:
      "Horizontal flex container for side-by-side layouts (e.g. input + button, icon row, grid cells).",
  },
  Divider: {
    props: z.object({
      label: z.string().optional(),
    }),
    description:
      "Horizontal rule / visual separator between sections. Optional centered label.",
  },
  Text: {
    props: z.object({
      content: z.string(),
      size: z.enum(["xs", "sm", "md", "lg"]).optional(),
      color: z.enum(["default", "muted", "dimmed"]).optional(),
    }),
    description:
      "Plain text paragraph. Use for descriptions, instructions, or any body copy that is not a heading.",
  },
  Card: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().nullable().optional(),
    }),
    slots: ["default"],
    description:
      "Container card with optional title and description. Renders children in the card body with vertical spacing.",
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
  Accordion: {
    props: z.object({
      value: z.union([z.string(), z.array(z.string())]).nullable().optional(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string().optional(),
          content: z.string().nullable().optional(),
          disabled: z.boolean().optional(),
        })
      ),
      type: z.enum(["single", "multiple"]).optional(),
      collapsible: z.boolean().optional(),
    }),
    description:
      "Expandable disclosure list. Supports single or multiple expanded sections and optional controlled value binding.",
    events: ["change"],
  },
  Alert: {
    props: z.object({
      title: z.string().optional(),
      description: z.string().nullable().optional(),
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
      icon: z.string().optional(),
      close: z.boolean().optional(),
    }),
    description: "Inline status message with optional icon, color, and dismiss action.",
  },
  Avatar: {
    props: z.object({
      src: z.string().url().optional(),
      alt: z.string().optional(),
      icon: z.string().optional(),
      text: z.string().optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
    }),
    description:
      "User avatar image with optional fallback text/icon and configurable size.",
  },
  Badge: {
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
    }),
    description: "Compact status badge for tags, states, and metadata labels.",
  },
  Carousel: {
    props: z.object({
      items: z.array(z.record(z.string(), z.unknown())),
      arrows: z.boolean().optional(),
      dots: z.boolean().optional(),
      loop: z.boolean().optional(),
    }),
    description:
      "Horizontally scrollable carousel for card/image slides backed by an items array.",
  },
  Collapsible: {
    props: z.object({
      open: z.boolean().optional(),
      triggerLabel: z.string().optional(),
    }),
    slots: ["default"],
    description:
      "Collapsible container with optional trigger label and controlled open state.",
    events: ["openChange"],
  },
  Drawer: {
    props: z.object({
      open: z.boolean().optional(),
      title: z.string().optional(),
      description: z.string().nullable().optional(),
      side: z.enum(["left", "right", "top", "bottom"]).optional(),
    }),
    slots: ["default"],
    description:
      "Slide-in drawer panel for secondary actions, filters, and contextual forms.",
    events: ["openChange"],
  },
  DropdownMenu: {
    props: z.object({
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          icon: z.string().optional(),
          disabled: z.boolean().optional(),
        })
      ),
      triggerLabel: z.string().optional(),
      triggerIcon: z.string().optional(),
    }),
    description: "Action menu with trigger button and selectable menu items.",
    events: ["select"],
  },
  Label: {
    props: z.object({
      text: z.string(),
      forId: z.string().optional(),
    }),
    description: "Form field label text for inputs and controls.",
  },
  Pagination: {
    props: z.object({
      page: z.number().int().positive().optional(),
      total: z.number().int().nonnegative(),
      itemsPerPage: z.number().int().positive().optional(),
    }),
    description:
      "Pagination controls for navigating large datasets with a current page value.",
    events: ["change"],
  },
  Popover: {
    props: z.object({
      open: z.boolean().optional(),
      content: z.string().optional(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
    }),
    slots: ["default"],
    description:
      "Floating popover anchored to trigger content, useful for small contextual UI.",
    events: ["openChange"],
  },
  Progress: {
    props: z.object({
      value: z.number().nonnegative(),
      max: z.number().positive().optional(),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
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
    }),
    description: "Linear progress indicator with configurable value, max, and style.",
  },
  RadioGroup: {
    props: z.object({
      value: z.string().nullable().optional(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      orientation: z.enum(["horizontal", "vertical"]).optional(),
    }),
    description:
      "Single-choice radio control group with optional bound value and item options.",
    events: ["change"],
  },
  Skeleton: {
    props: z.object({
      class: z.string().optional(),
    }),
    description: "Skeleton placeholder used while content is loading.",
  },
  Slider: {
    props: z.object({
      value: z.number().nullable().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().positive().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "Numeric range slider with optional two-way bound value and min/max/step controls.",
    events: ["change"],
  },
  Table: {
    props: z.object({
      columns: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
        })
      ),
      rows: z.array(z.record(z.string(), z.unknown())),
    }),
    description: "Data table with explicit column configuration and row records.",
  },
  Tabs: {
    props: z.object({
      value: z.string().nullable().optional(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          content: z.string().optional(),
          disabled: z.boolean().optional(),
        })
      ),
    }),
    slots: ["default"],
    description: "Tabbed navigation for switching between related content panels.",
    events: ["change"],
  },
  ToggleGroup: {
    props: z.object({
      type: z.enum(["single", "multiple"]).optional(),
      value: z.union([z.string(), z.array(z.string())]).nullable().optional(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          disabled: z.boolean().optional(),
        })
      ),
      variant: z
        .enum(["solid", "outline", "soft", "subtle", "ghost", "link"])
        .optional(),
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
    }),
    description:
      "Segmented set of toggle buttons supporting single or multiple active values.",
    events: ["change"],
  },
  Toggle: {
    props: z.object({
      pressed: z.boolean().nullable().optional(),
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
      disabled: z.boolean().optional(),
    }),
    description: "Two-state pressed button toggle for compact boolean actions.",
    events: ["change"],
  },
  Tooltip: {
    props: z.object({
      text: z.string(),
      kbds: z.array(z.string()).optional(),
      side: z.enum(["top", "right", "bottom", "left"]).optional(),
    }),
    slots: ["default"],
    description: "Hover/focus tooltip with short helper text and optional key hints.",
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
