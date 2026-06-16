import { forwardRef } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../lib/cn'
import { Card } from './Card'

/**
 * Testimonial — a client pull-quote led by an oversized result metric. The
 * metric is the type anchor (condensed crimson display); the quote is set in the
 * couture Fraunces italic for warmth. The avatar falls back to an initial
 * monogram so the card renders cleanly with placeholder data.
 *
 * @param {object} props
 * @param {string} props.quote
 * @param {string} props.name
 * @param {string} [props.metric] - oversized headline result (e.g. "−28 lbs")
 * @param {string} [props.result] - the supporting outcome line under the name
 * @param {string} [props.avatar] - image URL
 * @param {number} [props.rating=5] - star count (1–5)
 */
export const Testimonial = forwardRef(function Testimonial(
  { className, quote, name, metric, result, avatar, rating = 5, ...props },
  ref
) {
  return (
    <Card ref={ref} variant="elevated" className={cn('flex h-full flex-col', className)} {...props}>
      {(metric || result) && (
        <div className="flex items-baseline justify-between gap-4 border-b border-df-border pb-5">
          <span className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-400 leading-[0.85] tracking-tight text-df-accent-bright">
            {metric ?? result}
          </span>
          <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  'h-3.5 w-3.5',
                  index < rating ? 'fill-df-accent text-df-accent' : 'text-df-surface-3'
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      )}

      <blockquote className="mt-6 flex-1 font-accent text-lg italic leading-relaxed text-df-text sm:text-xl">
        “{quote}”
      </blockquote>

      <div className="mt-7 flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-11 w-11 rounded-df-full object-cover ring-2 ring-df-border-strong"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-df-full bg-df-accent-soft font-display text-lg font-400 text-df-accent-bright">
            {name?.charAt(0) ?? '?'}
          </span>
        )}
        <div>
          <p className="text-sm font-600 text-df-text">{name}</p>
          {result && <p className="text-xs font-500 text-df-text-muted">{result}</p>}
        </div>
      </div>
    </Card>
  )
})
