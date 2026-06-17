import { useCallback, useId, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileImage,
  FileVideo,
  Loader2,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { Button, Container, Field, Input, cn } from '@deluxfit/ds'
import { DEV_UPLOAD_BUCKET, DEV_UPLOAD_ROOT_FOLDER, supabase } from '@/config/supabase'

const MAX_FILE_BYTES = 500 * 1024 * 1024
const ACCEPTED_TYPE_PREFIXES = ['image/', 'video/']

const STATUS = {
  queued: 'queued',
  uploading: 'uploading',
  success: 'success',
  error: 'error',
}

function sanitizeSegment(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

function sanitizeFilename(name) {
  const lastDot = name.lastIndexOf('.')
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name
  const ext = lastDot > 0 ? name.slice(lastDot + 1) : ''
  const cleanStem = sanitizeSegment(stem) || 'file'
  const cleanExt = sanitizeSegment(ext).toLowerCase()
  return cleanExt ? `${cleanStem}.${cleanExt}` : cleanStem
}

function randomToken() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10)
  }
  return Math.random().toString(36).slice(2, 12)
}

function buildObjectPath(file, clientNameSegment) {
  const stamp = `${Date.now()}-${randomToken()}`
  const safeName = sanitizeFilename(file.name)
  const folder = clientNameSegment
    ? `${DEV_UPLOAD_ROOT_FOLDER}/${clientNameSegment}`
    : DEV_UPLOAD_ROOT_FOLDER
  return `${folder}/${stamp}-${safeName}`
}

function isAcceptedFile(file) {
  return ACCEPTED_TYPE_PREFIXES.some(prefix => file.type.startsWith(prefix))
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function FilePreviewThumb({ entry }) {
  if (entry.previewUrl) {
    return (
      <img
        src={entry.previewUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-df-sm border border-df-border object-cover"
      />
    )
  }
  const Icon = entry.kind === 'video' ? FileVideo : FileImage
  return (
    <div
      aria-hidden="true"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-df-sm border border-df-border bg-df-surface-2 text-df-text-muted"
    >
      <Icon className="h-6 w-6" />
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === STATUS.success) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.18em] text-df-positive">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        Uploaded
      </span>
    )
  }
  if (status === STATUS.error) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.18em] text-df-danger">
        <AlertCircle aria-hidden="true" className="h-4 w-4" />
        Failed
      </span>
    )
  }
  if (status === STATUS.uploading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.18em] text-df-accent-bright">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        Uploading
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.18em] text-df-text-muted">
      Ready
    </span>
  )
}

function FileRow({ entry, onRemove }) {
  const isLocked = entry.status === STATUS.uploading
  return (
    <li className="flex items-center gap-4 rounded-df-md border border-df-border bg-df-surface-2/60 p-3">
      <FilePreviewThumb entry={entry} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-sm font-600 text-df-text">{entry.file.name}</p>
          <p className="shrink-0 text-[11px] font-600 uppercase tracking-[0.18em] text-df-text-faint">
            {formatBytes(entry.file.size)}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <StatusBadge status={entry.status} />
          {entry.error ? (
            <p className="truncate text-xs text-df-danger" title={entry.error}>
              {entry.error}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        disabled={isLocked}
        aria-label={`Remove ${entry.file.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-df-sm border border-df-border-strong text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-3 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  )
}

function buildEntry(file) {
  const kind = file.type.startsWith('video/') ? 'video' : 'image'
  const previewUrl = kind === 'image' ? URL.createObjectURL(file) : null
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${randomToken()}`,
    file,
    kind,
    status: STATUS.queued,
    error: null,
    previewUrl,
  }
}

/**
 * DevUpload — content-intake page where the site owner and team upload
 * high-quality photos and videos for use on the DeluxFit website.
 */
export default function DevUpload() {
  const [entries, setEntries] = useState([])
  const [clientName, setClientName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [allDone, setAllDone] = useState(false)
  const fileInputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const dropZoneLabelId = useId()
  const dropZoneHintId = useId()

  const queueCount = entries.length
  const successCount = useMemo(
    () => entries.filter(entry => entry.status === STATUS.success).length,
    [entries]
  )
  const errorCount = useMemo(
    () => entries.filter(entry => entry.status === STATUS.error).length,
    [entries]
  )
  const pendingCount = useMemo(
    () =>
      entries.filter(
        entry => entry.status === STATUS.queued || entry.status === STATUS.error
      ).length,
    [entries]
  )
  const canUpload = !isUploading && pendingCount > 0

  const addFiles = useCallback(fileList => {
    const incoming = Array.from(fileList)
    if (!incoming.length) return

    const rejected = []
    const accepted = []
    incoming.forEach(file => {
      if (!isAcceptedFile(file)) {
        rejected.push(`${file.name} is not an image or video`)
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} is over ${formatBytes(MAX_FILE_BYTES)}`)
        return
      }
      accepted.push(buildEntry(file))
    })

    if (rejected.length) {
      setGlobalError(rejected.join(' · '))
    } else {
      setGlobalError(null)
    }
    if (accepted.length) {
      setAllDone(false)
      setEntries(prev => [...prev, ...accepted])
    }
  }, [])

  const removeEntry = useCallback(entryId => {
    setEntries(prev => {
      const target = prev.find(entry => entry.id === entryId)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(entry => entry.id !== entryId)
    })
  }, [])

  const openFilePicker = () => fileInputRef.current?.click()

  const handleFileInputChange = event => {
    addFiles(event.target.files)
    event.target.value = ''
  }

  const handleDragEnter = event => {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  const handleDragOver = event => {
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = event => {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDragging(false)
  }

  const handleDrop = event => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)
    if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files)
  }

  const handleDropZoneKey = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  const uploadAll = async () => {
    if (!canUpload) return
    setIsUploading(true)
    setGlobalError(null)
    setAllDone(false)

    const sanitizedName = sanitizeSegment(clientName)

    const idsToProcess = entries
      .filter(entry => entry.status === STATUS.queued || entry.status === STATUS.error)
      .map(entry => entry.id)

    setEntries(prev =>
      prev.map(entry =>
        idsToProcess.includes(entry.id)
          ? { ...entry, status: STATUS.uploading, error: null }
          : entry
      )
    )

    for (const entryId of idsToProcess) {
      const current = entries.find(entry => entry.id === entryId)
      if (!current) continue
      const path = buildObjectPath(current.file, sanitizedName)
      try {
        const { error } = await supabase.storage
          .from(DEV_UPLOAD_BUCKET)
          .upload(path, current.file, { contentType: current.file.type })
        if (error) throw error
        setEntries(prev =>
          prev.map(entry =>
            entry.id === entryId ? { ...entry, status: STATUS.success, error: null } : entry
          )
        )
      } catch (uploadError) {
        const message = uploadError?.message || 'Upload failed'
        setEntries(prev =>
          prev.map(entry =>
            entry.id === entryId ? { ...entry, status: STATUS.error, error: message } : entry
          )
        )
      }
    }

    setIsUploading(false)
    setAllDone(true)
  }

  const resetAll = () => {
    entries.forEach(entry => {
      if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl)
    })
    setEntries([])
    setClientName('')
    setGlobalError(null)
    setAllDone(false)
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-df-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(225,29,42,0.22),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-df-accent/60 to-transparent"
      />

      <header className="border-b border-df-border">
        <Container size="xl">
          <div className="flex h-20 items-center justify-between sm:h-24">
            <a
              href="/"
              aria-label="DeluxFit by Angie"
              className="inline-flex items-center rounded-df-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-df-bg"
            >
              <img
                src="/deluxfit-logo.png"
                alt="DeluxFit by Angie"
                width="946"
                height="308"
                className="h-9 w-auto select-none [filter:invert(1)_hue-rotate(180deg)] sm:h-10"
                draggable="false"
              />
            </a>
            <a
              href="/"
              className="group inline-flex items-center gap-2 rounded-df-sm border border-df-border-strong px-3.5 py-2.5 text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted transition-colors hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to site
            </a>
          </div>
        </Container>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 py-12 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-df-full border border-df-border-strong bg-df-accent-soft px-3 py-1 text-[10px] font-700 uppercase tracking-[0.24em] text-df-accent-bright">
              <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
              Content upload
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,3.5rem)] font-400 uppercase leading-[0.95] tracking-tight text-df-text">
              Upload your content<span className="text-df-accent">.</span>
            </h1>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-df-text-muted sm:text-base">
              Drop your high-quality photos and videos below and they'll be added to the
              DeluxFit site. Send original-resolution files for the best results — up to{' '}
              {formatBytes(MAX_FILE_BYTES)} per file.
            </p>
          </div>

          <div className="rounded-df-2xl border border-df-border bg-df-surface/85 p-6 shadow-df-xl backdrop-blur-xl sm:p-8">
            <Field
              label="Your name (optional)"
              helper="Used to organize your uploads into a named folder."
            >
              <Input
                value={clientName}
                onChange={event => setClientName(event.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={isUploading}
              />
            </Field>

            <div
              role="button"
              tabIndex={0}
              aria-labelledby={dropZoneLabelId}
              aria-describedby={dropZoneHintId}
              onClick={openFilePicker}
              onKeyDown={handleDropZoneKey}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-df-lg border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg',
                isDragging
                  ? 'border-df-accent-bright bg-df-accent-soft'
                  : 'border-df-border-input bg-df-surface-2/40 hover:border-df-border-hover hover:bg-df-surface-2'
              )}
            >
              <UploadCloud
                aria-hidden="true"
                className={cn(
                  'h-10 w-10 transition-colors',
                  isDragging ? 'text-df-accent-bright' : 'text-df-text-muted'
                )}
              />
              <p
                id={dropZoneLabelId}
                className="text-sm font-600 uppercase tracking-[0.18em] text-df-text"
              >
                Drag &amp; drop files here
              </p>
              <p id={dropZoneHintId} className="text-xs text-df-text-faint">
                Or press Enter / click to choose from your device · images &amp; videos · multiple
                files OK
              </p>
              <label htmlFor="dev-upload-file-input" className="sr-only">
                Choose photos and videos for the site
              </label>
              <input
                ref={fileInputRef}
                id="dev-upload-file-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInputChange}
                className="sr-only"
              />
            </div>

            {globalError ? (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-df-sm border border-df-danger/50 bg-df-danger-soft px-3 py-2.5 text-xs text-df-danger"
              >
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{globalError}</p>
              </div>
            ) : null}

            {queueCount > 0 ? (
              <div className="mt-6">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-text-muted">
                    {queueCount} {queueCount === 1 ? 'file' : 'files'} queued
                  </p>
                  {successCount > 0 ? (
                    <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-df-positive">
                      {successCount} done
                    </p>
                  ) : null}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {entries.map(entry => (
                    <FileRow key={entry.id} entry={entry} onRemove={removeEntry} />
                  ))}
                </ul>
              </div>
            ) : null}

            {allDone && successCount > 0 && errorCount === 0 ? (
              <div
                role="status"
                className="mt-6 flex items-start gap-2 rounded-df-sm border border-df-positive/50 bg-df-positive-soft px-3 py-2.5 text-xs text-df-positive"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  All {successCount} {successCount === 1 ? 'file has' : 'files have'} been received
                  and will appear on the site.
                </p>
              </div>
            ) : null}

            {allDone && errorCount > 0 ? (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-df-sm border border-df-danger/50 bg-df-danger-soft px-3 py-2.5 text-xs text-df-danger"
              >
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {errorCount} {errorCount === 1 ? 'file' : 'files'} failed. Tap upload to retry.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {queueCount > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetAll}
                  disabled={isUploading}
                >
                  Clear queue
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={uploadAll}
                disabled={!canUpload}
                aria-disabled={!canUpload}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Uploading
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" aria-hidden="true" />
                    Upload {pendingCount > 0 ? `${pendingCount} ` : ''}
                    {pendingCount === 1 ? 'file' : 'files'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-df-border">
        <Container size="xl">
          <p className="py-6 text-[10px] font-600 uppercase tracking-[0.24em] text-df-text-faint">
            © {new Date().getFullYear()} DeluxFit by Angie · Built for transformation
          </p>
        </Container>
      </footer>
    </div>
  )
}
