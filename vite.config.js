import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { ROUTE_PATHS } from './src/router/paths.js'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

const SITE_URL = 'https://www.deluxfitbyangie.com'

/**
 * Writes `sitemap.xml` from the router's own path list at build time.
 *
 * A hand-kept sitemap goes stale the first time a route is added and nobody
 * notices, because a stale sitemap looks exactly like a current one. Reading
 * the router means a page that is mounted is published and a page that is not
 * mounted is not — the file tree never gets a vote.
 */
function sitemapPlugin() {
  return {
    name: 'deluxfit-sitemap',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = ROUTE_PATHS.map(
        ({ path: route, priority, changefreq }) =>
          `  <url>\n` +
          `    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n` +
          `    <lastmod>${lastmod}</lastmod>\n` +
          `    <changefreq>${changefreq}</changefreq>\n` +
          `    <priority>${priority.toFixed(1)}</priority>\n` +
          `  </url>`
      ).join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `${urls}\n` +
          `</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  /*
   * The version the attribution rail prints. Reading package.json at config
   * time keeps one number: a build cannot report a release the manifest does
   * not carry.
   */
  define: {
    __BUILD_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Centralized design system — aliased to source so the app consumes it
      // with no separate build step, exactly as the published package would be.
      '@deluxfit/ds': path.resolve(__dirname, 'packages/deluxfit-design-system/index.js'),
    },
  },
  build: {
    /*
     * The floor the output is compiled to. Left undeclared the toolchain picks
     * a baseline older than anything this site's visitors run, and ships the
     * transforms and polyfills that baseline needs to browsers that have had
     * the features natively for years.
     */
    target: ['es2022', 'chrome111', 'edge111', 'firefox111', 'safari16.4'],
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor code changes on its own schedule, so each library gets a
          // chunk that survives an app deploy in the visitor's cache.
          react: ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          // The React Bits WebGL backdrops (Aurora / Particles / Threads) pull
          // in ogl; keep it in its own long-lived chunk so it caches apart from
          // app code and doesn't bloat the main bundle.
          ogl: ['ogl'],
        },
      },
    },
  },
})
