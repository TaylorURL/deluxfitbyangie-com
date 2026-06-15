import { Card, Reveal, Section, StatBlock } from '@deluxfit/ds'
import { program } from '@/content/site'

/**
 * Program Breakdown — the three-phase 12-week method as a connected timeline,
 * followed by a StatBlock proof strip. Anchored at #program for the header nav.
 */
export default function Program() {
  return (
    <Section
      id="program"
      eyebrow={program.eyebrow}
      heading={program.heading}
      subhead={program.subhead}
    >
      <ol className="grid gap-5 lg:grid-cols-3">
        {program.phases.map((phase, index) => (
          <Reveal key={phase.title} delay={index * 0.08} as="li">
            <Card variant="surface" className="flex h-full flex-col">
              <span className="text-xs font-700 uppercase tracking-[0.18em] text-df-accent-bright">
                {phase.label}
              </span>
              <h3 className="mt-3 font-display text-2xl font-700 uppercase tracking-tight text-df-text">
                {phase.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-df-text-muted">
                {phase.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <div className="mt-12 grid grid-cols-2 gap-y-10 rounded-df-xl border border-df-border bg-df-surface px-6 py-10 sm:mt-16 lg:grid-cols-4">
          {program.stats.map(({ value, label }, index) => (
            <StatBlock key={label} value={value} label={label} accent={index % 2 === 1} />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
