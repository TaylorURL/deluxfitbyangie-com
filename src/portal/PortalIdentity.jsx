import { Badge, MicroLabel } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Whose portal this is, said once at the top of it. The monogram is the first
 * letter of the name on the account rather than a photograph: nobody uploads
 * one, and an empty avatar ring is a hole in the page every time it renders.
 */
export default function PortalIdentity({ displayName, entitlements }) {
  const { portal } = useContent()
  const { hasMembership, hasCoaching } = entitlements
  const monogram = (displayName.trim()[0] || '·').toUpperCase()

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-df-border pb-6">
      <div className="flex min-w-0 items-center gap-4">
        <span
          aria-hidden="true"
          className="font-400 flex h-12 w-12 shrink-0 items-center justify-center rounded-df-md bg-df-accent-soft font-display text-2xl leading-none text-df-accent-bright"
        >
          {monogram}
        </span>
        <div className="min-w-0">
          <MicroLabel size="xs" tone="faint">
            {portal.brandLockup}
          </MicroLabel>
          <h1 className="font-400 truncate font-display text-2xl uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
            {displayName}
          </h1>
        </div>
      </div>

      {(hasMembership || hasCoaching) && (
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          {hasMembership && (
            <Badge tone="positive" variant="soft" size="md">
              {portal.overview.membershipStatus}
            </Badge>
          )}
          {hasCoaching && (
            <Badge tone="accent" variant="soft" size="md">
              {portal.overview.coachingStatus}
            </Badge>
          )}
        </div>
      )}
    </header>
  )
}
