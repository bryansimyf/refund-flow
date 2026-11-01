import { Suspense } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { queryClient } from "@/lib/reactQuery";

import { GlobalErrorDialog } from "@/components/GlobalErrorDialog";
import { GlobalSpinner } from "@/components/GlobalSpinner";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<GlobalSpinner forceLoading />}>{children}</Suspense>
      <GlobalSpinner />
      <GlobalErrorDialog />
    </QueryClientProvider>
  );
}
