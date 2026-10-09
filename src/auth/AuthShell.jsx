import { ArrowLeft } from 'lucide-react'
import { Container, SplitHeading } from '@deluxfit/ds'
import SplitRail from '@taylorurl/split-rail'
import { useContent } from '@/i18n'
import { Link } from '@/router'
import BrandLogo from '@/components/layout/BrandLogo'
import ShellAction from '@/components/layout/ShellAction'
import { studioYear } from '@/lib/timezone'
import { imageBox, imageSrcSet, recoverImage } from '@/lib/images'

const PANEL_PHOTO = '/brand/studio-red-mat-seated.webp'

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

      {/* The card alone in the middle of a wide screen is a form in a void.
          Past the desktop breakpoint the left five columns carry a photograph
          under the slogan, so the sign-in reads as a door into the same site
          rather than a widget from somewhere else. The phone gets the card
          alone: there is no room beside it, and the photo would only push the
          first field below the fold. */}
      <main className="flex flex-1">
        <div className="grid w-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <aside
            aria-hidden="true"
            className="relative hidden overflow-hidden border-r border-df-border bg-df-surface lg:block"
          >
            <img
              src={PANEL_PHOTO}
              srcSet={imageSrcSet(PANEL_PHOTO)}
              sizes="(min-width: 1024px) 42vw, 0px"
              width={imageBox(PANEL_PHOTO)?.width}
              height={imageBox(PANEL_PHOTO)?.height}
              alt=""
              decoding="async"
              onError={recoverImage}
              className="absolute inset-0 h-full w-full object-cover object-[55%_30%]"
            />
            <div className="from-df-bg/90 via-df-bg/20 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
              <SplitHeading
                as="p"
                size="section"
                text={`${brand.slogan}.`}
                accent="."
                className="max-w-[12ch]"
              />
            </div>
          </aside>
          <div className="flex items-start px-5 py-10 sm:items-center sm:py-16">
            <div className="mx-auto w-full max-w-md">{children}</div>
          </div>
        </div>
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
