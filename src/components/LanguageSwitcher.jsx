import { cn } from '@deluxfit/ds'
import { useContent, useLanguage } from '@/i18n'

const SWITCHER_BASE =
  'group/lang inline-flex items-center rounded-df-sm border border-df-border-strong bg-df-surface/40 p-0.5 transition-colors duration-200 ease-df-out hover:border-df-border-hover'

const OPTION_BASE =
  'relative inline-flex items-center justify-center rounded-df-xs px-3 text-[11px] font-700 uppercase tracking-[0.22em] transition-colors duration-200 ease-df-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-df-bg'

/**
 * @param {object} props
 * @param {'sm'|'md'} [props.size='sm'] - control height
 * @param {boolean} [props.block=false] - stretch full width
 */
export default function LanguageSwitcher({ size = 'sm', block = false, className }) {
  const { locale, setLocale, locales } = useLanguage()
  const { language } = useContent()
  const heightClass = size === 'md' ? 'h-12' : 'h-10'
  const optionHeight = size === 'md' ? 'h-11' : 'h-9'

  const ariaFor = code =>
    code === 'es' ? language.switchToSpanish : language.switchToEnglish

  return (
    <div
      role="group"
      aria-label={language.label}
      className={cn(SWITCHER_BASE, heightClass, block && 'w-full', className)}
    >
      {Object.values(locales).map(entry => {
        const active = entry.code === locale
        return (
          <button
            key={entry.code}
            type="button"
            aria-pressed={active}
            aria-label={ariaFor(entry.code)}
            onClick={() => setLocale(entry.code)}
            className={cn(
              OPTION_BASE,
              optionHeight,
              block && 'flex-1',
              active
                ? 'bg-df-accent text-df-on-accent shadow-df-glow-soft'
                : 'text-df-text-muted hover:bg-df-surface-2 hover:text-df-text'
            )}
          >
            {entry.label}
          </button>
        )
      })}
    </div>
  )
}
