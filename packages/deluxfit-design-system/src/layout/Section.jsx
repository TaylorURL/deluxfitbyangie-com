import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import { Container } from './Container'
import { SectionEyebrow } from '../components/SectionEyebrow'
import { SectionIndex } from '../components/SectionIndex'
import { SplitHeading } from '../components/SplitHeading'
import { Reveal } from '../components/Reveal'

const SPACE = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-28',
  lg: 'py-20 sm:py-36',
  xl: 'py-24 sm:py-44',
}

const TONE_THEME = { dark: 'dark', light: 'light', gray: 'gray' }

/**
 * When `heading`/`eyebrow` is supplied it renders an editorial, left-aligned
 * header: an oversized outlined index numeral as type furniture, the crimson
 * eyebrow, a giant condensed headline (with one phrase accented in Fraunces
 * italic), and a measured subhead. Pass `bare` for fully custom content.
 *
 * `tone` switches the section's surface context (dark / light / gray) by
 * scoping the `--df-*` tokens to this element via `data-theme`. All children
 * resolve from semantic tokens, so the brand red, text, borders, and shadows
 * flip together with no per-section hardcoding — the anduril-style alternation
 * pattern. When `tone` is set, the section also paints its `bg-df-bg` so the
 * panel is fully self-contained and hard-cuts cleanly against the neighbors.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.space='lg']
 * @param {string} [props.index] - oversized section numeral (e.g. "03")
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} [props.heading]
 * @param {string} [props.accent] - phrase within `heading` to set in italic serif
 * @param {React.ReactNode} [props.subhead]
 * @param {'left'|'center'} [props.align='left']
 * @param {boolean} [props.bare] - skip the inner Container/header entirely
 * @param {'dark'|'light'|'gray'} [props.tone] - section surface context
 */
export const Section = forwardRef(function Section(
  {
    className,
    space = 'lg',
    index,
    eyebrow,
    heading,
    accent,
    subhead,
    align = 'left',
    containerSize = 'lg',
    bare = false,
    tone,
    children,
    as: Component = 'section',
    ...props
  },
  ref
) {
  const hasHeader = Boolean(eyebrow || heading || subhead)
  const centered = align === 'center'
  const themeAttr = tone ? TONE_THEME[tone] : undefined

  return (
    <Component
      ref={ref}
      data-theme={themeAttr}
      className={cn(
        'relative overflow-hidden',
        themeAttr && 'bg-df-bg text-df-text',
        SPACE[space] ?? SPACE.lg,
        className
      )}
      {...props}
    >
      {bare ? (
        children
      ) : (
        <Container size={containerSize}>
          {hasHeader && (
            <Reveal
              className={cn(
                'flex flex-col',
                centered ? 'items-center text-center' : 'items-start text-left'
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-3 sm:gap-6',
                  centered && 'justify-center'
                )}
              >
                {index && <SectionIndex>{index}</SectionIndex>}
                {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              </div>
              {heading && (
                <SplitHeading
                  text={heading}
                  accent={accent}
                  className={cn(
                    'mt-4 text-[clamp(2rem,8vw,4.75rem)] leading-[0.92] sm:mt-7',
                    centered ? 'max-w-[18ch]' : 'max-w-[20ch]'
                  )}
                />
              )}
              {subhead && (
                <p
                  className={cn(
                    'mt-5 max-w-2xl text-base leading-relaxed text-df-text-muted sm:mt-6 sm:text-lg',
                    centered && 'mx-auto'
                  )}
                >
                  {subhead}
                </p>
              )}
            </Reveal>
          )}
          <div className={cn(hasHeader && 'mt-10 sm:mt-20')}>{children}</div>
        </Container>
      )}
    </Component>
  )
})
