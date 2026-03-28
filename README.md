# json-render-nuxt-ui workspace

Monorepo managed with `pnpm` workspaces.

## Packages

- `packages/json-render-nuxt-ui`: publishable npm package named `json-render-nuxt-ui`
- `apps/demo`: Nuxt 4 app that depends on the workspace package (`@nuxt/ui`, Vitest)

## Getting started

```bash
pnpm install
pnpm build    # build library and demo (dependency order via workspace)
pnpm test     # run tests in all packages (library unit tests + demo Vitest)
pnpm demo     # Nuxt dev server for apps/demo (builds the library first)
```

Demo-only commands from the repo root:

```bash
pnpm demo:build   # production Nuxt build for apps/demo
pnpm demo:test    # Vitest in apps/demo (builds the library first)
```

From `apps/demo`, `pnpm dev`, `pnpm build`, and `pnpm test` each run `pnpm --filter json-render-nuxt-ui build` first so the linked workspace package is built before Nuxt or Vitest runs.

## First exported API

The package currently exports:

- `helloWord(): string` -> returns `"Hello json-render!"`

## License

MIT © [Brainchimps GmbH](https://brainchimps.com)
