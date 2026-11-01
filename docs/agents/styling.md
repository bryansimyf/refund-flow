# Styling

Tailwind v4 is loaded from `src/index.css`. Brand and semantic tokens live in `@theme`. Fluid type uses `clamp()` (the plan's `--dclamp()` pattern).

## Width caps

Caps and page padding live on `#root`. Feature pages should not set their own max width.

- Below `md` (768px): content capped at 580px and centered.
- `md` to below `lg`: fluid, with horizontal padding.
- `lg` and up: centered, capped at 1440px.

`body` min-width is 320px. `dark:` is class-based and unused.

## UI

- Use `cn()` from `@/lib/shadcn/utils`.
- Primitives come from `@base-ui/react`, not Radix.
- `Button` sizes icons to 16px unless the icon has a `size-*` class.
- Base UI orientation hooks use `data-[orientation=vertical]:`.
