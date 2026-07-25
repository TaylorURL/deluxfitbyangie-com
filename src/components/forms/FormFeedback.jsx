import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function FormSuccess({ heading, body }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-df-md border border-df-positive/50 bg-df-positive-soft px-4 py-4 text-sm leading-relaxed text-df-positive"
    >
      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-700 uppercase tracking-[0.18em] text-df-positive">{heading}</p>
        {body && <p className="mt-1.5 text-df-text-muted">{body}</p>}
      </div>
    </div>
  )
}

export function FormError({ body }) {
  if (!body) return null
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-df-sm border border-df-danger/50 bg-df-danger-soft px-3 py-2.5 text-sm text-df-danger"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{body}</p>
    </div>
  )
}
