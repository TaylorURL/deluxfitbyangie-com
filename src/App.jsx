import { useEffect } from 'react'
import ClientPortalPlaceholder from './components/ClientPortalPlaceholder'
import DevUpload from './components/DevUpload'
import Header from './components/Header'
import Hero from './components/Hero'
import Pain from './components/Pain'
import Benefits from './components/Benefits'
import Program from './components/Program'
import Results from './components/Results'
import Pricing from './components/Pricing'
import Guarantee from './components/Guarantee'
import About from './components/About'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import { useContent } from './i18n'

/**
 * PORTAL ROUTE — the navbar's "Client Login" link points at /portal, which the
 * Vercel SPA rewrite serves with this same app shell. Until the real member
 * portal exists we render a branded placeholder; swap the import once the real
 * portal ships and this conditional becomes a single-component replacement.
 */
function isPortalRoute() {
  if (typeof window === 'undefined') return false
  return window.location.pathname.replace(/\/+$/, '').toLowerCase().startsWith('/portal')
}

/**
 * Keep <title> and the description / OG meta tags in sync with the active
 * locale so search engines, social previews, and the browser tab match the
 * language the visitor is reading.
 */
function useDocumentMeta(meta) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = meta.title

    const setMeta = (selector, value) => {
      const tag = document.head.querySelector(selector)
      if (tag) tag.setAttribute('content', value)
    }

    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
  }, [meta.title, meta.description])
}

/**
 * App — the DeluxFit by Angie sales funnel assembled top to bottom. A single
 * scroll-through page: hook → agitate → present the system → prove it → price
 * it → de-risk it → humanize it → answer objections → close. All editable copy
 * lives in the locale trees under `src/i18n/content/`; UI is composed entirely
 * from `@deluxfit/ds`.
 */
export default function App() {
  const { meta } = useContent()
  useDocumentMeta(meta)

  if (isPortalRoute()) {
    return <ClientPortalPlaceholder />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Pain />
        <Benefits />
        <Program />
        <Results />
        <Pricing />
        <Guarantee />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
