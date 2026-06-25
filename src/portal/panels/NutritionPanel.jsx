import { ExternalLink } from 'lucide-react'
import { Card } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { EmptyState, PanelHeading } from './PanelPrimitives'

/**
 * NutritionPanel — the client's personalized nutrition plan (a coaching
 * benefit). Read-only: calorie/macro targets, meal structure, resource links,
 * and notes from Angie. Gated behind active coaching.
 */
export default function NutritionPanel({ nutrition, entitlements }) {
  const { portal } = useContent()
  const copy = portal.nutrition

  if (!entitlements.hasCoaching) {
    return (
      <section>
        <PanelHeading title={copy.title} />
        <EmptyState
          title={copy.gatedTitle}
          body={copy.gatedBody}
          ctaLabel={copy.gatedCta}
          ctaHref="/online-coaching#apply"
        />
      </section>
    )
  }

  if (!nutrition) {
    return (
      <section>
        <PanelHeading title={copy.title} />
        <EmptyState body={copy.empty} />
      </section>
    )
  }

  const macros = [
    { label: copy.caloriesLabel, value: nutrition.calorie_target, unit: '' },
    { label: copy.proteinLabel, value: nutrition.protein_g, unit: copy.grams },
    { label: copy.carbsLabel, value: nutrition.carbs_g, unit: copy.grams },
    { label: copy.fatLabel, value: nutrition.fat_g, unit: copy.grams },
  ]
  const meals = Array.isArray(nutrition.meal_structure) ? nutrition.meal_structure : []
  const resources = Array.isArray(nutrition.resources) ? nutrition.resources : []

  return (
    <section>
      <PanelHeading title={copy.title} intro={copy.intro} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {macros.map(macro => (
          <Card key={macro.label} variant="surface">
            <p className="text-[11px] font-700 uppercase tracking-[0.16em] text-df-text-muted">
              {macro.label}
            </p>
            <p className="font-400 mt-2 font-display text-3xl text-df-text">
              {macro.value ?? '—'}
              {macro.value != null && macro.unit ? (
                <span className="ml-1 text-base text-df-text-muted">{macro.unit}</span>
              ) : null}
            </p>
          </Card>
        ))}
      </div>

      {meals.length > 0 && (
        <Card variant="surface" className="mt-6">
          <h3 className="font-400 font-display text-xl uppercase tracking-[0.01em] text-df-text">
            {copy.mealsTitle}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {meals.map((meal, index) => (
              <li
                key={index}
                className="flex items-start gap-3 border-t border-df-border pt-3 text-sm text-df-text-muted"
              >
                <span className="min-w-[7rem] font-700 uppercase tracking-[0.1em] text-df-accent-bright">
                  {meal.meal}
                </span>
                <span className="leading-relaxed">{meal.suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {resources.length > 0 && (
        <Card variant="surface" className="mt-6">
          <h3 className="font-400 font-display text-xl uppercase tracking-[0.01em] text-df-text">
            {copy.resourcesTitle}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {resources.map((resource, index) => (
              <li key={index} className="border-t border-df-border pt-3">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-600 text-df-accent-bright hover:text-df-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {nutrition.notes && (
        <Card variant="surface" className="mt-6">
          <h3 className="font-400 font-display text-xl uppercase tracking-[0.01em] text-df-text">
            {copy.notesTitle}
          </h3>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-df-text-muted">
            {nutrition.notes}
          </p>
        </Card>
      )}
    </section>
  )
}
