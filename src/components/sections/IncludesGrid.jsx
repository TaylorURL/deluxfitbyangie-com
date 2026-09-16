import { Reveal, Section, SplitHeading, cn } from '@deluxfit/ds'

/**
 * What a program includes, drawn as a ledger rather than a grid of tiles.
 *
 * Nine tiles in three rows, each with an icon in a tinted square, is the
 * layout every template ships, and it reads as one before a word of it is
 * read. A numbered row under a hairline is the shape of a list of terms,
 * which is what an inclusion is: the number says how many there are, the
 * rule says each one is a line item, and the two columns keep the list to a
 * screen. The icon stays, small and quiet at the end of the row, where it
 * confirms the title rather than announcing it.
 *
 * `children` are the drawn plates that go under the list, where a page has
 * something of its own to show alongside what it includes.
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
      <ol className="grid border-b border-df-border lg:grid-cols-2 lg:gap-x-12">
        {items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.04} as="li" className="flex">
            <div className="grid w-full grid-cols-[3rem_1fr_auto] items-start gap-x-4 border-t border-df-border py-6 sm:gap-x-5 sm:py-7">
              <span
                aria-hidden="true"
                className="font-400 font-display text-[1.75rem] tabular-nums leading-none tracking-[-0.02em] text-df-accent-bright"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <SplitHeading as="h3" size="card" text={title} />
                {description && (
                  <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-df-text-muted">
                    {description}
                  </p>
                )}
              </div>
              {Icon && (
                <span
                  className={cn(
                    'hidden h-11 w-11 items-center justify-center rounded-df-full bg-df-surface-2 text-df-accent-bright shadow-df-sm sm:flex'
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
      {children && (
        <Reveal className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">{children}</Reveal>
      )}
    </Section>
  )
}
