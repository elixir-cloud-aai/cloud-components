module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "turbo",
    "standard",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    // The base rule flags type-only references such as React.ReactNode
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: false, typedefs: false },
    ],
    "import/no-unresolved": "off",
    "import/extensions": [
      "error",
      "always",
      {
        ignorePackages: true,
      },
    ],
  },
};
