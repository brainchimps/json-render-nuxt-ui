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
    };

    for (const name of componentNames) {
      const result = nuxtUiComponentDefinitions[name].props.safeParse(
        invalidProps[name]
      );
      expect(result.success).toBe(false);
    }
  });
});
