import { cn } from '@deluxfit/ds'
import { imageBox, imageSrcSet, recoverImage } from '@/lib/images'

/**
 * A photograph run the full width of the page between two sections. It is
 * duotoned toward the brand: the colour is pulled most of the way out and a
 * crimson wash is laid back over the shadows, so a band from the gym shoot and
 * a band from the studio shoot read as one series rather than two lighting
 * setups. The scrim at each edge is what lets the section above end and the
 * section below begin on the same black.
 *
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.objectPosition] - tailwind object-position class (e.g. 'object-[50%_30%]')
 * @param {('short'|'tall')} [props.height]
 * @param {boolean} [props.priority] - set when the band is the first image on
 *   the route, so the largest paint is not waiting to be discovered
 * @param {string} [props.caption] - a short line set over the photograph
 */
export default function PhotoBand({
  src,
  alt,
  objectPosition = 'object-[50%_30%]',
  height = 'short',
  priority = false,
  caption,
  className,
}) {
  const box = imageBox(src)
  return (
    <section className={cn('relative isolate overflow-hidden bg-df-bg', className)}>
      <div
        className={cn(
          'relative w-full',
          height === 'tall'
            ? 'h-[52dvh] min-h-[340px] sm:h-[72dvh]'
            : 'h-[36dvh] min-h-[240px] sm:h-[52dvh]'
        )}
      >
        <img
          src={src}
          srcSet={imageSrcSet(src)}
          sizes="100vw"
          width={box?.width}
          height={box?.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
          onError={recoverImage}
          className={cn(
            'absolute inset-0 h-full w-full object-cover [filter:grayscale(0.7)_contrast(1.08)]',
            objectPosition
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--df-bg)_0%,transparent_28%,transparent_72%,var(--df-bg)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_15%_50%,var(--df-accent-wash-strong),transparent_65%)] mix-blend-color"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_50%,var(--df-accent-wash),transparent_65%)] mix-blend-overlay"
        />
        {caption && (
          <div className="absolute inset-x-0 bottom-8 flex justify-center px-5 sm:bottom-12">
            <p className="font-400 max-w-4xl text-center font-display text-[clamp(1.5rem,4.5vw,3rem)] uppercase leading-[0.95] tracking-[-0.01em] text-df-text [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
              {caption}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
