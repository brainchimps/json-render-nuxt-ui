# demo

Nuxt 4 app that consumes the local [`json-render-nuxt-ui`](../../packages/json-render-nuxt-ui) workspace package.

## Environment

Create [`apps/demo/.env`](./.env) from [`apps/demo/.env.example`](./.env.example):

```bash
cp apps/demo/.env.example apps/demo/.env
```

- `AI_GATEWAY_API_KEY` is required for the server chat endpoint.
- `ENFORCE_AI_MODEL` is optional:
  - Use fully-qualified Gateway model IDs (for example `openai/gpt-5.4-nano`).
  - If set, it overrides the available model list: the UI only offers that single model and the server enforces it.
  - It must match one of the allowlisted models in [`apps/demo/shared/models.ts`](./shared/models.ts).
  - This is useful for public deployments where you want to lock users to one approved model.

## From repository root

| Command | What it runs |
|--------|----------------|
| `pnpm demo` | `pnpm --filter demo dev` — Nuxt dev server |
| `pnpm demo:build` | `pnpm --filter demo build` — Nuxt production build |
| `pnpm demo:test` | `pnpm --filter demo test` — Vitest |

## From this directory ([`apps/demo`](./))

```bash
pnpm dev    # builds json-render-nuxt-ui, then nuxt dev
pnpm build  # builds json-render-nuxt-ui, then nuxt build
pnpm test   # builds json-render-nuxt-ui, then vitest run
```

`postinstall` runs `nuxt prepare` for Nuxt module codegen.
