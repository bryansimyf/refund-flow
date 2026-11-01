export const REFUND_REASONS = [
  "wrong_item",
  "missing_item",
  "quality_issue",
  "late_delivery",
  "other",
] as const;

export type RefundReason = (typeof REFUND_REASONS)[number];

export const REFUND_CHANNELS = ["original_payment_method", "in_app_credit"] as const;

export type RefundChannel = (typeof REFUND_CHANNELS)[number];
