import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      // Disallow explicit `any`
      "@typescript-eslint/no-explicit-any": "error",

      // Require return types on functions
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],

      // Enforce consistent type imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // No unused vars (allow underscore prefix)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Prefer nullish coalescing
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // No floating promises
      "@typescript-eslint/no-floating-promises": "error",

      // No misused promises
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false, arguments: false, properties: false } },
      ],
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".next/",
      "coverage/",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];

export default baseConfig;
