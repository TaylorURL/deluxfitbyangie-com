import { cn } from '@deluxfit/ds'
import { Link } from '@/router'

/**
 * The chip in the corner of a signed-in shell: sign out, back to the site, the
 * way into the console.
 *
 * The portal, the coach panel and the auth pages each wrote this control out
 * longhand — six copies of one forty-word class string, which is how three
 * screens of one application end up with three slightly different chrome
 * treatments. One height, one hover, one label register, one place to change
 * them.
 *
 * The label hides under `sm` and the icon carries the meaning there, so the
 * accessible name comes from `label` in both states: on a phone it is the only
 * name the control has.
 *
 * `native` renders a plain anchor rather than a routed link, for the door out
 * of a signed-in shell — a full document load is what drops the portal or the
 * console bundle instead of carrying it into the public site.
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon
 * @param {string} props.label - drawn from `sm` up, and the accessible name
 * @param {string} [props.href] - renders a link rather than a button
 * @param {boolean} [props.native] - a document load instead of a routed one
 * @param {'neutral'|'accent'} [props.tone]
 */
export default function ShellAction({
  icon: Icon,
  label,
  href,
  native,
  tone = 'neutral',
  className,
  ...props
}) {
  const Component = href ? (native ? 'a' : Link) : 'button'
  return (
    <Component
      aria-label={label}
      {...(href ? { href } : { type: 'button' })}
      className={cn(
        'group inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-df-sm border px-3 text-[11px] font-700 uppercase tracking-[0.14em] [touch-action:manipulation]',
        'transition-colors duration-df-fast ease-df-out active:bg-df-surface-3 sm:px-4',
        tone === 'accent'
          ? 'border-df-accent bg-df-accent-softer text-df-accent-bright hover:bg-df-accent-soft'
          : 'border-df-border-strong text-df-text-muted hover:border-df-border-hover hover:bg-df-surface-2 hover:text-df-text',
        className
      )}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
      <span className="hidden sm:inline">{label}</span>
    </Component>
  )
}
