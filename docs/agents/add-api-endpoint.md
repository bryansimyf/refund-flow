# Add an API endpoint

1. Add the path to `src/constants/endpoints.ts`. That is the only place HTTP paths belong.
2. Add a function in the feature `api.ts` that calls `apiGet` / `apiPost` / `apiPut` / `apiPatch` / `apiDelete`.
3. Add types in `types.ts` and a key in `queryKeys.ts`.
4. Expose a TanStack hook named `useXQuery` (or a mutation hook) from `hooks.ts`.
5. For mock mode, register a handler in `src/lib/axiosMock/response/` using `res200` / `res400` / `res401` / `res403`.
