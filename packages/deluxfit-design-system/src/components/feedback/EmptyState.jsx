import { Inbox } from 'lucide-react'
import { Button } from '../controls/Button'
import { cn } from '../../lib/cn'
import { SplitHeading } from '../typography/SplitHeading'

/**
 * Nothing here yet, said as a state rather than as a blank.
 *
 * It carries the way out where there is one, because an empty panel with no
 * next step reads as a fault in the application rather than as a stage of the
 * work — and on this site an empty panel is usually a thing the reader can go
 * and buy or go and start.
 *
 * The dashed edge is the one place in the system a border is not solid: it is
 * what says the box is a place something will be rather than a thing that is.
 *
 * The call to action is a plain anchor. The app intercepts internal clicks at
 * the document and routes them, so a component in the design system does not
 * have to know which router is above it.
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} props.body
 * @param {string} [props.ctaLabel]
 * @param {string} [props.ctaHref]
 * @param {React.ComponentType} [props.icon]
 */
export function EmptyState({ title, body, ctaLabel, ctaHref, icon: Icon = Inbox, className }) {
  return (
    <div
      className={cn(
        'rounded-df-md border border-dashed border-df-border-strong bg-df-surface px-6 py-12 text-center',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto mb-5 inline-flex h-10 w-10 items-center justify-center rounded-df-full bg-df-accent-soft text-df-accent-bright"
      >
        <Icon className="h-4 w-4" />
      </span>
      {/* The stack's own gap spaces the three parts, so a state with no title
          and a state with no call to action both close up rather than leaving
          the hole a margin on the surviving part would keep. */}
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        {title && <SplitHeading as="p" size="card" text={title} />}
        <p className="text-[15px] leading-relaxed text-df-text-muted">{body}</p>
        {ctaLabel && ctaHref && (
          <Button asChild variant="outline" size="md" className="mt-3">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        )}
      </div>
    </div>
  )
}
