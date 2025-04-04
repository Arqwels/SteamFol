module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, {
      extensions: [".tsx", ".ts"]
    }],
    "import/no-named-as-default": 0,
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true
      },
    ],
  },
};