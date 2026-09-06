import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
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
    plugins: { react },
    settings: { react: { version: 'detect' } },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Replaced at build time by the `define` in vite.config.js, so the
        // attribution rail prints the version the manifest carries.
        __BUILD_VERSION__: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // A component used in JSX and never imported is not a syntax error and
      // not a build error - Rollup only checks module exports - so it ships and
      // blanks the page at runtime. These two are what catch it: one marks a
      // JSX tag as a use of its binding, the other reports the tag with none.
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true },
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
  // Vendored React Bits components (reactbits.dev): library source that lives
  // in-tree rather than being hand-maintained here. Exempt from
  // HMR-only-component, and from the no-unused-vars false positive on `motion.*`
  // bindings used only in JSX — without eslint-plugin-react there is no
  // `jsx-uses-vars` rule to mark those as used.
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
