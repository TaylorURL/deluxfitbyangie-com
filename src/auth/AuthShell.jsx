import { ArrowLeft } from 'lucide-react'
import { Container } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { studioYear } from '@/lib/timezone'

export default function AuthShell({ children }) {
  const { brand, portal } = useContent()

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,var(--df-accent-wash),transparent_65%)]"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3">
            <Link
              href="/"
              aria-label={brand.fullName}
              className="inline-flex shrink-0 items-center rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
            >
              <BrandLogo alt={brand.fullName} className="h-7 sm:h-9" />
            </Link>
            <ShellAction href="/" icon={ArrowLeft} label={portal.backToSite} />
          </div>
        </Container>
      </header>

      <main className="flex flex-1 items-start px-5 py-10 sm:items-center sm:py-16">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {studioYear()} {brand.fullName}
          </p>
        </Container>
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}
