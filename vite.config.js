import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Centralized design system — aliased to source so the app consumes it
      // with no separate build step, exactly as the published package would be.
      '@deluxfit/ds': path.resolve(__dirname, 'packages/deluxfit-design-system/index.js'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          // The React Bits WebGL backdrops (Aurora / Particles / Threads) pull
          // in ogl; keep it in its own long-lived chunk so it caches apart from
          // app code and doesn't bloat the main bundle.
          ogl: ['ogl'],
        },
      },
    },
  },
})
