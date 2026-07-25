import { Container } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import LanguageSwitcher from './LanguageSwitcher'
import SocialLinks from './SocialLinks'
import { ShinyText } from '@/components/reactbits'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { brand, footer, nav } = useContent()
  return (
    <footer className="overflow-hidden border-t border-df-border bg-df-bg pt-12 sm:pt-16">
      <Container size="xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label={brand.fullName} className="inline-flex items-center">
              <img
                src="/deluxfit-logo.png"
                alt={brand.fullName}
                width="946"
                height="308"
                className="h-8 w-auto select-none [filter:invert(1)_hue-rotate(180deg)] sm:h-10"
                draggable="false"
              />
            </Link>
            <p className="mt-4 text-[11px] font-700 uppercase tracking-[0.24em]">
              <ShinyText text={brand.slogan} color="#c81a27" shineColor="#ff8b95" speed={4} />
            </p>
            <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{footer.blurb}</p>

            <div className="mt-6">
              <SocialLinks />
            </div>
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
          className="mt-10 select-none font-display text-[clamp(2.5rem,22vw,13rem)] font-400 uppercase leading-[0.78] tracking-tight text-df-surface-3 sm:mt-14"
        >
          {brand.name}
          <span className="text-df-accent-deep">.</span>
        </div>

        <div className="flex flex-col gap-5 border-t border-df-border py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="max-w-3xl text-xs leading-relaxed text-df-text-faint">
              {footer.smallPrint}
            </p>
            <p className="text-xs text-df-text-faint">
              © {CURRENT_YEAR} {brand.fullName}. {footer.rightsReserved}
            </p>
          </div>
          <LanguageSwitcher className="self-start sm:self-center" />
        </div>

        <div className="flex justify-center py-3 sm:py-4">
          <a
            href="https://www.taylorurl.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-xs tracking-wide text-df-text-muted transition-colors duration-150 hover:text-df-accent-bright focus-visible:rounded-sm focus-visible:text-df-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
          >
            Built by <span className="font-600">TaylorURL</span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
