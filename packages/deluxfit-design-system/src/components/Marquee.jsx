import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
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
