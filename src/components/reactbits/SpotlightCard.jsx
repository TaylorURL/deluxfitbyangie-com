import { useCallback, useRef } from 'react'

/**
 * A card that lights a soft radial under the pointer.
 *
 * The pointer position is written straight to a custom property on the layer
 * rather than held in state: it arrives on every mouse move, and a re-render
 * per frame is what makes an effect like this stutter on a long page. The
 * gradient reads the property, so the browser repaints one element and React
 * is not involved.
 */
const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'var(--df-accent-wash-soft)',
}) => {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  const move = useCallback(event => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    glow.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    glow.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }, [])

  const show = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0.6'
  }, [])

  const hide = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={move}
      onFocus={show}
      onBlur={hide}
      onMouseEnter={show}
      onMouseLeave={hide}
      className={`relative overflow-hidden rounded-df-2xl border border-df-border bg-df-surface p-8 ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-df-out"
        style={{
          background: `radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}

export default SpotlightCard
