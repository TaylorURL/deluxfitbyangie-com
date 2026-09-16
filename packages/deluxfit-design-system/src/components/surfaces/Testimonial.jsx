import { forwardRef } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from './Card'

/**
 * A client's words, with the figure they earned set above them in the display
 * face. The quote takes the one serif on the site: a reader expects a
 * different voice from the person speaking, and the italic didone is that
 * voice.
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
    <Card
      ref={ref}
      variant="elevated"
      className={cn('relative flex h-full flex-col overflow-hidden', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="font-400 pointer-events-none absolute -right-2 -top-6 select-none font-accent text-[9rem] italic leading-none text-df-accent opacity-[0.12]"
      >
        &rdquo;
      </span>

      {(metric || result) && (
        <div className="flex items-baseline justify-between gap-4 border-b border-df-border pb-5">
          <span className="font-400 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.85] tracking-[-0.02em] text-df-accent-bright">
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

      <blockquote className="mt-6 flex-1 font-accent text-xl italic leading-relaxed text-df-text sm:text-2xl">
        “{quote}”
      </blockquote>

      <div className="mt-7 flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={`${name}, DeluxFit client`}
            width="44"
            height="44"
            loading="lazy"
            decoding="async"
            className="h-11 w-11 rounded-df-full object-cover ring-2 ring-df-border-strong"
          />
        ) : (
          <span className="font-400 flex h-11 w-11 items-center justify-center rounded-df-full bg-df-accent bg-df-accent-gradient font-display text-lg text-df-on-accent">
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
