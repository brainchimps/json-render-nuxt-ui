# json-render-nuxt-ui

Pre-built [Nuxt UI](https://ui.nuxt.com/) components for [json-render](https://json-render.dev/). Drop-in catalog definitions and Vue implementations to render JSON specs with Nuxt UI.

## Compatibility

This package aims for compatibility with the official json-render shadcn package and tracks progress against its UI component set in [`SHADCN_UI_COMPONENTS_CHECKLIST.md`](./SHADCN_UI_COMPONENTS_CHECKLIST.md).

## Installation

```bash
npm install json-render-nuxt-ui @json-render/core @json-render/vue @nuxt/ui zod
```

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
| `json-render-nuxt-ui` | `nuxtUiComponents` |
| `json-render-nuxt-ui/catalog` | `nuxtUiComponentDefinitions` |

The `/catalog` entry point contains only Zod schemas and can be used in server-side prompt generation.
