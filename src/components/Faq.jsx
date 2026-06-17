import { Accordion, FaqItem, Reveal, Section } from '@deluxfit/ds'
import { useContent } from '@/i18n'

/**
 * FAQ — the DS Accordion as a numbered editorial list handling the prospect's
 * remaining objections. Radix supplies keyboard and ARIA wiring; content comes
 * from site.js. Anchored at #faq for the header nav and final CTA link.
 */
export default function Faq() {
  const { faq } = useContent()
  return (
    <Section
      id="faq"
      index="08"
      eyebrow={faq.eyebrow}
      heading={faq.heading}
      accent={faq.accent}
      containerSize="md"
    >
      <Reveal>
        <Accordion type="single" collapsible>
          {faq.items.map((item, index) => (
            <FaqItem
              key={item.question}
              value={`faq-${index}`}
              index={String(index + 1).padStart(2, '0')}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Accordion>
      </Reveal>
    </Section>
  )
}
