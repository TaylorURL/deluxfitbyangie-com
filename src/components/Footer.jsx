import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import LanguageSwitcher from './LanguageSwitcher'
import SocialLinks from './SocialLinks'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Footer — closing navigation, social channels, a ghosted oversized wordmark
 * as a final type-specimen flourish, and the legal disclaimer. The nav links
 * mirror the page list in i18n content so adding a route is a one-edit job.
 */
export default function Footer() {
  const { brand, footer, nav } = useContent()
  return (
    <footer className="overflow-hidden border-t border-df-border bg-df-bg pt-16">
      <Container size="xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label={brand.fullName} className="inline-flex items-center">
              <img
                src="/deluxfit-logo.png"
                alt={brand.fullName}
                width="946"
                height="308"
                className="h-10 w-auto select-none [filter:invert(1)_hue-rotate(180deg)]"
                draggable="false"
              />
            </Link>
            <p className="mt-4 text-[11px] font-700 uppercase tracking-[0.24em] text-df-accent-bright">
              {brand.slogan}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{footer.blurb}</p>

            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          <nav aria-label={footer.navLabel} className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-500 text-df-text-muted transition-colors hover:text-df-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="mt-14 select-none font-display text-[clamp(2.5rem,20vw,13rem)] font-400 uppercase leading-[0.78] tracking-tight text-df-surface-3"
        >
          {brand.name}
          <span className="text-df-accent-deep">.</span>
        </div>

        <div className="flex flex-col gap-4 border-t border-df-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <p className="max-w-3xl text-xs leading-relaxed text-df-text-faint">
              {footer.smallPrint}
            </p>
            <p className="text-xs text-df-text-faint">
              © {CURRENT_YEAR} {brand.fullName}. {footer.rightsReserved}
            </p>
          </div>
          <LanguageSwitcher className="self-start sm:self-center" />
        </div>
      </Container>
    </footer>
  )
}
