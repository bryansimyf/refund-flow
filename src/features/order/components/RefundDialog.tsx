import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/shadcn/utils";

import {
  lockedRefundedCheckboxClassName,
  OrderLineList,
  type OrderLineListSelection,
  OrderPaymentStatusChip,
} from "@/features/order/components/OrderLineList";
import {
  REFUND_CHANNELS,
  REFUND_REASONS,
  type RefundChannel,
  type RefundReason,
} from "@/features/order/constants";
import type { Order } from "@/features/order/types";
import { computeRefundTotal, type RefundPreviewUnit } from "@/features/order/utils/refundTotal";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const deliveryFeeCheckboxId = "refund-delivery-fee";
const REFUND_STEP_TOTAL = 2;

type RefundDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
};

function buildRefundPreviewUnits(order: Order, selectedUnitIds: Set<string>): RefundPreviewUnit[] {
  const rows: RefundPreviewUnit[] = [];

  for (const item of order.items) {
    item.units.forEach((unit, unitIndex) => {
      if (!selectedUnitIds.has(unit.unitId)) {
        return;
      }

      rows.push({
        unitId: unit.unitId,
        itemName: item.name,
        unitIndex,
        unitPrice: item.unitPrice,
        addons: unit.addons
          .filter((addon) => addon.status !== "refunded")
          .map((addon) => ({ name: addon.name, unitPrice: addon.unitPrice })),
      });
    });
  }

  return rows;
}

type StepRefundProps = {
  order: Order;
  selection: OrderLineListSelection;
  refundDeliveryFeeSelected: boolean;
  onRefundDeliveryFeeSelectedChange: (selected: boolean) => void;
};

function StepRefund({
  order,
  selection,
  refundDeliveryFeeSelected,
  onRefundDeliveryFeeSelectedChange,
}: StepRefundProps) {
  const { t } = useTranslation("order");

  const deliveryFeeRefunded = order.deliveryFeeStatus === "refunded";
  const showDeliveryFeeRow = order.deliveryFee > 0;

  return (
    <>
      <OrderLineList currency={order.currency} items={order.items} selection={selection} />
      {showDeliveryFeeRow ? (
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Field
              orientation="horizontal"
              data-disabled={deliveryFeeRefunded || undefined}
              className="min-w-0 flex-1 items-center gap-2"
            >
              <Checkbox
                id={deliveryFeeCheckboxId}
                checked={deliveryFeeRefunded || refundDeliveryFeeSelected}
                onCheckedChange={(checked) => onRefundDeliveryFeeSelectedChange(checked === true)}
                disabled={deliveryFeeRefunded}
                className={cn(deliveryFeeRefunded && lockedRefundedCheckboxClassName)}
              />
              <FieldLabel
                htmlFor={deliveryFeeCheckboxId}
                className="cursor-pointer text-body font-normal text-grey-900"
              >
                {t("deliveryFeeLabel")}
              </FieldLabel>
            </Field>
            <OrderPaymentStatusChip status={order.deliveryFeeStatus} />
          </div>
          <span className="shrink-0 text-body text-grey-900">
            {formatCurrency(order.currency, order.deliveryFee)}
          </span>
        </div>
      ) : null}
    </>
  );
}

type StepRefundReviewProps = {
  order: Order;
  previewUnits: RefundPreviewUnit[];
  refundDeliveryFeeSelected: boolean;
  reason: RefundReason | null;
  onReasonChange: (reason: RefundReason) => void;
  channel: RefundChannel | null;
  onChannelChange: (channel: RefundChannel) => void;
};

function StepRefundReview({
  order,
  previewUnits,
  refundDeliveryFeeSelected,
  reason,
  onReasonChange,
  channel,
  onChannelChange,
}: StepRefundReviewProps) {
  const { t } = useTranslation("order");

  const reasonItems = REFUND_REASONS.map((value) => ({
    value,
    label: t(`refundDialog.reasons.${value}`),
  }));

  const channelItems = REFUND_CHANNELS.map((value) => ({
    value,
    label: t(`refundDialog.channels.${value}`),
  }));

  return (
    <>
      <h2 className="text-label font-medium text-grey-700">{t("refundDialog.previewHeading")}</h2>
      <ul className="flex flex-col gap-3">
        {previewUnits.map((row) => (
          <li
            key={row.unitId}
            className="flex flex-col gap-2 rounded-md border border-grey-100 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-body text-grey-900">{row.itemName}</p>
                <p className="text-caption text-grey-600">
                  {t("unitLabel")} {row.unitIndex + 1}
                </p>
              </div>
              <span className="shrink-0 text-body text-grey-700">
                {formatCurrency(order.currency, row.unitPrice)}
              </span>
            </div>
            {row.addons.length > 0 ? (
              <ul className="flex flex-col gap-1 border-t border-grey-100 pt-2 pl-2">
                {row.addons.map((addon) => (
                  <li
                    key={addon.name}
                    className="flex items-center justify-between gap-2 text-caption text-grey-700"
                  >
                    <span>{addon.name}</span>
                    <span className="shrink-0 text-grey-600">
                      {formatCurrency(order.currency, addon.unitPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
        {refundDeliveryFeeSelected ? (
          <li className="flex items-center justify-between gap-3 rounded-md border border-grey-100 p-3">
            <span className="text-body text-grey-900">{t("deliveryFeeLabel")}</span>
            <span className="shrink-0 text-body text-grey-900">
              {formatCurrency(order.currency, order.deliveryFee)}
            </span>
          </li>
        ) : null}
      </ul>
      <Field className="gap-2">
        <FieldLabel>{t("refundDialog.reasonLabel")}</FieldLabel>
        <Select
          items={reasonItems}
          value={reason}
          onValueChange={(value) => onReasonChange(value as RefundReason)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("refundDialog.reasonPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {REFUND_REASONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`refundDialog.reasons.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field className="gap-2">
        <FieldLabel>{t("refundDialog.channelLabel")}</FieldLabel>
        <Select
          items={channelItems}
          value={channel}
          onValueChange={(value) => onChannelChange(value as RefundChannel)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("refundDialog.channelPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {REFUND_CHANNELS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`refundDialog.channels.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </>
  );
}

export function RefundDialog({ open, onOpenChange, order }: RefundDialogProps) {
  const { t } = useTranslation("order");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(() => new Set());
  const [refundDeliveryFeeSelected, setRefundDeliveryFeeSelected] = useState(false);
  const [reason, setReason] = useState<RefundReason | null>(null);
  const [channel, setChannel] = useState<RefundChannel | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const stepBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepBodyRef.current) {
      stepBodyRef.current.scrollTop = 0;
    }
  }, [step]);

  const canProceedToPreview = selectedUnitIds.size > 0 || refundDeliveryFeeSelected;
  const canConfirm = reason !== null && channel !== null;

  const previewUnits = useMemo(
    () => buildRefundPreviewUnits(order, selectedUnitIds),
    [order, selectedUnitIds],
  );

  const refundTotal = useMemo(
    () => computeRefundTotal(previewUnits, order.deliveryFee, refundDeliveryFeeSelected),
    [order.deliveryFee, previewUnits, refundDeliveryFeeSelected],
  );

  const resetDialogState = useCallback(() => {
    setStep(1);
    setSelectedUnitIds(new Set());
    setRefundDeliveryFeeSelected(false);
    setReason(null);
    setChannel(null);
    setConfirmOpen(false);
  }, []);

  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetDialogState();
        onOpenChange(false);
      }
    },
    [onOpenChange, resetDialogState],
  );

  /** Unit selected for refund; add-ons on that unit share the same flag. */
  const isUnitSelected = useCallback(
    (unitId: string) => selectedUnitIds.has(unitId),
    [selectedUnitIds],
  );

  /** Selects or clears the whole unit (and its add-ons in the UI). */
  const onUnitSelectedChange = useCallback((unitId: string, selected: boolean) => {
    setSelectedUnitIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(unitId);
      } else {
        next.delete(unitId);
      }

      return next;
    });
  }, []);

  /** Add-ons refund with their unit; toggling one toggles the unit group. */
  const isAddonSelected = useCallback(
    (unitId: string, addonId: string) => {
      void addonId;

      return selectedUnitIds.has(unitId);
    },
    [selectedUnitIds],
  );

  const onAddonSelectedChange = useCallback(
    (unitId: string, addonId: string, selected: boolean) => {
      void addonId;
      onUnitSelectedChange(unitId, selected);
    },
    [onUnitSelectedChange],
  );

  const selection: OrderLineListSelection = {
    isUnitSelected,
    onUnitSelectedChange,
    isAddonSelected,
    onAddonSelectedChange,
  };

  const handleNext = useCallback(() => {
    setStep(2);
  }, []);

  const handleBack = useCallback(() => {
    setStep(1);
  }, []);

  const handleConfirmClick = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirmYes = useCallback(() => {
    const refundData = {
      unitIds: Array.from(selectedUnitIds),
      isDeliveryFeeRefunded: refundDeliveryFeeSelected,
      reason,
      channel,
    };

    // TODO: perform refund API call with refundData
    // void refundData;
    console.log(refundData);

    resetDialogState();
    onOpenChange(false);
  }, [channel, onOpenChange, reason, refundDeliveryFeeSelected, resetDialogState, selectedUnitIds]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden sm:max-w-lg">
          <DialogHeader className="shrink-0">
            <DialogTitle>{t("refundDialog.title")}</DialogTitle>
            <DialogDescription>{t("refundDialog.body")}</DialogDescription>
            <p className="text-label font-medium text-brand-700">
              {t("refundDialog.stepLabel", { current: step, total: REFUND_STEP_TOTAL })}
              {" · "}
              {t(step === 1 ? "refundDialog.stepSelect" : "refundDialog.stepPreview")}
            </p>
          </DialogHeader>
          <div
            ref={stepBodyRef}
            className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain no-scrollbar px-4 -mx-4"
          >
            {step === 1 ? (
              <StepRefund
                order={order}
                selection={selection}
                refundDeliveryFeeSelected={refundDeliveryFeeSelected}
                onRefundDeliveryFeeSelectedChange={setRefundDeliveryFeeSelected}
              />
            ) : (
              <StepRefundReview
                order={order}
                previewUnits={previewUnits}
                refundDeliveryFeeSelected={refundDeliveryFeeSelected}
                reason={reason}
                onReasonChange={setReason}
                channel={channel}
                onChannelChange={setChannel}
              />
            )}
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-grey-200 pt-4">
            <span className="text-body font-medium text-grey-900">
              {t("refundDialog.totalLabel")}
            </span>
            <span className="shrink-0 text-body font-medium text-grey-900">
              {formatCurrency(order.currency, refundTotal)}
            </span>
          </div>
          <DialogFooter className="shrink-0">
            {step === 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                >
                  {t("refundDialog.close")}
                </Button>
                <Button type="button" disabled={!canProceedToPreview} onClick={handleNext}>
                  {t("refundDialog.next")}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleBack}>
                  {t("refundDialog.back")}
                </Button>
                <Button type="button" disabled={!canConfirm} onClick={handleConfirmClick}>
                  {t("refundDialog.confirm")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("refundDialog.confirmDialog.title")}</DialogTitle>
            <DialogDescription>{t("refundDialog.confirmDialog.body")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("refundDialog.confirmDialog.no")}
            </Button>
            <Button type="button" onClick={handleConfirmYes}>
              {t("refundDialog.confirmDialog.yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
