import { cloneElement, forwardRef, isValidElement, useId } from 'react'
import { cn } from '../lib/cn'

/**
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

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? controlId,
        'aria-describedby': children.props['aria-describedby'] ?? (message ? messageId : undefined),
        invalid: children.props.invalid ?? Boolean(error),
      })
    : children

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
      {control}
      {message && (
        <p id={messageId} className={cn('text-xs', error ? 'text-df-danger' : 'text-df-text-faint')}>
          {message}
        </p>
      )}
    </div>
  )
})
