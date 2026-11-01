import { describe, expect, it } from "vitest";

import { computeRefundTotal, type RefundPreviewUnit } from "@/features/order/utils/refundTotal";

function previewRow(
  overrides: Partial<RefundPreviewUnit> & Pick<RefundPreviewUnit, "unitId">,
): RefundPreviewUnit {
  return {
    itemName: "Item",
    unitIndex: 0,
    unitPrice: 0,
    addons: [],
    ...overrides,
  };
}

describe("computeRefundTotal", () => {
  it("returns 0 when nothing is selected and delivery fee is not included", () => {
    expect(computeRefundTotal([], 5, false)).toBe(0);
  });

  it("sums unit prices and add-on prices", () => {
    const rows: RefundPreviewUnit[] = [
      previewRow({
        unitId: "u1",
        unitPrice: 13.9,
        addons: [{ name: "Extra Shot", unitPrice: 2 }],
      }),
    ];

    expect(computeRefundTotal(rows, 5, false)).toBeCloseTo(15.9);
  });

  it("adds delivery fee only when selected", () => {
    const rows: RefundPreviewUnit[] = [previewRow({ unitId: "u1", unitPrice: 10 })];

    expect(computeRefundTotal(rows, 5, false)).toBeCloseTo(10);
    expect(computeRefundTotal(rows, 5, true)).toBeCloseTo(15);
  });

  it("sums multiple preview rows", () => {
    const rows: RefundPreviewUnit[] = [
      previewRow({ unitId: "u1", unitPrice: 11.9, addons: [{ name: "Oat", unitPrice: 1.5 }] }),
      previewRow({ unitId: "u2", unitPrice: 7.9 }),
    ];

    expect(computeRefundTotal(rows, 5, true)).toBeCloseTo(26.3);
  });
});
