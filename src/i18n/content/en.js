/*
 * English content tree for the site. The prices and service names here are the
 * business's own copy, not display formatting to be tidied:
 *
 *   1. Delux Fit Membership          - $14.99 / month, general (not personalized)
 *   2. Personalized Online Coaching  - $150 / month
 *   3. Single Live Training Session  - $75, one 45-60 min trial session
 *   4. Live Online Personal Training - $50 / session, ongoing program over Zoom
 *
 * Services 3 and 4 are separate products and are deliberately not merged: 3 is
 * the one-off trial, 4 is the ongoing program. `./es.js` mirrors this tree, and
 * a key that exists here but not there renders as a blank on the Spanish site.
 */

import {
  Dumbbell,
  Apple,
  CalendarCheck,
  ClipboardCheck,
  LineChart,
  PlayCircle,
  Video,
  Sparkles,
  ShieldCheck,
  Users,
  Library,
  Home,
  HandHeart,
  GraduationCap,
  HeartPulse,
  MessageSquare,
  Repeat,
  Zap,
  Target,
} from 'lucide-react'

/*
 * Every page that surfaces a service reads from this one object, so prices,
 * names and inclusions stay in lockstep. The values are copy rather than
 * placeholders: paraphrasing them changes what the site advertises.
 */
const services = {
  membership: {
    id: 'membership',
    slug: 'membership',
    href: '/membership',
    eyebrow: 'Service 01',
    name: 'Delux Fit Membership',
    tagline: 'General fitness content for everyone, on your time.',
    price: '$14.99',
    period: '/ month',
    summary:
      'Entry-level membership with access to general, non-personalized fitness content and educational resources designed for the public.',
    notPersonalizedNote: 'This content is general and NOT personalized.',
    bestFor:
      'Best for individuals who want affordable access to workout programs and fitness education, without personalized coaching.',
    includes: [
      'Workout programs',
      'Exercise library',
      'Training videos',
      'Fitness education',
      'General nutrition guide',
      'Fat loss programs',
      'Muscle building programs',
      'Core and ab routines',
      'New content added regularly',
    ],
    ctaLabel: 'Sign Up',
    ctaHref: '/membership#sign-up',
    cardCta: 'Sign Up',
  },
  coaching: {
    id: 'coaching',
    slug: 'online-coaching',
    href: '/online-coaching',
    eyebrow: 'Service 02',
    name: 'Personalized Online Coaching',
    tagline: 'A program built around your goals and fitness level.',
    price: '$150',
    period: '/ month',
    summary:
      'Customized coaching built around your goals and fitness level, with direct messaging to Angie through the platform.',
    bestFor:
      'Best for clients who want a structured, personalized program and professional guidance without live training sessions.',
    includes: [
      'Initial consultation',
      'Personalized workout plan',
      'Customized training schedule',
      'Monthly progress review',
      'Monthly check-in',
      'Progress tracking',
      'Direct messaging through the platform',
      'Basic nutrition guidance',
      'Personalized recommendations',
    ],
    communicationNote:
      'All communication happens inside the Delux Fit platform, there is no personal phone access. Response time is up to 72 business hours.',
    responseTime: 'Response time: up to 72 business hours',
    ctaLabel: 'Apply Now',
    ctaHref: '/online-coaching#apply',
    cardCta: 'Apply Now',
  },
  singleSession: {
    id: 'single-session',
    slug: 'single-session',
    href: '/single-session',
    eyebrow: 'Service 03',
    name: 'Single Live Training Session',
    tagline: 'A one-time private live session with Angie.',
    price: '$75',
    period: '/ session',
    sessionLength: '45-60 minutes',
    summary:
      'A one-time private live virtual session with Angie, perfect for trying Delux Fit before committing.',
    perfectFor: [
      'Trying Delux Fit before committing',
      'Learning proper technique',
      'Form correction',
      'Motivation',
      'Q&A',
      'A personalized workout experience',
    ],
    ctaLabel: 'Book a Session',
    ctaHref: '/single-session#book',
    cardCta: 'Book a Session',
  },
  liveProgram: {
    id: 'live-program',
    slug: 'training',
    href: '/training',
    eyebrow: 'Service 04',
    name: 'Live Online Personal Training Program',
    tagline: 'Ongoing live personal training, the closest thing to in-person.',
    price: '$50',
    period: '/ session',
    summary:
      'Ongoing live personal training over Zoom with Angie present for the entire session, the closest experience to in-person training.',
    recommendation: 'Recommended minimum 3 sessions per week.',
    recommendationExample: 'Example: 3 sessions/week = $150/week.',
    includes: [
      'Live coaching',
      'Real-time corrections',
      'Accountability',
      'Exercise guidance',
      'Personalized workout structure',
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/training#book',
    cardCta: 'Book Sessions',
  },
}

const en = {
  meta: {
    title: 'DeluxFit by Angie: Online Fitness Coaching, Memberships and Live Training',
    description:
      'DeluxFit by Angie offers a $14.99/month fitness membership, $150/month personalized online coaching, $75 single live training sessions, and a $50/session live online personal training program with certified personal trainer Angie.',
  },

  /*
   * Per-route head copy. Every route names its own title and description so no
   * two results read the same, and the router falls back to `meta` for anything
   * not listed. Titles run 30-60 characters and descriptions 120-160, which is
   * what a search result renders before it truncates.
   */
  routes: {
    '/': {
      title: 'DeluxFit by Angie: Online Fitness Coaching',
      description:
        'Memberships, personalized online coaching, and live one-on-one training with certified personal trainer Angie. Discipline over excuses.',
      breadcrumb: 'Home',
    },
    '/about': {
      title: 'About Angie: Certified Personal Trainer',
      description:
        'Meet Angie: a certified personal trainer who builds every program around the person. Her story, her credentials, and how she coaches.',
      breadcrumb: 'About',
    },
    '/membership': {
      title: 'Delux Fit Membership: $14.99 a Month',
      description:
        'Workout programs, an exercise library, training videos, and fitness education for $14.99 a month. General content, no coaching required.',
      breadcrumb: 'Membership',
    },
    '/online-coaching': {
      title: 'Personalized Online Coaching: $150 a Month',
      description:
        'A workout plan, a training schedule, and monthly progress reviews built around your goals, with direct messaging to Angie, for $150 a month.',
      breadcrumb: 'Online Coaching',
    },
    '/single-session': {
      title: 'Single Live Training Session: $75',
      description:
        'One private 45 to 60 minute live session with Angie over video. Learn technique, fix your form, and try Delux Fit before you commit.',
      breadcrumb: 'Single Session',
    },
    '/training': {
      title: 'Live Online Personal Training: $50 a Session',
      description:
        'Ongoing live personal training over Zoom with Angie coaching every rep, at $50 a session. The closest thing to training with her in person.',
      breadcrumb: 'Live Training',
    },
    '/testimonials': {
      title: 'Client Stories and Transformations',
      description:
        'Success stories, reviews, and before and after photos from the people who finished a DeluxFit program, in their own words and with permission.',
      breadcrumb: 'Testimonials',
    },
    '/contact': {
      title: 'Contact Angie',
      description:
        'Questions about the membership, online coaching, or live training? Send Angie a message and she will get back to you by email personally.',
      breadcrumb: 'Contact',
    },
    '/privacy': {
      title: 'Privacy Policy',
      description:
        'What DeluxFit by Angie collects, what it is used for, who else holds it, how long it is kept, and how to have it deleted.',
      breadcrumb: 'Privacy',
    },
    '/terms': {
      title: 'Terms of Service',
      description:
        'Billing, cancellation, rescheduling, refunds, and health terms for a DeluxFit membership, coaching, or a live training session.',
      breadcrumb: 'Terms',
    },
    notFound: {
      title: 'Page Not Found',
      description:
        'This page does not exist. Head back to the programs to find the membership, personalized online coaching, or live training with Angie.',
      breadcrumb: 'Not Found',
    },
  },

  brand: {
    name: 'DELUXFIT',
    fullName: 'DeluxFit by Angie',
    slogan: 'DISCIPLINE OVER EXCUSES',
    tagline: 'Discipline. Accountability. Education. Personalized coaching.',
    mission:
      'Delux Fit helps clients achieve their fitness goals through discipline, accountability, education, and personalized coaching.',
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Membership', href: '/membership' },
    { label: 'Online Coaching', href: '/online-coaching' },
    { label: 'Live Training', href: '/training' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '/contact' },
  ],

  header: {
    primaryCta: 'Apply Now',
    primaryCtaHref: '/online-coaching#apply',
    clientLogin: 'Client Login',
    clientLoginAria: 'Client Login Portal',
    admin: 'Admin',
    adminAria: 'Open the admin console',
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu',
    primaryNavLabel: 'Primary',
    mobileNavLabel: 'Mobile',
    mobileDialogLabel: 'Mobile Navigation',
  },

  a11y: {
    skipToContent: 'Skip to Content',
  },

  language: {
    label: 'Language',
    english: 'English',
    spanish: 'Spanish',
    switchToEnglish: 'Switch to English',
    switchToSpanish: 'Switch to Spanish',
  },

  services,

  home: {
    hero: {
      badge: 'Now coaching new online clients',
      slogan: 'DISCIPLINE OVER EXCUSES',
      headline: ['Discipline over', 'excuses.'],
      subhead:
        'Memberships, personalized online coaching, and live 1-on-1 training with certified personal trainer Angie.',
      primaryCta: 'See the Programs',
      primaryCtaHref: '#programs',
      secondaryCta: 'Apply for Coaching',
      secondaryCtaHref: '/online-coaching#apply',
      trust: {
        pillarValue: '1:1',
        pillarLabel: 'personalized coaching',
        tagline: 'Membership · Coaching · Live Training',
      },
      imageAlt: 'Angie mid-squat at a Smith machine, shot from behind',
    },

    intro: {
      eyebrow: 'Meet Angie',
      heading: 'A coach who builds the program around the person, not the other way around.',
      accent: 'around the person',
      body: [
        'I’m Angie, a certified personal trainer helping people get stronger, more confident, and more consistent through discipline, accountability, education, and coaching that actually fits their life.',
        'Whether you want general membership content, a fully personalized program, or live sessions on video with me, every option below is delivered directly by me, no templates, no resold programs, no guesswork.',
      ],
      ctaLabel: 'Read My Story',
      ctaHref: '/about',
      imageAlt: 'Angie coaching a client through a leg-press set',
    },

    servicesSection: {
      eyebrow: 'Choose how we work together',
      heading: 'Four ways to train with DeluxFit by Angie.',
      accent: 'Four ways',
      subhead:
        'A general membership, personalized online coaching, a single live session, or an ongoing live training program, pick the level of support that fits where you are right now.',
    },

    transformationCallout: {
      eyebrow: 'What it’s built on',
      heading: 'Discipline, accountability, education, built for real life.',
      accent: 'real life',
      body: 'Every DeluxFit program rests on the same three things, whichever level of support you pick.',
      pillars: [
        {
          icon: Dumbbell,
          title: 'Real Training',
          description:
            'Programming designed around your goals (fat loss, muscle gain, strength, or general fitness), not a one-size-fits-all template.',
        },
        {
          icon: HeartPulse,
          title: 'Real Guidance',
          description:
            'Basic nutrition guidance, fitness education, and form-focused coaching so the work you put in actually moves you forward.',
        },
        {
          icon: HandHeart,
          title: 'Real Accountability',
          description:
            'Direct access to me through the platform, monthly check-ins on coaching, live coaching on training sessions, no excuses.',
        },
      ],
      ctaLabel: 'See Client Stories',
      ctaHref: '/testimonials',
    },

    closing: {
      eyebrow: 'Ready to start?',
      heading: 'Pick the program that fits where you are.',
      accent: 'fits where you are',
      subhead:
        'Sign up for the membership, apply for personalized coaching, or book a live training session, and we’ll go from there.',
      primaryCta: 'Apply for Coaching',
      primaryCtaHref: '/online-coaching#apply',
      secondaryCta: 'Book a Session',
      secondaryCtaHref: '/single-session#book',
    },
  },

  about: {
    hero: {
      eyebrow: 'About Angie',
      heading:
        'Hi, I’m Angie, and I built DeluxFit to coach people the way I always wanted to be coached.',
      accent: 'coach people the way I always wanted to be coached',
      tagline: 'Certified Personal Trainer · Online & Live',
      imageAlt: 'Angie coaching a client through a leg-press set',
    },
    mission: {
      eyebrow: 'The mission',
      heading: 'Discipline over excuses.',
      accent: 'over excuses',
      body: 'Delux Fit helps clients achieve their fitness goals through discipline, accountability, education, and personalized coaching.',
    },
    story: {
      eyebrow: 'My story',
      heading: 'Training changed more than my body.',
      accent: 'more than my body',
      paragraphs: [
        'Fitness came into my life because I wanted to make a real change in myself, both physically and mentally. Very quickly, it became much more than that.',
        'At the time, I was going through one of the most difficult periods of my life. My youngest son was born with special medical conditions, and around the same time I received the news that my father had cancer.',
        'Training became the small part of my day I could dedicate completely to myself. It gave me a space to disconnect from the stress, the fear, and the responsibilities of everyday life and focus on becoming stronger, not only physically, but mentally and emotionally.',
        'Through fitness, I discovered what I was capable of when I practiced discipline, consistency, and commitment. I fell in love with the process because training was not simply changing my body; it was changing the way I faced the difficult moments in my life. That experience is a big part of why I became a coach.',
        'Today, I want other women to understand that fitness can be about so much more than looking good. It can become a space to take care of yourself, regain confidence, build discipline, feel stronger, and discover what you are capable of.',
        'My goal is to help women create physical changes they are proud of while also developing strength and confidence that carry into every other area of their lives.',
      ],
    },
    credentials: {
      eyebrow: 'Certifications & experience',
      heading: 'Trained to coach, certified to lead.',
      accent: 'certified to lead',
      items: [
        'Certified Personal Trainer',
        'Continuing education in strength and conditioning',
        'Years of experience coaching online and in person',
        'Experience programming for fat loss, muscle gain, strength, and general fitness',
      ],
    },
    philosophy: {
      eyebrow: 'Coaching philosophy',
      heading: 'Personalized, professional, sustainable.',
      accent: 'sustainable',
      pillars: [
        {
          icon: ClipboardCheck,
          title: 'Built for you',
          description:
            'Every personalized program is shaped around your goals, fitness level, lifestyle, and experience, never a generic plan lifted off a shelf.',
        },
        {
          icon: GraduationCap,
          title: 'Coaching, not guesswork',
          description:
            'You get the training plan AND the explanation, why the lifts, why the structure, why the progression. The goal is to leave you smarter and more independent every month.',
        },
        {
          icon: HandHeart,
          title: 'Honest, sustainable progress',
          description:
            'No crash promises, no meal plans, no unrealistic check-in cadence. Basic nutrition guidance, real training, and a structure you can actually maintain.',
        },
      ],
    },
    cta: {
      heading: 'Ready to train together?',
      accent: 'train together',
      subhead:
        'Browse the membership, apply for personalized coaching, or book a live online session.',
      primary: { label: 'See the Programs', href: '/#programs' },
      secondary: { label: 'Contact Angie', href: '/contact' },
    },
  },

  /* MEMBERSHIP — Service 01 · $14.99 / month */
  membership: {
    hero: {
      eyebrow: 'Service 01 · Delux Fit Membership',
      heading: 'General fitness content, built for self-guided training.',
      accent: 'self-guided training',
      subhead:
        'For $14.99 a month you get access to general (non-personalized) fitness content and educational resources designed for the public, workout programs, an exercise library, training videos, and more.',
      primaryCta: 'Sign Up for $14.99 a Month',
      primaryCtaHref: '#sign-up',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    notPersonalizedCallout:
      'This is an entry-level membership. The content is GENERAL and NOT personalized. For a program built around your goals, see Personalized Online Coaching.',
    includesEyebrow: 'What’s included',
    includesHeading: 'Everything you need to train consistently.',
    includesAccent: 'train consistently',
    includes: [
      {
        icon: Library,
        title: 'Workout programs',
        description:
          'A growing catalog of general training programs you can follow at your own pace.',
      },
      {
        icon: Dumbbell,
        title: 'Exercise library',
        description:
          'A reference library of movements so you always know what you’re doing and why.',
      },
      {
        icon: PlayCircle,
        title: 'Training videos',
        description:
          'Video demonstrations for every movement so the form is clear before you start.',
      },
      {
        icon: GraduationCap,
        title: 'Fitness education',
        description:
          'Short, practical lessons that explain the why behind the training, not just the what.',
      },
      {
        icon: Apple,
        title: 'General nutrition guide',
        description:
          'A general nutrition guide to help you build sustainable habits alongside your training.',
      },
      {
        icon: Zap,
        title: 'Fat loss programs',
        description: 'Structured fat-loss training you can start right away.',
      },
      {
        icon: HeartPulse,
        title: 'Muscle building programs',
        description: 'Hypertrophy-focused programs to build size and strength over time.',
      },
      {
        icon: Target,
        title: 'Core and ab routines',
        description: 'Focused core and ab routines to round out your training.',
      },
      {
        icon: Sparkles,
        title: 'New content added regularly',
        description: 'The library grows over time so your training stays fresh as you progress.',
      },
    ],
    bestFor: {
      eyebrow: 'Who it’s for',
      heading: 'Who is the Delux Fit membership for?',
      accent: 'membership for?',
      body: 'If you’re self-motivated and want a structured library to train from, the membership is the most affordable way to train with DeluxFit. For a personalized program built around your goals, see Online Coaching. For live, real-time sessions with Angie, see the Single Session or the Live Online Personal Training Program.',
    },
    signupSection: {
      id: 'sign-up',
      eyebrow: 'Sign up',
      heading: 'Start the membership at $14.99 a month.',
      accent: '$14.99 / month',
      body: 'Sign up below to start your $14.99/month membership and unlock the general content library. Cancel anytime.',
    },
  },

  /* ONLINE COACHING — Service 02 · $150 / month */
  coaching: {
    hero: {
      eyebrow: 'Service 02 · Personalized Online Coaching',
      heading: 'Personalized online coaching, designed around you.',
      accent: 'designed around you',
      subhead:
        'For $150 a month you get customized coaching built around your goals and fitness level, a personalized plan, monthly reviews, progress tracking, and direct messaging with Angie through the platform.',
      primaryCta: 'Apply Now',
      primaryCtaHref: '#apply',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'What’s included',
    includesHeading: 'Everything you need, built around you, adjusted as you progress.',
    includesAccent: 'adjusted as you progress',
    includes: [
      {
        icon: ClipboardCheck,
        title: 'Initial consultation',
        description:
          'We start with a consultation to understand your goals, training history, schedule, and any limitations.',
      },
      {
        icon: Dumbbell,
        title: 'Personalized workout plan',
        description:
          'A program designed specifically for you, never a template, built around your goals and fitness level.',
      },
      {
        icon: CalendarCheck,
        title: 'Customized training schedule',
        description: 'A training schedule structured around your week and your availability.',
      },
      {
        icon: LineChart,
        title: 'Monthly progress review',
        description:
          'Each month we review your progress together to see what’s working and what to adjust.',
      },
      {
        icon: Video,
        title: 'Monthly check-in',
        description:
          'One scheduled check-in per month to review training, ask questions, and refine the plan.',
      },
      {
        icon: Target,
        title: 'Progress tracking',
        description:
          'Track your progress inside the platform so every adjustment is based on real data.',
      },
      {
        icon: MessageSquare,
        title: 'Direct messaging through the platform',
        description:
          'Message Angie directly inside Delux Fit, the only channel for coaching communication.',
      },
      {
        icon: Apple,
        title: 'Basic nutrition guidance',
        description:
          'General, sustainable nutrition guidance to support your training, no meal plans.',
      },
      {
        icon: Sparkles,
        title: 'Personalized recommendations',
        description:
          'Recommendations tailored to your goals, your progress, and where you are in the program.',
      },
    ],
    communication: {
      eyebrow: 'How we communicate',
      heading: 'All communication happens inside the Delux Fit platform.',
      accent: 'inside the Delux Fit platform',
      body: 'There is no personal phone access. You message Angie directly through the platform, and she responds within up to 72 business hours.',
      points: [
        'All communication happens inside the Delux Fit platform',
        'No personal phone access',
        'Response time: up to 72 business hours',
      ],
    },
    bestFor: {
      eyebrow: 'Who it’s for',
      heading: 'Who is online coaching for?',
      accent: 'online coaching for?',
      body: 'If you want a program built specifically for you that you can follow on your own time, with monthly coaching from Angie, Online Coaching is the fit. If you also want live, real-time coaching, add a Single Session or the Live Online Personal Training Program.',
    },
    applicationSection: {
      id: 'apply',
      eyebrow: 'Apply for coaching',
      heading: 'Tell Angie about your goals.',
      accent: 'your goals',
      body: 'Fill out the application below. Angie reviews every application personally and follows up with next steps for onboarding before any payment is taken.',
    },
    application: {
      submitLabel: 'Submit Application',
      submittingLabel: 'Submitting…',
      successHeading: 'Application received.',
      successBody:
        'Thanks for applying. Angie will review your application personally and follow up by email with next steps.',
      errorBody:
        'Something went wrong submitting your application. Please try again, or email Angie directly from the Contact page.',
      fields: {
        name: { label: 'Full Name', placeholder: 'Your name', required: true },
        email: { label: 'Email', placeholder: 'you@example.com', required: true },
        phone: { label: 'Phone (Optional)', placeholder: '(555) 555-5555' },
        age: { label: 'Age', placeholder: '30', required: true },
        location: { label: 'City / Location', placeholder: 'City, State' },
        goal: {
          label: 'Primary Goal',
          placeholder: 'Select your primary goal',
          required: true,
          options: ['Fat loss', 'Muscle gain', 'Strength development', 'General fitness', 'Other'],
        },
        experience: {
          label: 'Training Experience',
          placeholder: 'Select your experience level',
          required: true,
          options: [
            'Brand new, never trained consistently',
            'Beginner, trained occasionally',
            'Intermediate, trained consistently for 1+ years',
            'Advanced, multiple years of structured training',
          ],
        },
        equipment: {
          label: 'What equipment do you have access to?',
          placeholder: 'Full gym, dumbbells at home, bodyweight only, etc.',
          required: true,
        },
        availability: {
          label: 'How many days per week can you train?',
          placeholder: 'e.g. 3-4 days',
          required: true,
        },
        notes: {
          label: 'Anything else Angie should know?',
          placeholder: 'Injuries, medical conditions, schedule constraints, specific goals…',
        },
        consent: {
          label:
            'I understand this is an application, Angie will review it and follow up before any payment is taken.',
          required: true,
        },
      },
    },
  },

  /* SINGLE LIVE TRAINING SESSION — Service 03 · $75 / session */
  session: {
    hero: {
      eyebrow: 'Service 03 · Single Live Training Session',
      heading: 'A one-time live session, try Delux Fit before you commit.',
      accent: 'before you commit',
      subhead:
        '$75 per session, 45-60 minutes. A one-time private live virtual session with Angie, perfect for trying Delux Fit, learning proper technique, form correction, motivation, Q&A, and a personalized workout experience.',
      primaryCta: 'Book a Session',
      primaryCtaHref: '#book',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    perfectForEyebrow: 'Perfect for',
    perfectForHeading: 'One private session, built entirely around you.',
    perfectForAccent: 'around you',
    perfectFor: [
      { icon: Sparkles, title: 'Trying Delux Fit before committing' },
      { icon: GraduationCap, title: 'Learning proper technique' },
      { icon: ClipboardCheck, title: 'Form correction' },
      { icon: HandHeart, title: 'Motivation' },
      { icon: MessageSquare, title: 'Q&A' },
      { icon: Dumbbell, title: 'A personalized workout experience' },
    ],
    sessionDetails: {
      eyebrow: 'Session details',
      length: '45-60 minutes',
      price: '$75 per session',
      bestFor:
        'A one-time private live virtual session with Angie. No commitment, book a single session and experience Delux Fit firsthand.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Book a session',
      heading: 'Pick a date and time and train with Angie live.',
      accent: 'train with Angie live',
      body: 'Select a date, a time, your training focus, and your fitness goal below. Your appointment is booked through the calendar and confirmed automatically.',
    },
  },

  /* LIVE ONLINE PERSONAL TRAINING PROGRAM — Service 04 · $50 / session */
  training: {
    hero: {
      eyebrow: 'Service 04 · Live Online Personal Training Program',
      heading: 'Ongoing live training, the closest thing to in-person.',
      accent: 'closest thing to in-person',
      subhead:
        '$50 per session. Ongoing live personal training over Zoom with Angie present for the entire session, live coaching, real-time corrections, accountability, and a personalized workout structure every time.',
      primaryCta: 'Get Started',
      primaryCtaHref: '#book',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'What’s included',
    includesHeading: 'Live coaching, on Zoom, in real time.',
    includesAccent: 'in real time',
    includes: [
      {
        icon: Video,
        title: 'Live coaching',
        description: 'A real-time session over Zoom, Angie is present for the entire workout.',
      },
      {
        icon: ClipboardCheck,
        title: 'Real-time corrections',
        description: 'Angie watches your form and corrects it as you go, so every rep counts.',
      },
      {
        icon: HandHeart,
        title: 'Accountability',
        description:
          'No skipping reps, no half-effort sets, accountability is built into every session.',
      },
      {
        icon: GraduationCap,
        title: 'Exercise guidance',
        description: 'Guidance on tempo, cues, intensity, and rest, all called live as you train.',
      },
      {
        icon: Dumbbell,
        title: 'Personalized workout structure',
        description: 'Each session is structured around your goals and the equipment you have.',
      },
    ],
    recommendation: {
      eyebrow: 'How often',
      heading: 'Recommended minimum 3 sessions per week.',
      accent: '3 sessions per week',
      body: 'For the best results we recommend a minimum of 3 sessions per week. Example: 3 sessions/week = $150/week. This is ongoing, the closest experience to in-person training, from anywhere.',
    },
    sessionDetails: {
      eyebrow: 'Program details',
      length: 'Ongoing, book as many sessions as you need',
      price: '$50 per session',
      bestFor:
        'Best for clients who want hands-on, live coaching and direct interaction during every workout, on an ongoing basis.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Book sessions',
      heading: 'Pick your times and train with Angie live.',
      accent: 'train with Angie live',
      body: 'Select a date, a time, your training focus, and your fitness goal below. Book one session or several across the week, we recommend a minimum of 3 per week.',
    },
  },

  /* BOOKING — shared copy for the live booking calendar (services 03 & 04) */
  booking: {
    selectDateLabel: 'Select a Date',
    selectTimeLabel: 'Select a Time',
    trainingFocusLabel: 'Training Focus',
    trainingFocusPlaceholder: 'Select a training focus',
    fitnessGoalLabel: 'Fitness Goal',
    fitnessGoalPlaceholder: 'Select your fitness goal',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    loadingSlots: 'Loading available times…',
    noSlots: 'No times available on this date. Try another day.',
    pickDateFirst: 'Pick a date to see available times.',
    slotTaken: 'Taken',
    submitLabel: 'Confirm Booking',
    submittingLabel: 'Booking…',
    successHeading: 'Session booked.',
    successBody:
      'Your session is confirmed. You’ll receive a confirmation with the secure video link. Manage your bookings any time from the client portal.',
    errorBody:
      'Something went wrong booking your session. Please try again, or reach out from the Contact page.',
    slotTakenError:
      'That time was just booked by someone else. Please pick another available time.',
    notConfiguredNotice:
      'This session could not be reserved automatically. Angie has your selection and will confirm the time by email.',
    trainingFocusOptions: [
      'Full body',
      'Upper body',
      'Lower body',
      'Core and abs',
      'Strength',
      'Conditioning / cardio',
      'Form & technique',
      'Mobility',
    ],
    fitnessGoalOptions: [
      'Fat loss',
      'Muscle gain',
      'Strength development',
      'General fitness',
      'Other',
    ],
  },

  testimonials: {
    hero: {
      eyebrow: 'Client stories',
      heading: 'Real clients, real progress.',
      accent: 'real progress',
      subhead:
        'Client success stories, reviews, and transformation photos are published here as Angie’s clients finish their programs, in their own words, with their permission.',
    },
    storiesNote:
      'Every quote on this page belongs to a client who finished a program. Nothing here is written on their behalf.',
    storiesEyebrow: 'Client stories',
    storiesHeading: 'What clients say.',
    storiesAccent: 'clients say',
    storiesEmpty: {
      heading: 'The first stories are still being earned.',
      body: 'Angie publishes a client’s story once they finish their program, in their own words and with their permission. Start a program and yours can be one of them.',
      ctaLabel: 'Apply for Coaching',
      ctaHref: '/online-coaching#apply',
    },
    cta: {
      heading: 'Want to be one of the real stories?',
      accent: 'real stories',
      subhead:
        'Pick a program and start. Your transformation can be the next one we feature here, with your permission.',
      primary: { label: 'Apply for Coaching', href: '/online-coaching#apply' },
      secondary: { label: 'Book a Session', href: '/single-session#book' },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contact',
      heading: 'Get in touch with Angie.',
      accent: 'with Angie',
      subhead:
        'Questions about the membership, online coaching, or live training? Send a message below, Angie reads and responds to every one personally. (Active coaching clients communicate inside the Delux Fit platform.)',
    },
    socialEyebrow: 'Follow along',
    socialHeading: 'Social',
    form: {
      submitLabel: 'Send Message',
      submittingLabel: 'Sending…',
      successHeading: 'Message sent.',
      successBody:
        'Thanks for reaching out, Angie will get back to you by email as soon as possible.',
      errorBody: 'Something went wrong sending your message. Please try again in a moment.',
      fields: {
        name: { label: 'Your Name', placeholder: 'Your name', required: true },
        email: { label: 'Email', placeholder: 'you@example.com', required: true },
        topic: {
          label: 'What is this about?',
          placeholder: 'Pick a topic',
          required: true,
          options: [
            'Membership question',
            'Online coaching question',
            'Single live session question',
            'Live training program question',
            'Press / collaborations',
            'Something else',
          ],
        },
        message: {
          label: 'Message',
          placeholder: 'Tell Angie what you’d like to talk about…',
          required: true,
        },
      },
    },
  },

  /* PROGRAMS GRID — shared section used on Home + service pages */
  programs: {
    eyebrow: 'Programs',
    heading: 'Pick the level of support that fits.',
    accent: 'level of support',
    subhead: 'Four ways to train. Every price and every inclusion is listed on the card.',
  },

  /* LEGAL — privacy and terms, one component renders both */
  legal: {
    lastUpdatedLabel: 'Last updated',
    lastUpdated: 'February 2026',
    privacy: {
      eyebrow: 'Privacy',
      heading: 'What DeluxFit collects, and why.',
      accent: 'collects',
      subhead:
        'Angie runs this site herself. It holds what a coach needs to coach you and nothing beyond that.',
      sections: [
        {
          heading: 'What is collected',
          body: 'Two things reach DeluxFit. The first is what you type into a form: your name, your email address, and whatever you write in the message, application, or booking. The second is what a member account holds once you have one, which is your training plan, your nutrition plan, the progress entries you log, the messages between you and Angie, and any photo you upload to a progress entry.',
        },
        {
          heading: 'What it is used for',
          body: 'Contact details are used to reply to you and to run your program. Training data is used to write your plan and review your progress. Nothing is sold, rented, or handed to an advertiser, and DeluxFit sends no marketing email you did not ask for.',
        },
        {
          heading: 'Who else holds it',
          body: 'Accounts, plans, messages, and uploads are stored with Supabase. Payments are taken by Stripe, which handles the card details directly: DeluxFit never sees or stores a card number. The site is served by Vercel. Each of those companies processes the data on Angie\u2019s behalf and under its own published privacy terms.',
        },
        {
          heading: 'How long it is kept',
          body: 'Account data is kept while your account is open. Ask Angie to close it and everything tied to it is deleted, other than the payment records Stripe is required to retain for tax and accounting. Messages sent through the contact form are kept while the conversation is live and cleared once it is finished.',
        },
        {
          heading: 'What you can ask for',
          body: 'You can ask for a copy of everything DeluxFit holds about you, ask for any of it to be corrected, or ask for all of it to be deleted. Write to Angie through the contact page and she will action it.',
        },
        {
          heading: 'Children',
          body: 'DeluxFit programs are sold to adults. The site is not directed at anyone under 18 and no account should be opened for one.',
        },
      ],
    },
    terms: {
      eyebrow: 'Terms',
      heading: 'The agreement between you and DeluxFit.',
      accent: 'agreement',
      subhead: 'Buying a program or opening an account means these terms apply to you.',
      sections: [
        {
          heading: 'What you are buying',
          body: 'The membership gives you general fitness content that is not written for you personally. Online coaching, single sessions, and the live training program are personalized services delivered by Angie. Each program page states its price, its billing period, and what is included, and those pages are the terms of the sale.',
        },
        {
          heading: 'Billing and cancellation',
          body: 'The membership and online coaching bill monthly through Stripe until you cancel. Cancel at any time and access runs to the end of the period you have already paid for. Single sessions and live training sessions are paid for as you book them.',
        },
        {
          heading: 'Missed and rescheduled sessions',
          body: 'Give at least 24 hours of notice to move a booked live session and it will be rescheduled at no charge. A session missed without that notice is treated as delivered.',
        },
        {
          heading: 'Refunds',
          body: 'A live session you have not yet taken is refundable in full. A membership or coaching month that has already run is not refundable, because the content and the plan for it were delivered. If something has gone wrong, write to Angie before opening a dispute.',
        },
        {
          heading: 'Health and safety',
          body: 'Angie is a certified personal trainer, not a doctor, and nothing on this site is medical advice. Speak to your physician before starting any exercise or nutrition program. You train at your own risk and you are responsible for stopping when something hurts.',
        },
        {
          heading: 'Your account',
          body: 'Keep your password to yourself and do not share your login. Plans, videos, and program material are Angie\u2019s work and are licensed to you for your own training only, not for redistribution or resale.',
        },
        {
          heading: 'Ending the agreement',
          body: 'You can close your account at any time by asking Angie. She can close an account that is being used to redistribute program material or to abuse the messaging in it, and will refund any period paid for and not delivered.',
        },
      ],
    },
  },

  footer: {
    legalLabel: 'Legal',
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
    blurb:
      'Discipline over excuses. Fitness memberships, personalized online coaching, and live training with certified personal trainer Angie.',
    navLabel: 'Footer',
    rightsReserved: 'All rights reserved.',
    socials: [],
    smallPrint:
      'Results vary. DeluxFit by Angie provides fitness coaching for educational purposes and is not a substitute for medical advice. Consult your physician before beginning any exercise or nutrition program.',
  },

  /* CLIENT PORTAL — member dashboard */
  portal: {
    backToSite: 'Back to Site',
    backToHome: 'Back to DeluxFit',
    brandLockup: 'Client Portal',
    auth: {
      signInTitle: 'Client Login',
      signUpTitle: 'Create your account',
      signInSubtitle: 'Sign in to your Delux Fit client portal.',
      signUpSubtitle: 'Join Delux Fit to access your plan, progress, and coach.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 8 characters',
      signInCta: 'Sign In',
      signUpCta: 'Create Account',
      signingIn: 'Signing in…',
      signingUp: 'Creating account…',
      toSignUp: 'New to Delux Fit? Create an account',
      toSignIn: 'Already have an account? Sign in',
      signOut: 'Sign Out',
      checkEmail: 'Check your email to confirm your account, then sign in.',
      genericError: 'Something went wrong. Please check your details and try again.',
    },
    nav: {
      overview: 'Overview',
      plan: 'My Plan',
      progress: 'Progress',
      nutrition: 'Nutrition',
      bookings: 'Sessions',
      messages: 'Messages',
      library: 'Library',
    },
    overview: {
      greeting: 'Welcome back',
      subtitle: 'Here’s everything in your Delux Fit account.',
      membershipStatus: 'Membership',
      coachingStatus: 'Coaching',
      noEntitlements:
        'You don’t have an active membership or coaching plan yet. Explore the programs to get started.',
      explorePrograms: 'Explore Programs',
      active: 'Active',
      inactive: 'Inactive',
    },
    plan: {
      title: 'My personalized plan',
      empty:
        'No personalized plan has been assigned yet. Personalized plans are available with Personalized Online Coaching.',
      emptyCta: 'Apply for Coaching',
      gatedTitle: 'Personalized plans are part of coaching',
      gatedBody: 'Your assigned workout plans appear here once you’re an active coaching client.',
    },
    progress: {
      title: 'Progress tracking',
      addEntry: 'Log an Entry',
      dateLabel: 'Date',
      weightLabel: 'Weight (lb)',
      bodyFatLabel: 'Body Fat (%)',
      notesLabel: 'Notes',
      notesPlaceholder: 'How did training feel? Energy, sleep, wins…',
      measurementsLabel: 'Measurements (in)',
      waistLabel: 'Waist',
      hipsLabel: 'Hips',
      chestLabel: 'Chest',
      armsLabel: 'Arms',
      thighsLabel: 'Thighs',
      photoLabel: 'Progress Photo',
      photoHelper: 'Optional, only you and Angie can see it.',
      saveEntry: 'Save Entry',
      saving: 'Saving…',
      empty: 'No entries yet. Log your first one to start tracking.',
      trendTitle: 'Weight trend',
      photo: 'Photo',
      viewPhoto: 'View Photo',
      colDate: 'Date',
      colWeight: 'Weight',
      colBodyFat: 'Body Fat',
      colNotes: 'Notes',
    },
    bookings: {
      title: 'Your sessions',
      empty: 'No upcoming sessions. Book a live session to get started.',
      bookCta: 'Book a Session',
      upcoming: 'Upcoming',
      past: 'Past',
    },
    messages: {
      title: 'Messages with Angie',
      intro:
        'This is the only channel for coaching communication. Response time is up to 72 business hours.',
      placeholder: 'Write a message to Angie…',
      send: 'Send',
      sending: 'Sending…',
      empty: 'No messages yet. Say hello to start the conversation.',
      attach: 'Attach File',
      viewAttachment: 'View Attachment',
      coachName: 'Angie',
      youName: 'You',
      gatedBody: 'Direct messaging is available to active coaching clients.',
    },
    library: {
      title: 'Content library',
      intro: 'Workout videos, nutrition resources, and fitness education.',
      empty: 'No content available yet. Check back soon, new content is added regularly.',
      gatedTitle: 'Unlock the content library',
      gatedBody: 'The content library is available with an active membership or coaching plan.',
      gatedCta: 'See Membership',
      categoryAll: 'All',
      categoryWorkout: 'Workouts',
      categoryNutrition: 'Nutrition',
      categoryEducation: 'Education',
      locked: 'Locked',
      open: 'Open',
      opening: 'Opening…',
      weekLabel: 'Week',
      dayLabel: 'Day',
      resourcesGroup: 'Resources',
    },
    nutrition: {
      title: 'Nutrition',
      intro: 'Your personalized calorie targets, meal structure, and resources from Angie.',
      empty:
        'No nutrition guidance has been written yet. Angie builds this around your goals once you start coaching.',
      unavailable: 'Your nutrition plan could not be loaded. Refresh the page to try again.',
      gatedTitle: 'Nutrition guidance is part of coaching',
      gatedBody:
        'Your personalized nutrition plan appears here once you’re an active coaching client.',
      gatedCta: 'Apply for Coaching',
      caloriesLabel: 'Daily Calories',
      proteinLabel: 'Protein',
      carbsLabel: 'Carbs',
      fatLabel: 'Fat',
      mealsTitle: 'Meal structure',
      resourcesTitle: 'Resources',
      notesTitle: 'Notes from Angie',
      grams: 'g',
    },
    hero: {
      eyebrow: 'Today',
      nextSession: 'Next session',
      noUpcoming: 'No upcoming sessions yet',
      book: 'Book a Session',
      allSessions: 'All Sessions',
      currentPlan: 'Current plan',
      noPlan: 'No plan assigned yet',
      planLocked: 'Unlocks with coaching',
      viewPlan: 'View Plan',
      weeks: 'weeks',
      todaysFuel: 'Today’s fuel',
      noFuel: 'No targets set yet',
      viewNutrition: 'View Nutrition',
      kcal: 'kcal / day',
      latestWeight: 'Latest weight',
      noProgress: 'No entries logged yet',
      startTracking: 'Start Tracking',
      viewProgress: 'View Progress',
      entries: 'entries logged',
    },
    loading: 'Loading…',
    offlineNotice: 'The portal couldn’t reach the server. Some data may be unavailable right now.',
  },

  /* Shared icons exposed for components that want a generic icon by name */
  icons: {
    shield: ShieldCheck,
    users: Users,
    repeat: Repeat,
  },
}

export default en
