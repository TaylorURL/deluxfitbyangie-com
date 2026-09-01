import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import BrandLogo from './BrandLogo'
import LanguageSwitcher from './LanguageSwitcher'
import SocialLinks from './SocialLinks'
import { ShinyText } from '@/components/reactbits'
import { studioYear } from '@/lib/timezone'

const CURRENT_YEAR = studioYear()

export default function Footer({ children }) {
  const { brand, footer, nav } = useContent()
  return (
    <footer className="overflow-hidden border-t border-df-border bg-df-bg pt-12 sm:pt-16">
      <Container size="xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label={brand.fullName}
              className="-my-[6px] inline-flex min-h-[44px] items-center py-[6px]"
            >
              <BrandLogo alt={brand.fullName} className="h-8 sm:h-10" />
            </Link>
            <p className="mt-4 text-[11px] font-700 uppercase tracking-[0.24em]">
              <ShinyText
                text={brand.slogan}
                color="var(--df-shine)"
                shineColor="var(--df-shine-highlight)"
                speed={4}
              />
            </p>
            <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{footer.blurb}</p>

            {footer.socials.length > 0 && (
              <div className="mt-6">
                <SocialLinks />
              </div>
            )}
          </div>

          <nav
            aria-label={footer.navLabel}
            className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3"
          >
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center text-sm font-500 text-df-text-muted transition-colors hover:text-df-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="font-400 mt-10 select-none font-display text-[clamp(2.5rem,22vw,13rem)] uppercase leading-[0.78] tracking-tight text-df-surface-3 sm:mt-14"
        >
          {brand.name}
          <span className="text-df-accent-deep">.</span>
        </div>

        <div className="flex flex-col gap-5 border-t border-df-border py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="max-w-3xl text-xs leading-relaxed text-df-text-faint">
              {footer.smallPrint}
            </p>
            <nav
              aria-label={footer.legalLabel}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {footer.legal.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="-my-[14px] inline-flex min-h-[44px] items-center py-[14px] text-xs text-df-text-muted underline-offset-4 hover:text-df-text hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-df-text-faint">
              © {CURRENT_YEAR} {brand.fullName}. {footer.rightsReserved}
            </p>
          </div>
          <LanguageSwitcher size="md" className="self-start sm:self-center" />
        </div>
      </Container>
      {children}
    </footer>
  )
}
