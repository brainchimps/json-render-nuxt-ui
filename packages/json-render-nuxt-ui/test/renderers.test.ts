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

  it("Stack renders a vertical flex container with gap", () => {
    const { ctx } = createBaseContext({ gap: "lg" });
    const vnode = asVNode(nuxtUiComponents.Stack(ctx));

    expect(vnode.type).toBe("div");
    expect(vnode.props.class).toContain("flex flex-col");
    expect(vnode.props.class).toContain("gap-6");
    expect(vnode.children).toEqual(["child-node"]);
  });

  it("Stack defaults to md gap", () => {
    const { ctx } = createBaseContext({});
    const vnode = asVNode(nuxtUiComponents.Stack(ctx));

    expect(vnode.props.class).toContain("gap-4");
  });

  it("Row renders a horizontal flex container", () => {
    const { ctx } = createBaseContext({
      gap: "sm",
      align: "end",
      justify: "between",
      wrap: true,
    });
    const vnode = asVNode(nuxtUiComponents.Row(ctx));

    expect(vnode.type).toBe("div");
    expect(vnode.props.class).toContain("flex flex-row");
    expect(vnode.props.class).toContain("gap-2");
    expect(vnode.props.class).toContain("items-end");
    expect(vnode.props.class).toContain("justify-between");
    expect(vnode.props.class).toContain("flex-wrap");
    expect(vnode.children).toEqual(["child-node"]);
  });

  it("Divider renders a plain hr by default", () => {
    const { ctx } = createBaseContext({});
    const vnode = asVNode(nuxtUiComponents.Divider(ctx));

    expect(vnode.type).toBe("hr");
  });

  it("Divider renders a labeled separator when label is provided", () => {
    const { ctx } = createBaseContext({ label: "or" });
    const vnode = asVNode(nuxtUiComponents.Divider(ctx));

    expect(vnode.type).toBe("div");
    expect(Array.isArray(vnode.children)).toBe(true);
  });

  it("Text renders a paragraph with content", () => {
    const { ctx } = createBaseContext({
      content: "Hello world",
      size: "lg",
      color: "muted",
    });
    const vnode = asVNode(nuxtUiComponents.Text(ctx));

    expect(vnode.type).toBe("p");
    expect(vnode.props.class).toContain("text-lg");
    expect(vnode.props.class).toContain("text-muted");
    expect(vnode.children).toBe("Hello world");
  });

  it("Card renders UCard with default slot wrapped in space-y-4", () => {
    const { ctx } = createBaseContext({
      title: "Title",
      description: "Description",
    });
    const vnode = asVNode(nuxtUiComponents.Card(ctx));

    expect(vnode.type).toBe("UCard");
    expect(typeof (vnode.children as Record<string, () => unknown>).default).toBe(
      "function"
    );
    const defaultSlot = asVNode(
      (vnode.children as Record<string, () => unknown>).default()
    );
    expect(defaultSlot.type).toBe("div");
    expect(defaultSlot.props.class).toContain("space-y-4");
    expect(defaultSlot.children).toEqual(["child-node"]);
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

  it("Accordion updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "item-1",
      items: [{ label: "Item 1", value: "item-1", content: "Details" }],
    });
    ctx.bindings.value = "/accordion/value";

    const vnode = asVNode(nuxtUiComponents.Accordion(ctx));
    expect(vnode.type).toBe("UAccordion");
    (vnode.props["onUpdate:modelValue"] as (value: string | string[]) => void)(
      "item-2"
    );
    expect(setBoundValue).toHaveBeenCalledWith("item-2");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Alert renders UAlert", () => {
    const { ctx } = createBaseContext({ title: "Heads up", description: "Message" });
    const vnode = asVNode(nuxtUiComponents.Alert(ctx));
    expect(vnode.type).toBe("UAlert");
  });

  it("Avatar renders UAvatar", () => {
    const { ctx } = createBaseContext({ src: "https://example.com/a.png", alt: "A" });
    const vnode = asVNode(nuxtUiComponents.Avatar(ctx));
    expect(vnode.type).toBe("UAvatar");
  });

  it("Badge renders UBadge with label slot content", () => {
    const { ctx } = createBaseContext({ label: "Beta", color: "primary" });
    const vnode = asVNode(nuxtUiComponents.Badge(ctx));
    expect(vnode.type).toBe("UBadge");
    expect(vnode.children).toBe("Beta");
  });

  it("Carousel renders UCarousel", () => {
    const { ctx } = createBaseContext({ items: [{ title: "Slide" }] });
    const vnode = asVNode(nuxtUiComponents.Carousel(ctx));
    expect(vnode.type).toBe("UCarousel");
  });

  it("Collapsible updates open binding and emits openChange", () => {
    const { ctx, emit } = createBaseContext({ open: true });
    ctx.bindings.open = "/collapsible/open";
    const vnode = asVNode(nuxtUiComponents.Collapsible(ctx));
    expect(vnode.type).toBe("UCollapsible");
    (vnode.props["onUpdate:open"] as (value: boolean) => void)(false);
    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("openChange");
  });

  it("Drawer updates open binding and emits openChange", () => {
    const { ctx, emit } = createBaseContext({ open: true, title: "Drawer" });
    ctx.bindings.open = "/drawer/open";
    const vnode = asVNode(nuxtUiComponents.Drawer(ctx));
    expect(vnode.type).toBe("UDrawer");
    (vnode.props["onUpdate:open"] as (value: boolean) => void)(false);
    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("openChange");
  });

  it("DropdownMenu emits select when model value changes", () => {
    const { ctx, emit } = createBaseContext({
      items: [{ label: "Edit", value: "edit" }],
    });
    const vnode = asVNode(nuxtUiComponents.DropdownMenu(ctx));
    expect(vnode.type).toBe("UDropdownMenu");
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("edit");
    expect(emit).toHaveBeenCalledWith("select");
  });

  it("Label renders a semantic label element", () => {
    const { ctx } = createBaseContext({ text: "Email" });
    const vnode = asVNode(nuxtUiComponents.Label(ctx));
    expect(vnode.type).toBe("label");
    expect(vnode.children).toBe("Email");
  });

  it("Pagination updates page binding and emits change", () => {
    const { ctx, emit } = createBaseContext({ page: 1, total: 20, itemsPerPage: 10 });
    ctx.bindings.page = "/pagination/page";
    const vnode = asVNode(nuxtUiComponents.Pagination(ctx));
    expect(vnode.type).toBe("UPagination");
    (vnode.props["onUpdate:page"] as (value: number) => void)(2);
    expect(setBoundValue).toHaveBeenCalledWith(2);
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Popover updates open binding and emits openChange", () => {
    const { ctx, emit } = createBaseContext({ open: true, content: "Body" });
    ctx.bindings.open = "/popover/open";
    const vnode = asVNode(nuxtUiComponents.Popover(ctx));
    expect(vnode.type).toBe("UPopover");
    (vnode.props["onUpdate:open"] as (value: boolean) => void)(false);
    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("openChange");
  });

  it("Progress renders UProgress", () => {
    const { ctx } = createBaseContext({ value: 42, max: 100 });
    const vnode = asVNode(nuxtUiComponents.Progress(ctx));
    expect(vnode.type).toBe("UProgress");
  });

  it("RadioGroup updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "a",
      items: [{ label: "Option A", value: "a" }],
    });
    ctx.bindings.value = "/radio/value";
    const vnode = asVNode(nuxtUiComponents.RadioGroup(ctx));
    expect(vnode.type).toBe("URadioGroup");
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("b");
    expect(setBoundValue).toHaveBeenCalledWith("b");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Skeleton renders USkeleton", () => {
    const { ctx } = createBaseContext({ class: "h-4 w-20" });
    const vnode = asVNode(nuxtUiComponents.Skeleton(ctx));
    expect(vnode.type).toBe("USkeleton");
  });

  it("Slider updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({ value: 10, min: 0, max: 100 });
    ctx.bindings.value = "/slider/value";
    const vnode = asVNode(nuxtUiComponents.Slider(ctx));
    expect(vnode.type).toBe("USlider");
    (vnode.props["onUpdate:modelValue"] as (value: number) => void)(20);
    expect(setBoundValue).toHaveBeenCalledWith(20);
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Table renders UTable", () => {
    const { ctx } = createBaseContext({
      columns: [{ key: "name", label: "Name" }],
      rows: [{ name: "Ada" }],
    });
    const vnode = asVNode(nuxtUiComponents.Table(ctx));
    expect(vnode.type).toBe("UTable");
  });

  it("Tabs updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      value: "one",
      items: [{ label: "One", value: "one", content: "One body" }],
    });
    ctx.bindings.value = "/tabs/value";
    const vnode = asVNode(nuxtUiComponents.Tabs(ctx));
    expect(vnode.type).toBe("UTabs");
    (vnode.props["onUpdate:modelValue"] as (value: string) => void)("two");
    expect(setBoundValue).toHaveBeenCalledWith("two");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("ToggleGroup updates bound value and emits change", () => {
    const { ctx, emit } = createBaseContext({
      type: "single",
      value: "bold",
      items: [{ label: "Bold", value: "bold" }],
    });
    ctx.bindings.value = "/toggle-group/value";
    const vnode = asVNode(nuxtUiComponents.ToggleGroup(ctx));
    expect(vnode.type).toBe("div");
    (vnode.props["data-on-change"] as (value: string | string[]) => void)("italic");
    expect(setBoundValue).toHaveBeenCalledWith("italic");
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Toggle updates pressed binding and emits change", () => {
    const { ctx, emit } = createBaseContext({
      pressed: true,
      label: "Pin",
    });
    ctx.bindings.pressed = "/toggle/pressed";
    const vnode = asVNode(nuxtUiComponents.Toggle(ctx));
    expect(vnode.type).toBe("UButton");
    (vnode.props.onClick as () => void)();
    expect(setBoundValue).toHaveBeenCalledWith(false);
    expect(emit).toHaveBeenCalledWith("change");
  });

  it("Tooltip renders UTooltip with trigger slot", () => {
    const { ctx } = createBaseContext({ text: "Hint" });
    const vnode = asVNode(nuxtUiComponents.Tooltip(ctx));
    expect(vnode.type).toBe("UTooltip");
    expect(typeof (vnode.children as Record<string, () => unknown>).default).toBe(
      "function"
    );
  });
});
