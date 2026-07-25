import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input, cn } from '@deluxfit/ds'
import { listClients } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import {
  AdminEmpty,
  AdminLoading,
  SectionCard,
  SectionHeading,
  clientLabel,
  fmtDate,
  useAsyncData,
} from '../components/AdminPrimitives'
import ClientDetail from '../clients/ClientDetail'

export default function AdminClients() {
  const { data: clients, loading, error } = useAsyncData(listClients, [], [])
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const list = clients ?? []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(c => `${c.full_name ?? ''} ${c.email ?? ''}`.toLowerCase().includes(q))
  }, [clients, query])

  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Clients"
        title="Client hub."
        intro="Browse every client, drill into one, and manage their plan, nutrition, progress, and messages."
      />

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <SectionCard className="lg:sticky lg:top-6 lg:self-start">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-df-text-faint"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search by name or email…"
              className="pl-9"
              aria-label="Search clients"
            />
          </div>

          <div className="mt-4 grid gap-1">
            {loading ? (
              <AdminLoading label="Loading clients…" />
            ) : error ? (
              <FormError body={error} />
            ) : filtered.length === 0 ? (
              <AdminEmpty body={query ? 'No clients match your search.' : 'No clients yet.'} />
            ) : (
              filtered.map(client => {
                const active = client.id === selected
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelected(client.id)}
                    className={cn(
                      'rounded-df-md border px-3 py-2.5 text-left transition',
                      active
                        ? 'border-df-accent bg-df-accent-soft'
                        : 'border-transparent hover:border-df-border hover:bg-df-surface-2'
                    )}
                  >
                    <span className="block truncate text-sm font-600 text-df-text">
                      {clientLabel(client)}
                    </span>
                    {client.email && (
                      <span className="block truncate text-xs text-df-text-muted">
                        {client.email}
                      </span>
                    )}
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-df-text-faint">
                      Since {fmtDate(client.created_at)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </SectionCard>

        <div>
          {selected ? (
            <ClientDetail clientId={selected} emphasis="manage" />
          ) : (
            <SectionCard>
              <AdminEmpty
                title="No client selected"
                body="Select a client from the list to open their coaching hub."
              />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
