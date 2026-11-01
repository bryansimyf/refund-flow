# Refund Flow

Mobile-first staff UI for reviewing one order and submitting a refund.

**Stack:** pnpm, Node 24, React 19, Vite, React Router, TanStack Query, axios, Zustand, Tailwind v4, Base UI, i18n (`en`, `ms`).

**Demo:** [https://bryansimyf.github.io/refund-flow/](https://bryansimyf.github.io/refund-flow/)

## Run

Requires Node 24 and pnpm.

```bash
pnpm install
pnpm dev
```

`pnpm dev` uses the `local-mock` mode, so the order comes from the mock API.

```bash
pnpm test
pnpm run deploy
```

`pnpm test` runs Vitest. `pnpm run deploy` runs tests, builds for GitHub Pages, and publishes `dist` to the `gh-pages` branch. A failing test stops the publish.

## API

Wired today ([`src/constants/endpoints.ts`](src/constants/endpoints.ts)):

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/order` | Order detail. [`mapOrder`](src/features/order/api.ts) maps snake_case JSON to the in-app `Order` shape. |

Planned:

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| `POST` | `/orders/refund` | `unitIds`, `isDeliveryFeeRefunded`, `reason`, `channel` | `200` with `{ "status": "success" }` |
| `POST` | `/orders/refund/preview` | Selected `line_id` / `unit_id` (confirm with backend) | Same shape as order detail, plus refund total |

The UI selects **unit** ids; add-ons refund with their unit. There is no separate add-on id in the payload today. Confirm only logs the submit body until the refund endpoint exists.

## Refund calculation

On the **select** step, the running total is computed in the browser so it updates as staff check units and the delivery fee. That logic is [`computeRefundTotal`](src/features/order/utils/refundTotal.ts), covered by [`refundTotal.test.ts`](src/features/order/utils/refundTotal.test.ts).

On **review**, the total should come from the server. **Next** should call `POST /orders/refund/preview`, and the review screen should show the items and total returned by the API so a wrong client-side sum is caught before submit.

## Assumptions for PM and design

**PM.** The select flow feels redundant: staff can tick items and add-ons, but an add-on cannot be refunded without its main item. Consider refunding by item only, with add-ons included automatically, and drop separate add-on checkboxes.

**Design.** The refund dialog does two jobs (selection and review). An alternative: **Refund** puts the order details page into selection mode (same line list with checkboxes); **Confirm** opens only the preview dialog.

## Key decisions and trade-offs

- **i18n (`en`, `ms`)** — Staff-facing copy is not hardcoded; the product is used in more than one language (English and Malay catalogs).
- **Shared [`OrderLineList`](src/features/order/components/OrderLineList.tsx)** — One list for read-only order details and for refund selection. An optional `selection` prop enables checkboxes and locked already-refunded rows, which makes the component heavier. It is used on the order details screen and the refund select step; the review step still uses its own preview list.
- **TanStack Query + Zustand UI** — Fetches drive [`GlobalSpinner`](src/components/GlobalSpinner.tsx); failures open [`GlobalErrorDialog`](src/components/GlobalErrorDialog.tsx). Per-query `meta` can set `hideGlobalSpinner` or `hideGlobalError`.
- **`mapOrder`** — Snake_case API fields are normalized to camelCase once at the API boundary; screens only consume `Order`, at the cost of maintaining `OrderApiResponse` beside the mapper.

## Known limitations and next steps

- Confirm does not call the API; it logs `{ unitIds, isDeliveryFeeRefunded, reason, channel }`.
- `POST /orders/refund` and `POST /orders/refund/preview` are not implemented. Step 2 is still built from the client-side selection.
- English and Malay are chosen via `?lang=` or session storage; the order screen has no in-app language switch.
- The review step does not reuse `OrderLineList`; it renders a separate preview list.
- After a successful refund submit, the order page should **refetch** `GET /order` so order details reflect updated lines, add-ons, and delivery fee (today the dialog closes without invalidating the order query).
- **Order details UX** — Align with the design note above: selection on the order page, preview-only dialog.
- **Roadmap:** Add refund + preview endpoints, render preview on step 2, refetch order after submit, move selection onto order details, then resolve add-on selection with PM/design.
