import { useId } from 'react'
import { buildSparkline } from '@/lib/sparkline'

/**
 * One drawing of a figure over time, for both sides of the application.
 *
 * The coach panel drew its own — a thinner line, no fill, a smaller dot, a
 * darker accent — from the same numbers the client's chart is built from. Two
 * pictures of one weight trend is one picture too many: the coach and the
 * client should be looking at the same thing when they talk about it.
 *
 * The gradient's id is generated per instance. A fixed one collides the moment
 * a page carries two charts, and the second one silently takes the first one's
 * fill.
 */
export default function Sparkline({ values, width = 280, height = 48, label }) {
  const fillId = useId()
  if (!Array.isArray(values) || values.length < 2) return null

  const { line, area, last } = buildSparkline(values, { width, height })
  const [lastX, lastY] = last

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      {...(label ? { 'aria-label': label } : { 'aria-hidden': 'true' })}
      className="overflow-visible text-df-accent-bright"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${fillId})`} stroke="none" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3" fill="currentColor" />
    </svg>
  )
}
