import { Card, Reveal, Section } from '@deluxfit/ds'

/**
 * IncludesGrid — the shared "what's included" grid used on every service page.
 * Each item is an icon-led card with a ghosted index numeral as type
 * furniture, matching the visual rhythm of the rest of the system.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string} [props.accent]
 * @param {string} [props.id]
 * @param {Array<{icon: React.ComponentType, title: string, description?: string}>} props.items
 */
export default function IncludesGrid({ id, eyebrow, heading, accent, items = [] }) {
  return (
    <Section id={id} eyebrow={eyebrow} heading={heading} accent={accent}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.05}>
            <Card variant="surface" className="relative flex h-full flex-col overflow-hidden">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-400 leading-none tabular-nums text-df-surface-3 sm:text-6xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {Icon && (
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
              )}
              <h3 className="mt-6 font-display text-xl font-400 uppercase tracking-[0.01em] text-df-text">
                {title}
              </h3>
              {description && (
                <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">
                  {description}
                </p>
              )}
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
