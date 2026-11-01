import { endpoints } from "@/constants/endpoints";
import { apiGet } from "@/lib/api";

import type { Order, OrderApiResponse } from "./types";

function mapOrder(data: OrderApiResponse): Order {
  return {
    orderId: data.order_id,
    status: data.status,
    currency: data.currency,
    deliveryFee: data.delivery_fee,
    deliveryFeeStatus: data.delivery_fee_status,
    items: data.items.map((item) => ({
      lineId: item.line_id,
      name: item.name,
      unitPrice: item.unit_price,
      units: item.units.map((unit) => ({
        unitId: unit.unit_id,
        status: unit.status,
        addons: unit.addons.map((addon) => ({
          addonId: addon.addon_id,
          name: addon.name,
          unitPrice: addon.unit_price,
          status: addon.status,
        })),
      })),
    })),
  };
}

export async function getOrder() {
  const data = await apiGet<OrderApiResponse>(endpoints.orders.detail);

  return mapOrder(data);
}
