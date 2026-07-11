/* =============================================================================
   React Bits — vendored animated component library (reactbits.dev)
   -----------------------------------------------------------------------------
   React Bits ships shadcn-style: each component is pulled from the registry at
   https://reactbits.dev/r/<Name>-JS-TW.json and lives in-tree as source we own,
   rather than as an opaque npm dependency. These are the JS + Tailwind variants.

   Two adaptations were applied at install time:
     - `motion/react` imports were rewritten to `framer-motion` (the same
       library, already a project dependency — no second animation runtime).
     - The WebGL backdrops (Aurora / Particles / Threads) depend on `ogl`.
     - StarBorder's keyframes live in tailwind.config.js.

   Everything is re-exported here under a single, named surface so pages import
   from '@/components/reactbits'. Consumers gate the motion-heavy pieces behind
   `useReducedMotion()` to honor the OS preference, exactly like the DS does.
   ========================================================================== */

// Text animations
export { default as ShinyText } from './ShinyText'
export { default as GradientText } from './GradientText'
export { default as CountUp } from './CountUp'
export { default as BlurText } from './BlurText'
export { default as RotatingText } from './RotatingText'
export { default as TrueFocus } from './TrueFocus'
export { default as DecryptedText } from './DecryptedText'
export { ScrollVelocity } from './ScrollVelocity'

// Interaction + cards
export { default as SpotlightCard } from './SpotlightCard'
export { default as StarBorder } from './StarBorder'
export { default as ClickSpark } from './ClickSpark'
export { default as Magnet } from './Magnet'
export { default as TiltedCard } from './TiltedCard'
export { default as GlareHover } from './GlareHover'
export { default as PixelCard } from './PixelCard'
export { default as AnimatedList } from './AnimatedList'

// WebGL backdrops (ogl)
export { default as Aurora } from './Aurora'
export { default as Particles } from './Particles'
export { default as Threads } from './Threads'
