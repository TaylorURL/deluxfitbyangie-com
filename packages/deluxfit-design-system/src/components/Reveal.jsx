import { forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/cn'

export const Reveal = forwardRef(function Reveal(
  { className, children, delay = 0, y = 24, as = 'div', once = true, amount = 0.3, ...props },
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

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </MotionTag>
  )
})
