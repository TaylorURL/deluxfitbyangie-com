import { Reveal, Section, StatBlock } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * Program Breakdown — the three-phase 12-week method as a numeral-led timeline,
 * closed by a strip of hero-scale stats that act as the section's graphic
 * anchor. Anchored at #program for the header nav.
 */
export default function Program() {
  return (
    <Section
      id="program"
      index="03"
      eyebrow={program.eyebrow}
      heading={program.heading}
      accent={program.accent}
      subhead={program.subhead}
    >
      <ol className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
        {program.phases.map((phase, index) => (
          <Reveal key={phase.title} delay={index * 0.08} as="li">
            <div className="flex h-full flex-col border-t-2 border-df-accent pt-6">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(3rem,7vw,5rem)] font-400 leading-[0.8] tabular-nums text-df-text"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mt-5 text-[11px] font-700 uppercase tracking-[0.2em] text-df-accent-bright">
                {phase.label}
              </span>
              <h3 className="mt-3 font-display text-3xl font-400 uppercase tracking-[0.01em] text-df-text">
                {phase.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-df-text-muted">
                {phase.description}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <div className="mt-20 grid grid-cols-2 gap-x-10 gap-y-12 border-t border-df-border pt-12 lg:grid-cols-4">
          {program.stats.map(({ value, label }, index) => (
            <StatBlock
              key={label}
              value={value}
              label={label}
              size="giant"
              align="left"
              accent={index % 2 === 1}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
