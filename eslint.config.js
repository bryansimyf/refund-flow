import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage", "public/meta.json"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "import-x": importX,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "camelcase": "warn",
      "newline-before-return": "warn",
      "prefer-template": "warn",
      "prefer-const": "warn",
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react-dom", "^react-router"],
            ["^@?\\w"],
            ["^@/app", "^@/config"],
            ["^@/stores"],
            ["^@/hooks"],
            ["^@/constants", "^@/types", "^@/utils", "^@/lib"],
            ["^@/features"],
            ["^@/layouts", "^@/components"],
            [
              "^\\.\\.(?!/?$)(?!.*\\.(?:json|css)$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)(?!.*\\.(?:json|css)$)",
              "^\\.(?!/?$)(?!.*\\.(?:json|css)$)",
              "^\\./?$",
            ],
            ["^@/assets"],
            ["^\\u0000"],
            ["^.+\\.json$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  eslintConfigPrettier,
]);
