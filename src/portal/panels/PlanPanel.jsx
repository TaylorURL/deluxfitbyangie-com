import { Card, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { EmptyState, PanelHeading } from './PanelPrimitives'

/**
 * A client with no coaching entitlement has no plan to show and never will
 * until they buy one, so the empty state points at the application rather than
 * telling them to wait.
 */
export default function PlanPanel({ plans, entitlements }) {
  const { portal } = useContent()
  const copy = portal.plan

  return (
    <section>
      <PanelHeading title={copy.title} />
      {plans.length === 0 ? (
        <EmptyState
          title={entitlements.hasCoaching ? undefined : copy.gatedTitle}
          body={entitlements.hasCoaching ? copy.empty : copy.gatedBody}
          ctaLabel={copy.emptyCta}
          ctaHref="/online-coaching#apply"
        />
      ) : (
        <div className="flex flex-col gap-5">
          {plans.map(plan => (
            <Card key={plan.id} variant="surface">
              <SplitHeading as="h3" size="card" text={plan.title} />
              {plan.summary && (
                <p className="mt-2 text-[15px] leading-relaxed text-df-text-muted">
                  {plan.summary}
                </p>
              )}
              {Array.isArray(plan.content?.weeks) && (
                <ul className="mt-4 flex flex-col gap-2">
                  {plan.content.weeks.map((week, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 border-t border-df-border pt-3 text-sm text-df-text-muted"
                    >
                      <span className="font-display text-base text-df-accent-bright">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{week.title ?? week}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
