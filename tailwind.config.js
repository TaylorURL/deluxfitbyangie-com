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
      // Drives the React Bits StarBorder component — twin radial sweeps that
      // travel along the top and bottom edges to trace an animated border.
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
