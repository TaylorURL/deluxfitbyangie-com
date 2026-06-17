import { useContent } from '@/i18n'

/**
 * TikTokGlyph — lucide ships no TikTok icon, so this inline SVG stands in
 * with the same sizing/stroke contract as the surrounding social icons.
 */
function TikTokGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.05a6.25 6.25 0 1 1-6.25-6.25c.26 0 .51.02.76.05v3.1a3.2 3.2 0 1 0 2.24 3.05V3h3.25Z" />
    </svg>
  )
}

/**
 * SocialLinks — the canonical row of social channels. Used in the contact
 * page sidebar and the footer.
 */
export default function SocialLinks({ size = 'md' }) {
  const { footer } = useContent()
  const buttonSize = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {footer.socials.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`flex ${buttonSize} items-center justify-center rounded-df-full border border-df-border text-df-text-muted transition-colors hover:border-df-accent hover:text-df-accent-bright`}
          >
            {Icon === 'tiktok' ? (
              <TikTokGlyph className={iconSize} />
            ) : (
              <Icon className={iconSize} aria-hidden="true" />
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}
