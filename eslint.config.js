import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]', ignoreRestSiblings: true },
      ],
      // The design system (@deluxfit/ds) is the single source of truth for UI.
      // Block deep imports into its internals so the barrel stays the entry.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@deluxfit/ds/src/*', '**/packages/deluxfit-design-system/src/*'],
              message:
                'Import UI from "@deluxfit/ds" (the barrel) — the design system is the single source of truth.',
            },
          ],
        },
      ],
    },
  },
  // The Tailwind preset is a CommonJS config file consumed by Node tooling.
  {
    files: ['**/tailwind-preset.cjs', '**/postcss.config.js', '**/tailwind.config.js'],
    languageOptions: {
      globals: { ...globals.node, module: 'writable', require: 'readonly' },
    },
  },
])
