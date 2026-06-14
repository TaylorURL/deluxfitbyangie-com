import { forwardRef, useId } from 'react'
import { cn } from '../lib/cn'

/**
 * Field — a labelled form-control wrapper. Generates an id, associates the label
 * and helper/error text, and clones the single child control with the wiring so
 * markup stays accessible without per-call boilerplate.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.helper]
 * @param {string} [props.error] - when set, overrides helper and marks invalid
 * @param {React.ReactElement} props.children - the control (e.g. <Input />)
 */
export const Field = forwardRef(function Field(
  { className, label, helper, error, htmlFor, children, ...props },
  ref
) {
  const generatedId = useId()
  const controlId = htmlFor ?? generatedId
  const messageId = `${controlId}-message`
  const message = error ?? helper

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label
          htmlFor={controlId}
          className="text-xs font-600 uppercase tracking-wider text-df-text-muted"
        >
          {label}
        </label>
      )}
      {children &&
        // The control receives id + aria wiring without callers repeating it.
        // eslint-disable-next-line react/no-children-prop
        wireControl(children, controlId, message ? messageId : undefined, Boolean(error))}
      {message && (
        <p
          id={messageId}
          className={cn('text-xs', error ? 'text-df-danger' : 'text-df-text-faint')}
        >
          {message}
        </p>
      )}
    </div>
  )
})

/** Clone the child control, injecting id/aria props only if not already set. */
function wireControl(child, controlId, describedBy, invalid) {
  if (!child || typeof child !== 'object' || !('props' in child)) return child
  const { cloneElement } = requireReact()
  return cloneElement(child, {
    id: child.props.id ?? controlId,
    'aria-describedby': child.props['aria-describedby'] ?? describedBy,
    invalid: child.props.invalid ?? invalid,
  })
}

/** Lazy require kept inline so the helper stays colocated with the component. */
function requireReact() {
  return { cloneElement: ReactCloneElement }
}

import { cloneElement as ReactCloneElement } from 'react'
