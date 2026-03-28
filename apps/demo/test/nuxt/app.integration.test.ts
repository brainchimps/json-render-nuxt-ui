import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import App from "~/app.vue";

describe("demo app (Nuxt)", () => {
  it("renders a one-page chat UI", async () => {
    const wrapper = await mountSuspended(App);
    expect(wrapper.find('[data-testid="chat-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="chat-messages"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="chat-prompt"]').exists()).toBe(true);
  });
});
