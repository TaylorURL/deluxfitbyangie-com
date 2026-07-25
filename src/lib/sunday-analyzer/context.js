import { createContext, useContext } from 'react'

/**
 * @typedef {object} SundayAnalyticsApi
 * @property {(name: string, props?: Record<string, unknown>) => void} track
 *   Currently a no-op — only pageviews reach the ingest pipeline.
 */

/** @type {import('react').Context<SundayAnalyticsApi | null>} */
export const SundayAnalyticsContext = createContext(null)

/** @returns {SundayAnalyticsApi} */
export function useSundayAnalytics() {
  const api = useContext(SundayAnalyticsContext)
  if (!api) {
    throw new Error('useSundayAnalytics must be used within a <SundayAnalyticsProvider>')
  }
  return api
}
