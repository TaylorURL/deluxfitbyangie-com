import { cn } from '@deluxfit/ds'

/**
 * PhotoGallery — responsive editorial grid for the real DeluxFit photography.
 * Renders an asymmetric, masonry-style layout that mixes tall portraits with
 * wider action stills, each framed with the same hairline border treatment as
 * FramedPhoto so the gallery feels native to the design system.
 *
 * @param {object} props
 * @param {Array<{src: string, alt: string, span?: ('regular'|'wide'|'tall'), objectPosition?: string}>} props.items
 */
export default function PhotoGallery({ items, className }) {
  return (
    <div
      className={cn(
        'grid auto-rows-[180px] grid-cols-2 gap-2.5 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-4',
        className
      )}
    >
      {items.map(({ src, alt, span = 'regular', objectPosition = 'object-center' }) => (
        <figure
          key={src}
          className={cn(
            'group relative overflow-hidden rounded-df-lg border border-df-border-strong bg-df-surface',
            SPAN_CLASSES[span]
          )}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-df-out group-hover:scale-[1.04]',
              objectPosition
            )}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-df-lg ring-1 ring-inset ring-df-glass-border"
          />
        </figure>
      ))}
    </div>
  )
}

const SPAN_CLASSES = {
  regular: 'row-span-1',
  wide: 'col-span-2 row-span-1',
  tall: 'row-span-2',
}
