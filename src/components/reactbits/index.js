/*
 * React Bits — vendored animated component library (reactbits.dev)
 *
 * React Bits ships shadcn-style: each component is pulled from the registry at
 * https://reactbits.dev/r/<Name>-JS-TW.json and lands in-tree as source rather
 * than as an opaque npm dependency. These are the JS + Tailwind variants.
 *
 * The in-tree copies carry local modifications that a re-pull has to re-apply:
 * `motion/react` imports become `framer-motion` (the same library, already a
 * dependency — a second animation runtime buys nothing), colour defaults
 * resolve to `--df-*` tokens instead of the registry's literals, and pointer
 * physics run on motion values rather than React state. The WebGL backdrops
 * (Aurora / Particles / Threads) additionally pull in `ogl`.
 *
 * Only what a page renders is kept. A registry component nothing imports is a
 * component nobody is holding to the rest of the system.
 *
 * Everything but the WebGL backdrops is re-exported here under a single, named
 * surface so pages import from '@/components/reactbits'; the backdrops are loaded
 * by path so each stays a chunk of its own. Consumers gate the motion-heavy
 * pieces behind `useReducedMotion()` to honor the OS preference, exactly like
 * the DS does.
 */

// Text animations
export { default as ShinyText } from './ShinyText'
export { default as GradientText } from './GradientText'
export { default as CountUp } from './CountUp'
export { default as BlurText } from './BlurText'
export { default as DecryptedText } from './DecryptedText'
export { ScrollVelocity } from './ScrollVelocity'

// Interaction + cards
export { default as SpotlightCard } from './SpotlightCard'
export { default as ClickSpark } from './ClickSpark'
export { default as Magnet } from './Magnet'
