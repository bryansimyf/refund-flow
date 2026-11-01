import { Link } from "react-router";

import { useTranslation } from "react-i18next";

import { FullHeightLayout } from "@/layouts/FullHeightLayout";
import { Button } from "@/components/ui/button";

export function ErrorPage() {
  const { t } = useTranslation("common");

  return (
    <FullHeightLayout>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-title text-grey-900">{t("notFound.title")}</h1>
        <p className="text-body text-grey-600">{t("notFound.body")}</p>
        <Button render={<Link to="/" />}>{t("actions.home")}</Button>
      </main>
    </FullHeightLayout>
  );
}
