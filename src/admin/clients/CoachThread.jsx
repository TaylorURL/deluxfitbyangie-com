import { useEffect, useRef, useState } from 'react'
import { Loader2, Paperclip, Send } from 'lucide-react'
import { Button, Textarea, cn } from '@deluxfit/ds'
import { sendCoachMessage, signedUrl, uploadMedia } from '@/lib/adminApi'
import { FormError } from '@/components/forms/FormFeedback'
import { fmtDateTime } from '../components/AdminPrimitives'

const isVideo = path => /\.(mp4|webm|mov|m4v)$/i.test(path || '')

// Each attachment resolves its own signed URL lazily, so a thread with many
// attachments doesn't block on one batch request.
function CoachAttachment({ bucket, path }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let active = true
    setUrl(null)
    signedUrl(bucket || 'library-media', path)
      .then(resolved => active && setUrl(resolved))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [bucket, path])

  const name = path.split('/').pop()
  if (!url) {
    return (
      <span className="mt-2 block text-xs opacity-80">
        <Paperclip className="mr-1 inline h-3 w-3" aria-hidden="true" />
        {name}
      </span>
    )
  }
  if (isVideo(path)) {
    return (
      <video
        controls
        src={url}
        className="mt-2 w-full max-w-xs rounded-df-md border border-df-border"
      />
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-xs underline opacity-90 hover:opacity-100"
    >
      <Paperclip className="h-3 w-3" aria-hidden="true" />
      {name}
    </a>
  )
}

export default function CoachThread({ clientId, messages, reload }) {
  const thread = messages ?? []
  const fileInputRef = useRef(null)

  const [body, setBody] = useState('')
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const handleSend = async event => {
    event.preventDefault()
    if (!body.trim() && !file) return
    setSending(true)
    setError(null)
    try {
      if (file) {
        const { path } = await uploadMedia(file, 'coach')
        await sendCoachMessage({
          userId: clientId,
          body: body.trim() || undefined,
          attachmentPath: path,
          attachmentBucket: 'library-media',
        })
      } else {
        await sendCoachMessage({ userId: clientId, body: body.trim() })
      }
      setBody('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await reload()
    } catch (sendError) {
      setError(sendError?.message || 'Could not send your message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="bg-df-surface/60 flex max-h-[26rem] flex-col gap-3 overflow-y-auto rounded-df-lg border border-df-border p-5">
        {thread.length === 0 ? (
          <p className="py-8 text-center text-sm text-df-text-faint">
            No messages yet. Start the conversation below.
          </p>
        ) : (
          thread.map(message => {
            const fromCoach = message.sender === 'coach'
            return (
              <div
                key={message.id}
                className={cn('flex flex-col', fromCoach ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-df-lg px-4 py-2.5 text-sm leading-relaxed',
                    fromCoach
                      ? 'bg-df-accent text-df-on-accent'
                      : 'border border-df-border bg-df-surface-2 text-df-text'
                  )}
                >
                  {message.body}
                  {message.attachment_path && (
                    <CoachAttachment
                      bucket={message.attachment_bucket}
                      path={message.attachment_path}
                    />
                  )}
                </div>
                <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-df-text-faint">
                  {fromCoach ? 'You' : 'Client'} · {fmtDateTime(message.created_at)}
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
          placeholder="Write a reply to your client…"
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
            aria-label="Attach video or file"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            {file ? file.name : 'Attach video / file'}
          </Button>
          <Button type="submit" size="sm" disabled={sending} className="ml-auto">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send
                <Send className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
        <FormError body={error} />
      </form>
    </div>
  )
}
