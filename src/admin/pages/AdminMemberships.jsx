import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, Field, Select } from '@deluxfit/ds'
import { listAllMemberships, listClients, saveMembership, removeMembership } from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  SectionCard,
  SectionHeading,
  AdminEmpty,
  AdminLoading,
  StatusBadge,
  ClientSelect,
  clientLabel,
  fmtDate,
  mapById,
  useAsyncData,
} from '../components/AdminPrimitives'

const PRODUCTS = ['membership', 'coaching']
const STATUSES = ['active', 'canceled', 'past_due', 'incomplete']

const PRODUCT_LABEL = {
  membership: 'Membership',
  coaching: 'Coaching',
}

const loadMemberships = () => Promise.all([listAllMemberships(), listClients()])

export default function AdminMemberships() {
  const { data, loading, error, reload } = useAsyncData(loadMemberships, [], [[], []])
  const [memberships, clients] = data ?? [[], []]
  const [busyKey, setBusyKey] = useState(null)
  const [writeError, setWriteError] = useState(null)

  const clientMap = useMemo(() => mapById(clients), [clients])

  const handleStatus = async (membership, status) => {
    setBusyKey(`${membership.id}:status`)
    setWriteError(null)
    try {
      await saveMembership({ userId: membership.user_id, product: membership.product, status })
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not update the membership.')
    } finally {
      setBusyKey(null)
    }
  }

  const handleRemove = async membership => {
    const name = clientLabel(clientMap.get(membership.user_id))
    if (
      !window.confirm(
        `Remove the ${PRODUCT_LABEL[membership.product] ?? membership.product} for ${name}?`
      )
    )
      return
    setBusyKey(`${membership.id}:remove`)
    setWriteError(null)
    try {
      await removeMembership({ userId: membership.user_id, product: membership.product })
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not remove the membership.')
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div className="grid gap-6">
      <GrantForm clients={clients} onSaved={reload} />

      <SectionCard>
        <SectionHeading
          eyebrow="Memberships"
          title="All subscriptions."
          intro="Every membership and coaching record across all clients. Change a status or remove a record below."
        />

        {writeError && (
          <div className="mt-5">
            <FormError body={writeError} />
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <AdminLoading label="Loading memberships…" />
          ) : error ? (
            <FormError body={error} />
          ) : memberships.length === 0 ? (
            <AdminEmpty body="No memberships yet. Grant one above to get started." />
          ) : (
            <div className="flex flex-col gap-3">
              {memberships.map(membership => {
                const name = clientLabel(clientMap.get(membership.user_id))
                const removing = busyKey === `${membership.id}:remove`
                const updating = busyKey === `${membership.id}:status`
                return (
                  <div
                    key={membership.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-df-lg border border-df-border bg-df-surface-2 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-600 text-df-text">{name}</p>
                      <p className="mt-1 text-sm text-df-text-muted">
                        {PRODUCT_LABEL[membership.product] ?? membership.product}
                        {membership.current_period_end
                          ? ` · renews ${fmtDate(membership.current_period_end)}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={membership.status} />
                      <Select
                        value={membership.status}
                        onChange={event => handleStatus(membership, event.target.value)}
                        disabled={updating || removing}
                      >
                        {STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(membership)}
                        disabled={updating || removing}
                      >
                        {removing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            Removing…
                          </>
                        ) : (
                          'Remove'
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

function GrantForm({ clients, onSaved }) {
  const [userId, setUserId] = useState('')
  const [product, setProduct] = useState('membership')
  const [status, setStatus] = useState('active')
  const [state, setState] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()
    if (!userId) {
      setState('error')
      setErrorBody('Pick a client first.')
      return
    }
    setState('working')
    setErrorBody(null)
    try {
      await saveMembership({ userId, product, status })
      setState('saved')
      setUserId('')
      setProduct('membership')
      setStatus('active')
      await onSaved()
    } catch (err) {
      setState('error')
      setErrorBody(err?.message || 'Could not save the membership.')
    }
  }

  return (
    <SectionCard>
      <SectionHeading
        eyebrow="Grant"
        title="Grant a membership."
        intro="Create or update a membership for a client without going through Stripe."
      />

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-3">
        <Field label="Client" className="sm:col-span-3">
          <ClientSelect clients={clients} value={userId} onChange={setUserId} />
        </Field>
        <Field label="Product">
          <Select value={product} onChange={event => setProduct(event.target.value)}>
            {PRODUCTS.map(item => (
              <option key={item} value={item}>
                {PRODUCT_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={event => setStatus(event.target.value)}>
            {STATUSES.map(item => (
              <option key={item} value={item}>
                {item.replace(/_/g, ' ')}
              </option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-3">
          <Button type="submit" size="lg" disabled={state === 'working'}>
            {state === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              'Save membership'
            )}
          </Button>
        </div>
      </form>

      {state === 'saved' && (
        <div className="mt-5">
          <FormSuccess
            heading="Membership saved"
            body="The membership record was created or updated."
          />
        </div>
      )}
      {state === 'error' && <FormError body={errorBody} />}
    </SectionCard>
  )
}
