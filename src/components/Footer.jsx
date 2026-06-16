import { Container } from '@deluxfit/ds'
import { brand, footer, nav } from '@/content/site'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * TikTokGlyph — lucide ships no TikTok icon, so this inline SVG stands in with
 * the same sizing/stroke contract as the lucide social icons beside it.
 */
function TikTokGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.05a6.25 6.25 0 1 1-6.25-6.25c.26 0 .51.02.76.05v3.1a3.2 3.2 0 1 0 2.24 3.05V3h3.25Z" />
    </svg>
  )
}

/**
 * Footer — closing navigation, social links (Instagram + TikTok), a ghosted
 * oversized wordmark as a final type-specimen flourish, and the legal
 * disclaimer. Social icons resolve from site content: a lucide component when
 * supplied, or the inline TikTok glyph for the 'tiktok' marker.
 */
export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-df-border bg-df-bg pt-16">
      <Container size="xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <a
              href="#top"
              className="font-display text-2xl font-400 uppercase tracking-tight text-df-text"
            >
              {brand.name}
              <span className="text-df-accent-bright">.</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-df-text-muted">{footer.blurb}</p>

            <ul className="mt-6 flex items-center gap-3">
              {footer.socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-df-full border border-df-border text-df-text-muted transition-colors hover:border-df-accent hover:text-df-accent-bright"
                  >
                    {Icon === 'tiktok' ? (
                      <TikTokGlyph className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-500 text-df-text-muted transition-colors hover:text-df-text"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="mt-14 select-none font-display text-[clamp(2.5rem,20vw,13rem)] font-400 uppercase leading-[0.78] tracking-tight text-df-surface-3"
        >
          {brand.name}
          <span className="text-df-accent-deep">.</span>
        </div>

        <div className="flex flex-col gap-4 border-t border-df-border py-8">
          <p className="max-w-3xl text-xs leading-relaxed text-df-text-faint">{footer.smallPrint}</p>
          <p className="text-xs text-df-text-faint">
            © {CURRENT_YEAR} {brand.fullName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
