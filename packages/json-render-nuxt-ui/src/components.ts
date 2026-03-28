import { h, resolveComponent } from "vue";
import { useBoundProp, type BaseComponentProps } from "@json-render/vue";
import type { NuxtUiComponentName, NuxtUiProps } from "./catalog";

type ComponentMap = {
  [K in NuxtUiComponentName]: (
    ctx: BaseComponentProps<NuxtUiProps<K>>
  ) => ReturnType<typeof h>;
};

const gapClass: Record<string, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const nuxtUiComponents: ComponentMap = {
  Stack: ({ props, children }) => {
    const gap = gapClass[props.gap ?? "md"];
    return h("div", { class: `flex flex-col ${gap}` }, children);
  },

  Row: ({ props, children }) => {
    const gap = gapClass[props.gap ?? "md"];
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    const justifyMap: Record<string, string> = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };
    const classes = [
      "flex flex-row",
      gap,
      alignMap[props.align ?? "center"],
      justifyMap[props.justify ?? "start"],
      props.wrap ? "flex-wrap" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return h("div", { class: classes }, children);
  },

  Divider: ({ props }) => {
    if (props.label) {
      return h("div", { class: "flex items-center gap-3 my-2" }, [
        h("hr", { class: "flex-1 border-default" }),
        h("span", { class: "text-xs text-dimmed shrink-0" }, props.label),
        h("hr", { class: "flex-1 border-default" }),
      ]);
    }
    return h("hr", { class: "border-default my-2" });
  },

  Text: ({ props }) => {
    const sizeClass: Record<string, string> = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    const colorClass: Record<string, string> = {
      default: "text-default",
      muted: "text-muted",
      dimmed: "text-dimmed",
    };
    const classes = [
      sizeClass[props.size ?? "sm"],
      colorClass[props.color ?? "default"],
    ].join(" ");
    return h("p", { class: classes }, props.content);
  },

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
      default: () => h("div", { class: "space-y-4" }, children),
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

  Accordion: ({ props, bindings, emit }) => {
    const UAccordion = resolveComponent("UAccordion");
    const [value, setValue] = useBoundProp<string | string[] | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(UAccordion, {
      modelValue: value ?? (props.type === "multiple" ? [] : null),
      items: props.items,
      type: props.type,
      collapsible: props.collapsible,
      "onUpdate:modelValue": (nextValue: string | string[]) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },

  Alert: ({ props }) => {
    const UAlert = resolveComponent("UAlert");
    return h(UAlert, {
      title: props.title,
      description: props.description ?? undefined,
      color: props.color,
      variant: props.variant,
      icon: props.icon,
      close: props.close,
    });
  },

  Avatar: ({ props }) => {
    const UAvatar = resolveComponent("UAvatar");
    return h(UAvatar, {
      src: props.src,
      alt: props.alt,
      icon: props.icon,
      text: props.text,
      size: props.size,
    });
  },

  Badge: ({ props }) => {
    const UBadge = resolveComponent("UBadge");
    return h(
      UBadge,
      {
        color: props.color,
        variant: props.variant,
        size: props.size,
      },
      props.label
    );
  },

  Carousel: ({ props }) => {
    const UCarousel = resolveComponent("UCarousel");
    return h(UCarousel, {
      items: props.items,
      arrows: props.arrows,
      dots: props.dots,
      loop: props.loop,
    });
  },

  Collapsible: ({ props, bindings, children, emit }) => {
    const UCollapsible = resolveComponent("UCollapsible");
    const [open, setOpen] = useBoundProp<boolean | undefined>(
      props.open,
      bindings?.open
    );

    return h(UCollapsible, {
      open: open ?? false,
      label: props.triggerLabel,
      content: children,
      "onUpdate:open": (nextOpen: boolean) => {
        setOpen(nextOpen);
        emit("openChange");
      },
    });
  },

  Drawer: ({ props, bindings, children, emit }) => {
    const UDrawer = resolveComponent("UDrawer");
    const [open, setOpen] = useBoundProp<boolean | undefined>(
      props.open,
      bindings?.open
    );

    return h(
      UDrawer,
      {
        open: open ?? false,
        title: props.title,
        description: props.description ?? undefined,
        side: props.side,
        "onUpdate:open": (nextOpen: boolean) => {
          setOpen(nextOpen);
          emit("openChange");
        },
      },
      {
        default: () => children,
      }
    );
  },

  DropdownMenu: ({ props, emit }) => {
    const UDropdownMenu = resolveComponent("UDropdownMenu");
    return h(UDropdownMenu, {
      items: props.items,
      label: props.triggerLabel,
      icon: props.triggerIcon,
      "onUpdate:modelValue": () => {
        emit("select");
      },
    });
  },

  Label: ({ props }) => {
    return h("label", { for: props.forId }, props.text);
  },

  Pagination: ({ props, bindings, emit }) => {
    const UPagination = resolveComponent("UPagination");
    const [page, setPage] = useBoundProp<number | undefined>(
      props.page,
      bindings?.page
    );

    return h(UPagination, {
      page: page ?? 1,
      total: props.total,
      itemsPerPage: props.itemsPerPage,
      "onUpdate:page": (nextPage: number) => {
        setPage(nextPage);
        emit("change");
      },
    });
  },

  Popover: ({ props, bindings, children, emit }) => {
    const UPopover = resolveComponent("UPopover");
    const [open, setOpen] = useBoundProp<boolean | undefined>(
      props.open,
      bindings?.open
    );

    return h(
      UPopover,
      {
        open: open ?? false,
        content: props.content,
        side: props.side,
        "onUpdate:open": (nextOpen: boolean) => {
          setOpen(nextOpen);
          emit("openChange");
        },
      },
      {
        default: () => children,
      }
    );
  },

  Progress: ({ props }) => {
    const UProgress = resolveComponent("UProgress");
    return h(UProgress, {
      modelValue: props.value,
      max: props.max,
      size: props.size,
      color: props.color,
    });
  },

  RadioGroup: ({ props, bindings, emit }) => {
    const URadioGroup = resolveComponent("URadioGroup");
    const [value, setValue] = useBoundProp<string | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(URadioGroup, {
      modelValue: value ?? null,
      items: props.items,
      orientation: props.orientation,
      "onUpdate:modelValue": (nextValue: string) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },

  Skeleton: ({ props }) => {
    const USkeleton = resolveComponent("USkeleton");
    return h(USkeleton, { class: props.class });
  },

  Slider: ({ props, bindings, emit }) => {
    const USlider = resolveComponent("USlider");
    const [value, setValue] = useBoundProp<number | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(USlider, {
      modelValue: value ?? 0,
      min: props.min,
      max: props.max,
      step: props.step,
      disabled: props.disabled,
      "onUpdate:modelValue": (nextValue: number) => {
        setValue(nextValue);
        emit("change");
      },
    });
  },

  Table: ({ props }) => {
    const UTable = resolveComponent("UTable");
    return h(UTable, {
      columns: props.columns,
      data: props.rows,
    });
  },

  Tabs: ({ props, bindings, children, emit }) => {
    const UTabs = resolveComponent("UTabs");
    const [value, setValue] = useBoundProp<string | null | undefined>(
      props.value,
      bindings?.value
    );

    return h(
      UTabs,
      {
        modelValue: value ?? null,
        items: props.items,
        "onUpdate:modelValue": (nextValue: string) => {
          setValue(nextValue);
          emit("change");
        },
      },
      {
        default: () => children,
      }
    );
  },

  ToggleGroup: ({ props, bindings, emit }) => {
    const UButton = resolveComponent("UButton");
    const [value, setValue] = useBoundProp<string | string[] | null | undefined>(
      props.value,
      bindings?.value
    );
    const type = props.type ?? "single";

    const update = (nextValue: string | string[]) => {
      setValue(nextValue);
      emit("change");
    };

    const selectedValues =
      type === "multiple"
        ? Array.isArray(value)
          ? value
          : []
        : typeof value === "string"
          ? [value]
          : [];

    return h(
      "div",
      {
        class: "inline-flex items-center gap-2",
        "data-on-change": update,
      },
      props.items.map((item) => {
        const isActive = selectedValues.includes(item.value);
        return h(UButton, {
          key: item.value,
          label: item.label,
          color: props.color,
          variant: isActive ? "solid" : (props.variant ?? "outline"),
          disabled: item.disabled,
          onClick: () => {
            if (type === "multiple") {
              const next = isActive
                ? selectedValues.filter((entry) => entry !== item.value)
                : [...selectedValues, item.value];
              update(next);
            } else {
              update(item.value);
            }
          },
        });
      })
    );
  },

  Toggle: ({ props, bindings, emit }) => {
    const UButton = resolveComponent("UButton");
    const [pressed, setPressed] = useBoundProp<boolean | null | undefined>(
      props.pressed,
      bindings?.pressed
    );
    const isPressed = Boolean(pressed);

    return h(UButton, {
      label: props.label,
      color: props.color,
      variant: isPressed ? "solid" : (props.variant ?? "outline"),
      size: props.size,
      disabled: props.disabled,
      "aria-pressed": isPressed,
      onClick: () => {
        const nextPressed = !isPressed;
        setPressed(nextPressed);
        emit("change");
      },
    });
  },

  Tooltip: ({ props, children }) => {
    const UTooltip = resolveComponent("UTooltip");
    const normalizedChildren = Array.isArray(children)
      ? children
      : children
        ? [children]
        : [];
    return h(
      UTooltip,
      {
        text: props.text,
        kbds: props.kbds,
        side: props.side,
      },
      {
        default: () =>
          normalizedChildren.length > 0
            ? normalizedChildren
            : [h("span", { class: "underline decoration-dotted" }, "Hover me")],
      }
    );
  },
};
