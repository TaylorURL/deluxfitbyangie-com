import { createContext } from 'react'

/**
 * Active-locale context for the app. The provider lives in
 * `./LanguageProvider.jsx` and the consumer hooks live in `./hooks.js` — this
 * file holds only the createContext call so the provider module stays a pure
 * component export (required by react-refresh under Vite HMR).
 */
export const LanguageContext = createContext(null)
