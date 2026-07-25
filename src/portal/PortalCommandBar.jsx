import { Badge, cn } from '@deluxfit/ds'
import { useContent } from '@/i18n'

export default function PortalCommandBar({ sections, activeId, displayName, monogram, entitlements }) {
  const { portal } = useContent()
  const { hasMembership, hasCoaching } = entitlements

  return (
    <div className="mb-8 sm:mb-10">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-df-border pb-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-df-md bg-df-accent-soft font-display text-2xl font-400 leading-none text-df-accent-bright"
          >
            {monogram}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-700 uppercase tracking-[0.22em] text-df-text-faint">
              {portal.brandLockup}
            </p>
            <h1 className="truncate font-display text-2xl font-400 uppercase leading-tight tracking-tight text-df-text sm:text-3xl">
              {displayName}
            </h1>
          </div>
        </div>

        {(hasMembership || hasCoaching) && (
          <div className="flex flex-wrap items-center gap-2">
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

      <nav
        aria-label={portal.brandLockup}
        className="sticky top-0 z-30 -mx-5 mt-px border-b border-df-border bg-df-bg/85 px-5 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <ul className="flex gap-1.5 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map(({ id, icon: Icon }) => {
            const isActive = activeId === id
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-df-sm border px-3.5 text-[12px] font-700 uppercase tracking-[0.14em] transition-colors duration-150 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg active:translate-y-px',
                    isActive
                      ? 'border-df-accent bg-df-accent-soft text-df-accent-bright'
                      : 'border-transparent text-df-text-muted hover:bg-df-surface-2 hover:text-df-text'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {portal.nav[id]}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
