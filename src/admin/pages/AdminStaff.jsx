import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { Button, Card, Field, Input, Select } from '@deluxfit/ds'
import { inviteUser } from '@/lib/inviteApi'
import { listStaff } from '@/lib/adminApi'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  SectionCard,
  SectionHeading,
  AdminEmpty,
  AdminLoading,
  clientLabel,
  fmtDate,
  useAsyncData,
} from '../components/AdminPrimitives'

/**
 * AdminStaff — surfaces the working invite flow plus the current staff roster.
 * Every invite goes through the
 * `invite-user` edge function, which validates that the caller's profile has
 * role='staff' before sending the Supabase Auth invite email.
 */
export default function AdminStaff() {
  const [values, setValues] = useState({ email: '', fullName: '', role: 'client' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorBody, setErrorBody] = useState(null)
  const [invited, setInvited] = useState(null)

  const handleChange = key => event => {
    setValues(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const next = {}
    if (!values.email.trim()) next.email = 'Required'
    else if (!values.email.includes('@')) next.email = 'Enter a valid email'
    if (values.role !== 'client' && values.role !== 'staff') next.role = 'Pick a role'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('working')
    setErrorBody(null)
    setInvited(null)
    try {
      const user = await inviteUser({
        email: values.email.trim(),
        fullName: values.fullName.trim() || undefined,
        role: values.role,
      })
      setStatus('sent')
      setInvited(user)
      setValues({ email: '', fullName: '', role: 'client' })
    } catch (error) {
      setStatus('error')
      setErrorBody(error?.message || 'Could not send the invite.')
    }
  }

  return (
    <div className="grid gap-6">
      <Card variant="elevated" padded>
        <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">Invite</p>
        <h2 className="font-400 mt-3 font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
          Send an invite.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
          Invites are brokered through the <code className="text-df-text">invite-user</code> edge
          function. The recipient gets a Supabase Auth email; their profile is created with the role
          you pick here.
        </p>

        <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email} className="sm:col-span-2">
            <Input
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder="person@example.com"
              autoComplete="off"
            />
          </Field>
          <Field label="Full name (optional)" error={errors.fullName}>
            <Input
              value={values.fullName}
              onChange={handleChange('fullName')}
              placeholder="Jane Doe"
              autoComplete="off"
            />
          </Field>
          <Field label="Role" error={errors.role}>
            <Select value={values.role} onChange={handleChange('role')}>
              <option value="client">Client</option>
              <option value="staff">Staff (admin)</option>
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={status === 'working'}>
              {status === 'working' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending invite…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send invite
                </>
              )}
            </Button>
          </div>
        </form>

        {status === 'sent' && invited && (
          <div className="mt-5">
            <FormSuccess
              heading="Invite sent"
              body={`${invited.email} will get an email to set a password. Role: ${invited.role}.`}
            />
          </div>
        )}
        {status === 'error' && <FormError body={errorBody} />}
      </Card>

      <StaffList />
    </div>
  )
}

/** The current staff roster — every profile with role='staff'. */
function StaffList() {
  const { data: staff, loading, error } = useAsyncData(listStaff, [], [])

  return (
    <SectionCard>
      <SectionHeading
        eyebrow="Team"
        title="Staff."
        intro="Everyone with admin access. Invite more above."
      />

      <div className="mt-6">
        {loading ? (
          <AdminLoading label="Loading staff…" />
        ) : error ? (
          <FormError body={error} />
        ) : staff.length === 0 ? (
          <AdminEmpty body="No staff members yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {staff.map(member => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-df-lg border border-df-border bg-df-surface-2 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-600 text-df-text">{clientLabel(member)}</p>
                  {member.email && (
                    <p className="mt-1 text-sm text-df-text-muted">{member.email}</p>
                  )}
                </div>
                <p className="text-sm text-df-text-faint">Since {fmtDate(member.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
