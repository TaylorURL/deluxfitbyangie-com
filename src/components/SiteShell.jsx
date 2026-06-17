import Header from './Header'
import Footer from './Footer'

/**
 * SiteShell — the chrome wrapper used by every routed marketing page: the
 * fixed header, the page body, and the footer. Individual pages render their
 * own sections inside `children`.
 */
export default function SiteShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
