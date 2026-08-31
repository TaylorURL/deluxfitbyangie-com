import { useReducedMotion } from 'framer-motion'
import { CountUp } from '@/components/reactbits'

/**
 * Under `prefers-reduced-motion`, or when no number is found, it renders the
 * original string statically.
 *
 * @param {object} props
 * @param {string} props.value - the full price string from the content tree
 * @param {string} [props.className]
 */
export default function AnimatedPrice({ value, className }) {
  const prefersReducedMotion = useReducedMotion()
  const match = typeof value === 'string' ? value.match(/^(\D*)([\d][\d,]*(?:\.\d+)?)(.*)$/) : null

  if (prefersReducedMotion || !match) {
    return className ? <span className={className}>{value}</span> : value
  }

  const [, prefix, number, suffix] = match
  const to = parseFloat(number.replace(/,/g, ''))
  const separator = number.includes(',') ? ',' : ''

  return (
    <span className={className}>
      {prefix}
      <CountUp to={to} duration={1.6} separator={separator} />
      {suffix}
    </span>
  )
}
