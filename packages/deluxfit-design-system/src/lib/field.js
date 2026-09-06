/**
 * The one description of what a field looks like, so input, select, textarea
 * and every control built out of them share a surface, a height, a corner and
 * a focus signature rather than converging on one by accident.
 *
 * Two decisions are load-bearing:
 *
 * The ground. A field takes `--df-field`, which is a step away from the panel
 * behind it in every theme. A field the same colour as its panel is a label
 * with a border, and readers stop reading it as somewhere to type.
 *
 * The text size. 16px everywhere, including the dense sizes. Below it, iOS
 * zooms the whole page when the field takes focus and leaves the reader
 * zoomed in with the rest of the screen off the side.
 */
export const FIELD_SURFACE = [
  'w-full rounded-df-sm border bg-df-field text-[16px] text-df-text',
  'placeholder:text-df-text-muted',
  'transition-[background-color,border-color,box-shadow] duration-df-fast ease-df-out',
  'disabled:cursor-not-allowed disabled:bg-df-surface-2 disabled:text-df-text-faint',
].join(' ')

/** Resting and hover edges, and the edge an invalid field keeps instead. */
export const FIELD_EDGE = {
  true: 'border-df-danger',
  false: 'border-df-border-input hover:border-df-border-hover hover:bg-df-field-hover',
}

/** Heights, from the control-height tokens so a field and the key beside it
 *  line up without either being tuned to the other. */
export const FIELD_HEIGHT = {
  sm: 'h-df-control-sm',
  md: 'h-df-control',
  lg: 'h-df-control-lg',
}
