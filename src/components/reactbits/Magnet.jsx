import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/**
 * Pulls its child toward the pointer while the pointer is within `padding` of
 * the element, and lets it settle back when the pointer leaves.
 *
 * The offset is a motion value rather than React state. Pointer position
 * arrives on every mouse move, and holding it in state re-renders the tree at
 * that rate, which is what collapses this effect on a phone. The spring writes
 * straight to the transform and the component renders once.
 *
 * @param {object} props
 * @param {number} [props.padding] - how far outside its own box the field reaches
 * @param {boolean} [props.disabled]
 * @param {number} [props.magnetStrength] - larger divides the offset down
 */
const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef(null)
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const springX = useSpring(offsetX, MAGNET_SPRING)
  const springY = useSpring(offsetY, MAGNET_SPRING)
  const prefersReducedMotion = useReducedMotion()
  const inert = disabled || prefersReducedMotion

  useEffect(() => {
    if (inert) {
      offsetX.set(0)
      offsetY.set(0)
      return
    }

    const onPointerMove = event => {
      const element = magnetRef.current
      if (!element) return

      const { left, top, width, height } = element.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const withinReach =
        Math.abs(centerX - event.clientX) < width / 2 + padding &&
        Math.abs(centerY - event.clientY) < height / 2 + padding

      offsetX.set(withinReach ? (event.clientX - centerX) / magnetStrength : 0)
      offsetY.set(withinReach ? (event.clientY - centerY) / magnetStrength : 0)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [padding, inert, magnetStrength, offsetX, offsetY])

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <motion.div className={innerClassName} style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  )
}

/** Critically damped enough to arrive without a visible overshoot. */
const MAGNET_SPRING = { stiffness: 260, damping: 30, mass: 0.6 }

export default Magnet
