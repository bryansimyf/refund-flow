export const orderKeys = {
  all: ["order"] as const,
  detail: () => [...orderKeys.all, "detail"] as const,
};
