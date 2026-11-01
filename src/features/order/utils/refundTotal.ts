export type RefundPreviewUnit = {
  unitId: string;
  itemName: string;
  unitIndex: number;
  unitPrice: number;
  addons: Array<{ name: string; unitPrice: number }>;
};

export function computeRefundTotal(
  previewUnits: RefundPreviewUnit[],
  deliveryFee: number,
  refundDeliveryFeeSelected: boolean,
): number {
  let total = previewUnits.reduce(
    (sum, row) =>
      sum + row.unitPrice + row.addons.reduce((addonSum, addon) => addonSum + addon.unitPrice, 0),
    0,
  );

  if (refundDeliveryFeeSelected) {
    total += deliveryFee;
  }

  return total;
}
