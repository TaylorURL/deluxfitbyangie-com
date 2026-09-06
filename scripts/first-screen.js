/*
 * Puts the home page's first screen into the served document.
 *
 * The entry is a bare shell, so nothing is on screen until the bundle has
 * downloaded, parsed and rendered. The hero is drawn here, in the document
 * itself, with the same markup the Home component renders and the copy read
 * from the English content tree, so a reader sees the first screen while the
 * app is still on the wire and the app lands on top of it without a jump. The
 * app replaces the whole root on mount; nothing here survives it.
 *
 * The shell is for the home page in English. A small inline script hides it on
 * every other path and for every other locale, so those readers get the shell
 * they had before rather than a flash of the wrong page. The locale rule is the
 * provider's own: a stored choice first, then the browser's languages.
 *
 * The markup mirrors Home.jsx's hero. A change to that hero's structure or
 * classes belongs here too, or the app will land a few pixels off the shell.
 *
 * The bundle is fetched and run after the first frame rather than before it. A
 * module script is deferred, which only means it waits for the parser: it runs
 * the moment parsing ends, and on a slow phone that moment arrives before the
 * browser has found a frame to paint the shell in. The page then sits blank
 * while the bundle draws over markup nobody has been shown, and the whole
 * download is charged to the first paint. The entry loses its script tag and
 * the chunk graph loses its links in the head; an inline module in its place
 * writes those links and asks for the bundle one frame after the first, which
 * is the first frame the shell can have been painted in and the last one the
 * bundle can hold back.
 *
 * Below all of it, the rules the shell needs go into the document too, so the
 * frame it is painted in owes a stylesheet nothing either.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import Beasties from 'beasties'
import { createServer } from 'vite'

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))
const dist = fileURLToPath(new URL('../dist/index.html', import.meta.url))

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})
let hero
let locales
try {
  ;({
    default: {
      home: { hero },
    },
  } = await server.ssrLoadModule('/src/i18n/content/en.js'))
  ;({ LOCALES: locales } = await server.ssrLoadModule('/src/i18n/locales.js'))
} finally {
  await server.close()
}

const escape = text =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const BUTTON =
  'group relative inline-flex select-none items-center justify-center gap-2 rounded-df-sm text-center font-700 uppercase tracking-[0.1em] transition-[background-color,color,border-color,box-shadow] duration-df-fast ease-df-out disabled:pointer-events-none disabled:opacity-45 h-df-control-lg px-7 text-[13px] w-full sm:w-auto'
const PRIMARY = `${BUTTON} border border-df-accent-deep bg-df-accent text-df-on-accent shadow-df-key hover:bg-df-accent-deep hover:shadow-df-key-soft`
const SECONDARY = `${BUTTON} border border-df-border-strong bg-df-surface-2 text-df-text shadow-df-key-soft hover:border-df-border-hover hover:bg-df-surface-3`
const ARROW =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'

const last = hero.headline.length - 1
const lines = hero.headline
  .map(
    (line, index) =>
      `${index > 0 ? ' ' : ''}<span class="block df-first-line${
        index === last ? ' text-df-accent-bright' : ''
      }">${escape(line)}</span>`
  )
  .join('')

const badge = `<span class="inline-flex items-center gap-3 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright"><span class="h-px w-7 bg-df-accent" aria-hidden="true"></span><span class="inline-block">${escape(hero.badge)}</span></span>`

const photo = `<figure class="relative overflow-hidden rounded-df-lg border border-df-border-strong bg-df-surface aspect-[4/5]"><img src="/brand/studio-portrait-dumbbells.webp" srcset="/brand/studio-portrait-dumbbells-480.webp 480w, /brand/studio-portrait-dumbbells-800.webp 800w, /brand/studio-portrait-dumbbells-1200.webp 1200w, /brand/studio-portrait-dumbbells.webp 1600w" sizes="(min-width: 640px) 18rem, 15rem" width="1600" height="2240" alt="${escape(hero.imageAlt)}" loading="eager" fetchpriority="high" decoding="sync" class="absolute inset-0 h-full w-full object-cover"><div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_15%,var(--df-accent-wash),transparent_70%)] mix-blend-overlay"></div><div aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-df-lg ring-1 ring-inset ring-df-glass-border"></div></figure>`

const shell = `<div id="df-first-screen" class="min-h-dvh"><div class="flex min-h-dvh flex-col"><main class="min-h-dvh flex-1"><section id="top" data-theme="dark" class="relative isolate overflow-hidden bg-df-bg text-df-text"><div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_80%_5%,var(--df-accent-wash-soft),transparent_60%)]"></div><div class="mx-auto w-full px-5 sm:px-6 lg:px-8 max-w-6xl pb-12 pt-[calc(var(--df-header-height)+1.5rem)] sm:pb-16 lg:pb-20"><div class="grid items-end gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14"><div class="min-w-0">${badge}<h1 class="font-400 mt-6 pb-[0.14em] font-display text-[clamp(2.75rem,10vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.015em] text-df-text sm:mt-8">${lines}</h1><p class="mt-6 max-w-xl text-base leading-relaxed text-df-text-muted sm:mt-8 sm:text-lg">${escape(hero.subhead)}</p><div class="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row"><a href="${escape(hero.primaryCtaHref)}" class="${PRIMARY}">${escape(hero.primaryCta)}${ARROW}</a><a href="${escape(hero.secondaryCtaHref)}" class="${SECONDARY}">${escape(hero.secondaryCta)}</a></div></div><div class="relative mx-auto w-full max-w-[15rem] sm:max-w-[18rem] lg:mx-0 lg:justify-self-end df-first-photo">${photo}</div></div></div></section></main></div></div>`

/* The hero's lines and portrait open a little below their resting place and
   rise as the app mounts. The shell holds them at that opening offset, so the
   app's first frame is the shell's last one. Under reduced motion neither
   moves and the shell sits at rest. */
const style =
  '<style>@media (prefers-reduced-motion:no-preference){.df-first-line{transform:translateY(.4em)}.df-first-photo{transform:translateY(20px)}}.df-no-first-screen #df-first-screen{display:none}</style>'

const codes = JSON.stringify(Object.keys(locales))
const guard = `<script>(function(){try{var p=location.pathname.replace(/\\/+$/,"")||"/";var l=null;try{l=localStorage.getItem("deluxfit:locale")}catch(e){}if(!l){var t=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];for(var i=0;i<t.length;i++){var b=String(t[i]||"").toLowerCase().split("-")[0];if(${codes}.indexOf(b)>=0){l=b;break}}}if(p!=="/"||(l&&l!=="en"))document.documentElement.classList.add("df-no-first-screen")}catch(e){}})()</script>`

let html = readFileSync(dist, 'utf8')
if (!html.includes('<div id="root"></div>'))
  throw new Error('dist/index.html carries no empty root')
html = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`)
html = html.replace('</head>', `${style}${guard}</head>`)

const entry = html.match(/^[ \t]*<script type="module" crossorigin src="([^"]+)"><\/script>\n/m)
if (!entry) throw new Error('dist/index.html carries no module entry')
const [tag, src] = entry

/*
 * The chunk graph, declared where the bundle is asked for rather than in the
 * head.
 *
 * A `modulepreload` in the head is a promise the browser keeps immediately, at
 * the same priority as the photograph the first screen is measured by, and the
 * bundle is a good deal larger than the photograph. On a metered connection
 * the two share what there is and the picture arrives when the script is done
 * with the link — which is a second the reader spends looking at a frame that
 * was otherwise ready. Nothing here changes what is fetched or the order the
 * modules run in: the same links are written, one frame after the first, so
 * the graph is still declared in one go and the chunks below the entry are
 * still found without a round trip apiece.
 */
const graph = [...html.matchAll(/^[ \t]*<link rel="modulepreload"[^>]*href="([^"]+)"[^>]*>\n/gm)]
for (const [line] of graph) html = html.replace(line, '')
const chunks = JSON.stringify([src, ...graph.map(([, href]) => href)])
const boot =
  `    <script type="module">requestAnimationFrame(() => requestAnimationFrame(() => {\n` +
  `      for (const href of ${chunks}) {\n` +
  `        const link = document.createElement('link')\n` +
  `        link.rel = 'modulepreload'\n` +
  `        link.crossOrigin = ''\n` +
  `        link.href = href\n` +
  `        document.head.appendChild(link)\n` +
  `      }\n` +
  `      import(${JSON.stringify(src)})\n` +
  `    }))</script>\n`
html = html.replace(tag, boot)

/*
 * The rules the shell above needs, written into the page beside it.
 *
 * A browser will not draw a document whose `<link rel="stylesheet">` is still
 * in flight, so the shell — which is otherwise ready the moment the document
 * lands — waits on a round trip and a download before any of it counts, and
 * the hero photograph queues behind that sheet for the bandwidth. The rules
 * its markup uses go into a `<style>` here; the sheet itself is asked for on a
 * media query that matches nothing, which fetches it without holding the
 * paint, and switched on when it arrives. Nothing is dropped from it: what
 * lands late is only what the document has no element for yet.
 *
 * The states the page takes on afterwards are the exception, because none of
 * them is on an element at build time — the theme the root carries, the header
 * once it is scrolled under, a link once it is current, the flat painting a
 * machine with no GPU gets. Every rule keyed on a `data-` or `aria-` attribute
 * rides along regardless. The font faces ride along too, or the preloaded
 * files in the head arrive with nothing naming them and the type is set twice.
 */
const inlined = await new Beasties({
  path: distDir,
  publicPath: '/',
  preload: 'media',
  pruneSource: false,
  inlineFonts: true,
  preloadFonts: false,
  allowRules: [/\[(data|aria)-/],
  reduceInlineStyles: false,
  mergeStylesheets: false,
  logLevel: 'silent',
}).process(html)

// Beasties stamps the element it treated as the document; the page does not
// need to carry that.
writeFileSync(dist, inlined.replace(' data-beasties-container', ''))
