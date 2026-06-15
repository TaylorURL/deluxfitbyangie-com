export default {
  presets: [require('./packages/deluxfit-design-system/tailwind-preset.cjs')],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './packages/deluxfit-design-system/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      fontWeight: {
        // Numeric aliases used throughout the DS components (Oswald exposes a
        // continuous weight axis; these keep class names self-documenting).
        500: '500',
        600: '600',
        700: '700',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
