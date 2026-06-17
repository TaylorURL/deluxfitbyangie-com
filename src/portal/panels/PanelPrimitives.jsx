import { Badge, Button } from '@deluxfit/ds'
import { Link } from '@/router'

/** PanelHeading — the title row shared by every dashboard panel. */
export function PanelHeading({ title, intro }) {
  return (
    <div className="mb-7">
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-400 uppercase leading-[0.95] tracking-tight text-df-text">
        {title}
        <span className="text-df-accent">.</span>
      </h2>
      {intro && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-df-text-muted">{intro}</p>}
    </div>
  )
}

/** EmptyState — a bordered placeholder with an optional CTA link. */
export function EmptyState({ title, body, ctaLabel, ctaHref }) {
  return (
    <div className="rounded-df-xl border border-dashed border-df-border-strong bg-df-surface/60 px-6 py-12 text-center">
      {title && (
        <p className="font-display text-xl font-400 uppercase tracking-[0.02em] text-df-text">{title}</p>
      )}
      {body && <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-df-text-muted">{body}</p>}
      {ctaLabel && ctaHref && (
        <Button asChild variant="outline" size="md" className="mt-6">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  )
}

/** StatusPill — active/inactive entitlement chip. */
export function StatusPill({ active, activeLabel, inactiveLabel }) {
  return (
    <Badge tone={active ? 'positive' : 'neutral'} variant={active ? 'soft' : 'outline'} size="md">
      {active ? activeLabel : inactiveLabel}
    </Badge>
  )
}
