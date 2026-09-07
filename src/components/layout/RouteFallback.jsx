import { Container, Skeleton, cn } from '@deluxfit/ds'

/**
 * Holds the shape of a page while its chunk is still in flight.
 *
 * Every route is its own chunk, so there is a gap between the click and the
 * first paint of the new page. An empty gap reads as a broken link.
 *
 * The block is `PageHero` with the words taken out: the same section padding,
 * the same container, the same eyebrow-then-headline-then-standfirst-then-keys
 * stack, and a headline placeholder set to the same clamp and the same leading
 * as the real one, in the same two lines it wraps to. Every route opens on that
 * hero, so what arrives lands where the placeholder stood rather than shoving
 * the page down as it resolves. Only the hero is drawn: what sits under it
 * differs by route, and reserving a shape for it would move the page rather
 * than hold it.
 *
 * @param {object} props
 * @param {'wide'|'aside'} [props.hero] - the shape the route's hero is in.
 *   The four service pages carry a price tile beside the copy and bottom-align
 *   the text column to it; drawn without the tile, the headline placeholder
 *   sits a few hundred pixels above where the headline actually lands.
 */
const HEADLINE_LINE = 'h-[calc(clamp(2.25rem,7vw,4.5rem)*0.9)]'
const STANDFIRST_LINE = 'h-7'

/* The median of the four tiles, which is the height that is least wrong
   whichever service page the reader is on. */
const ASIDE_HEIGHT = 'h-[33.5rem]'

export default function RouteFallback({ hero = 'wide' }) {
  const hasAside = hero === 'aside'

  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="relative isolate overflow-hidden bg-df-bg pb-12 pt-[calc(var(--df-header-height)+1.5rem)] sm:pb-16"
    >
      <Container size="lg">
        <div
          className={cn(
            hasAside
              ? 'grid items-end gap-10 sm:gap-12 lg:grid-cols-[1.35fr_1fr]'
              : 'flex flex-col items-start'
          )}
        >
          <div className="flex max-w-3xl flex-col items-start">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
              {/* The eyebrow is one or four words depending on the route, so one
                  width cannot be right for all of them. This is the median of the
                  eight routes that open on the shared hero, which is the width
                  that is least wrong wherever the reader lands. */}
              <Skeleton className="h-4 w-[10.375rem]" radius="xs" />
            </span>

            <div className="mt-5 w-full max-w-[17ch] pb-[calc(clamp(2.25rem,7vw,4.5rem)*0.12)] font-display text-[clamp(2.25rem,7vw,4.5rem)] sm:mt-6">
              <Skeleton className={`${HEADLINE_LINE} w-full`} radius="xs" />
              <Skeleton className={`${HEADLINE_LINE} w-[72%]`} radius="xs" />
            </div>

            <div className="mt-6 w-full max-w-2xl">
              <Skeleton className={`${STANDFIRST_LINE} w-full`} radius="xs" />
              <Skeleton className={`${STANDFIRST_LINE} w-[58%]`} radius="xs" />
            </div>

            {/* Only the service heroes end in a pair of keys. Drawing them on a
                hero that has none reserves eighty-four pixels the page then
                takes back, which moves everything under the hero up as the
                chunk lands. */}
            {hasAside && (
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Skeleton className="h-df-control-lg w-full sm:w-52" />
                <Skeleton className="h-df-control-lg w-full sm:w-56" />
              </div>
            )}
          </div>

          {hasAside && (
            <div className="mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
              <Skeleton className={`${ASIDE_HEIGHT} w-full`} radius="lg" />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
