import { useTokenColors } from '@deluxfit/ds'
import { ClickSpark } from '@/components/reactbits'

const SPARK_TOKENS = ['--df-accent-bright']

/**
 * Site-wide crimson spark burst on every click. Spans the document so the
 * effect reaches every page.
 *
 * The spark is painted to a canvas, which resolves no `var()` of its own, so
 * the accent has to be read off the token before it can be handed over.
 */
export default function ClickSparkLayer({ children }) {
  const [sparkColor] = useTokenColors(SPARK_TOKENS)

  if (!sparkColor) return <div className="min-h-dvh">{children}</div>

  return (
    <ClickSpark
      className="min-h-dvh"
      sparkColor={sparkColor}
      sparkCount={10}
      sparkRadius={18}
      sparkSize={11}
      duration={450}
    >
      {children}
    </ClickSpark>
  )
}
