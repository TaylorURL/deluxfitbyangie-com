import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Eye, FileUp, Loader2, Plus, Save, Upload, Users, X } from 'lucide-react'
import { Button, Field, Input, MicroLabel, Select, Textarea } from '@deluxfit/ds'
import {
  deleteContent,
  listClients,
  listContent,
  saveContent,
  uploadMedia,
} from '@/lib/api/adminApi'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { FormError, FormSuccess } from '@/components/forms/FormFeedback'
import {
  AdminEmpty,
  AdminLoading,
  SectionCard,
  SectionHeading,
  useAsyncData,
} from '../AdminPrimitives'
import ContentRow from '../content/ContentRow'
import ClientAssignList from '../content/ClientAssignList'
import { deleteLibraryItemPrompt } from '../confirmations'
import {
  ACCESS_LEVEL_OPTIONS,
  CATEGORY_OPTIONS,
  MEDIA_TYPE_OPTIONS,
  byProgramOrder,
  draftFromItem,
  emptyDraft,
} from '../content/contentMeta'

/**
 * Every write goes through the staff-only `upsert-content` edge function via
 * the adminApi helpers; uploads land in the private `library-media` bucket via
 * `uploadMedia`. The frontend never touches Supabase tables directly.
 */
export default function AdminContent() {
  const confirm = useConfirm()
  const { data: items, loading, error, reload } = useAsyncData(listContent, [], [])
  const { data: clients } = useAsyncData(listClients, [], [])

  const [draft, setDraft] = useState(null)
  const [upload, setUpload] = useState(null)
  const [assigning, setAssigning] = useState(false)
  const [assigned, setAssigned] = useState(() => new Set())
  const [status, setStatus] = useState('idle') // idle | saving | uploading | error
  const [formError, setFormError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const fileInputRef = useRef(null)

  const isEditing = Boolean(draft?.id)
  const isWorking = status === 'saving' || status === 'uploading'

  const sortedItems = useMemo(() => [...(items ?? [])].sort(byProgramOrder), [items])

  const resetForm = useCallback(() => {
    setDraft(null)
    setUpload(null)
    setAssigning(false)
    setAssigned(new Set())
    setStatus('idle')
    setFormError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const openCreate = () => {
    setSuccess(null)
    setFormError(null)
    setUpload(null)
    setAssigning(false)
    setAssigned(new Set())
    setStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setDraft(emptyDraft())
  }

  const openEdit = item => {
    setSuccess(null)
    setFormError(null)
    setUpload(null)
    setAssigning(false)
    // Assignments are synced only when the coach opens the panel — leaving it
    // closed keeps the item's existing assignments untouched on save.
    setAssigned(new Set())
    setStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setDraft(draftFromItem(item))
  }

  const setField = key => event => {
    const value = event.target.value
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  const handleFileChange = event => {
    const file = event.target.files?.[0] ?? null
    setUpload(file)
    setFormError(null)
  }

  const clearFile = () => {
    setUpload(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleAssigned = userId => {
    setAssigned(prev => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!draft) return
    if (!draft.title.trim()) {
      setFormError('A title is required.')
      return
    }

    setFormError(null)
    setSuccess(null)

    try {
      // 1. The upload comes first: the item row stores the storage path, which
      //    does not exist until the file has landed.
      let mediaPath
      if (upload) {
        setStatus('uploading')
        const { path } = await uploadMedia(upload, 'library')
        mediaPath = path
      }

      // 2. Persist the item. A fresh upload's path wins; otherwise fall back to
      //    the pasted external URL.
      setStatus('saving')
      const payload = {
        id: draft.id ?? undefined,
        title: draft.title.trim(),
        description: draft.description.trim() || undefined,
        category: draft.category,
        mediaType: draft.mediaType,
        accessLevel: draft.accessLevel,
        sort: Number(draft.sort) || 0,
        program: draft.program.trim() || undefined,
        week: Number(draft.week) || undefined,
        day: Number(draft.day) || undefined,
      }
      if (mediaPath) payload.mediaPath = mediaPath
      else if (draft.url.trim()) payload.url = draft.url.trim()

      // Only sync assignments when the coach actively edited them, so editing
      // other fields never wipes an item's existing assignment list.
      if (assigning) payload.assignedUserIds = [...assigned]

      const saved = await saveContent(payload)
      setSuccess(`“${saved?.title || payload.title}” ${isEditing ? 'updated' : 'created'}.`)
      resetForm()
      reload()
    } catch (saveError) {
      setStatus('error')
      setFormError(saveError?.message || 'Could not save the item.')
    }
  }

  const handleDelete = async item => {
    const ok = await confirm(deleteLibraryItemPrompt(item))
    if (!ok) return
    setBusyId(item.id)
    setFormError(null)
    setSuccess(null)
    try {
      await deleteContent(item.id)
      setSuccess(`“${item.title}” deleted.`)
      if (draft?.id === item.id) resetForm()
      reload()
    } catch (deleteError) {
      setFormError(deleteError?.message || 'Could not delete the item.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-6">
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading
            title="Content library"
            intro="Upload videos, PDFs, exercise instructions, and schedules, gate them by access level, and assign them directly to clients. Public is visible to anyone, Membership to members and coaching clients, and Coaching to coaching clients only."
          />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {/* This page shows the whole library because the coach may read
                every row; the portal preview is where she sees the subset a
                client is given. */}
            <Button asChild variant="secondary" className="shrink-0">
              <a href="/portal?preview=membership#library">
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span>Preview As A Client</span>
              </a>
            </Button>
            {!draft && (
              <Button onClick={openCreate} className="shrink-0">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>New Item</span>
              </Button>
            )}
          </div>
        </div>

        {success && (
          <div className="mt-5">
            <FormSuccess heading="Saved" body={success} />
          </div>
        )}

        {draft && (
          <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <div className="flex items-center justify-between">
              <MicroLabel tone="accent">{isEditing ? 'Edit Item' : 'New Item'}</MicroLabel>
              <Button variant="ghost" size="sm" onClick={resetForm} disabled={isWorking}>
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Cancel</span>
              </Button>
            </div>

            <Field label="Title">
              <Input
                value={draft.title}
                onChange={setField('title')}
                placeholder="Lower-body strength, week 1"
                autoComplete="off"
              />
            </Field>

            <Field label="Description (Optional)">
              <Textarea
                rows={3}
                value={draft.description}
                onChange={setField('description')}
                placeholder="What this covers, cues to focus on, how to use it…"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Category">
                <Select value={draft.category} onChange={setField('category')}>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Media Type">
                <Select value={draft.mediaType} onChange={setField('mediaType')}>
                  {MEDIA_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Access Level">
                <Select value={draft.accessLevel} onChange={setField('accessLevel')}>
                  {ACCESS_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-3 rounded-df-md border border-df-border bg-df-surface-2 p-4">
              <MicroLabel>Program Placement</MicroLabel>
              <p className="text-sm text-df-text-muted">
                Where this sits inside a program. Leave all three blank for a standalone resource,
                like a nutrition guide or a single demo video.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Program" helper="e.g. Glute Growth">
                  <Input
                    type="text"
                    value={draft.program}
                    onChange={setField('program')}
                    placeholder="Program name"
                  />
                </Field>
                <Field label="Week">
                  <Input type="number" min="1" value={draft.week} onChange={setField('week')} />
                </Field>
                <Field label="Day">
                  <Input type="number" min="1" value={draft.day} onChange={setField('day')} />
                </Field>
              </div>
            </div>

            <Field
              label="Sort Order"
              helper="Orders items inside the same day. Lower numbers first."
            >
              <Input
                type="number"
                value={draft.sort}
                onChange={setField('sort')}
                className="sm:max-w-[10rem]"
              />
            </Field>

            <div className="grid gap-3 rounded-df-md border border-df-border bg-df-surface-2 p-4">
              <MicroLabel>Media Source</MicroLabel>
              <Field
                label="External URL"
                helper="Paste a link to a hosted video or article, or upload a file below instead."
              >
                <Input
                  type="url"
                  value={draft.url}
                  onChange={setField('url')}
                  placeholder="https://…"
                  autoComplete="off"
                  disabled={Boolean(upload)}
                />
              </Field>

              <div>
                <MicroLabel tone="faint" className="mb-2">
                  Or upload a file
                </MicroLabel>
                <label htmlFor="content-file-input" className="sr-only">
                  Choose a file to upload
                </label>
                <input
                  ref={fileInputRef}
                  id="content-file-input"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isWorking}
                  className="block w-full cursor-pointer rounded-df-md border border-df-border-input bg-df-surface-2 text-sm text-df-text-muted file:mr-4 file:cursor-pointer file:border-0 file:bg-df-surface-3 file:px-4 file:py-3 file:text-[11px] file:font-700 file:uppercase file:tracking-[0.14em] file:text-df-text hover:file:bg-df-accent-soft hover:file:text-df-accent-bright disabled:cursor-not-allowed disabled:opacity-50"
                />
                {upload ? (
                  <p className="mt-2 flex items-center justify-between gap-3 rounded-df-sm border border-df-border bg-df-surface-2 px-3 py-2 text-xs text-df-text">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <FileUp
                        className="h-4 w-4 shrink-0 text-df-accent-bright"
                        aria-hidden="true"
                      />
                      <span className="truncate font-600">{upload.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearFile}
                      disabled={isWorking}
                      className="shrink-0 text-[11px] font-700 uppercase tracking-[0.14em] text-df-text-faint transition-colors duration-df-fast ease-df-out hover:text-df-text disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </p>
                ) : isEditing && draft.id ? (
                  <p className="mt-2 text-xs text-df-text-faint">
                    Leave empty to keep the current media. Choosing a file replaces it.
                  </p>
                ) : null}
                {status === 'uploading' && (
                  <p className="mt-2 inline-flex items-center gap-2 text-xs font-600 uppercase tracking-[0.16em] text-df-accent-bright">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Uploading file…</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 rounded-df-md border border-df-border bg-df-surface-2 p-4">
              <div className="flex items-center justify-between">
                <MicroLabel className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Assign to Clients</span>
                </MicroLabel>
                {!assigning ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssigning(true)}
                    disabled={isWorking}
                  >
                    Edit Assignments
                  </Button>
                ) : (
                  <MicroLabel as="span" tone="accent" className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Editing</span>
                  </MicroLabel>
                )}
              </div>
              {assigning ? (
                <>
                  <ClientAssignList
                    clients={clients ?? []}
                    selected={assigned}
                    onToggle={toggleAssigned}
                    onClear={() => setAssigned(new Set())}
                    disabled={isWorking}
                  />
                  <p className="text-xs text-df-text-faint">
                    Saving replaces this item's full assignment list with the selection above.
                    Assigned clients can view the item even without a matching entitlement.
                  </p>
                </>
              ) : (
                <p className="text-xs text-df-text-faint">
                  {isEditing
                    ? 'Existing assignments are kept unless you choose to edit them.'
                    : 'Optionally pick which clients can view this item directly.'}
                </p>
              )}
            </div>

            <FormError body={formError} />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={resetForm} disabled={isWorking}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isWorking}>
                {isWorking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>{status === 'uploading' ? 'Uploading…' : 'Saving…'}</span>
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="h-4 w-4" aria-hidden="true" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>Create Item</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </SectionCard>

      <SectionCard>
        <SectionHeading title="Library items" />
        <div className="mt-6">
          {loading ? (
            <AdminLoading label="Loading library…" />
          ) : error ? (
            <FormError body={error} />
          ) : sortedItems.length === 0 ? (
            <AdminEmpty body="No content yet. Create your first library item above." />
          ) : (
            <ul className="grid gap-3">
              {sortedItems.map(item => (
                <ContentRow
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  busy={busyId === item.id}
                />
              ))}
            </ul>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
