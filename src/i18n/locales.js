/*
 * I18N — SUPPORTED LOCALES
 *
 * The single source of truth for which languages the site ships. Adding a third
 * language is a matter of authoring its content tree, registering it here with
 * a loader, and adding a tab to LanguageSwitcher — no other file needs to
 * change.
 *
 * Only the default locale's tree is part of the entry bundle. Every other one
 * is a chunk of its own, fetched when a visitor asks for that language, so a
 * reader of one language never downloads or parses the copy for another.
 */

import en from './content/en'

export const DEFAULT_LOCALE = 'en'

export const LOCALES = {
  en: { code: 'en', label: 'EN', name: 'English' },
  es: { code: 'es', label: 'ES', name: 'Español' },
}

const LOADERS = {
  en: () => Promise.resolve(en),
  es: () => import('./content/es').then(module => module.default),
}

const resolved = { en }

export function isSupportedLocale(code) {
  return Object.prototype.hasOwnProperty.call(LOCALES, code)
}

/**
 * The content tree for a locale whose chunk is already in memory, or null when
 * it still has to be fetched. Lets a caller render the first screen without a
 * round trip whenever it can.
 */
export function loadedContent(code) {
  return resolved[code] ?? null
}

/**
 * The content tree for a locale, fetching its chunk on first use and holding it
 * for every caller after.
 */
export function loadContent(code) {
  const ready = resolved[code]
  if (ready) return Promise.resolve(ready)
  return LOADERS[code]().then(content => {
    resolved[code] = content
    return content
  })
}
