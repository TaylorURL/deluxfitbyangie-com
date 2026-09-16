import { ArrowRight, Check } from 'lucide-react'
import { Badge, Button, MicroLabel, SplitHeading, cn } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * The price tile that stands beside a service page's headline: what the thing
 * is, what it costs, the first few things it contains, and the way in.
 *
 * It opens on a band — red for the recommended program, a hairline for the
 * rest — so it shares a silhouette with the pricing cards further down the
 * page and a visitor recognises the tile as the same object at the top.
 *
 * @param {object} props
 * @param {object} props.service - an entry from the content tree's `services`
 * @param {string[]} props.includes - the bullets to show, already chosen
 * @param {string} [props.note] - one line under the price (a duration, a fit)
 * @param {boolean} [props.recommended] - draws the accent band and the solid badge
 */
export default function ServicePriceTile({ service, includes, note, recommended = false }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-df-xl',
        recommended
          ? 'bg-df-surface-2 bg-df-surface-gradient-elevated shadow-df-accent'
          : 'bg-df-surface bg-df-surface-gradient shadow-df-lg'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-6 py-3',
          recommended
            ? 'bg-df-accent bg-df-accent-gradient text-df-on-accent'
            : 'border-b border-df-border text-df-text-faint'
        )}
      >
        <span className="text-[11px] font-700 uppercase tracking-[0.18em]">{service.eyebrow}</span>
        <span
          aria-hidden="true"
          className={cn(
            'h-1.5 w-1.5 rounded-df-full',
            recommended ? 'bg-df-on-accent opacity-80' : 'bg-df-accent'
          )}
        />
      </div>

      <div className="p-6 sm:p-7">
        <SplitHeading as="p" size="card" text={service.name} className="text-df-text" />

        <div className="mt-5 flex items-end gap-2 border-b border-df-border pb-6">
          {/* Written once, at the figure. It used to count up from zero, which
              meant the first thing a visitor read was a price the service does
              not have — and in a tab the browser has throttled, the frame loop
              never runs and $0 is the only price ever drawn. */}
          <span className="font-400 font-display text-[clamp(3.25rem,12vw,5.25rem)] tabular-nums leading-[0.8] tracking-[-0.03em] text-df-text">
            {service.price}
          </span>
          <span className="pb-1.5 text-[13px] font-600 uppercase tracking-[0.1em] text-df-text-faint">
            {service.period}
          </span>
        </div>

        {note && (
          <MicroLabel tone="faint" className="mt-5">
            {note}
          </MicroLabel>
        )}

        <ul className="mt-6 flex flex-col gap-3">
          {includes.map(item => (
            <li
              key={item}
              className="flex items-start gap-3 text-[14px] leading-snug text-df-text-muted"
            >
              <span
                className={cn(
                  'mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full',
                  recommended
                    ? 'bg-df-accent bg-df-accent-gradient text-df-on-accent'
                    : 'bg-df-accent-soft text-df-accent-bright'
                )}
                aria-hidden="true"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Button asChild size="lg" block className="mt-7">
          <Link href={service.ctaHref}>
            {service.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        {recommended && (
          <Badge tone="accent" variant="soft" size="sm" className="mt-4 w-fit">
            Most Personalized
          </Badge>
        )}
      </div>
    </div>
  )
}
