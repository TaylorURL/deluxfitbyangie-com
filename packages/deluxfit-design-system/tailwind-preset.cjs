/**
 * DeluxFit Design System — Tailwind preset.
 *
 * Add to any Tailwind config to get the `df-*` color utilities
 * (`bg-df-surface`, `text-df-text-muted`, `border-df-border-strong`, …), the
 * literal `red-*`/`brand-*` crimson scale, the Oswald/Inter font stacks, the
 * radius/shadow scales (including the signature red glow), and the motion
 * vocabulary.
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('@deluxfit/ds/tailwind-preset.cjs')],
 *     content: [
 *       './src/**\/*.{js,jsx}',
 *       './packages/deluxfit-design-system/**\/*.{js,jsx}',
 *     ],
 *   }
 *
 * Semantic colors reference CSS variables defined in `src/styles/tokens.css`.
 * Because the value is a `var()`, Tailwind's `/opacity` modifier is unavailable
 * on those — use the dedicated `*-soft` / `*-softer` tokens for translucency.
 */

const dfColor = name => `var(--df-${name})`

/** Literal crimson scale — usable directly (e.g. `text-red-600`) and reused
 *  for both the `red` and `brand` keys so either name resolves to the brand. */
const crimsonScale = {
  50: '#fff1f2',
  100: '#ffdfe1',
  200: '#ffc4c8',
  300: '#ff9aa2',
  400: '#fb5663',
  500: '#f01f2d',
  600: '#e11d2a',
  700: '#bd1521',
  800: '#9c141e',
  900: '#81151d',
  950: '#47070c',
}

module.exports = {
  theme: {
    extend: {
      colors: {
        red: crimsonScale,
        brand: crimsonScale,
        df: {
          bg: dfColor('bg'),
          'bg-elevated': dfColor('bg-elevated'),
          surface: dfColor('surface'),
          'surface-2': dfColor('surface-2'),
          'surface-3': dfColor('surface-3'),
          border: dfColor('border'),
          'border-strong': dfColor('border-strong'),
          'border-input': dfColor('border-input'),
          'border-hover': dfColor('border-hover'),
          text: dfColor('text'),
          'text-muted': dfColor('text-muted'),
          'text-faint': dfColor('text-faint'),
          accent: dfColor('accent'),
          'accent-bright': dfColor('accent-bright'),
          'accent-deep': dfColor('accent-deep'),
          'accent-soft': dfColor('accent-soft'),
          'accent-softer': dfColor('accent-softer'),
          'on-accent': dfColor('on-accent'),
          positive: dfColor('positive'),
          'positive-soft': dfColor('positive-soft'),
          warning: dfColor('warning'),
          'warning-soft': dfColor('warning-soft'),
          danger: dfColor('danger'),
          'danger-soft': dfColor('danger-soft'),
          overlay: dfColor('overlay'),
          'glass-fill': dfColor('glass-fill'),
          'glass-border': dfColor('glass-border'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Oswald', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        df: 'var(--df-radius-md)',
        'df-xs': 'var(--df-radius-xs)',
        'df-sm': 'var(--df-radius-sm)',
        'df-md': 'var(--df-radius-md)',
        'df-lg': 'var(--df-radius-lg)',
        'df-xl': 'var(--df-radius-xl)',
        'df-2xl': 'var(--df-radius-2xl)',
        'df-full': 'var(--df-radius-full)',
      },
      boxShadow: {
        'df-sm': 'var(--df-shadow-sm)',
        'df-md': 'var(--df-shadow-md)',
        'df-lg': 'var(--df-shadow-lg)',
        'df-xl': 'var(--df-shadow-xl)',
        'df-glow': 'var(--df-shadow-glow)',
        'df-glow-soft': 'var(--df-shadow-glow-soft)',
      },
      transitionTimingFunction: {
        'df-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'df-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'df-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        sticky: '1100',
        overlay: '1200',
        modal: '1300',
      },
      keyframes: {
        'df-fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'df-pop-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'df-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'df-glow-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'df-fade-up': 'df-fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'df-pop-in': 'df-pop-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'df-marquee': 'df-marquee 28s linear infinite',
        'df-glow-pulse': 'df-glow-pulse 3.2s ease-in-out infinite',
      },
    },
  },
}
