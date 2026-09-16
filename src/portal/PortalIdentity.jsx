import { Badge } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Whose portal this is, said once at the top of it on a phone, where there is
 * no rail to carry it. The monogram is the first letter of the name on the
 * account rather than a photograph: nobody uploads one, and an empty avatar
 * ring is a hole in the page every time it renders.
 */
export default function PortalIdentity({ displayName, entitlements }) {
  const { portal } = useContent()
  const { hasMembership, hasCoaching } = entitlements
  const monogram = (displayName.trim()[0] || '·').toUpperCase()

  return (
    <header className="flex items-center justify-between gap-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="font-400 flex h-11 w-11 shrink-0 items-center justify-center rounded-df-full bg-df-accent bg-df-accent-gradient font-display text-xl leading-none text-df-on-accent"
        >
          {monogram}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-700 uppercase tracking-[0.2em] text-df-text-faint">
            {portal.brandLockup}
          </p>
          <p className="truncate text-[15px] font-600 text-df-text">{displayName}</p>
        </div>
      </div>

      {(hasMembership || hasCoaching) && (
        <div className="flex shrink-0 items-center gap-1.5">
          {hasCoaching ? (
            <Badge tone="accent" variant="solid" size="sm">
              {portal.overview.coachingStatus}
            </Badge>
          ) : (
            <Badge tone="positive" variant="soft" size="sm">
              {portal.overview.membershipStatus}
            </Badge>
          )}
        </div>
      )}
    </header>
  )
}
