import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MicroLabel } from '../typography/MicroLabel'

/**
 * One figure, said once, with the thing that makes a figure mean anything:
 * what it was before.
 *
 * The delta carries an arrow as well as a colour, because up and down is the
 * whole content of the change and colour alone does not deliver it to
 * everyone. Whether up is good is the caller's call — a weight falling and a
 * streak rising are both progress — so `goodDirection` decides which way the
 * green points rather than the sign doing it.
 */
export function Stat({
  className,
  label,
  value,
  unit,
  delta,
  deltaLabel,
  goodDirection = 'up',
  icon: Icon,
  children,
}) {
  const direction = delta == null || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down'
  const good = direction !== 'flat' && direction === goodDirection
  const DeltaIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[direction]

  return (
    /* One gap for the whole stack. The delta and anything the caller hangs
       below are both optional, and a margin on either leaves its space behind
       on the readings that do not have one. */
    <div className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <MicroLabel className="flex items-center gap-2">
        {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5 text-df-accent-bright" />}
        {label}
      </MicroLabel>

      <p className="font-400 flex items-baseline gap-1.5 font-display text-[clamp(2.25rem,5vw,3rem)] tabular-nums leading-none tracking-[-0.02em] text-df-text">
        {value}
        {unit && (
          <span className="font-sans text-[13px] font-600 uppercase tracking-[0.1em] text-df-text-muted">
            {unit}
          </span>
        )}
      </p>

      {delta != null && (
        <p
          className={cn(
            'inline-flex items-center gap-1 text-[13px] font-600 tabular-nums',
            direction === 'flat'
              ? 'text-df-text-faint'
              : good
                ? 'text-df-positive'
                : 'text-df-danger'
          )}
        >
          <DeltaIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {delta > 0 ? '+' : ''}
          {delta}
          {unit ? ` ${unit}` : ''}
          {deltaLabel && <span className="font-500 text-df-text-faint"> {deltaLabel}</span>}
        </p>
      )}

      {children}
    </div>
  )
}
