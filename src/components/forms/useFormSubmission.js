import { useCallback, useState } from 'react'
import { submitForm } from '@/lib/formSubmission'

const STATUS = {
  idle: 'idle',
  submitting: 'submitting',
  success: 'success',
  error: 'error',
}

/**
 * useFormSubmission — shared form state machine used by every marketing form
 * on the site (membership signup, online coaching application, 1-on-1
 * booking, contact). Returns:
 *
 *   {
 *     status,           // 'idle' | 'submitting' | 'success' | 'error'
 *     isSubmitting,
 *     isSuccess,
 *     isError,
 *     errorMessage,
 *     submit(payload),  // returns a promise
 *     reset(),
 *   }
 */
export function useFormSubmission(formKey) {
  const [status, setStatus] = useState(STATUS.idle)
  const [errorMessage, setErrorMessage] = useState(null)

  const submit = useCallback(
    async payload => {
      setStatus(STATUS.submitting)
      setErrorMessage(null)
      try {
        await submitForm(formKey, payload)
        setStatus(STATUS.success)
      } catch (error) {
        setStatus(STATUS.error)
        setErrorMessage(error?.message ?? null)
        throw error
      }
    },
    [formKey]
  )

  const reset = useCallback(() => {
    setStatus(STATUS.idle)
    setErrorMessage(null)
  }, [])

  return {
    status,
    isSubmitting: status === STATUS.submitting,
    isSuccess: status === STATUS.success,
    isError: status === STATUS.error,
    errorMessage,
    submit,
    reset,
  }
}
