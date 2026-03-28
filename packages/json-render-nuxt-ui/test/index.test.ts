import { describe, expect, it } from "vitest";
import { nuxtUiComponentDefinitions } from "../src/catalog";
import { nuxtUiComponents } from "../src/index";

describe("json-render-nuxt-ui exports", () => {
  it("exports the four catalog definitions", () => {
    expect(Object.keys(nuxtUiComponentDefinitions)).toEqual([
      "Card",
      "Header",
      "Button",
      "Input",
    ]);
  });

  it("exports matching Nuxt UI component implementations", () => {
    expect(Object.keys(nuxtUiComponents)).toEqual([
      "Card",
      "Header",
      "Button",
      "Input",
    ]);
  });
});
