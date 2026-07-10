import { buildSparkline } from '@/lib/sparkline'

/**
 * Sparkline — a tiny inline SVG line chart for a series of numbers, oldest to
 * newest. Used for the progress weight trend: a crimson stroke over a soft area
 * fade with a marked latest point. Renders nothing for fewer than two points.
 */
export default function Sparkline({ values, width = 280, height = 48 }) {
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
      aria-hidden="true"
      className="overflow-visible text-df-accent-bright"
    >
      <defs>
        <linearGradient id="df-sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#df-sparkline-fill)" stroke="none" />
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
