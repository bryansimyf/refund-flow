import { useState } from "react";
import { useTranslation } from "react-i18next";

import { OrderDetails } from "@/features/order/components/OrderDetails";
import { RefundDialog } from "@/features/order/components/RefundDialog";
import { useOrderQuery } from "@/features/order/hooks";

import { FullHeightLayout } from "@/layouts/FullHeightLayout";
import { Button } from "@/components/ui/button";

export default function OrderPage() {
  const { t } = useTranslation("order");
  const { data: orderData } = useOrderQuery();
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const handleRefund = () => {
    setShowRefundDialog(true);
  };

  return (
    <FullHeightLayout>
      <main className="flex flex-1 flex-col gap-6 px-4 py-8">
        <h1 className="text-title text-grey-900">{t("title")}</h1>
        {orderData && <OrderDetails order={orderData} />}
        <Button
          type="button"
          className="ml-auto w-fit"
          disabled={!orderData}
          onClick={handleRefund}
        >
          {t("refund")}
        </Button>
      </main>
      {orderData && (
        <RefundDialog
          open={showRefundDialog}
          onOpenChange={setShowRefundDialog}
          order={orderData}
        />
      )}
    </FullHeightLayout>
  );
}
