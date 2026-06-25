/**
 * Sparkline — a tiny inline SVG line chart for a series of numbers, oldest to
 * newest. Used for the progress weight trend: a crimson stroke over a soft area
 * fade with a marked latest point. Renders nothing for fewer than two points.
 */
export default function Sparkline({ values, width = 280, height = 48 }) {
  if (!Array.isArray(values) || values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const pad = 4

  const points = values.map((value, index) => {
    const x = index * stepX
    const y = pad + (1 - (value - min) / span) * (height - pad * 2)
    return [x, y]
  })

  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  const [lastX, lastY] = points[points.length - 1]

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
