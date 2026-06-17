import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'
import { DEFAULT_LOCALE, LOCALES, isSupportedLocale } from './locales'

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

/**
 * LanguageProvider — owns the active locale, persists it, syncs <html lang>,
 * and exposes the active content tree plus a setter to the rest of the app.
 */
export default function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(detectInitialLocale)

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
    setLocaleState(code)
  }, [])

  const value = useMemo(() => {
    const entry = LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE]
    return {
      locale: entry.code,
      localeName: entry.name,
      content: entry.content,
      locales: LOCALES,
      setLocale,
    }
  }, [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
