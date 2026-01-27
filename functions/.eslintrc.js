/* eslint-env node */

module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module", // 👈 para que acepte import/export
  },
  // 👇 desactivamos reglas molestas para este proyecto
  rules: {
    "no-console": "off",
    "no-undef": "off",
    quotes: "off",
  },
};
