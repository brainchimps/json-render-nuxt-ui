# json-render-nuxt-ui demo

Nuxt 4 app that consumes the local [`json-render-nuxt-ui`](../../packages/json-render-nuxt-ui) workspace package.

## Environment

Create [`apps/demo/.env`](./.env) from [`apps/demo/.env.example`](./.env.example):

```bash
cp apps/demo/.env.example apps/demo/.env
```

- `AI_GATEWAY_API_KEY` is required for the server chat endpoint.
- `ENFORCE_AI_MODEL` (optional) — lock the UI and server to a single model (must be a Gateway ID listed in [`shared/models.ts`](./shared/models.ts)).
- `IMPRINT_URL` (optional) — if set, renders an "Imprint" link in the footer.
- `PRIVACY_POLICY_URL` (optional) — if set, renders a "Privacy Policy" link in the footer.

## Development

See the [root README](../../README.md#getting-started) for repo-level commands.

From this directory:

```bash
pnpm dev    # nuxt dev (source-aliased, no pre-build needed)
pnpm build  # builds json-render-nuxt-ui, then nuxt build
pnpm test   # nuxt prepare, then vitest run
```

`postinstall` runs `nuxt prepare` for Nuxt module codegen, so type-checking and
auto-imports work immediately after `pnpm install`.

## json-render integration

These are the key files for understanding how json-render works in this demo:

| File | Purpose |
|------|---------|
| [`plugins/register-json-render-nuxt-ui.ts`](./plugins/register-json-render-nuxt-ui.ts) | **Nuxt plugin** — globally registers the Nuxt UI components that json-render needs at runtime (see [why this is required](../../packages/json-render-nuxt-ui/README.md#nuxt-plugin-required)) |
| [`shared/json-render-catalog.ts`](./shared/json-render-catalog.ts) | Catalog schema — defines available components so the AI knows what to generate |
| [`shared/json-render-registry.ts`](./shared/json-render-registry.ts) | Component registry — maps the package's Nuxt UI components + a custom `FancyHeader` to render functions |
| [`composables/useJsonRender.ts`](./composables/useJsonRender.ts) | Client composable — streams specs via `useUIStream`, exposes `registry`, `renderedSpec`, `isGenerating`, and `send()` |
| [`server/api/generate.post.ts`](./server/api/generate.post.ts) | Server endpoint — builds the LLM prompt from the catalog and streams the response |
