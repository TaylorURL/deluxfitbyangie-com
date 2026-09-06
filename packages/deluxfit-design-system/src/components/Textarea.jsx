import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { FIELD_EDGE, FIELD_SURFACE } from '../lib/field'

const textareaVariants = cva([FIELD_SURFACE, 'px-3.5 py-3 leading-relaxed'].join(' '), {
  variants: {
    invalid: FIELD_EDGE,
    autoGrow: { true: 'resize-none overflow-hidden', false: 'resize-y' },
  },
  defaultVariants: { invalid: false, autoGrow: false },
})

/**
 * `autoGrow` lets the box follow the answer instead of making the writer
 * scroll a three-line window: the field starts at `rows` and grows to
 * `maxRows`, past which it scrolls. Height is measured off the content rather
 * than counted in characters, so a pasted paragraph and a typed one settle at
 * the same place.
 */
export const Textarea = forwardRef(function Textarea(
  { className, rows = 4, maxRows = 14, invalid, autoGrow = false, onChange, ...props },
  ref
) {
  const innerRef = useRef(null)

  const attach = useCallback(
    node => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const resize = useCallback(() => {
    const node = innerRef.current
    if (!node || !autoGrow) return
    const styles = window.getComputedStyle(node)
    const lineHeight = parseFloat(styles.lineHeight) || 24
    const vertical = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    const ceiling = lineHeight * maxRows + vertical
    node.style.height = 'auto'
    const next = Math.min(node.scrollHeight, ceiling)
    node.style.height = `${next}px`
    node.style.overflowY = node.scrollHeight > ceiling ? 'auto' : 'hidden'
  }, [autoGrow, maxRows])

  // Measured before paint, so a field rendered with a value already in it is
  // never drawn at the wrong height and then corrected.
  useLayoutEffect(resize, [resize, props.value, props.defaultValue])

  return (
    <textarea
      ref={attach}
      rows={rows}
      aria-invalid={invalid || undefined}
      onChange={event => {
        resize()
        onChange?.(event)
      }}
      className={cn(textareaVariants({ invalid, autoGrow, className }))}
      {...props}
    />
  )
})

export { textareaVariants }
