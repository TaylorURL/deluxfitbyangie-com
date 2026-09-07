import { cn } from '@deluxfit/ds'
import { useContent, useLanguage } from '@/i18n'

const SWITCHER_BASE =
  'group/lang inline-flex items-center rounded-df-sm border border-df-border-strong bg-df-surface p-1 transition-colors duration-df-base ease-df-out hover:border-df-border-hover'

const OPTION_BASE =
  'relative inline-flex min-w-[44px] items-center justify-center rounded-df-xs px-3 text-[11px] font-700 uppercase tracking-[0.14em] transition-colors duration-df-fast ease-df-out'

/**
 * @param {object} props
 * @param {'sm'|'md'} [props.size='sm'] - control height
 * @param {boolean} [props.block=false] - stretch full width
 */
export default function LanguageSwitcher({ size = 'sm', block = false, className }) {
  const { locale, setLocale, locales } = useLanguage()
  const { language } = useContent()
  const heightClass = size === 'md' ? 'h-14' : 'h-12'
  const optionHeight = size === 'md' ? 'h-12' : 'h-11'

  const ariaFor = code => (code === 'es' ? language.switchToSpanish : language.switchToEnglish)

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
                ? 'bg-df-accent text-df-on-accent shadow-df-key-soft'
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
