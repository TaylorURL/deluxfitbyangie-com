import { Eye, EyeOff } from 'lucide-react'
import { Badge, Button } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * The staff-only strip above the portal. Off, it says why the coach's own view
 * is not a client's and offers the two levels; on, it names the level in force
 * and gets back out.
 *
 * It renders for staff alone — a client has nothing to preview, and the levels
 * it offers are the ones the library is gated on.
 */
export default function PortalPreviewBar({ level, onChange }) {
  const { portal } = useContent()
  const copy = portal.preview
  const previewing = Boolean(level)

  return (
    <div
      className={`mb-8 rounded-df-lg border px-5 py-4 ${
        previewing ? 'border-df-accent bg-df-accent-soft' : 'border-df-border bg-df-surface-2'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-start gap-3">
          <Badge tone={previewing ? 'accent' : 'neutral'} variant="soft" size="md">
            {previewing ? copy.activeLabel : copy.staffLabel}
          </Badge>
          <p className="min-w-0 text-sm leading-relaxed text-df-text-muted">
            {previewing ? copy.levelBody[level] : copy.staffBody}
            {previewing && <span className="block text-df-text-faint">{copy.ownData}</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!previewing && (
            <span className="text-[11px] font-700 uppercase tracking-[0.1em] text-df-text-faint">
              {copy.previewAs}
            </span>
          )}
          {level !== 'membership' && (
            <Button variant="secondary" size="sm" onClick={() => onChange('membership')}>
              <Eye aria-hidden="true" className="h-4 w-4" />
              {copy.levelLabel.membership}
            </Button>
          )}
          {level !== 'coaching' && (
            <Button variant="secondary" size="sm" onClick={() => onChange('coaching')}>
              <Eye aria-hidden="true" className="h-4 w-4" />
              {copy.levelLabel.coaching}
            </Button>
          )}
          {previewing && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              <EyeOff aria-hidden="true" className="h-4 w-4" />
              {copy.exit}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
