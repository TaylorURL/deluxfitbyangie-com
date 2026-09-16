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
 * @param {'stack'|'split'} [props.layout='stack'] - where the header sits. `stack`
 *   puts it above the content; `split` puts it in a column of its own on a wide
 *   screen and holds it there while the content beside it scrolls, which is
 *   what stops a page of prose reading as one heading over a wall of text with
 *   half the screen empty
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
    layout = 'stack',
    children,
    as: Component = 'section',
    ...props
  },
  ref
) {
  const hasHeader = Boolean(eyebrow || heading || subhead)
  const centered = align === 'center' && layout !== 'split'
  const split = layout === 'split' && hasHeader
  const themeAttr = tone ? TONE_THEME[tone] : undefined

  return (
    <Component
      ref={ref}
      data-theme={themeAttr}
      // `clip` rather than `hidden`: both contain the washes a section paints
      // past its own edge, but `hidden` also makes the section the thing a
      // sticky child sticks to, which pins the split header to a box that
      // scrolls away with it rather than to the screen.
      className={cn(
        'relative overflow-clip',
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
          className={cn(
            split
              ? 'grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-x-16'
              : cn('flex flex-col', hasHeader && 'gap-8 sm:gap-12')
          )}
        >
          {hasHeader && (
            <Reveal
              className={cn(
                'flex flex-col',
                centered ? 'items-center text-center' : 'items-start text-left',
                split &&
                  'lg:sticky lg:top-[calc(var(--df-header-height)+2rem)] lg:col-span-5 lg:self-start'
              )}
            >
              {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              {heading && (
                <SplitHeading
                  text={heading}
                  accent={accent}
                  className={cn(
                    'mt-4 sm:mt-6',
                    centered ? 'max-w-[18ch]' : 'max-w-[20ch]',
                    split && 'lg:max-w-[14ch]'
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
          <div className={cn(split && 'min-w-0 lg:col-span-7')}>{children}</div>
        </Container>
      )}
    </Component>
  )
})
