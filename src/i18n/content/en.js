/* =============================================================================
   DELUXFIT BY ANGIE — ENGLISH CONTENT (en)
   -----------------------------------------------------------------------------
   The active English content tree for the multi-page DeluxFit site. Pricing,
   features, and service language follow the client's finalized plan VERBATIM:

     1. Fitness Membership — $14.99 per month
     2. Personalized Online Coaching — $150 per month
     3. Live 1-on-1 Online Training — $50 per session (45–60 min)

   In-Person Personal Training ($75/session) is shown only as a "Coming Soon"
   teaser — it is NOT bookable and never described as active.

   HARD RULES (kept in lockstep with the brief):
   • Never advertise daily coaching, weekly check-ins, unlimited messaging,
     guaranteed results, customized meal plans, or anything beyond the three
     active services above.
   • Online Coaching includes a MONTHLY check-in / MONTHLY progress review only.
   • Nutrition support is "basic nutrition guidance" only — never meal plans.

   Spanish equivalents live in `./es.js` — every key here must exist there.
   ========================================================================== */

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
  Instagram,
  Library,
  Home,
  Building2,
  MonitorPlay,
  HandHeart,
  GraduationCap,
  HeartPulse,
} from 'lucide-react'

/* ---------------------------------------------------------------------------
   Service spec — the three live services + the coming-soon in-person teaser.
   Every page that surfaces a service reads from this single source so prices,
   names, and features stay in lockstep. EXACT VALUES — do not paraphrase.
   ------------------------------------------------------------------------ */
const services = {
  membership: {
    id: 'membership',
    slug: 'membership',
    href: '/membership',
    eyebrow: 'Service 01',
    name: 'Fitness Membership',
    tagline: 'Self-guided fitness, on your time.',
    price: '$14.99',
    period: '/ month',
    summary:
      'Affordable access to workout programs, exercise libraries, and fitness education — without personalized coaching.',
    bestFor:
      'Best for individuals who want affordable access to workout programs and fitness education without personalized coaching.',
    includes: [
      'Workout library',
      'Exercise demonstrations',
      'Home and gym workout routines',
      'Fitness education content',
      'Basic nutrition guidance resources',
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
    tagline: 'A program built around your goals — guided by Angie.',
    price: '$150',
    period: '/ month',
    summary:
      'Customized online coaching designed around your goals, fitness level, lifestyle, and experience.',
    bestFor:
      'Best for clients who want a structured plan and professional guidance without live training sessions.',
    includes: [
      'Initial onboarding assessment',
      'Personalized workout plan',
      '4 weekly training programs per month',
      'Goal-specific programming (fat loss, muscle gain, strength development, general fitness)',
      'Monthly progress review',
      'Monthly check-in',
      'Program adjustments as needed',
      'Basic nutrition guidance',
    ],
    responsibilities: [
      'Complete workouts independently',
      'Track your progress',
      'Submit progress photos and updates monthly',
    ],
    ctaLabel: 'Apply Now',
    ctaHref: '/online-coaching#apply',
    cardCta: 'Apply Now',
  },
  oneOnOne: {
    id: 'one-on-one',
    slug: 'training',
    href: '/training',
    eyebrow: 'Service 03',
    name: 'Live 1-on-1 Online Training',
    tagline: 'Live virtual personal training with Angie.',
    price: '$50',
    period: '/ session',
    sessionLength: '45–60 minutes per session',
    summary:
      'Live virtual personal training where Angie works directly with you during the session — real-time coaching, correction, and accountability.',
    bestFor:
      'Best for clients who want hands-on coaching and direct interaction during their workouts.',
    includes: [
      'Live video session',
      'Real-time coaching',
      'Exercise correction',
      'Motivation and accountability',
      'Customized workout experience',
      'Goal-specific instruction',
    ],
    ctaLabel: 'Book a Session',
    ctaHref: '/training#book',
    cardCta: 'Book a Session',
  },
  inPerson: {
    id: 'in-person',
    name: 'In-Person Personal Training',
    price: '$75',
    period: '/ session',
    sessionLength: '45–60 minutes per session',
    summary:
      'Hands-on, in-person personal training with Angie. Launching soon — not currently bookable.',
    status: 'Coming Soon',
  },
}

const en = {
  meta: {
    title: 'DeluxFit by Angie — Online Fitness Coaching & 1-on-1 Training',
    description:
      'DeluxFit by Angie offers a $14.99/month fitness membership, $150/month personalized online coaching, and $50 live 1-on-1 online training sessions with certified personal trainer Angie.',
  },

  brand: {
    name: 'DELUXFIT',
    fullName: 'DeluxFit by Angie',
    tagline: 'Personalized fitness coaching, built around your life.',
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Membership', href: '/membership' },
    { label: 'Online Coaching', href: '/online-coaching' },
    { label: '1-on-1 Training', href: '/training' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '/contact' },
  ],

  header: {
    primaryCta: 'Apply Now',
    primaryCtaHref: '/online-coaching#apply',
    clientLogin: 'Client Login',
    clientLoginAria: 'Client login portal',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryNavLabel: 'Primary',
    mobileNavLabel: 'Mobile',
    mobileDialogLabel: 'Mobile navigation',
  },

  language: {
    label: 'Language',
    english: 'English',
    spanish: 'Spanish',
    switchToEnglish: 'Switch to English',
    switchToSpanish: 'Switch to Spanish',
  },

  services,

  /* ----------------------------------------------------------------------- */
  /*  HOME                                                                    */
  /* ----------------------------------------------------------------------- */
  home: {
    hero: {
      badge: 'Now coaching new online clients',
      headline: ['Personalized training', 'built around', 'your goals.'],
      subhead:
        'DeluxFit by Angie is personalized online fitness coaching and live 1-on-1 training with certified personal trainer Angie — built for people who want a program designed around their goals, schedule, and experience.',
      primaryCta: 'See the Programs',
      primaryCtaHref: '#programs',
      secondaryCta: 'Apply for Coaching',
      secondaryCtaHref: '/online-coaching#apply',
      trust: {
        pillarValue: '1:1',
        pillarLabel: 'personalized coaching',
        tagline: 'Membership · Online Coaching · Live 1-on-1',
      },
      imageAlt: 'Angie mid-squat at a Smith machine, shot from behind',
    },

    intro: {
      eyebrow: 'Meet Angie',
      heading: 'A coach who builds the program around the person — not the other way around.',
      accent: 'around the person',
      body: [
        'I’m Angie — a certified personal trainer helping people get stronger, more confident, and more consistent through coaching that actually fits their life.',
        'Whether you want a self-guided membership, a fully personalized program, or live sessions on video with me, every option below is delivered directly by me — no templates, no resold programs, no guesswork.',
      ],
      ctaLabel: 'Read my story',
      ctaHref: '/about',
      imageAlt: 'Angie coaching a client through a leg-press set',
    },

    servicesSection: {
      eyebrow: 'Choose how we work together',
      heading: 'Three ways to train with DeluxFit by Angie.',
      accent: 'Three ways',
      subhead:
        'Self-guided membership, personalized online coaching, or live 1-on-1 sessions on video — pick the level of support that fits where you are right now.',
    },

    transformationCallout: {
      eyebrow: 'What it looks like',
      heading: 'Real coaching, built for real life — not the highlight reel.',
      accent: 'real life',
      body: 'Client transformation stories and progress photos are featured on the testimonials page as clients complete their programs. Until then, here is what every DeluxFit program is built around.',
      pillars: [
        {
          icon: Dumbbell,
          title: 'Real Training',
          description:
            'Programming designed around your goals — fat loss, muscle gain, strength, or general fitness — not a one-size-fits-all template.',
        },
        {
          icon: HeartPulse,
          title: 'Real Guidance',
          description:
            'Basic nutrition guidance and form-focused coaching so the work you put in actually moves you forward.',
        },
        {
          icon: HandHeart,
          title: 'Real Support',
          description:
            'Direct access to me through every program — monthly check-ins on coaching, live coaching on training sessions.',
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
        'Sign up for the membership, apply for personalized coaching, or book a live 1-on-1 session — and we’ll go from there.',
      primaryCta: 'Apply for Coaching',
      primaryCtaHref: '/online-coaching#apply',
      secondaryCta: 'Book a Session',
      secondaryCtaHref: '/training#book',
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  ABOUT                                                                   */
  /* ----------------------------------------------------------------------- */
  about: {
    hero: {
      eyebrow: 'About Angie',
      heading: 'Hi, I’m Angie — and I built DeluxFit to coach people the way I always wanted to be coached.',
      accent: 'coach people the way I always wanted to be coached',
      tagline: 'Certified Personal Trainer · Online & Live',
      imageAlt: 'Angie coaching a client through a leg-press set',
    },
    story: {
      eyebrow: 'My story',
      heading: 'From training myself, to training others.',
      accent: 'training others',
      paragraphs: [
        'Fitness has been part of my life for as long as I can remember. What started as a personal pursuit became a career — because I kept watching friends, family, and strangers get handed cookie-cutter programs that ignored their goals, their bodies, and the lives they were actually living.',
        'I started DeluxFit by Angie to do the opposite: build training that bends around the person, with real coaching, real accountability, and a structure you can keep up with whether you train from a full gym or your living room.',
        'Whether you’re brand new to lifting or coming back after a long break, you don’t need another generic plan. You need a coach who actually pays attention.',
      ],
    },
    credentials: {
      eyebrow: 'Certifications & experience',
      heading: 'Trained to coach, certified to lead.',
      accent: 'certified to lead',
      note: 'Detailed certification logos and credential numbers will be added by Angie as part of the public site copy review.',
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
            'Every program is shaped around your goals, fitness level, lifestyle, and experience — never a generic plan lifted off a shelf.',
        },
        {
          icon: GraduationCap,
          title: 'Coaching, not guesswork',
          description:
            'You get the training plan AND the explanation — why the lifts, why the structure, why the progression. The goal is to leave you smarter and more independent every month.',
        },
        {
          icon: HandHeart,
          title: 'Honest, sustainable progress',
          description:
            'No crash promises, no rigid meal plans, no unrealistic check-in cadence. Basic nutrition guidance, real training, and a structure you can actually maintain.',
        },
      ],
    },
    cta: {
      heading: 'Ready to train together?',
      accent: 'train together',
      subhead:
        'Browse the membership, apply for personalized coaching, or book a live 1-on-1 online session.',
      primary: { label: 'See the Programs', href: '/#programs' },
      secondary: { label: 'Contact Angie', href: '/contact' },
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  MEMBERSHIP                                                              */
  /* ----------------------------------------------------------------------- */
  membership: {
    hero: {
      eyebrow: 'Service 01 · Fitness Membership',
      heading: 'A fitness membership built for self-guided training.',
      accent: 'self-guided training',
      subhead:
        'For $14.99 a month you get access to a growing library of workout programs, exercise demonstrations, fitness education content, and basic nutrition guidance resources — on your schedule, at your pace.',
      primaryCta: 'Sign Up — $14.99 / month',
      primaryCtaHref: '#sign-up',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'What’s included',
    includesHeading: 'Everything you need to train consistently.',
    includesAccent: 'train consistently',
    includes: [
      {
        icon: Library,
        title: 'Workout library',
        description:
          'A growing catalog of training programs you can follow at your own pace.',
      },
      {
        icon: PlayCircle,
        title: 'Exercise demonstrations',
        description:
          'Video demonstrations for every movement so the form is clear before you start.',
      },
      {
        icon: Home,
        title: 'Home & gym workout routines',
        description:
          'Routines built for whatever you have access to — minimal-equipment workouts at home or full-gym sessions.',
      },
      {
        icon: GraduationCap,
        title: 'Fitness education content',
        description:
          'Short, practical lessons that explain the why behind the training, not just the what.',
      },
      {
        icon: Apple,
        title: 'Basic nutrition guidance resources',
        description:
          'Educational nutrition resources to help you build sustainable habits alongside your training.',
      },
      {
        icon: Sparkles,
        title: 'New content added regularly',
        description:
          'The library grows over time so your training stays fresh as you progress.',
      },
    ],
    bestFor: {
      eyebrow: 'Who it’s for',
      heading: 'Best for individuals who want affordable access to workout programs and fitness education — without personalized coaching.',
      accent: 'without personalized coaching',
      body: 'If you’re self-motivated and want a structured library to train from, the membership is the most affordable way to train with DeluxFit. For a personalized program built around your goals, see Online Coaching. For live, real-time sessions with Angie, see 1-on-1 Training.',
    },
    signupSection: {
      id: 'sign-up',
      eyebrow: 'Sign up',
      heading: 'Start the membership — $14.99 / month.',
      accent: '$14.99 / month',
      body: 'Sign up below and you’ll receive access details from Angie. Cancel anytime.',
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  ONLINE COACHING                                                         */
  /* ----------------------------------------------------------------------- */
  coaching: {
    hero: {
      eyebrow: 'Service 02 · Personalized Online Coaching',
      heading: 'Personalized online coaching, designed around you.',
      accent: 'designed around you',
      subhead:
        'For $150 a month you get customized online coaching built around your goals, fitness level, lifestyle, and experience — with a personalized program, monthly check-in, and monthly progress review.',
      primaryCta: 'Apply Now',
      primaryCtaHref: '#apply',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'What’s included',
    includesHeading: 'Everything you need — built around you, adjusted as you progress.',
    includesAccent: 'adjusted as you progress',
    includes: [
      {
        icon: ClipboardCheck,
        title: 'Initial onboarding assessment',
        description:
          'We start with a thorough assessment of your goals, training history, schedule, and any limitations.',
      },
      {
        icon: Dumbbell,
        title: 'Personalized workout plan',
        description:
          'A program designed specifically for you — not a template — based on the onboarding assessment.',
      },
      {
        icon: CalendarCheck,
        title: '4 weekly training programs per month',
        description:
          'Each month you receive four weekly training programs to follow, structured to progress over the month.',
      },
      {
        icon: Sparkles,
        title: 'Goal-specific programming',
        description:
          'Programming for fat loss, muscle gain, strength development, or general fitness — depending on your goal.',
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
        icon: ClipboardCheck,
        title: 'Program adjustments as needed',
        description:
          'Your program is updated based on the monthly review so it keeps moving with you.',
      },
      {
        icon: Apple,
        title: 'Basic nutrition guidance',
        description:
          'General, sustainable nutrition guidance to support your training — no rigid meal plans.',
      },
    ],
    responsibilities: {
      eyebrow: 'Client responsibilities',
      heading: 'What you bring to the program.',
      accent: 'you bring',
      body: 'Online coaching works best when both sides are doing their part. Your side looks like this:',
      items: [
        'Complete workouts independently',
        'Track your progress',
        'Submit progress photos and updates monthly',
      ],
    },
    bestFor: {
      eyebrow: 'Who it’s for',
      heading: 'Best for clients who want a structured plan and professional guidance — without live training sessions.',
      accent: 'without live training sessions',
      body: 'If you want a program built specifically for you that you can follow on your own time, with monthly coaching from Angie, Online Coaching is the fit. If you also want live, real-time coaching, add or switch to 1-on-1 Training.',
    },
    applicationSection: {
      id: 'apply',
      eyebrow: 'Apply for coaching',
      heading: 'Tell Angie about your goals.',
      accent: 'your goals',
      body: 'Fill out the application below. Angie reviews every application personally and follows up with next steps for onboarding.',
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
        name: { label: 'Full name', placeholder: 'Your name', required: true },
        email: { label: 'Email', placeholder: 'you@example.com', required: true },
        phone: { label: 'Phone (optional)', placeholder: '(555) 555-5555' },
        age: { label: 'Age', placeholder: '30', required: true },
        location: { label: 'City / location', placeholder: 'City, State' },
        goal: {
          label: 'Primary goal',
          placeholder: 'Select your primary goal',
          required: true,
          options: [
            'Fat loss',
            'Muscle gain',
            'Strength development',
            'General fitness',
            'Other',
          ],
        },
        experience: {
          label: 'Training experience',
          placeholder: 'Select your experience level',
          required: true,
          options: [
            'Brand new — never trained consistently',
            'Beginner — trained occasionally',
            'Intermediate — trained consistently for 1+ years',
            'Advanced — multiple years of structured training',
          ],
        },
        equipment: {
          label: 'What equipment do you have access to?',
          placeholder:
            'Full gym, dumbbells at home, bodyweight only, etc.',
          required: true,
        },
        availability: {
          label: 'How many days per week can you train?',
          placeholder: 'e.g. 3–4 days',
          required: true,
        },
        notes: {
          label: 'Anything else Angie should know?',
          placeholder:
            'Injuries, medical conditions, schedule constraints, specific goals…',
        },
        consent: {
          label:
            'I understand this is an application — Angie will review it and follow up before any payment is taken.',
          required: true,
        },
      },
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  1-ON-1 TRAINING                                                         */
  /* ----------------------------------------------------------------------- */
  training: {
    hero: {
      eyebrow: 'Service 03 · Live 1-on-1 Online Training',
      heading: 'Live virtual personal training — directly with Angie.',
      accent: 'directly with Angie',
      subhead:
        '$50 per session, 45–60 minutes per session. Live video sessions where Angie works directly with you — real-time coaching, exercise correction, motivation, and accountability built into every session.',
      primaryCta: 'Book a Session',
      primaryCtaHref: '#book',
      secondaryCta: 'Compare Programs',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'What’s included',
    includesHeading: 'Hands-on coaching, on video, in real time.',
    includesAccent: 'in real time',
    includes: [
      {
        icon: Video,
        title: 'Live video session',
        description:
          'A real-time, on-camera session — Angie is there with you for the entire workout.',
      },
      {
        icon: HandHeart,
        title: 'Real-time coaching',
        description:
          'Coaching as you train: tempo, cues, intensity, rest — all called live.',
      },
      {
        icon: ClipboardCheck,
        title: 'Exercise correction',
        description:
          'Angie watches your form and corrects it as you go, so the work counts.',
      },
      {
        icon: Sparkles,
        title: 'Motivation and accountability',
        description:
          'No skipping reps, no half-effort sets — accountability is part of the session.',
      },
      {
        icon: Dumbbell,
        title: 'Customized workout experience',
        description:
          'Each session is built around what you’re working on and the equipment you have.',
      },
      {
        icon: MonitorPlay,
        title: 'Goal-specific instruction',
        description:
          'Sessions are built around your goal — fat loss, muscle gain, strength, or general fitness.',
      },
    ],
    sessionDetails: {
      eyebrow: 'Session details',
      length: '45–60 minutes per session',
      price: '$50 per session',
      bestFor:
        'Best for clients who want hands-on coaching and direct interaction during their workouts.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Book a session',
      heading: 'Pick a time and train with Angie live.',
      accent: 'train with Angie live',
      body: 'Fill out the request below with a few session times that work for you. Angie will confirm by email and send the secure video link.',
    },
    booking: {
      submitLabel: 'Request Session',
      submittingLabel: 'Submitting…',
      successHeading: 'Session request received.',
      successBody:
        'Thanks — Angie will reach out to confirm your session and share the secure video link.',
      errorBody:
        'Something went wrong submitting your request. Please try again, or email Angie directly from the Contact page.',
      fields: {
        name: { label: 'Full name', placeholder: 'Your name', required: true },
        email: { label: 'Email', placeholder: 'you@example.com', required: true },
        phone: { label: 'Phone (optional)', placeholder: '(555) 555-5555' },
        timezone: {
          label: 'Time zone',
          placeholder: 'e.g. EST, PST, CST',
          required: true,
        },
        availability: {
          label: 'Preferred session times',
          placeholder:
            'List a few dates / times that work for you (e.g. Tue 7am EST, Wed 6pm EST)',
          required: true,
        },
        goal: {
          label: 'What you want to work on',
          placeholder:
            'Form correction, programming, strength, fat loss, getting started, etc.',
          required: true,
        },
        equipment: {
          label: 'Equipment available',
          placeholder: 'Full gym, dumbbells, bodyweight only, etc.',
        },
        notes: {
          label: 'Anything else Angie should know?',
          placeholder: 'Injuries, experience level, specific concerns…',
        },
      },
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  TESTIMONIALS                                                            */
  /* ----------------------------------------------------------------------- */
  testimonials: {
    hero: {
      eyebrow: 'Client stories',
      heading: 'Real clients, real progress.',
      accent: 'real progress',
      subhead:
        'Client success stories, reviews, and transformation photos are featured here as Angie’s clients complete their programs. The stories below are placeholders shown until real client content is added.',
    },
    placeholderNote:
      'Placeholder content — real client stories will appear here as Angie’s clients complete their programs.',
    items: [
      {
        metric: 'Coming soon',
        quote:
          'Client success stories will live here. Angie’s clients will share what changed, what they learned, and how they kept it.',
        name: 'Future Client',
        result: 'Real story coming soon',
        rating: 5,
      },
      {
        metric: 'Coming soon',
        quote:
          'This is a placeholder card. Once clients complete their programs, their words and results will appear here in their own voice.',
        name: 'Future Client',
        result: 'Real story coming soon',
        rating: 5,
      },
      {
        metric: 'Coming soon',
        quote:
          'Reviews and quotes are reserved for real clients only. We do not invent testimonials — what shows up here will be genuine.',
        name: 'Future Client',
        result: 'Real story coming soon',
        rating: 5,
      },
    ],
    galleryEyebrow: 'Transformations',
    galleryHeading: 'Before & after gallery.',
    galleryAccent: 'Before & after',
    galleryNote:
      'Transformation photos coming soon — placeholders are shown until Angie adds real client before/after content.',
    gallery: [
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
      { label: 'Coming soon', alt: 'Before and after transformation placeholder' },
    ],
    cta: {
      heading: 'Want to be one of the real stories?',
      accent: 'real stories',
      subhead:
        'Pick a program and start. Your transformation can be the next one we feature here — with your permission.',
      primary: { label: 'Apply for Coaching', href: '/online-coaching#apply' },
      secondary: { label: 'Book a Session', href: '/training#book' },
    },
  },

  /* ----------------------------------------------------------------------- */
  /*  CONTACT                                                                 */
  /* ----------------------------------------------------------------------- */
  contact: {
    hero: {
      eyebrow: 'Contact',
      heading: 'Get in touch with Angie.',
      accent: 'with Angie',
      subhead:
        'Questions about the membership, online coaching, or live 1-on-1 sessions? Send a message below — Angie reads and responds to every one personally.',
    },
    socialEyebrow: 'Follow along',
    socialHeading: 'Social',
    form: {
      submitLabel: 'Send Message',
      submittingLabel: 'Sending…',
      successHeading: 'Message sent.',
      successBody:
        'Thanks for reaching out — Angie will get back to you by email as soon as possible.',
      errorBody:
        'Something went wrong sending your message. Please try again in a moment, or reach out on social.',
      fields: {
        name: { label: 'Your name', placeholder: 'Your name', required: true },
        email: { label: 'Email', placeholder: 'you@example.com', required: true },
        topic: {
          label: 'What is this about?',
          placeholder: 'Pick a topic',
          required: true,
          options: [
            'Membership question',
            'Online coaching question',
            '1-on-1 training question',
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

  /* ----------------------------------------------------------------------- */
  /*  PROGRAMS GRID — shared section used on Home + service pages             */
  /* ----------------------------------------------------------------------- */
  programs: {
    eyebrow: 'Programs',
    heading: 'Pick the level of support that fits.',
    accent: 'level of support',
    subhead:
      'Three live services and one coming soon. Pricing and features are exact — nothing hidden.',
  },

  /* ----------------------------------------------------------------------- */
  /*  In-person coming soon                                                   */
  /* ----------------------------------------------------------------------- */
  inPerson: {
    eyebrow: 'Coming soon',
    title: 'In-Person Personal Training',
    price: '$75 / session',
    sessionLength: '45–60 minutes per session',
    summary:
      'Hands-on, in-person personal training with Angie. Launching soon — not currently bookable.',
    icon: Building2,
  },

  footer: {
    blurb:
      'Personalized fitness coaching and live 1-on-1 online training with certified personal trainer Angie.',
    navLabel: 'Footer',
    rightsReserved: 'All rights reserved.',
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/REPLACE_ME', icon: Instagram },
      // TikTok has no dedicated lucide glyph; the inline glyph picks up this marker.
      { label: 'TikTok', href: 'https://tiktok.com/@REPLACE_ME', icon: 'tiktok' },
    ],
    smallPrint:
      'Results vary. DeluxFit by Angie provides fitness coaching for educational purposes and is not a substitute for medical advice. Consult your physician before beginning any exercise or nutrition program.',
  },

  portal: {
    backToSite: 'Back to site',
    backToHome: 'Back to DeluxFit',
    comingSoon: 'Coming soon',
    headingLines: ['Client', 'Portal'],
    blurb:
      'A members-only home for current DeluxFit clients is launching shortly.',
    signInHint: 'Existing client? Sign in here once we go live.',
  },

  /* ----------------------------------------------------------------------- */
  /*  Shared icons exposed for components that want a generic icon by name    */
  /* ----------------------------------------------------------------------- */
  icons: {
    shield: ShieldCheck,
    users: Users,
  },
}

export default en
