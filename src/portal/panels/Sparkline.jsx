import { buildSparkline } from '@/lib/sparkline'

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
