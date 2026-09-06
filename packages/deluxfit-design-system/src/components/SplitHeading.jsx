import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * A display headline with one phrase carried in the brand red.
 *
 * The emphasis is colour, in the same face, at the same size. The other way to
 * do it — dropping the phrase into an italic serif — is the single most
 * recognisable tell in generated design, and it costs the headline its line:
 * two faces at two widths never sit on one baseline the way one face does.
 *
 * Four sizes, and no fifth. Every heading on the site used to name its own
 * clamp, which is how a page ended up with an h2 larger than the h1 above it —
 * each one looked right alone. The scale lives here now, so a heading is
 * chosen from it rather than measured against the last page.
 *
 * `card` is the step below `sub`: the title of one card inside a grid of them,
 * which is a heading a page can carry a dozen of and so is the one that must
 * not grow.
 *
 * @param {object} props
 * @param {string} props.text - the full heading copy
 * @param {string} [props.accent] - the substring to set in the accent colour
 * @param {'page'|'section'|'sub'|'card'} [props.size='section']
 * @param {string} [props.as='h2'] - heading element
 */
const headingVariants = cva('font-400 font-display uppercase tracking-[-0.01em] text-df-text', {
  variants: {
    size: {
      page: 'pb-[0.12em] text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.9]',
      section: 'text-[clamp(1.875rem,5vw,3.25rem)] leading-[0.95]',
      sub: 'text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.05]',
      card: 'text-xl leading-[1.15] tracking-[0.01em]',
    },
  },
  defaultVariants: { size: 'section' },
})
export { headingVariants }

export const SplitHeading = forwardRef(function SplitHeading(
  { className, text, accent, size, as: Component = 'h2', ...props },
  ref
) {
  const hasAccent = typeof text === 'string' && accent && text.includes(accent)
  const [before, after] = hasAccent ? text.split(accent) : [text, '']

  return (
    <Component ref={ref} className={cn(headingVariants({ size, className }))} {...props}>
      {before}
      {hasAccent && <span className="text-df-accent-bright">{accent}</span>}
      {after}
    </Component>
  )
})
