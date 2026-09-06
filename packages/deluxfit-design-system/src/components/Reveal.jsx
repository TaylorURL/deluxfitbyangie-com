import { forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/cn'

/**
 * Content that arrives as it is scrolled to — and, with `onMount`, content
 * that is already on screen when the page opens.
 *
 * Above the fold the in-view form is the wrong one twice over. It waits on an
 * observer to say what the reader can already see, so the first screen paints
 * empty and fills in a frame later; and an element first painted at nothing is
 * never reconsidered as the page's largest paint, so the headline stops being
 * the thing the load is measured by. `fade={false}` is the other half of that:
 * the copy travels without ever being transparent.
 *
 * @param {object} props
 * @param {boolean} [props.onMount] - animate on mount rather than on scroll
 * @param {boolean} [props.fade=true] - carry opacity as well as the offset
 */
export const Reveal = forwardRef(function Reveal(
  {
    className,
    children,
    delay = 0,
    y = 24,
    as = 'div',
    once = true,
    amount = 0.3,
    onMount = false,
    fade = true,
    ...props
  },
  ref
) {
  const prefersReducedMotion = useReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (prefersReducedMotion) {
    const Tag = as
    return (
      <Tag ref={ref} className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const from = fade ? { opacity: 0, y } : { y }
  const to = fade ? { opacity: 1, y: 0 } : { y: 0 }

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={from}
      {...(onMount ? { animate: to } : { whileInView: to, viewport: { once, amount } })}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </MotionTag>
  )
})
