import { Container, Reveal, Section, SplitHeading } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/sections/PageHero'
import ContactForm from '@/components/forms/ContactForm'
import SocialLinks from '@/components/layout/SocialLinks'
import { SpotlightCard } from '@/components/reactbits'

export default function Contact() {
  const { contact, footer } = useContent()

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        heading={contact.hero.heading}
        accent={contact.hero.accent}
        subhead={contact.hero.subhead}
      />

      <Section heading={contact.formHeading} accent={contact.formAccent}>
        <div
          className={
            footer.socials.length > 0
              ? 'grid gap-8 sm:gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16'
              : 'grid gap-8 sm:gap-12'
          }
        >
          <Reveal>
            <ContactForm />
          </Reveal>

          {footer.socials.length > 0 && (
            <Reveal delay={0.1}>
              <SpotlightCard spotlightColor="var(--df-accent-wash-soft)">
                <SplitHeading as="h3" size="card" text={contact.socialHeading} />
                <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
                  {contact.socialBody}
                </p>
                <div className="mt-6">
                  <SocialLinks />
                </div>
              </SpotlightCard>
            </Reveal>
          )}
        </div>
      </Section>

      <Container size="lg" className="pb-16 sm:pb-20">
        <div className="rounded-df-md bg-df-surface p-5 text-[13px] leading-relaxed text-df-text-muted shadow-df-sm sm:px-8 sm:py-7">
          {contact.directNote}
        </div>
      </Container>
    </>
  )
}
