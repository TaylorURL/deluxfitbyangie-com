import { cn } from '@deluxfit/ds'
import { imageBox, imageSrcSet } from '@/lib/images'

/**
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.aspect] - tailwind aspect-ratio class (e.g. 'aspect-[4/5]')
 * @param {boolean} [props.priority] - set on the frame a visitor sees first.
 *   Deferring the largest paint delays the metric it is measured by, which is
 *   the opposite of what lazy loading is for.
 * @param {string} [props.sizes] - the rendered width, for the candidate the
 *   browser picks before layout runs
 */
export default function FramedPhoto({
  src,
  alt,
  aspect = 'aspect-[3/4]',
  priority = false,
  sizes = '(min-width: 1024px) 30rem, 92vw',
  className,
}) {
  const box = imageBox(src)
  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-df-lg border border-df-border-strong bg-df-surface',
        aspect,
        className
      )}
    >
      <img
        src={src}
        srcSet={imageSrcSet(src)}
        sizes={sizes}
        width={box?.width}
        height={box?.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_15%,var(--df-accent-wash),transparent_70%)] mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-df-lg ring-1 ring-inset ring-df-glass-border"
      />
    </figure>
  )
}
