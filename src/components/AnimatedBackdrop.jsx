import { Suspense, lazy } from 'react'
import { useReducedMotion } from 'framer-motion'
import { hexToUnitRgb, useTokenColors } from '@deluxfit/ds'
import { documentDrawsInSoftware } from '@/lib/softwareRenderer'

/*
 * The three canvases carry `ogl` and their shaders — around 64KB that renders
 * a decorative layer behind the page. Imported statically they join the route's
 * own module graph, so the page cannot evaluate until the WebGL library has
 * downloaded, and the shader compile lands on the main thread while the first
 * screen is still being painted. Behind `lazy` the route renders on its own and
 * the backdrop arrives into the finished page.
 */
const Aurora = lazy(() => import('@/components/reactbits/Aurora'))
const Particles = lazy(() => import('@/components/reactbits/Particles'))
const Threads = lazy(() => import('@/components/reactbits/Threads'))

/*
 * Whether this machine draws in software, read once for the module. The head
 * settles it before the first frame and it cannot change afterwards, so there
 * is nothing here for a render to ask again.
 */
const SOFTWARE = documentDrawsInSoftware()

const AURORA_TOKENS = ['--df-aurora-deep', '--df-aurora-mid', '--df-aurora-black']
const PARTICLE_TOKENS = ['--df-accent-bright', '--df-accent', '--df-text']
const THREAD_TOKENS = ['--df-accent-deep']

/**
 * @param {object} props
 * @param {'aurora'|'particles'|'threads'} [props.variant='aurora']
 * @param {string} [props.className] - extra classes on the positioning layer
 * @param {number} [props.opacity=0.6] - overall canvas opacity
 */
export default function AnimatedBackdrop({ variant = 'aurora', className = '', opacity = 0.6 }) {
  const prefersReducedMotion = useReducedMotion()
  const auroraStops = useTokenColors(AURORA_TOKENS)
  const particleColors = useTokenColors(PARTICLE_TOKENS)
  const [threadColor] = useTokenColors(THREAD_TOKENS)

  /*
   * The stylesheet already paints the page flat where there is no GPU behind
   * it, and a canvas is the part of that page a stylesheet cannot reach: a
   * shader compiled and rasterised on the CPU holds the same thread the page
   * is laid out on, and a field below the fold is drawn there for a reader who
   * has not scrolled to it. Deciding here rather than inside each canvas means
   * the chunk carrying them is never asked for at all. A machine with a GPU
   * never takes this branch and sees the backdrop as designed.
   */
  if (prefersReducedMotion || SOFTWARE) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <Suspense fallback={null}>
        {variant === 'aurora' && auroraStops.length > 0 && (
          <Aurora colorStops={auroraStops} amplitude={0.55} blend={0.32} speed={0.55} />
        )}
        {variant === 'particles' && particleColors.length > 0 && (
          <Particles
            particleColors={particleColors}
            particleCount={170}
            particleSpread={12}
            speed={0.06}
            particleBaseSize={70}
            moveParticlesOnHover
            alphaParticles
            disableRotation={false}
          />
        )}
        {variant === 'threads' && threadColor && (
          <Threads color={hexToUnitRgb(threadColor)} amplitude={1.1} distance={0.35} />
        )}
      </Suspense>
    </div>
  )
}
