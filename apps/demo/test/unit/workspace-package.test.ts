import { describe, expect, it } from "vitest";
import { helloWord } from "json-render-nuxt-ui";

/**
 * Pins workspace resolution and the package's public greeting string.
 * `pnpm test` builds `json-render-nuxt-ui` first so `dist` exists on clean checkouts.
 */
describe("json-render-nuxt-ui in demo app", () => {
  it("resolves workspace package", () => {
    expect(helloWord()).toBe("Hello json-render!");
  });
});
