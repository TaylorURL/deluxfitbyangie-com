import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../lib/cn'

/**
 * The file control the browser ships is a button whose label is the file name,
 * which tells the reader that something was chosen and nothing about what.
 * This one shows the picture. For a progress photograph that is the whole
 * check the person wanted: the right shot, taken in the right light, not the
 * one before it.
 *
 * A drop target is added for the desk, and the whole area stays a real
 * `<input type="file">` underneath, so the phone still opens the camera roll
 * and the keyboard still reaches it.
 */
export function FileDrop({
  className,
  file,
  onFileChange,
  accept = 'image/*',
  label,
  hint,
  clearLabel = 'Remove',
  disabled,
  id,
}) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)
  const [preview, setPreview] = useState(null)

  // An object URL is a live handle on a blob; leaving the last one un-revoked
  // holds the file in memory for as long as the page is open.
  useEffect(() => {
    if (!file || !file.type?.startsWith('image/')) {
      setPreview(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const accepted = useCallback(
    list => {
      const next = list?.[0]
      if (next) onFileChange(next)
    },
    [onFileChange]
  )

  const clear = () => {
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (file) {
    return (
      <div
        className={cn(
          'flex items-center gap-4 rounded-df-md border border-df-border bg-df-surface p-3',
          className
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-df-sm object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-df-sm bg-df-surface-2 text-df-text-faint"
          >
            <ImagePlus className="h-5 w-5" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-600 text-df-text">{file.name}</span>
          <span className="mt-0.5 block text-[13px] tabular-nums text-df-text-muted">
            {Math.max(1, Math.round(file.size / 1024))} KB
          </span>
        </span>
        <button
          type="button"
          onClick={clear}
          aria-label={clearLabel}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-df-sm text-df-text-muted transition-colors duration-df-fast ease-df-out hover:bg-df-surface-2 hover:text-df-text"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={event => accepted(event.target.files)}
        />
      </div>
    )
  }

  return (
    <label
      onDragOver={event => {
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={event => {
        event.preventDefault()
        setOver(false)
        accepted(event.dataTransfer.files)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-df-md border border-dashed px-5 py-7 text-center transition-colors duration-df-fast ease-df-out',
        'focus-within:border-df-accent focus-within:shadow-df-ring',
        over
          ? 'border-df-accent bg-df-accent-softer'
          : 'border-df-border-strong bg-df-field hover:border-df-border-hover hover:bg-df-field-hover',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      <ImagePlus aria-hidden="true" className="h-5 w-5 text-df-text-muted" />
      <span className="text-[15px] font-600 text-df-text">{label}</span>
      {hint && <span className="text-[13px] leading-snug text-df-text-muted">{hint}</span>}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={event => accepted(event.target.files)}
      />
    </label>
  )
}
