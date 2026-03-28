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

  Select: ({ props, bindings, emit }) => {
    const USelect = resolveComponent("USelect");
    const [value, setValue] = useBoundProp<
      string | number | boolean | null | undefined
    >(props.value, bindings?.value);

    return h(USelect, {
      modelValue: value ?? null,
      items: props.items ?? [],
      placeholder: props.placeholder,
      size: props.size,
      disabled: props.disabled,
      "onUpdate:modelValue": (nextValue: string | number | boolean | null) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },

  Checkbox: ({ props, bindings, emit }) => {
    const UCheckbox = resolveComponent("UCheckbox");
    const [checked, setChecked] = useBoundProp<boolean | null | undefined>(
      props.checked,
      bindings?.checked
    );

    return h(UCheckbox, {
      modelValue: checked ?? false,
      label: props.label,
      description: props.description ?? undefined,
      disabled: props.disabled,
      "onUpdate:modelValue": (nextValue: boolean) => {
        setChecked(nextValue);
        emit("change");
      },
    });
  },

  Textarea: ({ props, bindings, emit }) => {
    const UTextarea = resolveComponent("UTextarea");
    const [value, setValue] = useBoundProp<string | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(UTextarea, {
      modelValue: value ?? "",
      placeholder: props.placeholder,
      rows: props.rows,
      autoresize: props.autoresize,
      maxrows: props.maxrows,
      disabled: props.disabled,
      "onUpdate:modelValue": (nextValue: string) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },

  Switch: ({ props, bindings, emit }) => {
    const USwitch = resolveComponent("USwitch");
    const [checked, setChecked] = useBoundProp<boolean | null | undefined>(
      props.checked,
      bindings?.checked
    );

    return h(USwitch, {
      modelValue: checked ?? false,
      label: props.label,
      description: props.description ?? undefined,
      disabled: props.disabled,
      "onUpdate:modelValue": (nextValue: boolean) => {
        setChecked(nextValue);
        emit("change");
      },
    });
  },

  Dialog: ({ props, bindings, children, emit, on }) => {
    const UModal = resolveComponent("UModal");
    const UButton = resolveComponent("UButton");
    const [open, setOpen] = useBoundProp<boolean | undefined>(
      props.open,
      bindings?.open
    );
    const confirm = on("confirm");
    const cancel = on("cancel");

    const updateOpen = (nextOpen: boolean) => {
      setOpen(nextOpen);
      emit("openChange");
    };

    return h(
      UModal,
      {
        open: open ?? false,
        title: props.title,
        description: props.description ?? undefined,
        "onUpdate:open": (nextOpen: boolean) => updateOpen(nextOpen),
      },
      {
        default: () => children,
        footer: () =>
          h("div", { class: "flex justify-end gap-2" }, [
            h(UButton, {
              variant: "ghost",
              label: props.cancelLabel ?? "Cancel",
              onClick: (event: Event) => {
                if (cancel.shouldPreventDefault) {
                  event.preventDefault();
                }
                cancel.emit();
                updateOpen(false);
              },
            }),
            h(UButton, {
              color: props.confirmColor ?? "primary",
              variant: props.confirmVariant ?? "solid",
              label: props.confirmLabel ?? "Confirm",
              onClick: (event: Event) => {
                if (confirm.shouldPreventDefault) {
                  event.preventDefault();
                }
                confirm.emit();
                if (props.closeOnConfirm !== false) {
                  updateOpen(false);
                }
              },
            }),
          ]),
      }
    );
  },
};
