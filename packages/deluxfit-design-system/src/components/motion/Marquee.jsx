import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * A strip of short labels travelling sideways, forever, with no visible seam.
 *
 * The list is drawn twice and the track moves exactly one list's width, so the
 * moment the first copy leaves the frame the second is standing where it
 * started — the loop has no join to notice. The second copy is `aria-hidden`,
 * because a reader listening to the page should hear the labels once.
 *
 * It travels on a keyframe rather than on a frame loop, which is what lets it
 * run without a repaint and what makes `animation-play-state` enough to stop
 * it under the pointer. Under a reduced-motion preference it does not move at
 * all; the labels are still there to read.
 *
 * `tone="accent"` is the ticker: the brand red as a full band with the labels
 * set in the display face, which is the one place on a page the red is
 * allowed to be loud. The default is the quiet strip, for a page that already
 * has its red elsewhere.
 *
 * @param {object} props
 * @param {React.ReactNode[]} props.items
 * @param {'neutral'|'accent'} [props.tone='neutral']
 */
export const Marquee = forwardRef(function Marquee(
  { className, items = [], tone = 'neutral', ...props },
  ref
) {
  const accent = tone === 'accent'
  return (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden',
        accent
          ? 'bg-df-accent bg-df-accent-gradient py-3 text-df-on-accent sm:py-4'
          : '[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex w-max animate-df-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none',
          accent ? 'gap-8 sm:gap-10' : 'gap-12'
        )}
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            aria-hidden={index >= items.length}
            className={cn(
              'flex shrink-0 items-center',
              accent
                ? 'font-400 gap-8 font-display text-[clamp(1.25rem,2.6vw,1.75rem)] uppercase leading-none tracking-[0.02em] sm:gap-10'
                : 'text-sm font-600 uppercase tracking-widest text-df-text-faint'
            )}
          >
            {item}
            {accent && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-df-full bg-df-on-accent opacity-70"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  )
})
