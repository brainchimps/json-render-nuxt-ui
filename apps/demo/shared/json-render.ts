import { defineRegistry } from "@json-render/vue";
import { h } from "vue";
import { catalog } from "~/shared/json-render-catalog";

const { registry } = defineRegistry(catalog, {
  components: {
    Panel: ({ props, children }) =>
      h(
        "section",
        {
          class:
            "space-y-3 rounded-lg border border-muted bg-elevated p-4 text-default",
        },
        [
          h("div", { class: "space-y-1" }, [
            h("h3", { class: "text-base font-semibold" }, props.title),
            props.description
              ? h("p", { class: "text-sm text-muted" }, props.description)
              : null,
          ]),
          children,
        ]
      ),
    Text: ({ props }) =>
      h(
        "p",
        {
          class:
            props.tone === "muted"
              ? "text-sm text-muted leading-relaxed"
              : "text-sm leading-relaxed",
        },
        props.content
      ),
    Stat: ({ props }) =>
      h("div", { class: "flex items-center justify-between gap-2 text-sm" }, [
        h("span", { class: "text-muted" }, props.label),
        h("strong", { class: "font-semibold" }, props.value),
      ]),
    Tag: ({ props }) =>
      h(
        "span",
        {
          class:
            "inline-flex w-fit items-center rounded-full border border-muted bg-elevated px-2 py-1 text-xs font-medium text-default",
        },
        props.label
      ),
  },
});

export { catalog, registry };
