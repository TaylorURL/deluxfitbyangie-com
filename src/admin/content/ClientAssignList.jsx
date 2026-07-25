import { Button } from '@deluxfit/ds'
import { clientLabel } from '../components/AdminPrimitives'

// Per-client assignment is independent of entitlement — a client picked here
// can view the item regardless of what they've paid for.
export default function ClientAssignList({ clients, selected, onToggle, onClear, disabled }) {
  if (!clients.length) {
    return (
      <p className="bg-df-surface/60 rounded-df-md border border-dashed border-df-border-strong px-4 py-6 text-center text-sm text-df-text-muted">
        No clients yet. Invite clients first to assign content to them.
      </p>
    )
  }

  return (
    <div className="bg-df-surface-2/40 rounded-df-md border border-df-border">
      <div className="flex items-center justify-between border-b border-df-border px-3 py-2">
        <p className="text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
          {selected.size} selected
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={disabled || selected.size === 0}
        >
          Clear
        </Button>
      </div>
      <ul className="max-h-60 overflow-y-auto p-2">
        {clients.map(client => {
          const checked = selected.has(client.id)
          return (
            <li key={client.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-df-sm px-2 py-2 transition-colors hover:bg-df-surface-3">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(client.id)}
                  className="h-4 w-4 shrink-0 rounded-df-sm border-df-border-strong bg-df-surface text-df-accent accent-df-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-600 text-df-text">
                    {clientLabel(client)}
                  </span>
                  {client.email ? (
                    <span className="block truncate text-xs text-df-text-faint">
                      {client.email}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
