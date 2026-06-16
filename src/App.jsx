import ClientPortalPlaceholder from './components/ClientPortalPlaceholder'
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
 * App — the DeluxFit by Angie sales funnel assembled top to bottom. A single
 * scroll-through page: hook → agitate → present the system → prove it → price
 * it → de-risk it → humanize it → answer objections → close. All editable copy
 * lives in `src/content/site.js`; UI is composed entirely from `@deluxfit/ds`.
 */
export default function App() {
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
