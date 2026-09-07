import { Reveal, Section, SplitHeading } from '@deluxfit/ds'
import { SpotlightCard } from '@/components/reactbits'

/**
 * `children` are the drawn plates that go under the grid, where a page has
 * something of its own to show alongside the list of what it includes.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string} [props.accent]
 * @param {string} [props.id]
 * @param {Array<{icon: React.ComponentType, title: string, description?: string}>} props.items
 * @param {React.ReactNode} [props.children]
 */
export default function IncludesGrid({ id, eyebrow, heading, accent, items = [], children }) {
  return (
    <Section id={id} eyebrow={eyebrow} heading={heading} accent={accent}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.05} className="flex">
            <SpotlightCard
              spotlightColor="var(--df-accent-wash-soft)"
              className="flex h-full w-full flex-col"
            >
              {Icon && (
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
              )}
              <SplitHeading as="h3" size="card" text={title} className="mt-6" />
              {description && (
                <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
              )}
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      {children && (
        <Reveal className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">{children}</Reveal>
      )}
    </Section>
  )
}
