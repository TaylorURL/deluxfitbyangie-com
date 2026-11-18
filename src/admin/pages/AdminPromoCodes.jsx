import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, DateField, Field, Input, MicroLabel, Select, Switch } from '@deluxfit/ds'
import { createPromoCode, listPromoCodes, turnOffPromoCode } from '@/lib/api/adminApi'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import { dayKey } from '@/lib/timezone'
import { turnOffPromoCodePrompt } from '../confirmations'
import {
  SectionCard,
  SectionHeading,
  AdminEmpty,
  AdminLoading,
  StatusBadge,
  fmtDate,
  useAsyncData,
} from '../AdminPrimitives'

const OFFERS = [
  { value: 'first_month_free', label: 'First month free' },
  { value: 'percent_first_month', label: 'A percentage off the first month' },
  { value: 'percent_every_month', label: 'A percentage off every month' },
]

const OFFER_HELPER = {
  first_month_free:
    'They pay nothing today, and the card they enter is charged the normal price from the second month on.',
  percent_first_month: 'The discount comes off the first month only, then the normal price.',
  percent_every_month:
    'The discount comes off every month for as long as they stay subscribed — a standing rate.',
}

const PRODUCTS = [
  { value: 'membership', label: 'Membership' },
  { value: 'coaching', label: 'Coaching' },
]

const EMPTY_FORM = {
  code: '',
  offer: 'first_month_free',
  percentOff: '20',
  product: 'membership',
  lastDay: '',
  newClientsOnly: true,
}

export default function AdminPromoCodes() {
  const confirm = useConfirm()
  const { data: codes, loading, error, reload } = useAsyncData(listPromoCodes, [], [])
  const [busyId, setBusyId] = useState(null)
  const [writeError, setWriteError] = useState(null)

  const handleTurnOff = async code => {
    const ok = await confirm(turnOffPromoCodePrompt(code))
    if (!ok) return
    setBusyId(code.id)
    setWriteError(null)
    try {
      await turnOffPromoCode(code.id)
      await reload()
    } catch (err) {
      setWriteError(err?.message || 'Could not turn the code off.')
    } finally {
      setBusyId(null)
    }
  }

  const list = codes ?? []

  return (
    <div className="grid gap-6">
      <CreateForm onCreated={reload} />

      <SectionCard>
        <SectionHeading
          title="Your codes"
          intro="Every code clients can type at checkout, newest first, with how many times each has been used."
        />

        {writeError && (
          <div className="mt-5">
            <FormError body={writeError} />
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <AdminLoading label="Loading promo codes…" />
          ) : error ? (
            <FormError body={error} />
          ) : list.length === 0 ? (
            <AdminEmpty body="No promo codes yet. Make one above." />
          ) : (
            <div className="flex flex-col gap-3">
              {list.map(code => {
                const busy = busyId === code.id
                return (
                  <div
                    key={code.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-df-lg border border-df-border bg-df-surface-2 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-700 tracking-[0.08em] text-df-text">{code.code}</p>
                      <p className="mt-1 text-sm text-df-text-muted">
                        {code.offer} · {code.appliesTo}
                        {code.newClientsOnly ? ' · new clients only' : ''}
                      </p>
                      <p className="mt-1 text-sm text-df-text-muted">
                        {code.lastDay ? `Works through ${fmtDate(code.lastDay)}` : 'No end date'}
                        {` · used ${code.timesRedeemed} ${code.timesRedeemed === 1 ? 'time' : 'times'}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={code.status} />
                      {code.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTurnOff(code)}
                          disabled={busy}
                        >
                          {busy ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              Turning off…
                            </>
                          ) : (
                            'Turn off'
                          )}
                        </Button>
                      )}
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

function CreateForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [state, setState] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)
  const [created, setCreated] = useState(null)

  const set = key => value => setForm(current => ({ ...current, [key]: value }))
  const percentShown = form.offer !== 'first_month_free'
  const today = dayKey()

  const handleSubmit = async event => {
    event.preventDefault()
    const code = form.code.trim().toUpperCase()
    let problem = null
    if (!/^[A-Z0-9]{3,20}$/.test(code)) {
      problem = 'Use 3 to 20 letters and numbers for the code, with no spaces.'
    } else if (percentShown && !/^\d+$/.test(form.percentOff.trim())) {
      problem = 'The discount has to be a whole number from 1 to 100.'
    } else if (!form.lastDay) {
      problem = 'Pick the last day the code works.'
    } else if (form.lastDay < today) {
      problem = 'The last day has already passed.'
    }
    if (problem) {
      setState('error')
      setErrorBody(problem)
      return
    }

    setState('working')
    setErrorBody(null)
    try {
      const result = await createPromoCode({
        code,
        offer: form.offer,
        percentOff: percentShown ? Number(form.percentOff) : 100,
        product: form.product,
        lastDay: form.lastDay,
        newClientsOnly: form.newClientsOnly,
      })
      setCreated(result)
      setState('saved')
      setForm(EMPTY_FORM)
      await onCreated()
    } catch (err) {
      setState('error')
      setErrorBody(err?.message || 'Could not create the code.')
    }
  }

  return (
    <SectionCard>
      <SectionHeading
        title="Make a promo code"
        intro="Clients type the code in the promo code box on the payment page when they subscribe on the website. Stripe checks it, applies the discount and counts every use."
      />

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Code" helper="What clients type, like BLACKFRIDAY. Letters and numbers only.">
          <Input
            value={form.code}
            onChange={event => set('code')(event.target.value.toUpperCase().replace(/\s+/g, ''))}
            placeholder="BLACKFRIDAY"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={20}
          />
        </Field>

        <Field label="Works on">
          <Select value={form.product} onChange={event => set('product')(event.target.value)}>
            {PRODUCTS.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="What it gives" helper={OFFER_HELPER[form.offer]}>
          <Select value={form.offer} onChange={event => set('offer')(event.target.value)}>
            {OFFERS.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>

        {percentShown && (
          <Field label="Percent off">
            <Input
              value={form.percentOff}
              onChange={event => set('percentOff')(event.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              suffix="%"
              maxLength={3}
            />
          </Field>
        )}

        <Field
          label="Last day it works"
          helper="It stops working at midnight that night, Houston time."
        >
          <DateField value={form.lastDay} onValueChange={set('lastDay')} min={today} />
        </Field>

        <div className="flex items-end sm:col-span-2">
          <Switch
            checked={form.newClientsOnly}
            onChange={event => set('newClientsOnly')(event.target.checked)}
            label="New clients only"
            description="Someone who has paid you before can't use it."
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" disabled={state === 'working'}>
            {state === 'working' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating…
              </>
            ) : (
              'Create code'
            )}
          </Button>
        </div>
      </form>

      {state === 'saved' && created && (
        <div className="mt-5">
          <FormSuccess
            heading={`${created.code} is live`}
            body={`${created.offer} on ${created.appliesTo}, through ${fmtDate(created.lastDay)}. Share the code with clients and they can use it at checkout now.`}
          />
        </div>
      )}
      {state === 'error' && <FormError body={errorBody} />}

      <div className="mt-6 rounded-df-lg border border-df-border bg-df-surface-2 px-5 py-4">
        <MicroLabel tone="accent">Good to know</MicroLabel>
        <p className="mt-2 text-sm leading-relaxed text-df-text-muted">
          A code only works on the website&apos;s payment page. It never changes what a current
          member already pays, and turning a code off doesn&apos;t take a discount back from anyone
          who already used it.
        </p>
      </div>
    </SectionCard>
  )
}
