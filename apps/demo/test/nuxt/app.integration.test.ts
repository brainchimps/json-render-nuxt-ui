import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import IndexPage from "~/pages/index.vue";

describe("demo app (Nuxt)", () => {
  it("renders landing page with greeting, starter chips, and prompt", async () => {
    const wrapper = await mountSuspended(IndexPage);
    expect(wrapper.find('[data-testid="chat-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="chat-prompt"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="starter-chips"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="starter-chip-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="render-panel"]').exists()).toBe(false);
  });
});
