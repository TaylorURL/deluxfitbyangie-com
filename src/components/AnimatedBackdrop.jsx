import { useReducedMotion } from 'framer-motion'
import { Aurora, Particles, Threads } from '@/components/reactbits'

/**
 * AnimatedBackdrop — a brand-tuned wrapper around the React Bits WebGL
 * backdrops (Aurora / Particles / Threads). It fixes the crimson palette so
 * every animated panel reads as one voice, pins the canvas behind content
 * (`absolute inset-0 -z-10`, non-interactive), and — critically — renders
 * nothing under `prefers-reduced-motion`, letting the section's own static
 * gradient carry the moment instead.
 *
 * @param {object} props
 * @param {'aurora'|'particles'|'threads'} [props.variant='aurora']
 * @param {string} [props.className] - extra classes on the positioning layer
 * @param {number} [props.opacity=0.6] - overall canvas opacity
 */
export default function AnimatedBackdrop({ variant = 'aurora', className = '', opacity = 0.6 }) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {variant === 'aurora' && (
        <Aurora colorStops={['#4a0910', '#a81420', '#0d0204']} amplitude={0.55} blend={0.32} speed={0.55} />
      )}
      {variant === 'particles' && (
        <Particles
          particleColors={['#fb3645', '#e11d2a', '#f5f3f2']}
          particleCount={170}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={70}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
        />
      )}
      {variant === 'threads' && (
        <Threads color={[0.74, 0.11, 0.16]} amplitude={1.1} distance={0.35} />
      )}
    </div>
  )
}
