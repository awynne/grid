/* ESLint configuration for GridPulse (TypeScript + React) */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    "node_modules/",
    "build/",
    ".react-router/",
    "database/migrations/",
  ],
  rules: {
    // React 17+ / automatic runtime
    "react/react-in-jsx-scope": "off",
    // Using TypeScript types instead of prop-types
    "react/prop-types": "off",
  },
};
