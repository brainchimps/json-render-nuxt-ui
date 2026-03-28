# json-render-nuxt-ui workspace

Monorepo managed with `pnpm` workspaces.

## Packages

- `packages/json-render-nuxt-ui`: publishable npm package named `json-render-nuxt-ui`
- `apps/demo`: local demo consumer package

## Getting started

```bash
pnpm install
pnpm test
pnpm demo
```

## First exported API

The package currently exports:

- `helloWord(): string` -> returns `"Hello json-render!"`
