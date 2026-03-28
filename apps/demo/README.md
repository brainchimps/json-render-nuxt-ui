# demo

Nuxt 4 app that consumes the local `json-render-nuxt-ui` workspace package.

## From repository root

| Command | What it runs |
|--------|----------------|
| `pnpm demo` | `pnpm --filter demo dev` — Nuxt dev server |
| `pnpm demo:build` | `pnpm --filter demo build` — Nuxt production build |
| `pnpm demo:test` | `pnpm --filter demo test` — Vitest |

## From this directory (`apps/demo`)

```bash
pnpm dev    # builds json-render-nuxt-ui, then nuxt dev
pnpm build  # builds json-render-nuxt-ui, then nuxt build
pnpm test   # builds json-render-nuxt-ui, then vitest run
```

`postinstall` runs `nuxt prepare` for Nuxt module codegen.
