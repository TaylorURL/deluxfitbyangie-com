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
 * It travels on a keyframe rather than on a frame loop, which is what lets the
 * mask fade its ends without a repaint and what makes `animation-play-state`
 * enough to stop it under the pointer. Under a reduced-motion preference it
 * does not move at all; the labels are still there to read.
 *
 * @param {object} props
 * @param {React.ReactNode[]} props.items
 */
export const Marquee = forwardRef(function Marquee({ className, items = [], ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className
      )}
      {...props}
    >
      <div className="flex w-max animate-df-marquee gap-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            aria-hidden={index >= items.length}
            className="flex shrink-0 items-center text-sm font-600 uppercase tracking-widest text-df-text-faint"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
})
