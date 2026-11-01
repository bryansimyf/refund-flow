import { useQuery } from "@tanstack/react-query";

import { getOrder } from "./api";
import { orderKeys } from "./queryKeys";

export function useOrderQuery() {
  return useQuery({
    queryKey: orderKeys.detail(),
    queryFn: getOrder,
  });
}
