# refund-flow

Mobile-first React + Vite SPA. Feature work lives under `src/features/`. The app shell in `src/app/` is routing and providers only.

## Boot

`main.tsx` optionally loads the mock API, then providers, then `RouterProvider`. `/` redirects to `/order`.

## Stack

pnpm, Node 24, React 19, Vite, react-router, TanStack Query, axios, zustand, Tailwind v4, Base UI, i18n (`en`, `ms`).

## Rules

- Imports use `@/*` only. HTTP goes through `apiGet`/`apiPost`/… Paths live in `src/constants/endpoints.ts`.
- Domain state stays in `features/<domain>/store`. Global UI state is `src/stores`.
- No hardcoded user-facing copy. Use i18n. TanStack hooks are named `useXQuery`.
- `*.svg?react` is a component. Plain `*.svg` is a URL.

## Docs

- [Project structure](docs/agents/project-structure.md)
- [Styling](docs/agents/styling.md)
- [Env and modes](docs/agents/env-and-modes.md)
- [Add an API endpoint](docs/agents/add-api-endpoint.md)
- [i18n](docs/agents/i18n.md)
- [Commit messages](docs/agents/write-commit.md)
