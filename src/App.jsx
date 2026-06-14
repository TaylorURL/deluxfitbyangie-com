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
 * App — the DeluxFit by Angie sales funnel assembled top to bottom. A single
 * scroll-through page: hook → agitate → present the system → prove it → price
 * it → de-risk it → humanize it → answer objections → close. All editable copy
 * lives in `src/content/site.js`; UI is composed entirely from `@deluxfit/ds`.
 */
export default function App() {
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
