module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "semi": [0],
   "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
   "jsx-a11y/anchor-is-valid": [0],
   "react/require-default-props": [0],
   "arrow-body-style": [0],
   "no-param-reassign": [0],
   "react/react-in-jsx-scope": [0],
   "react/button-has-type": [0],
   "react/prop-types": [0],
   "no-console": [0],
   "camelcase": [0],
   "react/jsx-one-expression-per-line": [0],
   "no-nested-ternary": [0]
  },
};
