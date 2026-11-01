import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useUiStore } from "@/stores";

type GlobalSpinnerProps = {
  forceLoading?: boolean;
};

export function GlobalSpinner({ forceLoading = false }: GlobalSpinnerProps) {
  const isGlobalLoading = useUiStore((state) => state.isGlobalLoading);
  const { t } = useTranslation("common");

  if (!forceLoading && !isGlobalLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/70"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-brand-500" aria-hidden="true" />
      <span className="sr-only">{t("generic.loading")}</span>
    </div>
  );
}
