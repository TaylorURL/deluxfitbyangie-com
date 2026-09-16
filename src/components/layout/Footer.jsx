import { ArrowUpRight } from 'lucide-react'
import { Button, Container, SplitHeading, cn } from '@deluxfit/ds'
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
 * display scale with the one action beside it; the wordmark, the destinations
 * and the small print sit under a rule beneath, quiet and out of the way.
 *
 * Under all of it the brand name runs off the bottom of the page as an
 * outline at the largest size the site sets anything: the watermark a poster
 * carries, drawn in a hairline so it holds the composition without competing
 * with the slogan set in solid above it.
 */
export default function Footer({ children, className }) {
  const { brand, footer, nav } = useContent()

  return (
    <footer
      className={cn(
        'df-grain relative isolate overflow-hidden border-t border-df-border bg-df-bg',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28rem] bg-[radial-gradient(60%_70%_at_50%_120%,var(--df-accent-wash-deep),transparent_70%)]"
      />
      {/* The bottom padding sits on the content rather than on the footer, so
          the rail that closes the page is the footer's last forty pixels and
          nothing sits under it. */}
      <Container size="lg" className="pb-10 pt-16 sm:pb-12 sm:pt-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SplitHeading
            as="p"
            size="page"
            text={`${brand.slogan}.`}
            accent="."
            className="max-w-[14ch]"
          />
          <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
            <Link href={footer.ctaHref}>
              {footer.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

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
                className="group flex min-h-11 items-center gap-2 text-[15px] font-500 text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-text"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-0 bg-df-accent transition-[width] duration-df-base ease-df-out group-hover:w-4"
                />
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

      {/* The watermark. It is clipped by the footer's own edge, so only the
          top two thirds of the letters show, which is what makes it read as
          the ground the footer stands on rather than as a fourth line of it. */}
      <p
        aria-hidden="true"
        className="df-outline font-400 pointer-events-none absolute -bottom-[0.28em] left-1/2 -z-10 w-max -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(6rem,22vw,20rem)] uppercase leading-none tracking-[-0.02em]"
      >
        {brand.name}
      </p>
      {children}
    </footer>
  )
}
