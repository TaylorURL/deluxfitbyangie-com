import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'
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
// queueing behind the first render.
if (INITIAL_LOCALE !== DEFAULT_LOCALE) loadContent(INITIAL_LOCALE)

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
    loadContent(locale).then(next => {
      if (active) setContent(next)
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
    loadContent(code).then(next => {
      setContent(next)
      setLocaleState(code)
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
