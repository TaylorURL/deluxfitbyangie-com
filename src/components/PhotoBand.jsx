import { cn } from '@deluxfit/ds'
import { imageBox, imageSrcSet } from '@/lib/images'

/**
 * Renders the image with a fixed aspect ratio, a dark scrim, and a hairline
 * top/bottom border so it reads as part of the existing dark surface stack.
 *
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.objectPosition] - tailwind object-position class (e.g. 'object-[50%_30%]')
 * @param {('short'|'tall')} [props.height]
 * @param {boolean} [props.priority] - set when the band is the first image on
 *   the route, so the largest paint is not waiting to be discovered
 */
export default function PhotoBand({
  src,
  alt,
  objectPosition = 'object-[50%_30%]',
  height = 'short',
  priority = false,
  className,
}) {
  const box = imageBox(src)
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border-y border-df-border bg-df-bg',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full',
          height === 'tall'
            ? 'h-[50dvh] min-h-[320px] sm:h-[70dvh]'
            : 'h-[34dvh] min-h-[220px] sm:h-[48dvh]'
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
          className={cn('absolute inset-0 h-full w-full object-cover', objectPosition)}
        />
        <div
          aria-hidden="true"
          className="from-df-bg/85 via-df-bg/30 to-df-bg/85 pointer-events-none absolute inset-0 bg-gradient-to-b"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_50%,var(--df-accent-wash),transparent_65%)] mix-blend-overlay"
        />
      </div>
    </section>
  )
}
