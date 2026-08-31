import { useContext } from 'react'
import { LanguageContext } from './context'

/**
 * useLanguage — active locale code, locale registry, and setter. For toggles,
 * switchers, and any UI that needs to react to the language itself rather than
 * the translated copy.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>.')
  }
  return ctx
}

/**
 * useContent — the active locale's full content tree. Components import this
 * instead of reading hardcoded copy, so switching the language re-renders every
 * surface with the right translation.
 */
export function useContent() {
  return useLanguage().content
}
