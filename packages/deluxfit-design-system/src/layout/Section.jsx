import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import { Container } from './Container'
import { SectionEyebrow } from '../components/typography/SectionEyebrow'
import { SplitHeading } from '../components/typography/SplitHeading'
import { Reveal } from '../components/motion/Reveal'

/* The rhythm the hand-written sections already keep. `lg` used to run half
   again past it, which is why a page built from both read as two pages. */
const SPACE = {
  sm: 'py-12 sm:py-16',
  md: 'py-14 sm:py-20',
  lg: 'py-16 sm:py-28',
  xl: 'py-20 sm:py-36',
}

const TONE_THEME = { dark: 'dark', light: 'light', gray: 'gray' }

/**
 * When `heading`/`eyebrow` is supplied it renders an editorial, left-aligned
 * header: the crimson eyebrow, a giant condensed headline with one phrase
 * carried in the accent colour, and a measured subhead. Pass `bare` for fully
 * custom content.
 *
 * `tone` switches the section's surface context (dark / light / gray) by
 * scoping the `--df-*` tokens to this element via `data-theme`. All children
 * resolve from semantic tokens, so the brand red, text, borders, and shadows
 * flip together with no per-section hardcoding, which is what lets a page
 * alternate tones panel by panel. A toned section also paints its own
 * `bg-df-bg`, so the panel is self-contained and hard-cuts cleanly against its
 * neighbours.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.space='lg']
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} [props.heading]
 * @param {string} [props.accent] - phrase within `heading` to set in the accent colour
 * @param {React.ReactNode} [props.subhead]
 * @param {'left'|'center'} [props.align='left']
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.containerSize='lg'] - inner Container width
 * @param {boolean} [props.bare] - skip the inner Container/header entirely
 * @param {'dark'|'light'|'gray'} [props.tone] - section surface context
 */
export const Section = forwardRef(function Section(
  {
    className,
    space = 'lg',
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
        <Container
          size={containerSize}
          className={cn('flex flex-col', hasHeader && 'gap-8 sm:gap-12')}
        >
          {hasHeader && (
            <Reveal
              className={cn(
                'flex flex-col',
                centered ? 'items-center text-center' : 'items-start text-left'
              )}
            >
              {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              {heading && (
                <SplitHeading
                  text={heading}
                  accent={accent}
                  className={cn('mt-4 sm:mt-6', centered ? 'max-w-[18ch]' : 'max-w-[20ch]')}
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
          <div>{children}</div>
        </Container>
      )}
    </Component>
  )
})
