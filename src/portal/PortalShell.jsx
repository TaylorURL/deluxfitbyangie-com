import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react'
import { Container } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { useContent } from '@/i18n'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { useAuth } from '@/auth/useAuth'
import { studioYear } from '@/lib/timezone'

export default function PortalShell({ children }) {
  const { brand, portal, header } = useContent()
  const { user, isStaff, signOut } = useAuth()

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,var(--df-accent-wash),transparent_65%)]"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3">
            <a
              href="/"
              aria-label={brand.fullName}
              className="inline-flex shrink-0 items-center rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
            >
              <BrandLogo alt={brand.fullName} className="h-7 sm:h-10" />
            </a>
            <div className="flex items-center gap-2 sm:gap-3">
              {isStaff && (
                <ShellAction
                  native
                  href="/admin"
                  tone="accent"
                  icon={ShieldCheck}
                  label={header.admin}
                />
              )}
              {user && <ShellAction onClick={signOut} icon={LogOut} label={portal.auth.signOut} />}
              <ShellAction native href="/" icon={ArrowLeft} label={portal.backToSite} />
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1 px-5 py-10 sm:py-16">{children}</main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {studioYear()} {brand.fullName} · {brand.slogan}
          </p>
        </Container>
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}
