/* =============================================================================
   I18N — SUPPORTED LOCALES
   -----------------------------------------------------------------------------
   The single source of truth for which languages the site ships. Adding a third
   language is a matter of authoring its content tree, registering it here, and
   adding a tab to LanguageSwitcher — no other file needs to change.
   ========================================================================== */

import en from './content/en'
import es from './content/es'

export const DEFAULT_LOCALE = 'en'

export const LOCALES = {
  en: { code: 'en', label: 'EN', name: 'English', content: en },
  es: { code: 'es', label: 'ES', name: 'Español', content: es },
}

export const LOCALE_CODES = Object.keys(LOCALES)

export function isSupportedLocale(code) {
  return Object.prototype.hasOwnProperty.call(LOCALES, code)
}
