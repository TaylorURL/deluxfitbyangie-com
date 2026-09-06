import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/cn'

const MotionSpan = motion.span

/**
 * A short, closed set of choices, shown all at once. Where a select hides
 * every option but the chosen one behind a tap, this spends the width to keep
 * them in view, which is the right trade whenever the reader is comparing
 * rather than picking from a list they already know.
 *
 * The selected ground is one element that travels between segments rather than
 * a class that turns on and off, so the eye follows the selection instead of
 * catching it having already moved. It travels on a shared layout id, which is
 * a transform, so the animation never touches layout.
 */
export function SegmentedControl({
  className,
  value,
  onChange,
  options,
  label,
  size = 'md',
  invalid,
  ...props
}) {
  const layoutId = useId()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-df-sm border bg-df-surface p-1',
        invalid ? 'border-df-danger' : 'border-df-border',
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {options.map(option => {
        const selected = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative isolate inline-flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-df-xs px-3 font-700 uppercase tracking-[0.12em] transition-colors duration-df-fast ease-df-out',
              size === 'sm' ? 'h-df-control-sm text-[11px]' : 'h-df-control text-[12px]',
              selected ? 'text-df-on-accent' : 'text-df-text-muted hover:text-df-text'
            )}
          >
            {selected && (
              <MotionSpan
                aria-hidden="true"
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-df-xs bg-df-accent"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                }
              />
            )}
            {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
