import { useRef, useEffect, useCallback } from 'react'

const ClickSpark = ({
  sparkColor = 'var(--df-accent-bright)',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  className = '',
  children,
}) => {
  const canvasRef = useRef(null)
  const surfaceRef = useRef(null)
  const sparksRef = useRef([])
  const startTimeRef = useRef(null)
  const wakeRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    let resizeTimeout

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(parent)

    resizeCanvas()

    return () => {
      ro.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [])

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing]
  )

  /*
   * The loop runs only while there is a spark to draw. A frame callback that
   * re-queues itself unconditionally holds a wake every 16ms for the length of
   * the visit, and competes with every interaction on the page to clear an
   * empty canvas.
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId = 0

    const draw = timestamp => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = easeFunc(progress)

        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      animationId = sparksRef.current.length ? requestAnimationFrame(draw) : 0
    }

    wakeRef.current = () => {
      if (!animationId) animationId = requestAnimationFrame(draw)
    }

    return () => {
      wakeRef.current = null
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale])

  /*
   * The burst is bound to the wrapper element rather than passed as an onClick
   * prop. A decorative div carrying a click handler reads to a screen reader,
   * and to anything walking the accessibility tree, as something to act on.
   * The listener does the same work and leaves the element inert.
   */
  useEffect(() => {
    const surface = surfaceRef.current
    const canvas = canvasRef.current
    if (!surface || !canvas) return

    const onClick = event => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const now = performance.now()
      sparksRef.current.push(
        ...Array.from({ length: sparkCount }, (_, i) => ({
          x,
          y,
          angle: (2 * Math.PI * i) / sparkCount,
          startTime: now,
        }))
      )
      wakeRef.current?.()
    }

    surface.addEventListener('click', onClick)
    return () => surface.removeEventListener('click', onClick)
  }, [sparkCount])

  return (
    <div ref={surfaceRef} className={`relative h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 block h-full w-full select-none"
      />
      {children}
    </div>
  )
}

export default ClickSpark
