import { cn } from '@deluxfit/ds'

/**
 * FramedPhoto — on-brand frame for real photography (hero, about, etc.). Mirrors
 * the rounded/bordered surface treatment of PhotoPlaceholder so swapping a real
 * image in keeps the same architectural feel, plus a subtle red glow inset and
 * top-edge gradient that lifts the subject without obscuring it.
 *
 * @param {object} props
 * @param {string} props.src - image source path
 * @param {string} props.alt - accessible image description
 * @param {string} [props.aspect] - tailwind aspect-ratio class (e.g. 'aspect-[4/5]')
 */
export default function FramedPhoto({ src, alt, aspect = 'aspect-[3/4]', className }) {
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
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_15%,rgba(225,29,42,0.18),transparent_70%)] mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-df-lg ring-1 ring-inset ring-df-glass-border"
      />
    </figure>
  )
}
