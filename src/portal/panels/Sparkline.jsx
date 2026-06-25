/**
 * Sparkline — a tiny inline SVG line chart for a series of numbers, oldest to
 * newest. Used for the progress weight trend. Renders nothing for fewer than
 * two points.
 */
export default function Sparkline({ values, width = 280, height = 48 }) {
  if (!Array.isArray(values) || values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const pad = 3

  const points = values.map((value, index) => {
    const x = index * stepX
    const y = pad + (1 - (value - min) / span) * (height - pad * 2)
    return [x, y]
  })

  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
      className="text-df-accent-bright"
    >
      <path
        d={path}
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
