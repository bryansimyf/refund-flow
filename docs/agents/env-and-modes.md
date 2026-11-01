# Env and modes

Env files live in `env/.env.<mode>`. Vite `envDir` is `env`. `pnpm run dev` uses `local-mock`.

## Modes

`local-mock`, `local-local`, `local-dev`, `local-stage`, `local-test`, `development`, `development-mock`, `staging`, `testing`, `production`.

`VITE_ENABLE_MOCK_API` is `"1"` only in `*-mock` modes. `VITE_ENV` is `local | development | staging | testing | production`.

`env/<VITE_ENV>/robots.txt` is copied into the build. `%VAR%` placeholders in `index.html` and `public/manifest.json` are filled at build time.

Do not invent URLs or IDs. Keep `<PLACEHOLDER>` until the real value exists.
