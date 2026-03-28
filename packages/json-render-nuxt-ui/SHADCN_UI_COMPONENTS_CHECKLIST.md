# shadcn/ui Component Coverage Checklist

This package aims for compatibility with the official json-render shadcn package and tracks progress against its UI component set.

Source folder: [vercel-labs/json-render/packages/shadcn/src/ui](https://github.com/vercel-labs/json-render/tree/main/packages/shadcn/src/ui)

Legend:
- `[x]` Implemented in `json-render-nuxt-ui`
- `[ ]` Not yet implemented

Current implementation files:
- Component definitions: [`src/catalog.ts`](./src/catalog.ts)
- Component implementations: [`src/components.ts`](./src/components.ts)

## Components

- [ ] [`accordion`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/accordion.tsx)
- [ ] [`alert`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/alert.tsx)
- [ ] [`avatar`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/avatar.tsx)
- [ ] [`badge`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/badge.tsx)
- [x] [`button`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/button.tsx) (implemented as `Button`)
- [x] [`card`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/card.tsx) (implemented as `Card`)
- [ ] [`carousel`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/carousel.tsx)
- [ ] [`checkbox`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/checkbox.tsx)
- [ ] [`collapsible`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/collapsible.tsx)
- [ ] [`dialog`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/dialog.tsx)
- [ ] [`drawer`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/drawer.tsx)
- [ ] [`dropdown-menu`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/dropdown-menu.tsx)
- [x] [`input`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/input.tsx) (implemented as `Input`)
- [ ] [`label`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/label.tsx)
- [ ] [`pagination`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/pagination.tsx)
- [ ] [`popover`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/popover.tsx)
- [ ] [`progress`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/progress.tsx)
- [ ] [`radio-group`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/radio-group.tsx)
- [ ] [`select`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/select.tsx)
- [ ] [`separator`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/separator.tsx)
- [ ] [`skeleton`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/skeleton.tsx)
- [ ] [`slider`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/slider.tsx)
- [ ] [`switch`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/switch.tsx)
- [ ] [`table`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/table.tsx)
- [ ] [`tabs`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/tabs.tsx)
- [ ] [`textarea`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/textarea.tsx)
- [ ] [`toggle-group`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/toggle-group.tsx)
- [ ] [`toggle`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/toggle.tsx)
- [ ] [`tooltip`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/tooltip.tsx)

## Notes

- Your package currently includes one extra non-shadcn component: `Header`.
- Implemented status is based on both catalog definition and runtime component renderer being present.
