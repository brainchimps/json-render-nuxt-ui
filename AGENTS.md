# AGENTS.md

## Publishing Requires Explicit Approval

- Never run publish or release commands on behalf of the user unless the user explicitly asks for that exact command in the current request.
- Treat these as protected commands: `npm publish`, `pnpm publish`, `yarn publish`, `bun publish`, `changeset publish`, `semantic-release`, and any script that triggers publishing.
- Before any protected command, ask for confirmation and wait for a clear "yes, run it now".
- If prior messages allowed publishing, that permission does not carry over to later turns.

## Adding or Modifying Components

Every component in `packages/json-render-nuxt-ui` touches **four** files. When adding, renaming, or removing a component, update all of them:

1. **`src/catalog.ts`** — Zod props schema, description, slots, and events in `nuxtUiComponentDefinitions`.
2. **`src/components.ts`** — Vue render function in `nuxtUiComponents`.
3. **`src/globals.ts`** — If the component uses `resolveComponent()` for a `@nuxt/ui` component, add its dependencies to `nuxtUiGlobalDeps`. Pure HTML components (Stack, Row, Divider, Text, Header) have no entry.
4. **`test/index.test.ts`** — Add the component name to `componentNames`, add slots/events assertions, and add valid + invalid props entries. Also update **`test/renderers.test.ts`** with a renderer test for the new component.

The demo plugin (`apps/demo/plugins/register-json-render-nuxt-ui.ts`) only needs updating when a new `@nuxt/ui` global is introduced (i.e. a new entry in `nuxtUiGlobalDeps`).

Also update **[`SHADCN_UI_COMPONENTS_CHECKLIST.md`](packages/json-render-nuxt-ui/SHADCN_UI_COMPONENTS_CHECKLIST.md)** — check off any shadcn component that the new component covers, and list new non-shadcn components in the Notes section.
