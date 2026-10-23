import { cn } from '@deluxfit/ds'
import { imageArrived, imageBox, imageSrcSet, recoverImage } from '@/lib/images'

/**
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
        'grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-4',
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
            srcSet={imageSrcSet(src)}
            sizes="(min-width: 1024px) 25vw, 50vw"
            width={imageBox(src)?.width}
            height={imageBox(src)?.height}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={recoverImage}
            onLoad={imageArrived}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-transform duration-df-slow ease-df-out group-hover:scale-[1.04]',
              objectPosition
            )}
          />
          <div
            aria-hidden="true"
            className="from-df-bg/60 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
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
