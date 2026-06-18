import { cn } from '@deluxfit/ds'

/**
 * PhotoBand — full-bleed editorial photo strip used between page sections to
 * carry the real photo shoot into routed pages without redoing their layout.
 * Renders the image with a fixed aspect ratio, a dark scrim, and a hairline
 * top/bottom border so it reads as part of the existing dark surface stack.
 *
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.objectPosition] - tailwind object-position class (e.g. 'object-[50%_30%]')
 * @param {('short'|'tall')} [props.height]
 */
export default function PhotoBand({
  src,
  alt,
  objectPosition = 'object-[50%_30%]',
  height = 'short',
  className,
}) {
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
            ? 'h-[50vh] min-h-[320px] sm:h-[70vh]'
            : 'h-[34vh] min-h-[220px] sm:h-[48vh]'
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn('absolute inset-0 h-full w-full object-cover', objectPosition)}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-df-bg/85 via-df-bg/30 to-df-bg/85"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_50%,rgba(225,29,42,0.18),transparent_65%)] mix-blend-overlay"
        />
      </div>
    </section>
  )
}
