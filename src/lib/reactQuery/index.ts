import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { useUiStore } from "@/stores";

import type { AppQueryMeta } from "@/types/queryMeta";
import { toAppError } from "@/lib/axios";

const inFlightQueries = new Set<string>();
const inFlightMutations = new Set<number>();

function shouldShowSpinner(meta?: AppQueryMeta) {
  return !meta?.hideGlobalSpinner;
}

function shouldSkipError(error: unknown, meta?: AppQueryMeta) {
  if (meta?.hideGlobalError) {
    return true;
  }

  const appError = toAppError(error);

  if (appError.code === "CANCELED") {
    return true;
  }

  if (appError.code && meta?.skippedErrorCodes?.includes(appError.code)) {
    return true;
  }

  if (appError.code === "TIMEOUT" && meta?.skipTimeoutError) {
    return true;
  }

  if (appError.code === "NETWORK" && meta?.skipNetworkError) {
    return true;
  }

  return false;
}

function handleError(error: unknown, meta?: AppQueryMeta) {
  if (shouldSkipError(error, meta)) {
    return;
  }

  useUiStore.getState().setError(toAppError(error));
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      handleError(error, query.meta);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      handleError(error, mutation.meta);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  const query = event.query;
  const meta = query.meta;
  const key = query.queryHash;

  if (!shouldShowSpinner(meta)) {
    return;
  }

  const fetching = query.state.fetchStatus === "fetching";

  if (fetching && !inFlightQueries.has(key)) {
    inFlightQueries.add(key);
    useUiStore.getState().incrementLoading();

    return;
  }

  if (!fetching && inFlightQueries.has(key)) {
    inFlightQueries.delete(key);
    useUiStore.getState().decrementLoading();
  }
});

queryClient.getMutationCache().subscribe((event) => {
  const mutation = event.mutation;

  if (!mutation || !shouldShowSpinner(mutation.meta)) {
    return;
  }

  const id = mutation.mutationId;
  const pending = mutation.state.status === "pending";

  if (pending && !inFlightMutations.has(id)) {
    inFlightMutations.add(id);
    useUiStore.getState().incrementLoading();

    return;
  }

  if (!pending && inFlightMutations.has(id)) {
    inFlightMutations.delete(id);
    useUiStore.getState().decrementLoading();
  }
});
