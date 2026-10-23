import { cn } from '@deluxfit/ds'
import { imageArrived, imageBox, imageSrcSet, recoverImage } from '@/lib/images'

/**
 * A photograph in the site's frame: the image itself under a hairline, and a
 * second frame in the brand red set a step behind it and offset to one
 * corner. The offset frame is what makes a portrait on a black page read as
 * placed rather than dropped — it gives the photograph a shadow in the one
 * colour the site owns.
 *
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.aspect] - tailwind aspect-ratio class (e.g. 'aspect-[4/5]')
 * @param {boolean} [props.priority] - set on the frame a visitor sees first.
 *   Deferring the largest paint delays the metric it is measured by, which is
 *   the opposite of what lazy loading is for.
 * @param {string} [props.sizes] - the rendered width, for the candidate the
 *   browser picks before layout runs
 * @param {'left'|'right'} [props.offset='right'] - which way the red frame steps
 * @param {string} [props.caption] - a short label in the lower corner
 */
export default function FramedPhoto({
  src,
  alt,
  aspect = 'aspect-[3/4]',
  priority = false,
  sizes = '(min-width: 1024px) 30rem, 92vw',
  offset = 'right',
  caption,
  className,
}) {
  const box = imageBox(src)
  return (
    <figure className={cn('relative', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-df-xl border-2 border-df-accent opacity-70',
          offset === 'right'
            ? 'translate-x-3 translate-y-3 sm:translate-x-5 sm:translate-y-5'
            : '-translate-x-3 translate-y-3 sm:-translate-x-5 sm:translate-y-5'
        )}
      />
      <div
        className={cn('relative overflow-hidden rounded-df-xl bg-df-surface shadow-df-lg', aspect)}
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
          onError={recoverImage}
          onLoad={imageArrived}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(8,8,10,0.55)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_15%,var(--df-accent-wash),transparent_70%)] mix-blend-overlay"
        />
        {caption && (
          <figcaption className="absolute bottom-4 left-4 inline-flex h-8 items-center gap-2 rounded-df-full border border-df-glass-border bg-df-glass-fill px-3.5 text-[11px] font-700 uppercase tracking-[0.16em] text-df-text backdrop-blur-md">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-df-full bg-df-accent-bright" />
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  )
}
