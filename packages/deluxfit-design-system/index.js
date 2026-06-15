/**
 * @deluxfit/ds — the single, importable source of the DeluxFit visual
 * language: tokens, the red/black theme, components, and layout primitives.
 *
 * Importing this entry also pulls in the token stylesheet, so a host app only
 * needs:
 *
 *   import { Button, PricingCard, Section } from '@deluxfit/ds'
 *
 * It is aliased to source in the app's vite.config.js + jsconfig.json — no
 * separate build step is required to consume it.
 */
import './src/styles/tokens.css'

export * from './src/lib/cn'
export * from './src/components'
export * from './src/layout'
