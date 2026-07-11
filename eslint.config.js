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
  // The design system is a publishable library, not HMR-refreshed app code, so
  // co-exporting `cva` variant helpers alongside their components is intentional.
  {
    files: ['packages/deluxfit-design-system/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Vendored React Bits components (reactbits.dev) — third-party library source
  // we own but do not hand-maintain. Exempt from HMR-only-component and from the
  // no-unused-vars false positive on JSX-only `motion.*` usage (this project has
  // no eslint-plugin-react, so `jsx-uses-vars` isn't available to mark it used).
  {
    files: ['src/components/reactbits/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': 'off',
    },
  },
  // Node-consumed config files (CommonJS presets + Vite config) run outside the
  // browser, so expose Node globals like `module`, `require`, and `__dirname`.
  {
    files: [
      '**/tailwind-preset.cjs',
      '**/postcss.config.js',
      '**/tailwind.config.js',
      '**/vite.config.js',
    ],
    languageOptions: {
      globals: { ...globals.node, module: 'writable', require: 'readonly' },
    },
  },
])
