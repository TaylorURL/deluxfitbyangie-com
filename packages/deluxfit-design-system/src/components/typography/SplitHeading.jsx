import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

/**
 * A display headline with one phrase carried in the brand red.
 *
 * The emphasis is colour, in the same face, at the same size. The other way to
 * do it — dropping the phrase into an italic serif — is the single most
 * recognisable tell in generated design, and it costs the headline its line:
 * two faces at two widths never sit on one baseline the way one face does.
 *
 * Five sizes, and no sixth. Every heading on the site used to name its own
 * clamp, which is how a page ended up with an h2 larger than the h1 above it —
 * each one looked right alone. The scale lives here now, so a heading is
 * chosen from it rather than measured against the last page.
 *
 * The scale runs large and tight. Anton is a poster face: it is drawn to be
 * read from across a room, and set small it loses the condensed weight that
 * is the whole reason it was chosen. So the page title fills the column, the
 * section title is a statement rather than a label, and the leading closes
 * to the point where the lines nearly touch.
 *
 * `hero` is the one step above `page`, for the first screen of the home page
 * alone. `card` is the step below `sub`: the title of one card inside a grid
 * of them, which is a heading a page can carry a dozen of and so is the one
 * that must not grow.
 *
 * @param {object} props
 * @param {string} props.text - the full heading copy
 * @param {string} [props.accent] - the substring to set in the accent colour
 * @param {'hero'|'page'|'section'|'sub'|'card'} [props.size='section']
 * @param {string} [props.as='h2'] - heading element
 */
const headingVariants = cva('font-400 font-display uppercase text-df-text', {
  variants: {
    size: {
      hero: 'pb-[0.1em] text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.84] tracking-[-0.025em]',
      page: 'pb-[0.1em] text-[clamp(2.75rem,8.5vw,6rem)] leading-[0.86] tracking-[-0.02em]',
      section: 'text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.9] tracking-[-0.02em]',
      sub: 'text-[clamp(1.625rem,4vw,2.5rem)] leading-[0.98] tracking-[-0.01em]',
      card: 'text-[1.375rem] leading-[1.08] tracking-[0]',
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
