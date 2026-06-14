import { forwardRef } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../lib/cn'
import { Card } from './Card'

/**
 * Testimonial — a client quote with avatar, name, and headline result. The
 * avatar falls back to an initial monogram when no image is supplied, so the
 * card renders cleanly with placeholder data.
 *
 * @param {object} props
 * @param {string} props.quote
 * @param {string} props.name
 * @param {string} [props.result] - a short outcome (e.g. "Lost 28 lbs in 12 weeks")
 * @param {string} [props.avatar] - image URL
 * @param {number} [props.rating=5] - star count (1–5)
 */
export const Testimonial = forwardRef(function Testimonial(
  { className, quote, name, result, avatar, rating = 5, ...props },
  ref
) {
  return (
    <Card ref={ref} variant="elevated" className={cn('flex h-full flex-col', className)} {...props}>
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'h-4 w-4',
              index < rating ? 'fill-df-accent text-df-accent' : 'text-df-surface-3'
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-df-text">
        “{quote}”
      </blockquote>

      <div className="mt-6 flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-11 w-11 rounded-df-full object-cover ring-2 ring-df-border-strong"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-df-full bg-df-accent-soft font-display text-lg font-600 text-df-accent-bright">
            {name?.charAt(0) ?? '?'}
          </span>
        )}
        <div>
          <p className="text-sm font-600 text-df-text">{name}</p>
          {result && <p className="text-xs font-500 text-df-accent-bright">{result}</p>}
        </div>
      </div>
    </Card>
  )
})
