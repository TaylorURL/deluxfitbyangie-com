import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * The preset exposes weights as numeric aliases (`font-400` … `font-700`), and
 * tailwind-merge has no way to know that: `font-<anything>` that is not one of
 * its built-in weight words is read as a font-family, so `font-400` cancels
 * `font-display` and drops every heading composed through `cn` to the body
 * face. Naming the aliases puts them in the weight group, where they belong.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-weight': [{ font: ['400', '500', '600', '700'] }],
    },
  },
})

/**
 * Tailwind-aware class composer. Concatenates strings/objects/arrays via clsx
 * and de-duplicates conflicting Tailwind utilities via twMerge so a
 * later-applied class always wins: `cn('p-2', 'p-4')` yields `'p-4'`.
 *
 * Use everywhere a component accepts a `className` prop that should layer on
 * top of internal defaults.
 *
 * @param {...any} inputs - clsx-compatible class values
 * @returns {string} merged, conflict-resolved class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
