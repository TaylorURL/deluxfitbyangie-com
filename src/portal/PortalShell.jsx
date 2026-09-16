import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react'
import SplitRail from '@taylorurl/split-rail'
import { useContent } from '@/i18n'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { useAuth } from '@/auth/useAuth'

/**
 * The frame around the portal. On a laptop the dashboard draws its own rail
 * down the left edge, so the shell holds nothing above the work; on a phone
 * there is no rail, and the bar across the top carries the wordmark and the
 * two doors out. The main slot is the whole viewport either way, which is
 * what makes the portal read as an application rather than as a page of the
 * marketing site with a login in front of it.
 */
export default function PortalShell({ children }) {
  const { brand, portal, header } = useContent()
  const { user, isStaff, signOut } = useAuth()

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-df-bg">
      <header className="border-b border-df-border bg-df-bg-elevated lg:hidden">
        <div className="flex h-[var(--df-header-height)] items-center justify-between gap-3 px-5">
          <a
            href="/"
            aria-label={brand.fullName}
            className="inline-flex shrink-0 items-center rounded-df-sm transition-opacity duration-df-fast ease-df-out hover:opacity-80"
          >
            <BrandLogo alt={brand.fullName} className="h-7" />
          </a>
          <div className="flex items-center gap-2">
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
      </header>

      <main className="flex-1">{children}</main>

      <footer className="lg:hidden">
        <SplitRail version={__BUILD_VERSION__} />
      </footer>
    </div>
  )
}
