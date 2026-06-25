import { Badge, Button } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * PanelHeading — the editorial title block shared by every dashboard panel.
 * Carries the brand's red-rule eyebrow (echoing the marketing SectionEyebrow),
 * the condensed display title with its signature crimson period, an optional
 * intro, and an optional `actions` slot for a panel-level control (kept inline
 * with the heading so each panel opens with one composed unit).
 */
export function PanelHeading({ eyebrow, title, intro, actions }) {
  return (
    <header className="mb-8 border-b border-df-border pb-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          {eyebrow && (
            <span className="inline-flex items-center gap-2.5 text-[11px] font-700 uppercase tracking-[0.22em] text-df-accent-bright">
              <span className="h-px w-7 bg-df-accent" aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <h2 className="mt-3 font-display text-[clamp(1.875rem,4vw,2.75rem)] font-400 uppercase leading-[0.95] tracking-tight text-df-text">
            {title}
            <span className="text-df-accent">.</span>
          </h2>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
      </div>
      {intro && (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-df-text-muted">{intro}</p>
      )}
    </header>
  )
}

/** EmptyState — a bordered placeholder with a crimson rule mark and optional CTA. */
export function EmptyState({ title, body, ctaLabel, ctaHref }) {
  return (
    <div className="rounded-df-xl border border-dashed border-df-border-strong bg-df-surface/60 px-6 py-14 text-center sm:py-16">
      <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-df-accent" />
      {title && (
        <p className="font-display text-xl font-400 uppercase tracking-[0.02em] text-df-text sm:text-2xl">
          {title}
        </p>
      )}
      {body && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-df-text-muted">{body}</p>
      )}
      {ctaLabel && ctaHref && (
        <Button asChild variant="outline" size="md" className="mt-7">
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
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-df-full ${active ? 'bg-df-positive' : 'bg-df-text-faint'}`}
      />
      {active ? activeLabel : inactiveLabel}
    </Badge>
  )
}
