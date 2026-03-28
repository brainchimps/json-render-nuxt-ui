import { describe, expect, it } from "vitest";
import { nuxtUiComponentDefinitions } from "../src/catalog";
import { nuxtUiComponents } from "../src/index";

const componentNames = [
  "Stack",
  "Row",
  "Divider",
  "Text",
  "Card",
  "Header",
  "Button",
  "Input",
  "Select",
  "Checkbox",
  "Textarea",
  "Switch",
  "Dialog",
  "Accordion",
  "Alert",
  "Avatar",
  "Badge",
  "Carousel",
  "Collapsible",
  "Drawer",
  "DropdownMenu",
  "Label",
  "Pagination",
  "Popover",
  "Progress",
  "RadioGroup",
  "Skeleton",
  "Slider",
  "Table",
  "Tabs",
  "ToggleGroup",
  "Toggle",
  "Tooltip",
] as const;

function getSlots(name: (typeof componentNames)[number]) {
  const definition = nuxtUiComponentDefinitions[name];
  return "slots" in definition ? definition.slots : undefined;
}

function getEvents(name: (typeof componentNames)[number]) {
  const definition = nuxtUiComponentDefinitions[name];
  return "events" in definition ? definition.events : undefined;
}

describe("json-render-nuxt-ui component registry", () => {
  it("exports all expected catalog definitions", () => {
    expect(Object.keys(nuxtUiComponentDefinitions)).toEqual(componentNames);
  });

  it("exports matching component implementations for every catalog component", () => {
    expect(Object.keys(nuxtUiComponents)).toEqual(componentNames);
    expect(Object.keys(nuxtUiComponents).sort()).toEqual(
      Object.keys(nuxtUiComponentDefinitions).sort()
    );
  });

  it("has a non-empty description for every component", () => {
    for (const name of componentNames) {
      const description = nuxtUiComponentDefinitions[name].description;
      expect(description.length).toBeGreaterThan(0);
    }
  });
});

describe("json-render-nuxt-ui component metadata", () => {
  it("defines expected slots", () => {
    expect(getSlots("Stack")).toEqual(["default"]);
    expect(getSlots("Row")).toEqual(["default"]);
    expect(getSlots("Card")).toEqual(["default"]);
    expect(getSlots("Dialog")).toEqual(["default"]);
    expect(getSlots("Accordion")).toBeUndefined();
    expect(getSlots("Alert")).toBeUndefined();
    expect(getSlots("Avatar")).toBeUndefined();
    expect(getSlots("Badge")).toBeUndefined();
    expect(getSlots("Carousel")).toBeUndefined();
    expect(getSlots("Collapsible")).toEqual(["default"]);
    expect(getSlots("Drawer")).toEqual(["default"]);
    expect(getSlots("DropdownMenu")).toBeUndefined();
    expect(getSlots("Label")).toBeUndefined();
    expect(getSlots("Pagination")).toBeUndefined();
    expect(getSlots("Popover")).toEqual(["default"]);
    expect(getSlots("Progress")).toBeUndefined();
    expect(getSlots("RadioGroup")).toBeUndefined();
    expect(getSlots("Skeleton")).toBeUndefined();
    expect(getSlots("Slider")).toBeUndefined();
    expect(getSlots("Table")).toBeUndefined();
    expect(getSlots("Tabs")).toEqual(["default"]);
    expect(getSlots("ToggleGroup")).toBeUndefined();
    expect(getSlots("Toggle")).toBeUndefined();
    expect(getSlots("Tooltip")).toEqual(["default"]);

    expect(getSlots("Divider")).toBeUndefined();
    expect(getSlots("Text")).toBeUndefined();
    expect(getSlots("Header")).toBeUndefined();
    expect(getSlots("Button")).toBeUndefined();
    expect(getSlots("Input")).toBeUndefined();
    expect(getSlots("Select")).toBeUndefined();
    expect(getSlots("Checkbox")).toBeUndefined();
    expect(getSlots("Textarea")).toBeUndefined();
    expect(getSlots("Switch")).toBeUndefined();
  });

  it("defines expected events", () => {
    expect(getEvents("Stack")).toBeUndefined();
    expect(getEvents("Row")).toBeUndefined();
    expect(getEvents("Divider")).toBeUndefined();
    expect(getEvents("Text")).toBeUndefined();
    expect(getEvents("Card")).toBeUndefined();
    expect(getEvents("Header")).toBeUndefined();
    expect(getEvents("Button")).toEqual(["press"]);
    expect(getEvents("Input")).toEqual(["change"]);
    expect(getEvents("Select")).toEqual(["change"]);
    expect(getEvents("Checkbox")).toEqual(["change"]);
    expect(getEvents("Textarea")).toEqual(["change"]);
    expect(getEvents("Switch")).toEqual(["change"]);
    expect(getEvents("Dialog")).toEqual([
      "openChange",
      "confirm",
      "cancel",
    ]);
    expect(getEvents("Accordion")).toEqual(["change"]);
    expect(getEvents("Alert")).toBeUndefined();
    expect(getEvents("Avatar")).toBeUndefined();
    expect(getEvents("Badge")).toBeUndefined();
    expect(getEvents("Carousel")).toBeUndefined();
    expect(getEvents("Collapsible")).toEqual(["openChange"]);
    expect(getEvents("Drawer")).toEqual(["openChange"]);
    expect(getEvents("DropdownMenu")).toEqual(["select"]);
    expect(getEvents("Label")).toBeUndefined();
    expect(getEvents("Pagination")).toEqual(["change"]);
    expect(getEvents("Popover")).toEqual(["openChange"]);
    expect(getEvents("Progress")).toBeUndefined();
    expect(getEvents("RadioGroup")).toEqual(["change"]);
    expect(getEvents("Skeleton")).toBeUndefined();
    expect(getEvents("Slider")).toEqual(["change"]);
    expect(getEvents("Table")).toBeUndefined();
    expect(getEvents("Tabs")).toEqual(["change"]);
    expect(getEvents("ToggleGroup")).toEqual(["change"]);
    expect(getEvents("Toggle")).toEqual(["change"]);
    expect(getEvents("Tooltip")).toBeUndefined();
  });
});

describe("json-render-nuxt-ui schema validation", () => {
  it("accepts valid props for every component", () => {
    const validProps: Record<(typeof componentNames)[number], unknown> = {
      Stack: { gap: "md" },
      Row: { gap: "sm", align: "center", justify: "between", wrap: true },
      Divider: { label: "or" },
      Text: { content: "Hello world", size: "sm", color: "muted" },
      Card: { title: "Title", description: "Description" },
      Header: { text: "Heading", level: "h2", description: null },
      Button: {
        label: "Save",
        color: "primary",
        variant: "solid",
        size: "md",
      },
      Input: { value: "hello", type: "email", placeholder: "Email" },
      Select: {
        value: "active",
        items: ["active", { label: "Disabled", value: "disabled", disabled: true }],
      },
      Checkbox: { checked: true, label: "Accept terms" },
      Textarea: { value: "Long text", rows: 4, autoresize: true },
      Switch: { checked: false, label: "Enable notifications" },
      Dialog: {
        open: true,
        title: "Confirm action",
        confirmLabel: "Continue",
        cancelLabel: "Back",
        confirmColor: "warning",
      },
      Accordion: {
        value: "item-1",
        items: [{ label: "Item 1", value: "item-1", content: "Details" }],
      },
      Alert: { title: "Heads up", description: "Info", color: "info" },
      Avatar: { src: "https://example.com/avatar.png", alt: "User", size: "md" },
      Badge: { label: "Beta", color: "primary", variant: "soft" },
      Carousel: { items: [{ title: "One" }], arrows: true, dots: true },
      Collapsible: { open: true },
      Drawer: { open: true, title: "Filters", side: "right" },
      DropdownMenu: {
        items: [{ label: "Edit", value: "edit" }, { label: "Delete", value: "delete" }],
        triggerLabel: "Actions",
      },
      Label: { text: "Email" },
      Pagination: { page: 2, total: 50, itemsPerPage: 10 },
      Popover: { open: false, content: "Popover body" },
      Progress: { value: 42, max: 100, size: "md" },
      RadioGroup: {
        value: "a",
        items: [{ label: "Option A", value: "a" }, { label: "Option B", value: "b" }],
      },
      Skeleton: { class: "h-4 w-32" },
      Slider: { value: 30, min: 0, max: 100, step: 5 },
      Table: {
        columns: [{ key: "name", label: "Name" }],
        rows: [{ name: "Ada" }],
      },
      Tabs: {
        value: "overview",
        items: [{ label: "Overview", value: "overview", content: "Overview content" }],
      },
      ToggleGroup: {
        type: "multiple",
        value: ["bold"],
        items: [{ label: "Bold", value: "bold" }],
      },
      Toggle: { pressed: true, label: "Pin", color: "primary" },
      Tooltip: { text: "Helpful hint" },
    };

    for (const name of componentNames) {
      const result = nuxtUiComponentDefinitions[name].props.safeParse(validProps[name]);
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid props for every component", () => {
    const invalidProps: Record<(typeof componentNames)[number], unknown> = {
      Stack: { gap: "huge" },
      Row: { align: "middle" },
      Divider: { label: 42 },
      Text: { content: 123 },
      Card: { title: 123 },
      Header: { level: "h7" },
      Button: { label: "Save", variant: "filled" },
      Input: { type: "date" },
      Select: { items: [{ label: "Missing value" }] },
      Checkbox: { checked: "yes" },
      Textarea: { rows: 0 },
      Switch: { checked: "no" },
      Dialog: { confirmVariant: "filled" },
      Accordion: { items: [{ value: "item-1" }] },
      Alert: { color: "brand" },
      Avatar: { size: "xxl" },
      Badge: { variant: "filled" },
      Carousel: { items: "not-array" },
      Collapsible: { open: "yes" },
      Drawer: { side: "center" },
      DropdownMenu: { items: [{ label: "Missing value" }] },
      Label: { text: 12 },
      Pagination: { page: 0 },
      Popover: { open: "yes" },
      Progress: { value: -1 },
      RadioGroup: { items: [{ label: "Missing value" }] },
      Skeleton: { class: 42 },
      Slider: { step: 0 },
      Table: { columns: [{ label: "Missing key" }] },
      Tabs: { items: [{ label: "Missing value" }] },
      ToggleGroup: { type: "many" },
      Toggle: { pressed: "yes" },
      Tooltip: { text: 42 },
    };

    for (const name of componentNames) {
      const result = nuxtUiComponentDefinitions[name].props.safeParse(
        invalidProps[name]
      );
      expect(result.success).toBe(false);
    }
  });
});
