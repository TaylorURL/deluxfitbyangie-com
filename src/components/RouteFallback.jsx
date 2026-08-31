import { Container } from '@deluxfit/ds'

/**
 * Holds the shape of a page while its chunk is still in flight.
 *
 * Every route is its own chunk, so there is a gap between the click and the
 * first paint of the new page. An empty gap reads as a broken link.
 *
 * The block is `PageHero` with the words taken out: the same section padding,
 * the same container, the same eyebrow-then-headline-then-standfirst stack, and
 * a headline placeholder set to the same clamp and the same leading as the real
 * one. Every route opens on that hero, so what arrives lands where the
 * placeholder stood rather than shoving the page down as it resolves. Only the
 * hero is drawn: what sits under it differs by route, and reserving a shape for
 * it would move the page rather than hold it.
 */
const HEADLINE_LINE = 'h-[calc(clamp(2.25rem,9vw,5.5rem)*0.92)]'
const STANDFIRST_LINE = 'h-[1.75rem] animate-pulse bg-df-surface sm:h-[1.925rem]'

export default function RouteFallback() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="relative isolate overflow-hidden bg-df-bg pb-12 pt-24 sm:pb-16 sm:pt-40 lg:pt-48"
    >
      <Container size="xl">
        <div className="flex max-w-3xl flex-col items-start">
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
            <span className="h-4 w-40 animate-pulse bg-df-surface-2" />
          </span>

          <div className="mt-5 w-full sm:mt-6">
            <div className={`${HEADLINE_LINE} w-full animate-pulse bg-df-surface-2`} />
            <div className={`${HEADLINE_LINE} w-[82%] animate-pulse bg-df-surface-2`} />
            <div className={`${HEADLINE_LINE} w-[54%] animate-pulse bg-df-surface-2`} />
          </div>

          <div className="mt-6 w-full max-w-2xl sm:mt-7">
            <div className={`${STANDFIRST_LINE} w-full`} />
            <div className={`${STANDFIRST_LINE} w-full`} />
            <div className={`${STANDFIRST_LINE} w-[64%]`} />
          </div>
        </div>
      </Container>
    </section>
  )
}
