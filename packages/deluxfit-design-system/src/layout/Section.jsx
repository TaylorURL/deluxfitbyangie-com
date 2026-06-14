import { forwardRef } from 'react'
import { cn } from '../lib/cn'
import { Container } from './Container'
import { SectionEyebrow } from '../components/SectionEyebrow'
import { Reveal } from '../components/Reveal'

const SPACE = { sm: 'py-12', md: 'py-16 sm:py-20', lg: 'py-20 sm:py-28', xl: 'py-24 sm:py-36' }

/**
 * Section — a vertically-rhythmed page band. When `heading` (or `eyebrow`) is
 * supplied it renders a reveal-on-scroll header (eyebrow → heading → subhead)
 * inside a Container; otherwise it's a bare padded band for fully custom
 * content. Pass `containerSize` to widen/narrow the inner column.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.space='lg']
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} [props.heading]
 * @param {React.ReactNode} [props.subhead]
 * @param {boolean} [props.bare] - skip the inner Container/header entirely
 */
export const Section = forwardRef(function Section(
  {
    className,
    space = 'lg',
    eyebrow,
    heading,
    subhead,
    align = 'center',
    containerSize = 'lg',
    bare = false,
    children,
    as: Component = 'section',
    ...props
  },
  ref
) {
  const hasHeader = Boolean(eyebrow || heading || subhead)
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <Component ref={ref} className={cn(SPACE[space] ?? SPACE.lg, className)} {...props}>
      {bare ? (
        children
      ) : (
        <Container size={containerSize}>
          {hasHeader && (
            <Reveal className={cn('mx-auto flex max-w-2xl flex-col gap-4', alignment)}>
              {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              {heading && (
                <h2 className="font-display text-3xl font-700 uppercase leading-[1.05] tracking-tight text-df-text sm:text-4xl md:text-5xl">
                  {heading}
                </h2>
              )}
              {subhead && (
                <p className="text-base leading-relaxed text-df-text-muted sm:text-lg">{subhead}</p>
              )}
            </Reveal>
          )}
          <div className={cn(hasHeader && 'mt-12 sm:mt-16')}>{children}</div>
        </Container>
      )}
    </Component>
  )
})
