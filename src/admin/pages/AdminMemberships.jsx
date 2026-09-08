import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, Field, MicroLabel, Select } from '@deluxfit/ds'
import {
  listAllMemberships,
  listClients,
  saveMembership,
  removeMembership,
} from '@/lib/api/adminApi'
import { useConfirm } from '@/components/ui/ConfirmDialog'
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
} from '../AdminPrimitives'

const PRODUCTS = ['membership', 'coaching']
const STATUSES = ['active', 'canceled', 'past_due', 'incomplete']

const PRODUCT_LABEL = {
  membership: 'Membership',
  coaching: 'Coaching',
}

// What each product actually unlocks, said where the choice is made rather
// than in a document beside the app.
const PRODUCT_HELPER = {
  membership:
    'The general content library: programs, workout videos and education. Not personalized.',
  coaching:
    'Their own plan, nutrition, monthly progress reviews and direct messaging — and everything Membership unlocks, so a coaching client never needs both.',
}

const loadMemberships = () => Promise.all([listAllMemberships(), listClients()])

export default function AdminMemberships() {
  const confirm = useConfirm()
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
    const product = PRODUCT_LABEL[membership.product] ?? membership.product
    const ok = await confirm({
      title: 'Remove This Membership?',
      body: `${name} loses access to everything the ${product.toLowerCase()} unlocks. Stripe is not touched: cancel the subscription there as well, or it keeps billing.`,
      confirmLabel: 'Remove Membership',
    })
    if (!ok) return
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
          title="All subscriptions"
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
        title="Grant a membership"
        intro="Granting access opens the portal straight away and charges nobody. Billing is the separate half: a client who subscribes on the website is charged by Stripe and granted access automatically, and a client granted access here is not billed at all until you set that up in Stripe."
      />

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-3">
        <Field label="Client" className="sm:col-span-3">
          <ClientSelect clients={clients} value={userId} onChange={setUserId} />
        </Field>
        <Field label="Product" helper={PRODUCT_HELPER[product]}>
          <Select value={product} onChange={event => setProduct(event.target.value)}>
            {PRODUCTS.map(item => (
              <option key={item} value={item}>
                {PRODUCT_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" helper="Only an active record unlocks anything.">
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
            body="The client can sign in and use it now. Nothing was charged."
          />
        </div>
      )}
      {state === 'error' && <FormError body={errorBody} />}

      <div className="mt-6 rounded-df-lg border border-df-border bg-df-surface-2 px-5 py-4">
        <MicroLabel tone="accent">Charging a client a different rate</MicroLabel>
        <p className="mt-2 text-sm leading-relaxed text-df-text-muted">
          Create a coupon in Stripe under Product Catalog, add a promotion code to it, and set its
          duration to <span className="text-df-text">Forever</span> so the discount applies to every
          renewal rather than the first month alone. The client enters that code on the checkout
          page when they subscribe on the website, and is billed the reduced rate from then on —
          access and cancellation behave the same as any other member.
        </p>
      </div>
    </SectionCard>
  )
}
