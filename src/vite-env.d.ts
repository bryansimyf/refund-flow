/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference path="./lib/i18n/types.ts" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENV: "local" | "development" | "staging" | "testing" | "production";
  readonly VITE_ROBOTS_META: string;
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_PUBLIC_TITLE: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_DEFAULT_LANGUAGE_CODE: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_LOGGING: string;
  readonly VITE_GOOGLE_TAG_MANAGER_CONTAINER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";

  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
