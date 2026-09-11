import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'
import { importChunk } from '../lib/chunk'
import { DEFAULT_LOCALE, LOCALES, isSupportedLocale, loadContent, loadedContent } from './locales'

const STORAGE_KEY = 'deluxfit:locale'

/**
 * Resolve the initial locale: persisted choice wins, browser preference is the
 * next signal, and English is the safe default. SSR-safe (returns the default
 * when window/navigator are unavailable).
 */
function detectInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && isSupportedLocale(stored)) return stored
  } catch {
    // Private mode / disabled storage — fall through to the next signal.
  }

  const navigatorLanguages =
    (typeof navigator !== 'undefined' &&
      (navigator.languages?.length ? navigator.languages : [navigator.language])) ||
    []
  for (const tag of navigatorLanguages) {
    if (!tag) continue
    const base = tag.toLowerCase().split('-')[0]
    if (isSupportedLocale(base)) return base
  }

  return DEFAULT_LOCALE
}

const INITIAL_LOCALE = detectInitialLocale()

// The request for a non-default tree goes out as this module evaluates rather
// than when the provider mounts, so it overlaps the rest of the boot instead of
// queueing behind the first render. Nothing is waiting on it here — it is the
// effect below that renders off the tree and the effect that asks again if this
// one came back empty handed, so a failure is swallowed rather than left to
// reject into a page that has not been drawn yet.
if (INITIAL_LOCALE !== DEFAULT_LOCALE) loadContent(INITIAL_LOCALE).catch(() => {})

export default function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(INITIAL_LOCALE)
  const [content, setContent] = useState(() => loadedContent(locale))

  /*
   * A locale and the copy it renders move together. Switching sets both only
   * once the tree is in hand, so no surface is ever caught showing one
   * language under the label of another.
   */
  useEffect(() => {
    if (content) return
    let active = true
    // A tree that is not the default one is a chunk, and a chunk the current
    // build no longer has would leave this provider holding `null` forever —
    // which renders as nothing at all, since there is no copy to draw a page
    // with. `importChunk` retries it and, failing that, reloads onto the build
    // that does have the file.
    importChunk(() => loadContent(locale))
      .then(next => {
        if (active) setContent(next)
      })
      .catch(() => {
        /*
         * The reload is allowed once per visit, so the second time through it
         * declines and the retry is the end of the road. Left there this
         * provider goes on holding `null` and the reader sits in front of an
         * empty document — and because the failure arrives as a rejected
         * promise rather than a throw during render, the boundary above never
         * hears about it and nothing draws in its place.
         *
         * The default tree rides in the entry bundle and so is always already
         * in hand. Falling back to it costs the reader the language they asked
         * for and keeps them the page, which is the better half of that trade.
         * The locale moves with the copy so no surface is left labelled as a
         * language it is not, and their choice is persisted again the moment
         * they use the switcher — by then on a build that has the chunk.
         */
        if (!active) return
        setContent(loadedContent(DEFAULT_LOCALE))
        setLocaleState(DEFAULT_LOCALE)
      })
    return () => {
      active = false
    }
  }, [locale, content])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, locale)
      } catch {
        // Storage may be unavailable; persisting is best-effort.
      }
    }
  }, [locale])

  const setLocale = useCallback(code => {
    if (!isSupportedLocale(code)) return
    const ready = loadedContent(code)
    if (ready) {
      setContent(ready)
      setLocaleState(code)
      return
    }
    importChunk(() => loadContent(code))
      .then(next => {
        setContent(next)
        setLocaleState(code)
      })
      .catch(() => {
        // The language the reader asked for cannot be fetched. They stay on the
        // one they were already reading, which is drawn and correct, rather
        // than the rejection escaping into the page. Their click goes nowhere,
        // and that is the whole of the damage.
      })
  }, [])

  const value = useMemo(() => {
    const entry = LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE]
    return {
      locale: entry.code,
      localeName: entry.name,
      content,
      locales: LOCALES,
      setLocale,
    }
  }, [locale, content, setLocale])

  if (!content) return null

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
