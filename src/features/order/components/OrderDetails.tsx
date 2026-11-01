import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format";

import { OrderLineList, OrderPaymentStatusChip } from "@/features/order/components/OrderLineList";
import type { Order } from "@/features/order/types";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type OrderDetailsProps = {
  order: Order;
};

function orderTotal(order: Order): number {
  let total = order.deliveryFee;

  for (const item of order.items) {
    total += item.units.length * item.unitPrice;

    for (const unit of item.units) {
      for (const addon of unit.addons) {
        total += addon.unitPrice;
      }
    }
  }

  return total;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { t } = useTranslation("order");

  return (
    <Card className="gap-6 bg-white text-grey-900 ring-grey-200">
      <CardHeader className="gap-1">
        <p className="text-caption text-grey-500">{t("orderIdLabel")}</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-heading text-grey-900">{order.orderId}</p>
          <OrderPaymentStatusChip status={order.status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <h2 className="text-label font-medium text-grey-700">{t("itemsHeading")}</h2>
        <OrderLineList currency={order.currency} items={order.items} />
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-grey-200 bg-transparent">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-body text-grey-900">{t("deliveryFeeLabel")}</span>
            <OrderPaymentStatusChip status={order.deliveryFeeStatus} />
          </div>
          <span className="shrink-0 text-body text-grey-900">
            {formatCurrency(order.currency, order.deliveryFee)}
          </span>
        </div>
        <div className="flex w-full items-center justify-between gap-3 border-t border-grey-200 pt-3">
          <span className="text-body font-medium text-grey-900">{t("orderTotalLabel")}</span>
          <span className="shrink-0 text-body font-medium text-grey-900">
            {formatCurrency(order.currency, orderTotal(order))}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
