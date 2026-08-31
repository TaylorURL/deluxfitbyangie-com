import { useEffect, useState } from 'react'

/**
 * Resolves `--df-*` custom properties to the values the browser computed for
 * them.
 *
 * Canvas and WebGL parse colour strings themselves and understand no `var()`,
 * so a surface painted outside the DOM cannot reference a token the way a
 * stylesheet does. The read happens after mount, once the stylesheet that
 * defines the tokens has certainly been applied; until then the returned list
 * is empty, which callers use as the signal that there is nothing to paint
 * yet.
 *
 * @param {string[]} names - custom property names, including the leading `--`
 * @returns {string[]} resolved values, in the order asked for
 */
export function useTokenColors(names) {
  const key = names.join(' ')
  const [colors, setColors] = useState([])

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    setColors(key.split(' ').map(name => styles.getPropertyValue(name).trim()))
  }, [key])

  return colors
}

/**
 * Converts a `#rgb` or `#rrggbb` colour to the three 0..1 channel floats a
 * shader uniform takes.
 *
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToUnitRgb(hex) {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map(char => char + char)
          .join('')
      : value
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return [0, 0, 0]
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}
