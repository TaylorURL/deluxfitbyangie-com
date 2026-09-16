import { Reveal, SplitHeading } from '@deluxfit/ds'

/**
 * Three things a page rests on, set as three cards under one numbering.
 *
 * Each card opens on its numeral at display scale, with the icon in a red
 * disc beside it: the number says there are three and this is which, and the
 * disc carries the brand into the card without the title having to. The
 * three share one ground so the eye reads across them as one sentence with
 * three clauses.
 *
 * @param {object} props
 * @param {Array<{icon: React.ComponentType, title: string, description: string}>} props.items
 */
export default function PillarGrid({ items = [], className }) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.06} className="flex">
            <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-df-xl bg-df-surface bg-df-surface-gradient p-6 shadow-df-md transition-shadow duration-df-base ease-df-out hover:shadow-df-lg sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-df-full bg-[radial-gradient(closest-side,var(--df-accent-wash-soft),transparent)] opacity-0 transition-opacity duration-df-slow ease-df-out group-hover:opacity-100"
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="font-400 font-display text-[3rem] leading-none tracking-[-0.03em] text-df-text-faint transition-colors duration-df-base ease-df-out group-hover:text-df-accent-bright"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                {Icon && (
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-full bg-df-accent bg-df-accent-gradient text-df-on-accent shadow-df-key"
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                )}
              </div>
              <SplitHeading as="h3" size="sub" text={title} className="mt-8" />
              <p className="mt-4 text-[15px] leading-relaxed text-df-text-muted">{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
