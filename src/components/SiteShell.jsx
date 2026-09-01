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
      {/*
        A screen of held height, so the footer opens below the fold on every
        route and stays there. The footer runs taller than the viewport on a
        phone, so `flex-1` alone never reaches it: the column is already past
        its minimum before main has any room to grow, and a page that arrives
        shorter than the screen — or a chunk still in flight behind the
        placeholder — leaves the footer sitting halfway up the first screen.
      */}
      <main id="main" tabIndex={-1} className="min-h-dvh flex-1 focus:outline-none">
        {children}
      </main>
      <Footer>
        <SplitRail version={__BUILD_VERSION__} />
      </Footer>
    </div>
  )
}
