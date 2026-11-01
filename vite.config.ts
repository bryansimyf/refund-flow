import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { configDefaults } from "vitest/config";
import svgr from "vite-plugin-svgr";

import {
  copyEnvAssetsPlugin,
  htmlEnvPlugin,
  manifestEnvPlugin,
  metaJsonPlugin,
} from "./vite.plugin.ts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "env", "");

  return {
    envDir: "env",
    base: env.VITE_PUBLIC_URL || "/",
    server: {
      port: 3000,
      strictPort: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      svgr({ include: "**/*.svg?react" }),
      htmlEnvPlugin(env),
      manifestEnvPlugin(env),
      copyEnvAssetsPlugin(env.VITE_ENV),
      metaJsonPlugin(env.VITE_APP_VERSION),
    ].flat() as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
              return "react-vendor";
            }

            return undefined;
          },
        },
      },
    },
    test: {
      include: ["src/**/*.test.ts"],
      exclude: [...configDefaults.exclude],
    },
  };
});
