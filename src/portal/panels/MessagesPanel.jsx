import { useEffect, useRef, useState } from 'react'
import { Loader2, Paperclip, Send } from 'lucide-react'
import { Button, Textarea, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import { useAuth } from '@/auth/useAuth'
import { getSignedUrl, sendMessage, uploadAttachment } from '@/lib/portalApi'
import { FormError } from '@/components/forms/FormFeedback'
import { EmptyState, PanelHeading } from './PanelPrimitives'

const formatTime = iso =>
  new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

const isVideo = path => /\.(mp4|webm|mov)$/i.test(path || '')

/** Attachment — resolves a message attachment's signed URL lazily. Coach video
 * feedback renders inline; everything else is a "View attachment" link. */
function Attachment({ message, label }) {
  const [url, setUrl] = useState(null)
  const path = message.attachment_path
  const bucket = message.attachment_bucket || 'message-attachments'

  useEffect(() => {
    let active = true
    getSignedUrl(bucket, path).then(resolved => {
      if (active) setUrl(resolved)
    })
    return () => {
      active = false
    }
  }, [bucket, path])

  if (!url) {
    return (
      <span className="mt-1 block text-xs opacity-80">
        <Paperclip className="mr-1 inline h-3 w-3" aria-hidden="true" />
        {path.split('/').pop()}
      </span>
    )
  }

  if (isVideo(path)) {
    return <video controls src={url} className="mt-2 max-w-full rounded-df-md" />
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 block text-xs underline opacity-80 hover:opacity-100"
    >
      <Paperclip className="mr-1 inline h-3 w-3" aria-hidden="true" />
      {label}
    </a>
  )
}

/**
 * MessagesPanel — the in-platform messaging thread with Angie. This is the only
 * channel for coaching communication; the 72-business-hour expectation is set
 * in copy. Sends route through the `send-message` edge function. Gated to
 * active coaching clients.
 */
export default function MessagesPanel({ messages, entitlements, reloadMessages }) {
  const { portal } = useContent()
  const copy = portal.messages
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [body, setBody] = useState('')
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  if (!entitlements.hasCoaching) {
    return (
      <section>
        <PanelHeading title={copy.title} />
        <EmptyState body={copy.gatedBody} ctaLabel={portal.plan.emptyCta} ctaHref="/online-coaching#apply" />
      </section>
    )
  }

  const handleSend = async event => {
    event.preventDefault()
    if (!body.trim() && !file) return
    setSending(true)
    setError(null)
    try {
      let attachmentPath
      if (file) attachmentPath = await uploadAttachment(user.id, file)
      await sendMessage({ body: body.trim(), attachmentPath })
      setBody('')
      setFile(null)
      await reloadMessages()
    } catch (sendError) {
      setError(sendError?.message || 'Could not send your message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section>
      <PanelHeading title={copy.title} intro={copy.intro} />

      <div className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto rounded-df-lg border border-df-border bg-df-surface/60 p-5">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-df-text-faint">{copy.empty}</p>
        ) : (
          messages.map(message => {
            const fromClient = message.sender === 'client'
            return (
              <div
                key={message.id}
                className={cn('flex flex-col', fromClient ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-df-lg px-4 py-2.5 text-sm leading-relaxed',
                    fromClient
                      ? 'bg-df-accent text-df-on-accent'
                      : 'border border-df-border bg-df-surface-2 text-df-text'
                  )}
                >
                  {message.body}
                  {message.attachment_path && (
                    <span className="mt-1 block text-xs opacity-80">
                      <Paperclip className="mr-1 inline h-3 w-3" aria-hidden="true" />
                      {message.attachment_path.split('/').pop()}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-df-text-faint">
                  {fromClient ? copy.youName : copy.coachName} · {formatTime(message.created_at)}
                </span>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3">
        <Textarea
          value={body}
          onChange={event => setBody(event.target.value)}
          placeholder={copy.placeholder}
          rows={3}
        />
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={event => setFile(event.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            aria-label={copy.attach}
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            {file ? file.name : copy.attach}
          </Button>
          <Button type="submit" size="sm" disabled={sending} className="ml-auto">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.sending}
              </>
            ) : (
              <>
                {copy.send}
                <Send className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
        <FormError body={error} />
      </form>
    </section>
  )
}
