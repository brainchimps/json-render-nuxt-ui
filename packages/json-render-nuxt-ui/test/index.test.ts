import { describe, expect, it } from "vitest";
import { helloWord } from "../src/index";

describe("helloWord", () => {
  it("returns the starter message", () => {
    expect(helloWord()).toBe("Hello json-render!");
  });
});
