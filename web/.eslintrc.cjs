module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  plugins: ['react', '@typescript-eslint', 'react-refresh', 'prettier'],
  rules: {
    'no-void': "off",
    'class-methods-use-this': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
    'import/extensions': ['off'],
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "no-underscore-dangle":  ["error", { "allowAfterThis": true }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
  },
};
