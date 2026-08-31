/**
 * Build the SVG path geometry for a sparkline over a series of numbers (oldest
 * to newest), normalized to the given box. Returns the line path, a closed area
 * path (line down to the baseline and back), and the last point so callers can
 * mark the latest value. Presentation — stroke, fill, size — stays with each
 * caller; only the shared normalize + path math lives here.
 */
export function buildSparkline(values, { width = 280, height = 48, pad = 4 } = {}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)

  const points = values.map((value, index) => {
    const x = index * stepX
    const y = pad + (1 - (value - min) / span) * (height - pad * 2)
    return [x, y]
  })

  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return { line, area, last: points[points.length - 1] }
}
