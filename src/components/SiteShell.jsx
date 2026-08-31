import SplitRail from '@taylorurl/split-rail'
import Header from './Header'
import Footer from './Footer'
import { useContent } from '@/i18n'

export default function SiteShell({ children }) {
  const { a11y } = useContent()

  return (
    <div className="flex min-h-dvh flex-col">
      {/*
        Off-screen until focused. The nav carries seven destinations plus the
        login and CTA controls, which is nine tab stops between the top of the
        page and the first word of it on every route.
      */}
      <a
        href="#main"
        className="sr-only min-h-[44px] min-w-[44px] items-center justify-center rounded-df-sm bg-df-accent px-4 py-3 text-[12px] font-700 uppercase tracking-[0.16em] text-df-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-modal focus:inline-flex"
      >
        {a11y.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer>
        <SplitRail version={__BUILD_VERSION__} />
      </Footer>
    </div>
  )
}
