import { cn } from '../lib/cn'

/**
 * The one placeholder in the system. Every loading state on the site is built
 * out of this, so a screen's placeholders share a colour, a corner and a
 * rhythm rather than each screen inventing its own.
 *
 * The sweep is a child element travelling on `transform`, not a background
 * position being animated: a background-position animation runs on the main
 * thread, and a screen holding thirty placeholders is exactly the moment the
 * main thread is busiest. Under a reduced-motion preference the sweep is not
 * rendered at all — the placeholder is still a placeholder without it.
 *
 * `aria-hidden` is on the placeholder rather than on the region: the region
 * announces "loading" once, and thirty grey boxes underneath it say nothing a
 * listener needs.
 */
export function Skeleton({ className, radius = 'sm', ...props }) {
  const corner = {
    xs: 'rounded-df-xs',
    sm: 'rounded-df-sm',
    md: 'rounded-df-md',
    lg: 'rounded-df-lg',
    full: 'rounded-df-full',
  }[radius]

  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden bg-df-surface-2', corner, className)}
      {...props}
    >
      <span className="absolute inset-0 animate-df-shimmer bg-gradient-to-r from-transparent via-df-surface-3 to-transparent motion-reduce:hidden" />
    </div>
  )
}

/**
 * A run of lines at the measure real prose sits at, with the last one short —
 * which is what a paragraph does, and what a stack of equal bars does not.
 */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn('h-3.5', index === lines - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  )
}
