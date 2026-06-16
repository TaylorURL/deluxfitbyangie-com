import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import { Container } from './Container'
import { SectionEyebrow } from '../components/SectionEyebrow'
import { SectionIndex } from '../components/SectionIndex'
import { SplitHeading } from '../components/SplitHeading'
import { Reveal } from '../components/Reveal'

const SPACE = { sm: 'py-16', md: 'py-20 sm:py-28', lg: 'py-24 sm:py-36', xl: 'py-28 sm:py-44' }

/**
 * Section — a vertically-rhythmed page band on the shared "type specimen" grid.
 * When `heading`/`eyebrow` is supplied it renders an editorial, left-aligned
 * header: an oversized outlined index numeral as type furniture, the crimson
 * eyebrow, a giant condensed headline (with one phrase accented in Fraunces
 * italic), and a measured subhead. Pass `bare` for fully custom content.
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
    children,
    as: Component = 'section',
    ...props
  },
  ref
) {
  const hasHeader = Boolean(eyebrow || heading || subhead)
  const centered = align === 'center'

  return (
    <Component
      ref={ref}
      className={cn('relative overflow-hidden', SPACE[space] ?? SPACE.lg, className)}
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
                  'flex items-center gap-4 sm:gap-6',
                  centered && 'justify-center'
                )}
              >
                {index && <SectionIndex>{index}</SectionIndex>}
                {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              </div>
              {heading && (
                <h2
                  className={cn(
                    'mt-5 font-display text-[clamp(2.25rem,6vw,4.75rem)] font-400 leading-[0.92] tracking-[-0.01em] text-df-text sm:mt-7',
                    centered ? 'max-w-[18ch]' : 'max-w-[20ch]'
                  )}
                >
                  {renderHeading(heading, accent)}
                </h2>
              )}
              {subhead && (
                <p
                  className={cn(
                    'mt-6 max-w-2xl text-base leading-relaxed text-df-text-muted sm:text-lg',
                    centered && 'mx-auto'
                  )}
                >
                  {subhead}
                </p>
              )}
            </Reveal>
          )}
          <div className={cn(hasHeader && 'mt-14 sm:mt-20')}>{children}</div>
        </Container>
      )}
    </Component>
  )
})
