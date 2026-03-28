import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const setBoundValue = vi.fn();
  const useBoundPropMock = vi.fn((value: unknown) => [value, setBoundValue] as const);
  return { setBoundValue, useBoundPropMock };
});

vi.mock("@json-render/vue", () => ({
  useBoundProp: mocks.useBoundPropMock,
}));

vi.mock("vue", () => ({
  resolveComponent: vi.fn((name: string) => name),
  h: vi.fn((type: unknown, props?: Record<string, unknown> | null, children?: unknown) => ({
    type,
    props: props ?? {},
    children,
  })),
}));

import { nuxtUiComponents } from "../src/components";

const setBoundValue = mocks.setBoundValue;
const useBoundPropMock = mocks.useBoundPropMock;

function createEventBinding(shouldPreventDefault = false) {
  return {
    shouldPreventDefault,
    emit: vi.fn(),
  };
}

function createBaseContext(props: Record<string, unknown>) {
  const emit = vi.fn();
  const bindings: Record<string, string> = {};
  const eventBindings = {
    press: createEventBinding(),
    confirm: createEventBinding(),
    cancel: createEventBinding(),
  };

  return {
    ctx: {
      props,
      children: ["child-node"],
      bindings,
      emit,
      on: (event: keyof typeof eventBindings) => eventBindings[event],
    } as any,
    emit,
    bindings,
    eventBindings,
  };
}

function asVNode(value: unknown) {
  return value as {
    type: unknown;
    props: Record<string, unknown>;
    children: Record<string, () => unknown> | unknown[];
  };
}

describe("component renderers", () => {
  beforeEach(() => {
    setBoundValue.mockClear();
    useBoundPropMock.mockClear();
  });

  it("Card renders UCard with default slot content", () => {
    const { ctx } = createBaseContext({
      title: "Title",
      description: "Description",
    });
    const vnode = asVNode(nuxtUiComponents.Card(ctx));

    expect(vnode.type).toBe("UCard");
    expect(typeof (vnode.children as Record<string, () => unknown>).default).toBe(
      "function"
    );
    expect(
      (vnode.children as Record<string, () => unknown>).default()
    ).toEqual(["child-node"]);
    expect(typeof (vnode.children as Record<string, () => unknown>).header).toBe(
      "function"
    );
  });

  it("Header renders semantic header with heading text", () => {
    const { ctx } = createBaseContext({
      text: "Profile",
      level: "h3",
    });
    const vnode = asVNode(nuxtUiComponents.Header(ctx));

    expect(vnode.type).toBe("header");
    expect(Array.isArray(vnode.children)).toBe(true);
  });

  it("Button emits press on click", () => {
    const { ctx, eventBindings } = createBaseContext({
      label: "Save",
      variant: "solid",
    });
    const vnode = asVNode(nuxtUiComponents.Button(ctx));

    expect(vnode.type).toBe("UButton");
    const event = { preventDefault: vi.fn() } as unknown as Event;
    (vnode.props.onClick as (event: Event) => void)(event);

    expect(eventBindings.press.emit).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("Input updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "hello",
      type: "text",
    });
    ctx.bindings.value = "/form/name";

    const vnode = asVNode(nuxtUiComponents.Input(ctx));
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("updated");

    expect(useBoundPropMock).toHaveBeenCalled();
    expect(setBoundValue).toHaveBeenCalledWith("updated");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Select updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "a",
      items: ["a", "b"],
    });
    ctx.bindings.value = "/form/choice";

    const vnode = asVNode(nuxtUiComponents.Select(ctx));
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("b");

    expect(setBoundValue).toHaveBeenCalledWith("b");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Checkbox updates bound checked state and emits change", () => {
    const { ctx, emit } = createBaseContext({
      checked: false,
      label: "Accept",
    });
    ctx.bindings.checked = "/form/accept";

    const vnode = asVNode(nuxtUiComponents.Checkbox(ctx));
    (vnode.props["onUpdate:modelValue"] as (value: boolean) => void)(true);

    expect(setBoundValue).toHaveBeenCalledWith(true);
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Textarea updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "initial",
      rows: 3,
    });
    ctx.bindings.value = "/form/message";

    const vnode = asVNode(nuxtUiComponents.Textarea(ctx));
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("next");

    expect(setBoundValue).toHaveBeenCalledWith("next");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Switch updates bound checked state and emits change", () => {
    const { ctx, emit } = createBaseContext({
      checked: true,
      label: "Enabled",
    });
    ctx.bindings.checked = "/form/enabled";

    const vnode = asVNode(nuxtUiComponents.Switch(ctx));
    (vnode.props["onUpdate:modelValue"] as (value: boolean) => void)(false);

    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Dialog maps open updates and footer button events", () => {
    const { ctx, emit, eventBindings } = createBaseContext({
      open: true,
      title: "Confirm",
      closeOnConfirm: true,
    });
    ctx.bindings.open = "/dialog/open";

    const vnode = asVNode(nuxtUiComponents.Dialog(ctx));
    expect(vnode.type).toBe("UModal");

    (vnode.props["onUpdate:open"] as (value: boolean) => void)(false);
    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("openChange");

    const footer = (vnode.children as Record<string, () => unknown>).footer() as {
      children: Array<{ props: { onClick: (event: Event) => void } }>;
    };
    const [cancelButton, confirmButton] = footer.children;

    const cancelEvent = { preventDefault: vi.fn() } as unknown as Event;
    cancelButton.props.onClick(cancelEvent);
    expect(eventBindings.cancel.emit).toHaveBeenCalledTimes(1);

    const confirmEvent = { preventDefault: vi.fn() } as unknown as Event;
    confirmButton.props.onClick(confirmEvent);
    expect(eventBindings.confirm.emit).toHaveBeenCalledTimes(1);
  });
});
