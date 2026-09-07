import { Container, SplitHeading, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import BrandLogo from './BrandLogo'
import LanguageSwitcher from './LanguageSwitcher'
import SocialLinks from './SocialLinks'
import { studioYear } from '@/lib/timezone'

const CURRENT_YEAR = studioYear()

/**
 * The page closes on its own line rather than on an index of itself. The
 * slogan is the argument every page above it has been making, so it is set at
 * display scale and given the room a statement needs; the wordmark, the
 * destinations and the small print sit under a rule beneath it, quiet and out
 * of the way.
 *
 * The alternative — four columns headed Product, Company, Resources, Legal —
 * is what a footer becomes when it is filled in rather than written, and on a
 * seven-page site it is an index of a thing small enough not to need one.
 */
export default function Footer({ children, className }) {
  const { brand, footer, nav } = useContent()

  return (
    <footer
      className={cn('border-t border-df-border bg-df-bg pb-10 pt-14 sm:pb-12 sm:pt-20', className)}
    >
      <Container size="lg">
        <SplitHeading
          as="p"
          size="page"
          text={`${brand.slogan}.`}
          accent="."
          className="max-w-[16ch]"
        />

        <div className="mt-12 flex flex-col gap-10 border-t border-df-border pt-10 lg:flex-row lg:items-start lg:justify-between">
          {/* The column's own gap rather than a margin per child: a margin is
              measured from a box the logo does not fill, so the space under it
              comes out a couple of pixels off every other gap on the page. */}
          <div className="flex max-w-sm flex-col items-start gap-4">
            <Link
              href="/"
              aria-label={brand.fullName}
              className="inline-flex h-11 items-center transition-opacity duration-df-fast ease-df-out hover:opacity-80"
            >
              <BrandLogo alt={brand.fullName} className="h-8 sm:h-9" />
            </Link>
            <p className="text-[15px] leading-relaxed text-df-text-muted">{footer.blurb}</p>
            {footer.socials.length > 0 && (
              <div className="mt-2">
                <SocialLinks />
              </div>
            )}
          </div>

          <nav
            aria-label={footer.navLabel}
            className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3 lg:gap-x-14"
          >
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center text-[15px] font-500 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-df-border pt-7 sm:flex-row sm:items-end sm:justify-between sm:pt-8">
          <div className="flex flex-col gap-3">
            <p className="max-w-3xl text-[13px] leading-relaxed text-df-text-faint">
              {footer.smallPrint}
            </p>
            <nav
              aria-label={footer.legalLabel}
              className="flex flex-wrap items-center gap-x-6 gap-y-1"
            >
              {footer.legal.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="-my-[14px] inline-flex min-h-[44px] items-center py-[14px] text-[13px] text-df-text-muted underline-offset-4 hover:text-df-text hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="text-[13px] text-df-text-faint">
              © {CURRENT_YEAR} {brand.fullName}. {footer.rightsReserved}
            </p>
          </div>
          <LanguageSwitcher className="self-start sm:self-end" />
        </div>
      </Container>
      {children}
    </footer>
  )
}
