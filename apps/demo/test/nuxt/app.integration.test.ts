import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import App from "~/app.vue";

describe("demo app (Nuxt)", () => {
  it("renders chat-first layout before any json-render spec", async () => {
    const wrapper = await mountSuspended(App);
    expect(wrapper.find('[data-testid="chat-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="chat-messages"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="chat-prompt"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="starter-chips"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="starter-chip-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="render-panel"]').exists()).toBe(false);
  });
});
