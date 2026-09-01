import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { framePump } from './framePump'

const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = 'var(--df-shine)',
  shineColor = 'var(--df-shine-highlight)',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
}) => {
  const [isPaused, setIsPaused] = useState(false)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef(null)
  const directionRef = useRef(direction === 'left' ? 1 : -1)
  const spanRef = useRef(null)

  const animationDuration = speed * 1000
  const delayDuration = delay * 1000

  /*
   * The sweep writes `background-position` on a `background-clip: text` span,
   * which the compositor cannot take over — every frame is a repaint on the
   * main thread. Driving it from the pump keeps that cost to the moments the
   * text is actually on screen in a visible tab.
   */
  useEffect(() => {
    const span = spanRef.current
    if (!span || disabled || isPaused) {
      lastTimeRef.current = null
      return
    }

    return framePump(span, (time, resumed) => {
      if (resumed || lastTimeRef.current === null) {
        lastTimeRef.current = time
        return
      }

      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      elapsedRef.current += deltaTime

      if (yoyo) {
        const cycleDuration = animationDuration + delayDuration
        const fullCycle = cycleDuration * 2
        const cycleTime = elapsedRef.current % fullCycle

        if (cycleTime < animationDuration) {
          const p = (cycleTime / animationDuration) * 100
          progress.set(directionRef.current === 1 ? p : 100 - p)
        } else if (cycleTime < cycleDuration) {
          progress.set(directionRef.current === 1 ? 100 : 0)
        } else if (cycleTime < cycleDuration + animationDuration) {
          const reverseTime = cycleTime - cycleDuration
          const p = 100 - (reverseTime / animationDuration) * 100
          progress.set(directionRef.current === 1 ? p : 100 - p)
        } else {
          progress.set(directionRef.current === 1 ? 0 : 100)
        }
      } else {
        const cycleDuration = animationDuration + delayDuration
        const cycleTime = elapsedRef.current % cycleDuration

        if (cycleTime < animationDuration) {
          const p = (cycleTime / animationDuration) * 100
          progress.set(directionRef.current === 1 ? p : 100 - p)
        } else {
          progress.set(directionRef.current === 1 ? 100 : 0)
        }
      }
    })
  }, [disabled, isPaused, yoyo, animationDuration, delayDuration, progress])

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1
    elapsedRef.current = 0
    progress.set(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction])

  // Maps progress onto a sweep that starts and ends fully off the text.
  const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`)

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  return (
    <motion.span
      ref={spanRef}
      className={`inline-block ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  )
}

export default ShinyText
