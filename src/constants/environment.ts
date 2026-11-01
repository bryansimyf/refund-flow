const publicUrl = import.meta.env.VITE_PUBLIC_URL;

/** React Router basename: no trailing slash except root `/`. */
const routerBasename =
  publicUrl === "/" || publicUrl === "" ? "/" : publicUrl.replace(/\/$/, "");

export const environment = {
  appVersion: import.meta.env.VITE_APP_VERSION,
  env: import.meta.env.VITE_ENV,
  publicUrl,
  routerBasename,
  publicTitle: import.meta.env.VITE_PUBLIC_TITLE,
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL,
  defaultLanguageCode: import.meta.env.VITE_DEFAULT_LANGUAGE_CODE,
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === "1",
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "1",
  gtmContainerId: import.meta.env.VITE_GOOGLE_TAG_MANAGER_CONTAINER_ID,
} as const;
