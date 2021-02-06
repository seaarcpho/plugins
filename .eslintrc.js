module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    "eslint:recommended",
    "standard",
    /* "plugin:prettier/recommended",
    "plugin:mocha/recommended", */
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 11,
    project: ["./tsconfig.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint" /*"mocha", "chai-friendly"*/],
  rules: {
    "@typescript-eslint/require-await": "warn",
    "no-unused-vars": "off",
    "prefer-template": "warn",
    curly: "error",
    /* "mocha/no-mocha-arrows": "off", */
    // Disable the default rule
    "no-unused-expressions": 0,
    // Use the chai friendly rule
    /* "chai-friendly/no-unused-expressions": 2, */
  },
};
