# shadcn/ui Component Coverage Checklist

This package aims for compatibility with the official json-render shadcn package and tracks progress against its UI component set.

Source folder: [vercel-labs/json-render/packages/shadcn/src/ui](https://github.com/vercel-labs/json-render/tree/main/packages/shadcn/src/ui)

> Source component list snapshot: as of Mar 28, 2026.

Legend:
- `[x]` Implemented in `json-render-nuxt-ui`
- `[ ]` Not yet implemented

Current implementation files:
- Component definitions: [`src/catalog.ts`](./src/catalog.ts)
- Component implementations: [`src/components.ts`](./src/components.ts)

## Components

- [x] [`accordion`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/accordion.tsx) (implemented as `Accordion`)
- [x] [`alert`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/alert.tsx) (implemented as `Alert`)
- [x] [`avatar`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/avatar.tsx) (implemented as `Avatar`)
- [x] [`badge`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/badge.tsx) (implemented as `Badge`)
- [x] [`button`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/button.tsx) (implemented as `Button`)
- [x] [`card`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/card.tsx) (implemented as `Card`)
- [x] [`carousel`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/carousel.tsx) (implemented as `Carousel`)
- [x] [`checkbox`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/checkbox.tsx) (implemented as `Checkbox`)
- [x] [`collapsible`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/collapsible.tsx) (implemented as `Collapsible`)
- [x] [`dialog`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/dialog.tsx) (implemented as `Dialog`)
- [x] [`drawer`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/drawer.tsx) (implemented as `Drawer`)
- [x] [`dropdown-menu`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/dropdown-menu.tsx) (implemented as `DropdownMenu`)
- [x] [`input`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/input.tsx) (implemented as `Input`)
- [x] [`label`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/label.tsx) (implemented as `Label`)
- [x] [`pagination`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/pagination.tsx) (implemented as `Pagination`)
- [x] [`popover`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/popover.tsx) (implemented as `Popover`)
- [x] [`progress`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/progress.tsx) (implemented as `Progress`)
- [x] [`radio-group`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/radio-group.tsx) (implemented as `RadioGroup`)
- [x] [`select`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/select.tsx) (implemented as `Select`)
- [x] [`separator`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/separator.tsx) (implemented as `Divider`)
- [x] [`skeleton`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/skeleton.tsx) (implemented as `Skeleton`)
- [x] [`slider`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/slider.tsx) (implemented as `Slider`)
- [x] [`switch`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/switch.tsx) (implemented as `Switch`)
- [x] [`table`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/table.tsx) (implemented as `Table`)
- [x] [`tabs`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/tabs.tsx) (implemented as `Tabs`)
- [x] [`textarea`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/textarea.tsx) (implemented as `Textarea`)
- [x] [`toggle-group`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/toggle-group.tsx) (implemented as `ToggleGroup`)
- [x] [`toggle`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/toggle.tsx) (implemented as `Toggle`)
- [x] [`tooltip`](https://github.com/vercel-labs/json-render/blob/main/packages/shadcn/src/ui/tooltip.tsx) (implemented as `Tooltip`)

## Notes

- This package also includes layout and utility components not in the shadcn package: `Stack`, `Row`, `Divider`, `Text`, and `Header`.
- Implemented status is based on both catalog definition and runtime component renderer being present.
