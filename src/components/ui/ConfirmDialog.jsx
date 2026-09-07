/* eslint-disable react-refresh/only-export-components --
 * The hook and the provider are one thing: `useConfirm` is how a call site
 * asks the provider a question, and splitting them apart to satisfy an HMR
 * heuristic would put half a mechanism in each of two files. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'
import { Button, Panel, cn } from '@deluxfit/ds'

/**
 * The question the app asks before it destroys something, asked in the app's
 * own voice.
 *
 * Four delete buttons handed this to `window.confirm`, which draws the
 * operating system's dialog: a different typeface, a different button order on
 * every platform, no way to name the destructive action as destructive, and
 * nothing to say which of the two buttons is the safe one. Two more deleted
 * without asking at all. One dialog, and every destructive action goes through
 * it.
 *
 * The safe answer holds focus when the dialog opens and Escape takes it, so
 * the fastest thing a hand can do is the thing that changes nothing.
 */
const ConfirmContext = createContext(null)

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error('useConfirm needs a ConfirmProvider above it')
  return confirm
}

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolveRef = useRef(null)
  const cancelRef = useRef(null)

  const confirm = useCallback(
    options =>
      new Promise(resolve => {
        resolveRef.current = resolve
        setRequest(options)
      }),
    []
  )

  const settle = useCallback(answer => {
    resolveRef.current?.(answer)
    resolveRef.current = null
    setRequest(null)
  }, [])

  useEffect(() => {
    if (!request) return undefined
    cancelRef.current?.focus()
    const onKey = event => {
      if (event.key === 'Escape') settle(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [request, settle])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-modal flex items-end justify-center p-4 sm:items-center">
            <button
              type="button"
              aria-label={request.cancelLabel ?? 'Cancel'}
              onClick={() => settle(false)}
              className="absolute inset-0 cursor-pointer bg-df-overlay [touch-action:manipulation]"
            />
            <Panel
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby={request.body ? 'confirm-body' : undefined}
              elevation="raised"
              className={cn(
                'relative w-full max-w-md animate-df-rise motion-reduce:animate-none',
                'shadow-df-xl'
              )}
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-df-full bg-df-danger-soft text-df-danger"
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2
                id="confirm-title"
                className="font-400 mt-5 font-display text-2xl uppercase leading-tight tracking-tight text-df-text"
              >
                {request.title}
              </h2>
              {request.body && (
                <p
                  id="confirm-body"
                  className="mt-3 text-[15px] leading-relaxed text-df-text-muted"
                >
                  {request.body}
                </p>
              )}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button ref={cancelRef} variant="ghost" onClick={() => settle(false)}>
                  {request.cancelLabel ?? 'Cancel'}
                </Button>
                <Button variant="danger" onClick={() => settle(true)}>
                  {request.confirmLabel ?? 'Delete'}
                </Button>
              </div>
            </Panel>
          </div>,
          document.body
        )}
    </ConfirmContext.Provider>
  )
}
