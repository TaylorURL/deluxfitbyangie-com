import { cn } from '../lib/cn'

/**
 * A share of a target, drawn as a track and a fill. It is a `meter` in the
 * accessibility tree rather than a decorated div, so the value is read out as
 * a value and not inferred from a width.
 *
 * The fill is scaled on the x axis rather than sized in percent, so the
 * animation runs on the compositor and a row of them costs one frame between
 * them.
 */
export function Meter({ className, value, max = 100, label, tone = 'accent', children }) {
  const share = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const fill = {
    accent: 'bg-df-accent',
    positive: 'bg-df-positive',
    warning: 'bg-df-warning',
    neutral: 'bg-df-text-faint',
  }[tone]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {children}
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-df-full bg-df-surface-3"
      >
        <div
          aria-hidden="true"
          className={cn(
            'h-full w-full origin-left rounded-df-full transition-transform duration-df-slow ease-df-out',
            fill
          )}
          style={{ transform: `scaleX(${share})` }}
        />
      </div>
    </div>
  )
}
