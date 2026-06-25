// TEMPORARY visual-verification harness — renders the real portal layout with
// mock data (no Supabase). Delete after screenshotting.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from '@/i18n'
import { AuthContext } from '@/auth/useAuth'
import PortalShell from './PortalShell'
import PortalCommandBar from './PortalCommandBar'
import TodayHero from './TodayHero'
import OverviewPanel from './panels/OverviewPanel'
import PlanPanel from './panels/PlanPanel'
import ProgressPanel from './panels/ProgressPanel'
import BookingsPanel from './panels/BookingsPanel'
import MessagesPanel from './panels/MessagesPanel'
import LibraryPanel from './panels/LibraryPanel'
import NutritionPanel from './panels/NutritionPanel'
import {
  Apple,
  CalendarClock,
  LayoutDashboard,
  Library as LibraryIcon,
  LineChart,
  MessageSquare,
  ClipboardList,
} from 'lucide-react'
import { Container } from '@deluxfit/ds'

const soon = days => new Date(Date.now() + days * 86400000).toISOString()

const data = {
  profile: { full_name: 'Marisol Vega' },
  entitlements: { hasMembership: true, hasCoaching: true },
  plans: [
    {
      id: 'p1',
      title: 'Phase II — Strength Block',
      summary: 'Four-week lower-body emphasis with a controlled deload in week four.',
      content: { weeks: [{ title: 'Week 1 — Volume' }, { title: 'Week 2 — Intensity' }, { title: 'Week 3 — Peak' }, { title: 'Week 4 — Deload' }] },
    },
  ],
  progress: [
    { id: 'e5', entry_date: '2026-06-20', weight: 148, body_fat: 22, notes: 'Strong squats, sleep solid.', photo_path: 'x/y.jpg' },
    { id: 'e4', entry_date: '2026-06-13', weight: 149, body_fat: 22.4, notes: 'Tired midweek.', photo_path: null },
    { id: 'e3', entry_date: '2026-06-06', weight: 150, body_fat: 23, notes: null, photo_path: null },
    { id: 'e2', entry_date: '2026-05-30', weight: 152, body_fat: 23.5, notes: 'Travel week.', photo_path: null },
    { id: 'e1', entry_date: '2026-05-23', weight: 153, body_fat: 24, notes: 'Baseline.', photo_path: null },
  ],
  nutrition: {
    calorie_target: 1850,
    protein_g: 150,
    carbs_g: 165,
    fat_g: 55,
    meal_structure: [
      { meal: 'Breakfast', suggestion: '40g protein + slow carbs' },
      { meal: 'Lunch', suggestion: 'Lean protein, greens, rice' },
      { meal: 'Dinner', suggestion: 'Protein + veg, lighter carbs' },
    ],
    resources: [{ label: 'Grocery list', url: 'https://example.com' }],
    notes: 'Hydrate hard on training days. Pre-log dinners.',
  },
  bookings: [
    { id: 'b1', slot_start: soon(2), status: 'confirmed', service: 'single_session', training_focus: 'Lower body' },
    { id: 'b0', slot_start: soon(-7), status: 'completed', service: 'single_session', training_focus: 'Full body' },
  ],
  messages: [
    { id: 'm1', sender: 'coach', body: 'Great work this week — let’s push squats.', created_at: soon(-1) },
    { id: 'm2', sender: 'client', body: 'Thanks Angie! Feeling strong.', created_at: soon(-0.9) },
  ],
  content: [
    { id: 'c1', title: 'Hip Mobility Flow', description: '10-minute daily routine.', media_type: 'video', category: 'workout', access_level: 'membership', url: 'https://example.com' },
    { id: 'c2', title: 'Protein Basics', description: 'How to hit your target.', media_type: 'article', category: 'nutrition', access_level: 'coaching', url: 'https://example.com' },
    { id: 'c3', title: 'Sleep & Recovery', description: 'Why it matters.', media_type: 'pdf', category: 'education', access_level: 'membership', media_path: 'x/z.pdf' },
  ],
  user: { id: 'u1', email: 'marisol@example.com' },
  reloadProgress: async () => {},
  reloadMessages: async () => {},
}

const SECTIONS = [
  { id: 'overview', icon: LayoutDashboard, Panel: OverviewPanel },
  { id: 'plan', icon: ClipboardList, Panel: PlanPanel },
  { id: 'progress', icon: LineChart, Panel: ProgressPanel },
  { id: 'nutrition', icon: Apple, Panel: NutritionPanel },
  { id: 'bookings', icon: CalendarClock, Panel: BookingsPanel },
  { id: 'messages', icon: MessageSquare, Panel: MessagesPanel },
  { id: 'library', icon: LibraryIcon, Panel: LibraryPanel },
]

const authValue = { user: data.user, signOut: () => {}, role: 'client', loading: false, profileLoading: false }
const displayName = data.profile.full_name
const monogram = displayName[0]

function Preview() {
  return (
    <LanguageProvider>
      <AuthContext.Provider value={authValue}>
        <PortalShell>
          <Container size="xl">
            <PortalCommandBar sections={SECTIONS} activeId="overview" displayName={displayName} monogram={monogram} entitlements={data.entitlements} />
            <TodayHero bookings={data.bookings} plans={data.plans} nutrition={data.nutrition} progress={data.progress} entitlements={data.entitlements} />
            <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-24">
              {SECTIONS.map(({ id, Panel }) => (
                <section key={id} id={id} className="scroll-mt-24">
                  <Panel {...data} />
                </section>
              ))}
            </div>
          </Container>
        </PortalShell>
      </AuthContext.Provider>
    </LanguageProvider>
  )
}

createRoot(document.getElementById('preview-root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>
)
