import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"],
  },
  {
    files: ["eslint.config.mjs", "scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "module",
    },
    rules: js.configs.recommended.rules,
  },
  {
    files: [
      "apps/**/*.{js,jsx,ts,tsx}",
      "packages/**/*.{js,jsx,ts,tsx}",
      "services/**/*.{js,jsx,ts,tsx}",
      "tools/**/*.{js,jsx,ts,tsx}",
      "tests/**/*.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      sourceType: "module",
    },
    rules: js.configs.recommended.rules,
  },
];
