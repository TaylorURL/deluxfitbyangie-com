import { Panel } from '@deluxfit/ds'
import { Link } from '@/router'

export default function AuthCard({ title, subtitle, children, footerLinks }) {
  return (
    <Panel>
      <h1 className="font-400 font-display text-[clamp(2rem,6vw,2.75rem)] uppercase leading-[0.95] tracking-tight text-df-text">
        {title}
        <span className="text-df-accent">.</span>
      </h1>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">{subtitle}</p>
      )}

      <div className="mt-7">{children}</div>

      {footerLinks && footerLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] font-600 uppercase tracking-[0.14em] text-df-text-muted transition-colors duration-df-fast ease-df-out hover:text-df-accent-bright"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </Panel>
  )
}
