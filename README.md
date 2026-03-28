# json-render-nuxt-ui

[![NPM](https://img.shields.io/npm/v/json-render-nuxt-ui)](https://www.npmjs.com/package/json-render-nuxt-ui) [![Vercel Deploy](https://deploy-badge.vercel.app/vercel/json-render-nuxt-ui)](https://json-render-nuxt-ui.brainchimps.com)

Pre-built [Nuxt UI](https://ui.nuxt.com/) components for [json-render](https://json-render.dev/) — define a catalog, point an LLM at it, and get AI-powered UI generation with live-streamed Nuxt UI interfaces.


## Getting Started

1. **[🚀 Try the live demo](https://json-render-nuxt-ui.brainchimps.com)** — see it in action
2. **[Use the npm package](https://www.npmjs.com/package/json-render-nuxt-ui)** — integrate with json-render
3. **[Browse the demo app](./apps/demo/)** — full integration example

## Packages

- [`packages/json-render-nuxt-ui`](packages/json-render-nuxt-ui) — drop-in catalog definitions and Vue render functions for Card, Header, Button, and Input
- [`apps/demo`](apps/demo) — Nuxt 4 chat app that streams AI-generated UI specs and renders them in real time

## Development

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

## License

MIT © [Brainchimps GmbH](https://brainchimps.com)
