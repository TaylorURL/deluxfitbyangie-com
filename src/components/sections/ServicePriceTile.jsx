import { ArrowRight, Check } from 'lucide-react'
import { Badge, Button, MicroLabel, Panel, SplitHeading, cn } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * The price tile that stands beside a service page's headline: what the thing
 * is, what it costs, the first few things it contains, and the way in.
 *
 * It lived four times over, once per service page, with the differences
 * amounting to which array the bullets came from and whether the tile was the
 * one being recommended. Those are props.
 *
 * @param {object} props
 * @param {object} props.service - an entry from the content tree's `services`
 * @param {string[]} props.includes - the bullets to show, already chosen
 * @param {string} [props.note] - one line under the price (a duration, a fit)
 * @param {boolean} [props.recommended] - draws the accent edge and the solid badge
 */
export default function ServicePriceTile({ service, includes, note, recommended = false }) {
  return (
    <Panel className={cn(recommended && 'shadow-df-accent')}>
      <Badge tone="accent" variant={recommended ? 'solid' : 'soft'} size="md" className="w-fit">
        {service.eyebrow}
      </Badge>

      <SplitHeading
        as="p"
        size="card"
        text={service.name}
        className="mt-4 text-df-text-muted sm:mt-5"
      />

      <div className="mt-4 flex items-end gap-2 border-b border-df-border pb-5 sm:pb-6">
        {/* Written once, at the figure. It used to count up from zero, which
            meant the first thing a visitor read was a price the service does
            not have — and in a tab the browser has throttled, the frame loop
            never runs and $0 is the only price ever drawn. */}
        <span className="font-400 font-display text-[clamp(2.75rem,11vw,4.5rem)] tabular-nums leading-[0.82] text-df-text">
          {service.price}
        </span>
        <span className="pb-2 text-sm text-df-text-faint">{service.period}</span>
      </div>

      {note && (
        <MicroLabel tone="faint" className="mt-4">
          {note}
        </MicroLabel>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {includes.map(item => (
          <li key={item} className="flex items-start gap-3 text-sm text-df-text-muted">
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-df-full',
                recommended
                  ? 'bg-df-accent text-df-on-accent'
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
    </Panel>
  )
}
