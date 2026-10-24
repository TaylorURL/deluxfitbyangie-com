import { cn } from '@deluxfit/ds'
import { imageArrived, recoverImage } from '@/lib/images'

/**
 * A drawn plate: the site's own picture of a thing a photograph cannot show.
 *
 * A week of training and the arc of a block are structure, not scenery. A
 * photograph of a barbell says the subject is training; it does not say that
 * the week has four sessions and three rest days, or that the load backs off
 * before it climbs again. The plates live under `public/art` as flat vector
 * files in the brand's own palette and are reused wherever the page is talking
 * about the thing they draw.
 *
 * They carry no ground of their own, so the section decides what they sit on,
 * and the file's own title is the accessible name — `alt` is not restated here
 * because two descriptions of one drawing eventually disagree.
 *
 * A plate whose request dies asks again on the same terms as a photograph.
 * The drawing is the only thing on the page saying what the week is shaped
 * like, so an empty box where it goes leaves the section making a claim it no
 * longer shows.
 *
 * @param {object} props
 * @param {string} props.src - a file under /art
 * @param {string} props.alt - what the drawing shows
 */
export default function ArtPlate({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      width="320"
      height="176"
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={recoverImage}
      onLoad={imageArrived}
      className={cn('h-auto w-full select-none', className)}
    />
  )
}
