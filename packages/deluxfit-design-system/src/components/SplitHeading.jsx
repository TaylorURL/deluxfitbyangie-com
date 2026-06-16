import { forwardRef } from 'react'
import { cn } from '../lib/cn'

/**
 * SplitHeading — renders a heading string in the condensed Anton display face
 * with exactly one phrase set in the couture Fraunces italic (crimson). This is
 * the single source of the "one accented phrase per heading" rule, shared by the
 * Section header and every hand-built band so the whole site reads as one voice.
 *
 * @param {object} props
 * @param {string} props.text - the full heading copy (from site.js)
 * @param {string} [props.accent] - the substring to set in italic serif
 * @param {string} [props.as='h2'] - heading element
 */
export const SplitHeading = forwardRef(function SplitHeading(
  { className, text, accent, as: Component = 'h2', ...props },
  ref
) {
  const hasAccent = typeof text === 'string' && accent && text.includes(accent)
  const [before, after] = hasAccent ? text.split(accent) : [text, '']

  return (
    <Component
      ref={ref}
      className={cn(
        'font-display font-400 leading-[0.9] tracking-[-0.01em] text-df-text',
        className
      )}
      {...props}
    >
      {before}
      {hasAccent && (
        <span className="font-accent italic font-400 text-df-accent-bright">{accent}</span>
      )}
      {after}
    </Component>
  )
})
