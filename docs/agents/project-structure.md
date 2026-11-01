# Project structure

## Layout

- `src/app/` — providers and router. No product UI.
- `src/features/<domain>/` — `api.ts`, `types.ts`, `queryKeys.ts`, `hooks.ts`, `index.ts`, plus `pages/`, `components/`, `store/` as needed.
- `src/components/` — shared UI. `components/ui/` is Base UI primitives.
- `src/layouts/` — `FullHeightLayout`.
- `src/stores/` — global UI store only.
- `src/lib/` — axios, api wrappers, react-query, i18n, mocks, `cn()`. One wrapper per package.
- `src/constants/` — endpoints, client, environment.

## Layers

- Features never import `apiClient`. They use `src/lib/api`.
- A helper used by one screen stays in that file. Extract it when a second screen needs it.
- Domain zustand stores live under the feature, not `src/stores`.
