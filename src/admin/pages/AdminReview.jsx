import { useState } from 'react'
import { Field } from '@deluxfit/ds'
import { listClients } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import {
  AdminEmpty,
  AdminLoading,
  ClientSelect,
  SectionCard,
  SectionHeading,
  useAsyncData,
} from '../components/AdminPrimitives'
import ClientDetail from '../clients/ClientDetail'

/**
 * AdminReview — the Monthly Review surface. Pick a client, then review their
 * progress, photos, and measurements and update the program in one place. It
 * reuses ClientDetail (emphasis="review") so review and program edits live
 * side by side.
 */
export default function AdminReview() {
  const { data: clients, loading, error } = useAsyncData(listClients, [], [])
  const [selected, setSelected] = useState('')

  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Monthly review"
        title="Monthly review."
        intro="Review progress, photos, measurements, and update the program — all from one place."
      />

      <SectionCard>
        {loading ? (
          <AdminLoading label="Loading clients…" />
        ) : error ? (
          <FormError body={error} />
        ) : (clients ?? []).length === 0 ? (
          <AdminEmpty body="No clients yet." />
        ) : (
          <Field label="Client">
            <ClientSelect
              clients={clients}
              value={selected}
              onChange={setSelected}
              placeholder="Choose a client to review…"
              id="review-client"
            />
          </Field>
        )}
      </SectionCard>

      {selected ? (
        <ClientDetail clientId={selected} emphasis="review" />
      ) : (
        <SectionCard>
          <AdminEmpty
            title="No client selected"
            body="Choose a client above to start their monthly review."
          />
        </SectionCard>
      )}
    </div>
  )
}
