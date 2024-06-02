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
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.ts', 'vite.config.ts', 'mapbox-gl-indoorequal', 'native',
    '**/*.svg', '**/*.json'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  plugins: ['react', '@typescript-eslint', 'react-refresh', 'prettier'],
  rules: {
    'no-void': 'off',
    'class-methods-use-this': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
    'import/extensions': ['off'],
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto',
      },
    ],
    'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
    'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': ['error', {
      'namedComponents': 'arrow-function',
      'unnamedComponents': 'arrow-function',
    }],
    'react/require-default-props': 'off',
    'jsx-a11y/click-events-have-key-events': 'off', // since the app is mobile-first
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-use-before-define': 'off', // bugs out
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
