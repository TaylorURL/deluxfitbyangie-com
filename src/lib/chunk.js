/*
 * LOADING A CHUNK THE BUILD NO LONGER HAS
 *
 * Every page on this site is split into hashed chunks, and every deploy writes
 * a new set and deletes the last one. A reader who had the page open while a
 * deploy landed is running the previous build, so the moment they open a page,
 * switch language, or sign in, the app asks for a file that is not there any
 * more. The window is small and it closes on its own — by the time anyone goes
 * looking, the deploy has settled and the current file answers on the first
 * try — but for the reader it happened, and what they saw was the site go
 * blank under them.
 *
 * Blank, rather than a missing decoration, because a rejected `import()` behind
 * `lazy` is thrown during render: with nothing to catch it React unmounts the
 * whole tree, and one absent canvas takes the page down with it.
 *
 * A retry answers the request that failed on its way through the network. It
 * cannot answer a file that has genuinely gone, and the only build that still
 * has that file is the one the reader is running — so the way out is to go and
 * get the current document, which names the chunks that do exist. That happens
 * once, because a reload that did not help must not become a loop.
 */

import { lazy } from 'react'

const RELOAD_KEY = 'deluxfit:chunk-reload'

// Long enough that a reload which did not fix anything cannot cycle, short
// enough that a second deploy later in the same visit is still recoverable.
const RELOAD_WINDOW_MS = 30000

const RETRY_DELAY_MS = 600

/*
 * What a browser says when a module request came back as something that is not
 * a module. Every engine phrases it differently, and the phrasing is all there
 * is to go on: the failure arrives as a plain TypeError with no code on it.
 * Safari names the MIME type it was handed, which is `text/html` here because
 * the edge answers a path it cannot find with `index.html`.
 */
const CHUNK_FAILURE =
  /dynamically imported module|importing a module script failed|valid javascript mime type|failed to load module script|failed to fetch/i

/**
 * Whether an error is a module the browser could not load, rather than one the
 * module threw once it was running.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isChunkLoadError(error) {
  const message = String((error && error.message) || error || '')
  return CHUNK_FAILURE.test(message)
}

/**
 * Fetch the current document, at most once per visit per window.
 *
 * Returns whether the reload was actually started, so a caller can fall back to
 * showing something when it was not. Storage is unavailable in some privacy
 * modes, and a reload with no record that it happened is the loop this exists
 * to prevent, so a browser that will not remember does not get one.
 *
 * @returns {boolean}
 */
export function reloadForCurrentBuild() {
  if (typeof window === 'undefined') return false
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY)) || 0
    if (Date.now() - last < RELOAD_WINDOW_MS) return false
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

/**
 * Load a chunk, retrying once and then reloading onto the current build.
 *
 * Wraps the `import()` itself rather than the component around it, so the same
 * recovery covers the loaders that are not components — a locale tree, the
 * auth client — which otherwise reject into nothing and leave a provider
 * waiting forever on a promise that will never settle.
 *
 * @template T
 * @param {() => Promise<T>} load
 * @returns {Promise<T>}
 */
export function importChunk(load) {
  return load().catch(error => {
    if (!isChunkLoadError(error)) throw error
    return new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      .then(load)
      .catch(retryFailure => {
        reloadForCurrentBuild()
        throw retryFailure
      })
  })
}

/**
 * `React.lazy` over `importChunk`.
 *
 * @param {() => Promise<{ default: import('react').ComponentType }>} load
 * @returns {import('react').LazyExoticComponent<import('react').ComponentType>}
 */
export function lazyChunk(load) {
  return lazy(() => importChunk(load))
}
