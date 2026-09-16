import { Badge } from '../typography/Badge'
import { cn } from '../../lib/cn'
import { SplitHeading } from '../typography/SplitHeading'

/**
 * One header, composed the same way on every panel: the title, then whatever
 * count qualifies it, then the space, then the actions. A header that reorders
 * itself per section makes each section feel like a different application,
 * which is exactly what an application a reader moves around in all day cannot
 * afford.
 *
 * It lives here rather than beside either surface because the client portal
 * and the coach panel are one application seen from two sides. They each had
 * their own copy of this, at two different heading sizes, and the two sides
 * drifted apart a step at a time.
 *
 * The size comes off the shared scale rather than from a clamp written here,
 * and the accent period is what marks a panel title apart from the page title
 * above it without needing a fourth size.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {number} [props.count] - the figure that qualifies the title
 * @param {string} [props.intro]
 * @param {React.ReactNode} [props.actions]
 */
export function PanelHeading({ title, count, intro, actions, className }) {
  return (
    <header className={cn('mb-7 flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-end gap-3">
          <SplitHeading size="section" text={`${title}.`} accent="." className="min-w-0" />
          {count != null && (
            <Badge tone="neutral" variant="soft" size="md" className="mb-2 tabular-nums">
              {count}
            </Badge>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {intro && (
        <p className="max-w-df-measure text-[15px] leading-relaxed text-df-text-muted">{intro}</p>
      )}
    </header>
  )
}
