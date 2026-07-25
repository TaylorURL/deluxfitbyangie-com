import { Container, Reveal, Section, SectionEyebrow } from '@deluxfit/ds'
import { useContent } from '@/i18n'
import PageHero from '@/components/PageHero'
import ContactForm from '@/components/forms/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import { ShinyText, SpotlightCard } from '@/components/reactbits'

export default function Contact() {
  const { contact } = useContent()

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        heading={contact.hero.heading}
        accent={contact.hero.accent}
        subhead={contact.hero.subhead}
      />

      <Section
        index="01"
        eyebrow="Send a message"
        heading="Tell Angie what you’d like to talk about."
        accent="talk about"
      >
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard
              spotlightColor="rgba(225,29,42,0.16)"
              className="!rounded-df-2xl !border-df-border !bg-df-surface !p-6 sm:!px-8 sm:!py-8"
            >
              <SectionEyebrow>
                <ShinyText text={contact.socialEyebrow} color="#c81a27" shineColor="#ff8b95" speed={4} />
              </SectionEyebrow>
              <h3 className="mt-4 font-display text-2xl font-400 uppercase tracking-[0.01em] text-df-text sm:mt-5">
                {contact.socialHeading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-df-text-muted">
                Angie posts coaching tips, workouts, and behind-the-scenes content across these
                channels.
              </p>
              <div className="mt-6">
                <SocialLinks />
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </Section>

      <Container size="lg" className="pb-16 sm:pb-20">
        <div className="rounded-df-2xl border border-df-border bg-df-surface p-5 text-xs leading-relaxed text-df-text-faint sm:px-8 sm:py-7">
          Looking to sign up, apply for coaching, or book a 1-on-1 session? The fastest path is
          directly through the matching service page — those forms route straight to Angie.
        </div>
      </Container>
    </>
  )
}
