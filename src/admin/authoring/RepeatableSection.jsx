import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@deluxfit/ds'

// The caller owns the row data; this only handles layout, the add button, and
// per-row removal.
export default function RepeatableSection({
  title,
  helper,
  rows,
  renderRow,
  onAdd,
  addLabel,
  onRemove,
  canRemove,
  disabled,
}) {
  return (
    <div className="bg-df-surface-2/40 grid gap-3 rounded-df-md border border-df-border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
          {title}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} disabled={disabled}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
      {helper && <p className="text-xs text-df-text-faint">{helper}</p>}
      <div className="grid gap-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="bg-df-surface/40 grid gap-4 rounded-df-sm border border-df-border p-3 sm:grid-cols-3"
          >
            {renderRow(row, index)}
            <div className="sm:col-span-3 sm:flex sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={disabled || !canRemove}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
