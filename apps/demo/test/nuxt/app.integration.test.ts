import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import App from "~/app.vue";

describe("demo app (Nuxt)", () => {
  it("renders greeting from the real app shell", async () => {
    const wrapper = await mountSuspended(App);
    expect(wrapper.text()).toContain("json-render-nuxt-ui demo");
    expect(wrapper.text()).toContain("Hello json-render!");
  });
});
