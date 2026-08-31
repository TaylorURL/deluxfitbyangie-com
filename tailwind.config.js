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
        // Weights are written numerically across the app (`font-700`), which
        // Tailwind only accepts as a utility once the numbers are named here.
        500: '500',
        600: '600',
        700: '700',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
