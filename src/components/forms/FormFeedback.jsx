import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function FormSuccess({ heading, body }) {
  return (
    <div
      role="status"
      className="border-df-positive/50 flex items-start gap-3 rounded-df-md border bg-df-positive-soft px-4 py-4 text-sm leading-relaxed text-df-positive"
    >
      <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" />
      <div>
        <p className="font-700 uppercase tracking-[0.18em] text-df-positive">{heading}</p>
        {body && <p className="mt-2 text-df-text-muted">{body}</p>}
      </div>
    </div>
  )
}

export function FormError({ body }) {
  if (!body) return null
  return (
    <div
      role="alert"
      className="border-df-danger/50 mt-4 flex items-start gap-2 rounded-df-sm border bg-df-danger-soft px-3 py-3 text-sm text-df-danger"
    >
      <AlertCircle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
      <p>{body}</p>
    </div>
  )
}
