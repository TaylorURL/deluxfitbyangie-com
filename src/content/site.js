/* =============================================================================
   DELUXFIT BY ANGIE — SITE CONTENT
   -----------------------------------------------------------------------------
   ⚠️  PLACEHOLDER CONTENT — FOR ANGIE TO REPLACE.

   Every string, price, statistic, testimonial, image path, and social handle in
   this file is placeholder copy written in a confident, motivating fitness-sales
   voice. Edit here to change the live site — all sections read from this single
   file so nothing else needs to be touched for normal copy/price updates.

   • Stripe checkout links live separately in `src/config/checkout.js`.
   • Images point at `/public/*` placeholder assets — drop in real photos with
     the same filenames (or update the paths here) to swap them.
   ========================================================================== */

import { CHECKOUT_LINKS } from '../config/checkout'
import {
  Dumbbell,
  Apple,
  MessageCircleHeart,
  Users,
  CalendarCheck,
  LineChart,
  ShieldCheck,
  Instagram,
} from 'lucide-react'

export const brand = {
  name: 'DELUXFIT',
  fullName: 'DeluxFit by Angie',
  tagline: 'Online coaching that transforms.',
}

export const nav = [
  { label: 'Program', href: '#program' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export const hero = {
  badge: 'Now coaching the Summer 2026 transformation group',
  headline: ['Build the body', 'you stopped', 'believing was possible.'],
  subhead:
    'DeluxFit is 1-on-1 online coaching for women who are done starting over. Custom workouts, real nutrition coaching, and weekly accountability — built around your life, not someone else’s highlight reel.',
  primaryCta: 'Start Your Transformation',
  secondaryCta: 'See Results',
  trust: {
    rating: '4.9/5',
    ratingLabel: 'average client rating',
    clients: '500+ clients transformed',
  },
  imageAlt: 'Angie coaching a client through a strength workout',
}

export const marqueeItems = [
  'Strength Training',
  'Fat Loss',
  'Nutrition Coaching',
  'Accountability',
  'Mindset',
  'Mobility',
  'Postpartum Strong',
]

export const pain = {
  eyebrow: 'Sound familiar?',
  heading: 'You’re not lazy. You’ve just been handed the wrong plan.',
  accent: 'the wrong plan',
  subhead:
    'You’ve tried hard before — maybe harder than anyone knows. The problem was never your effort. It was a cookie-cutter program that ignored your body, your schedule, and your life.',
  points: [
    'Tired of starting a new diet every Monday and quitting by Thursday.',
    'Sick of generic workout plans that leave you sore, bored, and stuck.',
    'Exhausted by all-or-nothing rules that make food feel like the enemy.',
    'Frustrated that the scale won’t budge no matter how little you eat.',
    'Done with “fitspo” programs built for 22-year-olds with no kids and no job.',
    'Lonely doing it alone, with no one checking in or in your corner.',
  ],
}

export const benefits = {
  eyebrow: 'What you get',
  heading: 'A complete system — not just another workout PDF.',
  accent: 'complete system',
  subhead:
    'Everything is built for you and adjusted every week as you progress. This is coaching, not a template you download and never open again.',
  items: [
    {
      icon: Dumbbell,
      title: 'Custom Workout Plans',
      description:
        'Programming designed around your goals, equipment, and experience — at home or in the gym, in 3–5 sessions a week.',
    },
    {
      icon: Apple,
      title: 'Nutrition Coaching',
      description:
        'A flexible, food-freedom approach with targets that fit your real life. No banned foods, no starving, no guilt.',
    },
    {
      icon: CalendarCheck,
      title: 'Weekly Accountability',
      description:
        'Check in every week with photos, stats, and wins. I review everything and adjust your plan so you keep moving.',
    },
    {
      icon: MessageCircleHeart,
      title: 'Direct Access to Angie',
      description:
        'Message me between check-ins through the app. Stuck, traveling, or tempted to quit? I’m one text away.',
    },
    {
      icon: Users,
      title: 'Private Community',
      description:
        'Train alongside a group of driven women who celebrate your wins and pull you forward on the hard days.',
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description:
        'See your strength, measurements, and habits trend in one place — proof you’re changing, even when the scale lies.',
    },
  ],
}

export const program = {
  eyebrow: 'The program',
  heading: 'The DeluxFit 12-week transformation method.',
  subhead:
    'Three focused phases that build on each other — so you don’t just lose weight, you build a body and a routine that lasts.',
  phases: [
    {
      label: 'Phase 01 · Weeks 1–4',
      title: 'Foundation',
      description:
        'We dial in your nutrition baseline, master core lifts with perfect form, and build the daily habits everything else stands on.',
    },
    {
      label: 'Phase 02 · Weeks 5–8',
      title: 'Build & Burn',
      description:
        'Training intensifies and nutrition gets strategic. This is where the mirror starts changing and your confidence catches fire.',
    },
    {
      label: 'Phase 03 · Weeks 9–12',
      title: 'Sculpt & Sustain',
      description:
        'We sharpen your results and lock in a lifestyle you can keep — so the transformation outlasts the program.',
    },
  ],
  stats: [
    { value: '12', label: 'Week Program' },
    { value: '500+', label: 'Clients Transformed' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '93%', label: 'Finish & Re-enroll' },
  ],
}

export const results = {
  eyebrow: 'Real women, real results',
  heading: 'Transformations that speak for themselves.',
  subhead:
    'These are placeholder stories and photos — Angie will swap in real client wins and before/after images here.',
  testimonials: [
    {
      quote:
        'Angie gave me a plan that actually fit my life as a working mom of two. I’m down 28 pounds and stronger than I was in my twenties.',
      name: 'Jessica M.',
      result: 'Lost 28 lbs in 12 weeks',
      rating: 5,
    },
    {
      quote:
        'I’ve done every diet out there. This was the first time I didn’t feel deprived — and the first time it actually stuck.',
      name: 'Priya K.',
      result: 'Down 3 dress sizes',
      rating: 5,
    },
    {
      quote:
        'The weekly check-ins kept me honest. Knowing Angie was reviewing my week made me show up even when I didn’t feel like it.',
      name: 'Dana R.',
      result: 'First-ever pull-up',
      rating: 5,
    },
    {
      quote:
        'I came for fat loss and left with confidence I didn’t know I was missing. Best money I’ve ever spent on myself.',
      name: 'Megan T.',
      result: 'Lost 19 lbs, gained strength',
      rating: 5,
    },
  ],
  gallery: [
    { label: 'Sarah · 16 weeks', alt: 'Before and after transformation placeholder' },
    { label: 'Aisha · 12 weeks', alt: 'Before and after transformation placeholder' },
    { label: 'Lauren · 20 weeks', alt: 'Before and after transformation placeholder' },
  ],
}

export const pricing = {
  eyebrow: 'Choose your transformation',
  heading: 'Pick the plan that matches your goals.',
  subhead:
    'Every tier includes custom training, nutrition coaching, and weekly accountability. Cancel anytime — no contracts, no games.',
  note: 'Prices shown in USD. Placeholder pricing — Angie sets the final numbers in Stripe.',
  tiers: [
    {
      id: 'kickstart',
      name: 'Kickstart',
      price: '$149',
      period: '/ 1 month',
      description: 'Test the waters and feel the difference in 30 days.',
      features: [
        'Custom 4-week workout plan',
        'Personalized nutrition targets',
        'Weekly check-in & plan adjustments',
        'In-app messaging support',
        'Private community access',
      ],
      ctaLabel: 'Start Kickstart',
      ctaHref: CHECKOUT_LINKS.kickstart,
      highlighted: false,
    },
    {
      id: 'transform',
      name: 'Transform',
      price: '$129',
      period: '/ mo · 3 months',
      description: 'The full 12-week method — our most popular path to real change.',
      features: [
        'Everything in Kickstart',
        'Full 12-week transformation method',
        'Bi-weekly form-check video reviews',
        'Priority messaging with Angie',
        'Habit & mindset coaching modules',
        'Progress tracking dashboard',
      ],
      ctaLabel: 'Start Transforming',
      ctaHref: CHECKOUT_LINKS.transform,
      highlighted: true,
      badgeLabel: 'Most Popular',
    },
    {
      id: 'elite',
      name: 'Elite 1:1',
      price: '$199',
      period: '/ mo · 6 months',
      description: 'Maximum access for the woman who wants the fastest, deepest results.',
      features: [
        'Everything in Transform',
        'Weekly 1:1 video coaching calls',
        'Fully bespoke training & nutrition',
        'Daily check-in & unlimited messaging',
        'Supplement & recovery guidance',
        'Lifetime alumni community access',
      ],
      ctaLabel: 'Go Elite',
      ctaHref: CHECKOUT_LINKS.elite,
      highlighted: false,
    },
  ],
}

export const guarantee = {
  icon: ShieldCheck,
  eyebrow: 'Zero risk',
  heading: 'The 14-day “love it or it’s free” guarantee.',
  body: 'Show up, do the work, and use the coaching for 14 days. If you don’t feel more confident, more capable, and genuinely supported, email us and get every penny back. The only risk is staying exactly where you are.',
  cta: 'Claim Your Spot',
}

export const about = {
  eyebrow: 'Meet your coach',
  name: 'Angie',
  heading: 'Hi, I’m Angie — and I built DeluxFit for the woman you’re becoming.',
  bio: [
    'For over a decade I’ve helped women cut through the noise of crash diets and punishing workouts to build bodies — and confidence — that last. I’ve been where you are: frustrated, overwhelmed, and ready for something that finally works.',
    'DeluxFit is the coaching I wish I’d had: real food, smart training, and a coach who actually shows up. No shame, no extremes — just a proven system and someone in your corner every single week.',
  ],
  credentials: [
    'Certified Personal Trainer (NASM-CPT)',
    'Precision Nutrition Level 1 Coach',
    'Pre/Postnatal Fitness Specialist',
    '10+ years coaching women online & in person',
  ],
  imageAlt: 'Angie, certified personal trainer and founder of DeluxFit',
}

export const faq = {
  eyebrow: 'Questions',
  heading: 'Everything you need to know.',
  items: [
    {
      question: 'Do I need a gym membership?',
      answer:
        'Not at all. Tell me what you have — a full gym, a few dumbbells, or just your bodyweight at home — and I’ll build your program around it. Plenty of clients get incredible results training from home.',
    },
    {
      question: 'I’m a total beginner. Is this for me?',
      answer:
        'Absolutely. Most of my clients start exactly where you are. Every workout includes video demos and form coaching, and we scale everything to your level so you build confidence from day one.',
    },
    {
      question: 'How is this different from a free workout app?',
      answer:
        'Apps hand you a generic plan and disappear. DeluxFit is real coaching: your program is built for you, adjusted every week based on your progress, and backed by direct access to me whenever you’re stuck.',
    },
    {
      question: 'Will I have to give up the foods I love?',
      answer:
        'Never. My approach is flexible and sustainable — no banned foods, no starving. You’ll learn to enjoy the foods you love while still hitting your goals, which is exactly why it lasts.',
    },
    {
      question: 'How much time do I need each week?',
      answer:
        'Most clients train 3–5 times a week for 30–45 minutes, plus a few minutes for your weekly check-in. The plan flexes around your schedule — not the other way around.',
    },
    {
      question: 'What if it’s not for me?',
      answer:
        'You’re protected by the 14-day “love it or it’s free” guarantee. Try the coaching risk-free, and if it’s not the right fit, email us within 14 days for a full refund.',
    },
  ],
}

export const finalCta = {
  eyebrow: 'Your transformation starts now',
  heading: 'The next 12 weeks are happening either way.',
  subhead:
    'You can arrive there wishing you’d started today — or arrive stronger, leaner, and prouder than ever. Spots in each coaching group are limited so I can give every client real attention.',
  primaryCta: 'Start Your Transformation',
  secondaryCta: 'Read the FAQ',
}

export const footer = {
  blurb: 'Online fitness coaching that transforms bodies and rebuilds confidence — one woman at a time.',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/REPLACE_ME', icon: Instagram },
    // TikTok has no dedicated lucide glyph; the music note stands in until swapped.
    { label: 'TikTok', href: 'https://tiktok.com/@REPLACE_ME', icon: 'tiktok' },
  ],
  smallPrint:
    'Results vary. DeluxFit by Angie provides fitness and nutrition coaching for educational purposes and is not a substitute for medical advice. Consult your physician before beginning any exercise or nutrition program.',
}
