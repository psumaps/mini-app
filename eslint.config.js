import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

// Create a config for TypeScript files
const typescriptConfig = {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: ['./tsconfig.json', './tsconfig.node.json'],
        },
    },
    plugins: {
        '@typescript-eslint': typescriptPlugin,
    },
    rules: {
        ...typescriptPlugin.configs.recommended.rules,
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-namespace': 'off',
    },
};

// Create a config for React files
const reactConfig = {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        'react-refresh': reactRefreshPlugin,
        'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        ...reactPlugin.configs.recommended.rules,
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/require-default-props': 'off',
        'react/destructuring-assignment': 'off',
        'jsx-a11y/click-events-have-key-events': 'off', // since the app is mobile-first
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
    },
};

// Create a config for import plugin
const importConfig = {
    plugins: {
        import: importPlugin,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
                packageDir: ['.', './web', './shared'],
            },
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                '': 'never',
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
};

// Create a config for prettier
const prettierRules = {
    plugins: {
        prettier: prettierPlugin,
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
};

// Common rules for all JavaScript/TypeScript files
const commonRules = {
    rules: {
        'no-void': 'off',
        'class-methods-use-this': 'off',
        'func-style': ['error', 'declaration', {allowArrowFunctions: true}],
        'no-underscore-dangle': ['error', {allowAfterThis: true}],
        'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
        'no-use-before-define': 'off',
        radix: 'off',
        'no-restricted-globals': 'off',
    },
};

// Define globals for browser environment
const globals = {
    languageOptions: {
        globals: {
            document: 'readonly',
            window: 'readonly',
            console: 'readonly',
            setTimeout: 'readonly',
            clearTimeout: 'readonly',
            setInterval: 'readonly',
            clearInterval: 'readonly',
            localStorage: 'readonly',
            history: 'readonly',
            NodeJS: 'readonly',
            React: 'readonly',
            requestAnimationFrame: 'readonly',
        },
    },
};

export default [
    // Base ESLint recommended rules
    js.configs.recommended,

    // Ignore patterns
    {
        ignores: [
            'dist',
            'tailwind/index.css',
            'tailwind.config.ts',
            'vite.config.ts',
            'mapbox-gl-indoorequal',
            'native',
            '**/*.svg',
            '**/*.json',
            'global.d.ts',
            'vite-env.d.ts',
            'decorators/**',
        ],
    },

    // Global definitions
    globals,

    // Common configuration for all JavaScript files
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        ...commonRules,
    },

    // TypeScript specific configuration
    typescriptConfig,

    // React specific configuration
    reactConfig,

    // Import plugin configuration
    importConfig,

    // Prettier configuration
    prettierRules,

    // Apply Prettier config as the last item to override other configs
    prettierConfig,
];
