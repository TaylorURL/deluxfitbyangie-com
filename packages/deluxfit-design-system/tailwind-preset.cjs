/**
 * DeluxFit Design System, Tailwind preset.
 *
 * Add to any Tailwind config to get the `df-*` color utilities
 * (`bg-df-surface`, `text-df-text-muted`, `border-df-border-strong`, …), the
 * literal `red-*`/`brand-*` crimson scale, the Anton, Bodoni Moda and Inter
 * font stacks, the radius and shadow scales (including the signature red
 * glow), and the motion vocabulary.
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

/** Literal crimson scale, usable directly (e.g. `text-red-600`) and reused
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
          field: dfColor('field'),
          'field-hover': dfColor('field-hover'),
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
          'chart-grid': dfColor('chart-grid'),
          'chart-baseline': dfColor('chart-baseline'),
          'chart-cursor': dfColor('chart-cursor'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Anton', 'Oswald', 'system-ui', 'sans-serif'],
        accent: ['Bodoni Moda', 'Georgia', 'Times New Roman', 'serif'],
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
      /* Named apart from the colour utilities on purpose: `bg-df-accent` is
         the flat fill, `bg-df-accent-gradient` is the same red with a light on
         it, and a class that could mean either would mean neither. */
      backgroundImage: {
        'df-accent-gradient': 'var(--df-accent-gradient)',
        'df-accent-gradient-hover': 'var(--df-accent-gradient-hover)',
        'df-surface-gradient': 'var(--df-surface-gradient)',
        'df-surface-gradient-elevated': 'var(--df-surface-gradient-elevated)',
        'df-grid': 'var(--df-grid)',
      },
      boxShadow: {
        'df-sm': 'var(--df-shadow-sm)',
        'df-md': 'var(--df-shadow-md)',
        'df-lg': 'var(--df-shadow-lg)',
        'df-xl': 'var(--df-shadow-xl)',
        'df-glow-soft': 'var(--df-shadow-glow-soft)',
        'df-key': 'var(--df-key-lift)',
        'df-key-soft': 'var(--df-key-lift-soft)',
        'df-ring': 'var(--df-ring)',
        'df-accent': 'var(--df-shadow-accent)',
      },
      height: {
        'df-bar': 'var(--df-bar-height)',
        'df-tabbar': 'var(--df-tabbar-height)',
        'df-control-sm': 'var(--df-control-h-sm)',
        'df-control': 'var(--df-control-h-md)',
        'df-control-lg': 'var(--df-control-h-lg)',
      },
      minHeight: {
        'df-control-sm': 'var(--df-control-h-sm)',
        'df-control': 'var(--df-control-h-md)',
        'df-control-lg': 'var(--df-control-h-lg)',
      },
      maxWidth: {
        'df-measure': 'var(--df-measure)',
      },
      transitionDuration: {
        'df-fast': 'var(--df-duration-fast)',
        'df-base': 'var(--df-duration-base)',
        'df-slow': 'var(--df-duration-slow)',
      },
      transitionTimingFunction: {
        'df-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'df-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      zIndex: {
        scrim: '1050',
        sticky: '1100',
        overlay: '1200',
        modal: '1300',
      },
      keyframes: {
        'df-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        /* The placeholder sweep. It travels on transform alone, which is what
           keeps a screen of forty of them off the main thread. */
        'df-shimmer': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        /* The first screen's own arrival. It travels without ever being
           transparent, so the headline stays the paint the load is measured
           by, and it runs off the compositor rather than off a frame loop -
           which is what makes it arrive in a tab the browser has throttled. */
        'df-rise': {
          from: { transform: 'translateY(24px)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'df-marquee': 'df-marquee 28s linear infinite',
        'df-shimmer': 'df-shimmer 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'df-rise': 'df-rise 550ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
}
