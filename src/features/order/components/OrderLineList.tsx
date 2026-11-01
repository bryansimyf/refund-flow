import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/shadcn/utils";

import type { OrderLineItem, PaymentStatus } from "@/features/order/types";

import { StatusChip } from "@/components/StatusChip";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const paymentStatusLabelKey = {
  completed: "status.completed",
  paid: "status.paid",
  refunded: "status.refunded",
} as const satisfies Record<PaymentStatus, `status.${PaymentStatus}`>;

/** Maps payment status to StatusChip tone for order line rows. */
function paymentStatusTone(status: PaymentStatus): "success" | "warning" {
  return status === "refunded" ? "warning" : "success";
}

/** Checked, non-interactive styling for rows already refunded (not a new selection). */
export const lockedRefundedCheckboxClassName =
  "cursor-not-allowed opacity-100 disabled:opacity-100 data-checked:border-grey-400 data-checked:bg-grey-400 data-checked:text-white dark:data-checked:border-grey-400 dark:data-checked:bg-grey-400";

function refundUnitCheckboxId(unitId: string) {
  return `refund-unit-${unitId}`;
}

function refundAddonCheckboxId(unitId: string, addonId: string) {
  return `refund-addon-${unitId}-${addonId}`;
}

export function OrderPaymentStatusChip({ status }: { status: PaymentStatus }) {
  const { t } = useTranslation("order");

  return <StatusChip label={t(paymentStatusLabelKey[status])} tone={paymentStatusTone(status)} />;
}

/** Composite key because addon ids repeat across units on the same order. */
export function orderAddonSelectionKey(unitId: string, addonId: string) {
  return `${unitId}:${addonId}`;
}

export type OrderLineListSelection = {
  isUnitSelected: (unitId: string) => boolean;
  onUnitSelectedChange: (unitId: string, selected: boolean) => void;
  isAddonSelected: (unitId: string, addonId: string) => boolean;
  onAddonSelectedChange: (unitId: string, addonId: string, selected: boolean) => void;
};

type OrderLineListProps = {
  currency: string;
  items: OrderLineItem[];
  selection?: OrderLineListSelection;
};

export function OrderLineList({ currency, items, selection }: OrderLineListProps) {
  const { t } = useTranslation("order");

  const list = (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.lineId} className="flex flex-col gap-3 rounded-md border border-grey-100 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-body text-grey-900">{item.name}</p>
              <p className="text-caption text-grey-600">
                {t("quantityLabel", { count: item.units.length })}
              </p>
            </div>
            <p className="shrink-0 text-body text-grey-700">
              {formatCurrency(currency, item.units.length * item.unitPrice)}
            </p>
          </div>
          <ul className="flex flex-col gap-3 border-t border-grey-100 pt-3">
            {item.units.map((unit, unitIndex) => {
              const unitRefunded = unit.status === "refunded";
              const unitLabel = `${t("unitLabel")} ${unitIndex + 1}`;
              const unitCheckboxId = refundUnitCheckboxId(unit.unitId);

              return (
                <li
                  key={unit.unitId}
                  className="flex flex-col gap-2 border-l-2 border-grey-200 pl-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {selection ? (
                      <Field
                        orientation="horizontal"
                        data-disabled={unitRefunded || undefined}
                        className="min-w-0 flex-1 items-center gap-2"
                      >
                        <Checkbox
                          id={unitCheckboxId}
                          checked={unitRefunded || selection.isUnitSelected(unit.unitId)}
                          onCheckedChange={(checked) =>
                            selection.onUnitSelectedChange(unit.unitId, checked)
                          }
                          disabled={unitRefunded}
                          className={cn(unitRefunded && lockedRefundedCheckboxClassName)}
                        />
                        <FieldLabel
                          htmlFor={unitCheckboxId}
                          className="cursor-pointer text-caption font-normal text-grey-600"
                        >
                          {unitLabel}
                        </FieldLabel>
                      </Field>
                    ) : (
                      <p className="text-caption text-grey-600">{unitLabel}</p>
                    )}
                    <OrderPaymentStatusChip status={unit.status} />
                  </div>
                  {unit.addons.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      <li className="text-caption text-grey-500">{t("addonsHeading")}</li>
                      {unit.addons.map((addon) => {
                        const addonLocked = unitRefunded || addon.status === "refunded";
                        const addonCheckboxId = refundAddonCheckboxId(unit.unitId, addon.addonId);

                        return (
                          <li
                            key={orderAddonSelectionKey(unit.unitId, addon.addonId)}
                            className="flex items-start justify-between gap-3 pl-2"
                          >
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                              {selection ? (
                                <Field
                                  orientation="horizontal"
                                  data-disabled={addonLocked || undefined}
                                  className="min-w-0 flex-1 items-center gap-2"
                                >
                                  <Checkbox
                                    id={addonCheckboxId}
                                    checked={
                                      addonLocked ||
                                      selection.isAddonSelected(unit.unitId, addon.addonId)
                                    }
                                    onCheckedChange={(checked) =>
                                      selection.onAddonSelectedChange(
                                        unit.unitId,
                                        addon.addonId,
                                        checked,
                                      )
                                    }
                                    disabled={addonLocked}
                                    className={cn(addonLocked && lockedRefundedCheckboxClassName)}
                                  />
                                  <FieldLabel
                                    htmlFor={addonCheckboxId}
                                    className="cursor-pointer text-caption font-normal text-grey-700"
                                  >
                                    {addon.name}
                                  </FieldLabel>
                                </Field>
                              ) : (
                                <span className="text-caption text-grey-700">{addon.name}</span>
                              )}
                              <OrderPaymentStatusChip status={addon.status} />
                            </div>
                            <span className="shrink-0 text-caption text-grey-600">
                              {formatCurrency(currency, addon.unitPrice)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );

  if (selection) {
    return <FieldGroup className="gap-4">{list}</FieldGroup>;
  }

  return list;
}
