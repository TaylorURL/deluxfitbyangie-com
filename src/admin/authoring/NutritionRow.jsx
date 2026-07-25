import { Pencil, Trash2, Utensils } from 'lucide-react'
import { Badge, Button, cn } from '@deluxfit/ds'
import { StatusBadge, fmtDate } from '../components/AdminPrimitives'

export default function NutritionRow({ plan, onEdit, onDelete, busy }) {
  const isActive = plan.status === 'active'
  const macros = [
    plan.calorie_target != null ? `${plan.calorie_target} kcal` : null,
    plan.protein_g != null ? `${plan.protein_g}P` : null,
    plan.carbs_g != null ? `${plan.carbs_g}C` : null,
    plan.fat_g != null ? `${plan.fat_g}F` : null,
  ].filter(Boolean)
  const meals = Array.isArray(plan.meal_structure) ? plan.meal_structure : []
  const resources = Array.isArray(plan.resources) ? plan.resources : []

  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-df-md border p-4',
        isActive
          ? 'border-df-accent/40 bg-df-accent-soft/40'
          : 'bg-df-surface-2/50 border-df-border'
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-lg bg-df-accent-soft text-df-accent-bright"
          >
            <Utensils className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-400 truncate font-display text-base uppercase tracking-[0.01em] text-df-text">
                {plan.title || 'Untitled plan'}
              </p>
              <StatusBadge status={plan.status} />
            </div>
            {macros.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {macros.map(macro => (
                  <Badge key={macro} tone="neutral" variant="outline" size="sm">
                    {macro}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-faint">
              {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
              <span aria-hidden="true"> · </span>
              Created {fmtDate(plan.created_at)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(plan)} disabled={busy}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(plan)} disabled={busy}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      {meals.length > 0 && (
        <ul className="grid gap-2 border-t border-df-border pt-3">
          {meals.map((row, index) => (
            <li key={index} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-3">
              <span className="shrink-0 font-600 text-df-text sm:w-32">{row?.meal}</span>
              <span className="text-df-text-muted">{row?.suggestion}</span>
            </li>
          ))}
        </ul>
      )}

      {plan.notes ? (
        <p className="border-t border-df-border pt-3 text-sm leading-relaxed text-df-text-muted">
          {plan.notes}
        </p>
      ) : null}

      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-df-border pt-3">
          {resources.map((row, index) =>
            row?.url ? (
              <a
                key={index}
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-df-sm border border-df-border bg-df-surface px-3 py-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-muted transition-colors hover:border-df-border-strong hover:text-df-accent-bright"
              >
                {row.label || row.url}
              </a>
            ) : (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-df-sm border border-df-border bg-df-surface px-3 py-1.5 text-[11px] font-600 uppercase tracking-[0.16em] text-df-text-muted"
              >
                {row?.label}
              </span>
            )
          )}
        </div>
      )}
    </li>
  )
}
