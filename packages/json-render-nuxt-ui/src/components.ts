import { h, resolveComponent } from "vue";
import { useBoundProp, type BaseComponentProps } from "@json-render/vue";
import type { NuxtUiComponentName, NuxtUiProps } from "./catalog";

type ComponentMap = {
  [K in NuxtUiComponentName]: (
    ctx: BaseComponentProps<NuxtUiProps<K>>
  ) => ReturnType<typeof h>;
};

export const nuxtUiComponents: ComponentMap = {
  Card: ({ props, children }) => {
    const UCard = resolveComponent("UCard");
    const hasHeader = Boolean(props.title || props.description);

    return h(UCard, null, {
      header: hasHeader
        ? () =>
            h("div", { class: "space-y-1" }, [
              props.title
                ? h("h3", { class: "text-base font-semibold" }, props.title)
                : null,
              props.description
                ? h("p", { class: "text-sm text-muted" }, props.description)
                : null,
            ])
        : undefined,
      default: () => children,
    });
  },

  Header: ({ props }) => {
    const level = props.level ?? "h2";
    const titleClassByLevel: Record<string, string> = {
      h1: "text-3xl font-bold tracking-tight",
      h2: "text-2xl font-semibold tracking-tight",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      h5: "text-base font-semibold",
      h6: "text-sm font-semibold uppercase tracking-wide",
    };

    return h("header", { class: "space-y-1" }, [
      h(level, { class: titleClassByLevel[level] }, props.text),
      props.description
        ? h("p", { class: "text-sm text-muted" }, props.description)
        : null,
    ]);
  },

  Button: ({ props, on }) => {
    const UButton = resolveComponent("UButton");
    const press = on("press");

    return h(UButton, {
      label: props.label,
      color: props.color,
      variant: props.variant,
      size: props.size,
      icon: props.icon,
      loading: props.loading,
      disabled: props.disabled,
      onClick: (event: Event) => {
        if (press.shouldPreventDefault) {
          event.preventDefault();
        }
        press.emit();
      },
    });
  },

  Input: ({ props, bindings, emit }) => {
    const UInput = resolveComponent("UInput");
    const [value, setValue] = useBoundProp<string | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(UInput, {
      modelValue: value ?? "",
      type: props.type ?? "text",
      placeholder: props.placeholder,
      size: props.size,
      disabled: props.disabled,
      autofocus: props.autofocus,
      "onUpdate:modelValue": (nextValue: string) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },
};
