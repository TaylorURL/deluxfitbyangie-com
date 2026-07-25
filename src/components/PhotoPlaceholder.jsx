import { ImageIcon } from 'lucide-react'
import { cn } from '@deluxfit/ds'

/**
 * @param {object} props
 * @param {string} props.label - caption shown inside the frame
 * @param {string} props.alt - accessible description of the intended image
 * @param {string} [props.aspect] - tailwind aspect-ratio class (e.g. 'aspect-[3/4]')
 */
export default function PhotoPlaceholder({ label, alt, aspect = 'aspect-[3/4]', className }) {
  return (
    <figure
      role="img"
      aria-label={alt}
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-df-lg border border-df-border-strong bg-gradient-to-br from-df-surface-2 via-df-surface to-black',
        aspect,
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_15%,rgba(225,29,42,0.18),transparent_70%)]"
      />
      <ImageIcon className="h-8 w-8 text-df-text-faint" aria-hidden="true" />
      <figcaption className="mt-3 px-4 text-center text-xs font-600 uppercase tracking-wider text-df-text-muted">
        {label}
      </figcaption>
    </figure>
  )
}
