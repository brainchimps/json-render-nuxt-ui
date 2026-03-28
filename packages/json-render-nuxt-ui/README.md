# json-render-nuxt-ui

Pre-built [Nuxt UI](https://ui.nuxt.com/) components for [json-render](https://json-render.dev/). Drop-in catalog definitions and Vue implementations to render JSON specs with Nuxt UI.

> 100% compatible with the official [@json-render/shadcn](https://www.npmjs.com/package/@json-render/shadcn) component set (29/29) as of Mar 28, 2026, plus additional non-shadcn layout/utility components. See [SHADCN_UI_COMPONENTS_CHECKLIST.md](./packages/json-render-nuxt-ui/SHADCN_UI_COMPONENTS_CHECKLIST.md).

> **[🚀 Try the live demo](https://json-render-nuxt-ui.brainchimps.com)** 

## Compatibility

This package aims for compatibility with the official json-render shadcn package and tracks progress against its UI component set in [`SHADCN_UI_COMPONENTS_CHECKLIST.md`](./SHADCN_UI_COMPONENTS_CHECKLIST.md).

## Installation

```bash
npm install json-render-nuxt-ui @json-render/core @json-render/vue @nuxt/ui zod
```

## Nuxt Plugin (required)

> **Unlike @json-render/shadcn**, Nuxt UI components are auto-imported via compile-time template transforms — they are **not** registered globally at runtime. This package deliberately uses Vue's `resolveComponent()` instead of importing `@nuxt/ui` internals directly, so consumers keep full control over tree-shaking and bundled component set. The trade-off is that you must register the components yourself in a Nuxt plugin. `registerNuxtUiGlobals()` makes this easy.

Create a plugin file (e.g. `plugins/register-json-render-nuxt-ui.ts`):

```typescript
import {
  registerNuxtUiGlobals,
  nuxtUiComponentDefinitions,
} from "json-render-nuxt-ui";
import {
  UCard,
  UButton,
  UInput,
  USelect,
  UCheckbox,
  UTextarea,
  USwitch,
  UModal,
} from "#components";

export default defineNuxtPlugin((nuxtApp) => {
  registerNuxtUiGlobals(
    nuxtApp,
    { UCard, UButton, UInput, USelect, UCheckbox, UTextarea, USwitch, UModal },
    nuxtUiComponentDefinitions,
  );
});
```

**How it works:**

- The second argument is a record of Nuxt UI components imported from `#components` (Nuxt's virtual module). Only these are tree-shakeable — never use `import("#components")` dynamically.
- The third argument determines which globals to register based on catalog component names. Pass `nuxtUiComponentDefinitions` to register all built-in components, or a subset like `{ Card: ..., Button: ... }` to register only what you use.
- If you forget a component, you'll see a clear warning in the console telling you exactly which import to add.

## Quick Start

### 1. Create a Catalog

Import standard definitions from `json-render-nuxt-ui/catalog` and pass them to `defineCatalog`:

```typescript
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/vue/schema";
import { nuxtUiComponentDefinitions } from "json-render-nuxt-ui/catalog";

const catalog = defineCatalog(schema, {
  components: {
    Card: nuxtUiComponentDefinitions.Card,
    Header: nuxtUiComponentDefinitions.Header,
    Button: nuxtUiComponentDefinitions.Button,
    Input: nuxtUiComponentDefinitions.Input,
  },
  actions: {},
});
```

> **Note:** State actions (`setState`, `pushState`, `removeState`, `validateForm`) are built into the Vue schema and handled automatically by `ActionProvider`.

### 2. Create a Registry

Import implementations from `json-render-nuxt-ui` and pass them to `defineRegistry`:

```typescript
import { defineRegistry } from "@json-render/vue";
import { nuxtUiComponents } from "json-render-nuxt-ui";

const { registry } = defineRegistry(catalog, {
  components: {
    Card: nuxtUiComponents.Card,
    Header: nuxtUiComponents.Header,
    Button: nuxtUiComponents.Button,
    Input: nuxtUiComponents.Input,
  },
});
```

### 3. Render

```vue
<script setup lang="ts">
import { JSONUIProvider, Renderer } from "@json-render/vue";
</script>

<template>
  <JSONUIProvider :registry="registry" :initial-state="{}">
    <Renderer :spec="spec" :registry="registry" />
  </JSONUIProvider>
</template>
```

## Extending with Custom Components

Start from the built-ins and add your own:

```typescript
import { z } from "zod";

const catalog = defineCatalog(schema, {
  components: {
    Card: nuxtUiComponentDefinitions.Card,
    Header: nuxtUiComponentDefinitions.Header,
    Button: nuxtUiComponentDefinitions.Button,
    Input: nuxtUiComponentDefinitions.Input,

    Metric: {
      props: z.object({
        label: z.string(),
        value: z.string(),
      }),
      description: "Simple metric item",
    },
  },
  actions: {},
});
```

## Standard Components

### Layout

| Component | Description |
|-----------|-------------|
| `Card` | Container card with optional title and description |
| `Header` | Section heading with optional description |

### Input

| Component | Description |
|-----------|-------------|
| `Button` | Clickable button (emits `press`) |
| `Input` | Text input with optional two-way state binding on `value` |
| `Select` | Select input with optional two-way state binding on `value` |
| `Checkbox` | Checkbox with optional two-way state binding on `checked` |
| `Textarea` | Multiline input with optional two-way state binding on `value` |
| `Switch` | Toggle switch with optional two-way state binding on `checked` |

### Overlay

| Component | Description |
|-----------|-------------|
| `Dialog` | Modal dialog with open binding and `confirm` / `cancel` events |

## Built-in Actions

State actions (`setState`, `pushState`, `removeState`, `validateForm`) are built into `@json-render/vue` schema and handled by `ActionProvider`.

| Action | Description |
|--------|-------------|
| `setState` | Set a value at a state path |
| `pushState` | Push a value onto an array in state |
| `removeState` | Remove an item from an array in state |
| `validateForm` | Validate all fields and write result to state |

## Exports

| Entry Point | Exports |
|-------------|---------|
| `json-render-nuxt-ui` | `nuxtUiComponents`, `nuxtUiComponentDefinitions`, `registerNuxtUiGlobals` |
| `json-render-nuxt-ui/catalog` | `nuxtUiComponentDefinitions` |

The `/catalog` entry point contains only Zod schemas and can be used in server-side prompt generation. The main entry re-exports `nuxtUiComponentDefinitions` for convenience so you only need one import in your plugin.
