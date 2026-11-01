import { useTranslation } from "react-i18next";

import { useUiStore } from "@/stores";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GlobalErrorDialog() {
  const error = useUiStore((state) => state.error);
  const clearError = useUiStore((state) => state.clearError);
  const { t } = useTranslation("common");

  return (
    <Dialog open={error !== null} onOpenChange={(open) => !open && clearError()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{error?.title ?? t("dialog.errorTitle")}</DialogTitle>
          <DialogDescription>{error?.message ?? t("generic.message")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={clearError}>
            {t("actions.ok")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
