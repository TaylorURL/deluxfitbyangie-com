import { cn } from '@deluxfit/ds'
import { imageBox, imageSrcSet, recoverImage } from '@/lib/images'

const LOGO = '/deluxfit-logo.webp'

/**
 * The wordmark, wherever it appears: the site header, the footer, and the
 * header of each of the three shells behind a login.
 *
 * The file is black text with a red accent on transparent. Over a dark ground
 * the inversion pair turns it white and keeps the red; over a light one it is
 * left alone. Both states name the same filter function list, so a bar that
 * flips tone under a scrolling section interpolates between them instead of
 * cutting.
 *
 * @param {object} props
 * @param {string} props.alt - empty when a sibling already names the link
 * @param {boolean} [props.inverted] - true over a dark ground
 * @param {string} [props.className] - the height it renders at
 */
export default function BrandLogo({ alt, inverted = true, className }) {
  const box = imageBox(LOGO)
  return (
    <img
      src={LOGO}
      srcSet={imageSrcSet(LOGO)}
      sizes="10rem"
      width={box?.width}
      height={box?.height}
      alt={alt}
      draggable="false"
      onError={recoverImage}
      className={cn(
        'w-auto select-none object-contain',
        inverted ? '[filter:invert(1)_hue-rotate(180deg)]' : '[filter:invert(0)_hue-rotate(0deg)]',
        className
      )}
    />
  )
}
