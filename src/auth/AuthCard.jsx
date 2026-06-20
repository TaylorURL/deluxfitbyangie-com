import { Link } from '@/router'

/**
 * AuthCard — the surface shared by every auth page. A glass card with a big
 * display title (with the signature red dot), an optional subtitle, the form
 * slot, and an optional footer link row underneath.
 */
export default function AuthCard({ title, subtitle, children, footerLinks }) {
  return (
    <div className="rounded-df-2xl border border-df-border bg-df-surface/85 p-8 shadow-df-xl backdrop-blur-xl sm:p-10">
      <h1 className="font-display text-[clamp(2rem,6vw,2.75rem)] font-400 uppercase leading-[0.95] tracking-tight text-df-text">
        {title}
        <span className="text-df-accent">.</span>
      </h1>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-df-text-muted">{subtitle}</p>
      )}

      <div className="mt-7">{children}</div>

      {footerLinks && footerLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-600 uppercase tracking-[0.16em] text-df-text-muted transition-colors hover:text-df-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
