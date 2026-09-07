import { cloneElement, forwardRef, isValidElement, useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MicroLabel } from '../typography/MicroLabel'

/**
 * Label, control, message: one rhythm, and the label never leaves.
 *
 * A placeholder that stands in for the label disappears the moment there is
 * content, which takes the field's meaning with it exactly when the reader
 * goes back to check their answer. So the label is always drawn, and the
 * placeholder is free to do the other job — showing the shape of a valid
 * answer.
 *
 * An error is not carried by the red edge alone. The edge is joined by a
 * marker and a sentence, both tied to the control through `aria-describedby`,
 * because on a site whose accent already is red, a red border says nothing at
 * all.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.helper]
 * @param {string} [props.error] - when set, overrides helper and marks invalid
 * @param {boolean} [props.optional] - marks the field as safe to leave empty
 * @param {string} [props.optionalLabel] - the word that marking is set in
 * @param {React.ReactNode} [props.action] - a control aligned with the label
 * @param {React.ReactElement} props.children - the control (e.g. <Input />)
 */
export const Field = forwardRef(function Field(
  {
    className,
    label,
    helper,
    error,
    optional,
    optionalLabel = 'Optional',
    action,
    htmlFor,
    children,
    ...props
  },
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
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <MicroLabel as="label" htmlFor={controlId}>
            {label}
            {optional && (
              <span className="ml-2 font-600 normal-case tracking-normal text-df-text-faint">
                {optionalLabel}
              </span>
            )}
          </MicroLabel>
          {action}
        </div>
      )}
      {control}
      {message && <FieldMessage id={messageId} error={Boolean(error)} text={message} />}
    </div>
  )
})

/**
 * The line under a control: helper text, or the reason an answer was refused.
 *
 * A `Field` renders its own, but a fieldset of radios or a bare Switch is not
 * inside one — and both were writing the sentence out longhand in red with no
 * marker, which is an error state carried by colour alone. Exported so those
 * two sites say it the same way this one does.
 */
export function FieldMessage({ id, error, text, className }) {
  return (
    <p
      id={id}
      className={cn(
        'flex items-start gap-1.5 text-[13px] leading-snug',
        error ? 'text-df-danger' : 'text-df-text-muted',
        className
      )}
    >
      {error && <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
      {text}
    </p>
  )
}
