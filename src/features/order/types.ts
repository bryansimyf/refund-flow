export type PaymentStatus = "completed" | "paid" | "refunded";

export type OrderAddon = {
  addonId: string;
  name: string;
  unitPrice: number;
  status: PaymentStatus;
};

export type OrderUnit = {
  unitId: string;
  status: PaymentStatus;
  addons: OrderAddon[];
};

export type OrderLineItem = {
  lineId: string;
  name: string;
  unitPrice: number;
  units: OrderUnit[];
};

export type Order = {
  orderId: string;
  status: PaymentStatus;
  currency: string;
  deliveryFee: number;
  deliveryFeeStatus: PaymentStatus;
  items: OrderLineItem[];
};

export type OrderApiResponse = {
  order_id: string;
  status: PaymentStatus;
  currency: string;
  delivery_fee: number;
  delivery_fee_status: PaymentStatus;
  items: Array<{
    line_id: string;
    name: string;
    unit_price: number;
    units: Array<{
      unit_id: string;
      status: PaymentStatus;
      addons: Array<{
        addon_id: string;
        name: string;
        unit_price: number;
        status: PaymentStatus;
      }>;
    }>;
  }>;
};
