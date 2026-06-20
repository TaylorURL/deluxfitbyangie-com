import { Card } from '@deluxfit/ds'

/**
 * PlaceholderPanel — the empty-state shell every stubbed admin page renders
 * while the real CRUD is still being built. A surface card with an eyebrow,
 * a short description, and an optional "what's coming" bullet list.
 */
export default function PlaceholderPanel({ eyebrow, description, comingSoon }) {
  return (
    <Card variant="elevated" padded>
      <p className="text-[10px] font-700 uppercase tracking-[0.28em] text-df-accent">{eyebrow}</p>
      <p className="mt-3 text-base leading-relaxed text-df-text-muted">{description}</p>
      {comingSoon && comingSoon.length > 0 && (
        <ul className="mt-6 grid gap-2 text-sm text-df-text-faint">
          {comingSoon.map(item => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 rounded-full bg-df-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
