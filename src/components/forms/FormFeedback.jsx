import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@deluxfit/ds'

/**
 * The two answers a form gives back, drawn the same way.
 *
 * They were two treatments before — different corners, different padding,
 * different type — which read as two different systems talking about the same
 * submission. One shape, and the tone is the only thing that changes.
 *
 * Neither carries a margin of its own: where a message sits is the form's
 * business, not the message's. Inside, the heading and the body are spaced by
 * the stack's gap, so a message with no heading has no gap to leave behind.
 */
const SHELL = 'flex items-start gap-3 rounded-df-md border px-4 py-3.5 text-sm leading-relaxed'

export function FormSuccess({ heading, body, className }) {
  return (
    <div
      role="status"
      className={cn(SHELL, 'border-df-positive/50 bg-df-positive-soft text-df-positive', className)}
    >
      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="font-700 uppercase tracking-[0.14em]">{heading}</p>
        {body && <p className="text-df-text-muted">{body}</p>}
      </div>
    </div>
  )
}

export function FormError({ heading, body, className }) {
  if (!body && !heading) return null
  return (
    <div
      role="alert"
      className={cn(SHELL, 'border-df-danger/50 bg-df-danger-soft text-df-danger', className)}
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-2">
        {heading && <p className="font-700 uppercase tracking-[0.14em]">{heading}</p>}
        {body && <p className={cn(heading && 'text-df-text-muted')}>{body}</p>}
      </div>
    </div>
  )
}
