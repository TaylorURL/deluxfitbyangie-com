import { Accordion, FaqItem, Reveal, Section } from '@deluxfit/ds'
import { faq } from '@/content/site'

/**
 * FAQ — the DS Accordion handling the prospect's remaining objections. Radix
 * supplies keyboard and ARIA wiring; content comes from site.js. Anchored at
 * #faq for the header nav and final CTA's secondary link.
 */
export default function Faq() {
  return (
    <Section id="faq" eyebrow={faq.eyebrow} heading={faq.heading} containerSize="md">
      <Reveal>
        <Accordion type="single" collapsible>
          {faq.items.map((item, index) => (
            <FaqItem
              key={item.question}
              value={`faq-${index}`}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Accordion>
      </Reveal>
    </Section>
  )
}
