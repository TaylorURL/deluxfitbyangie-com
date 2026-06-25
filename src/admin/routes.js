import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarClock,
  Library as LibraryIcon,
  ClipboardList,
  Apple,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import AdminDashboard from './pages/AdminDashboard'
import AdminClients from './pages/AdminClients'
import AdminReview from './pages/AdminReview'
import AdminBookings from './pages/AdminBookings'
import AdminContent from './pages/AdminContent'
import AdminPlans from './pages/AdminPlans'
import AdminNutrition from './pages/AdminNutrition'
import AdminMemberships from './pages/AdminMemberships'
import AdminStaff from './pages/AdminStaff'

/**
 * ADMIN_ROUTES — the role-gated backend nav. Each entry is a sub-path under
 * `/admin`. The shell renders the matching component in the main slot and
 * highlights the matching sidebar item.
 *
 * Most pages are intentionally stubs in this foundation pass — they wire into
 * the nav and ship a titled empty state so the layout, role guard, and
 * navigation can be validated end-to-end before the CRUD work lands.
 */
export const ADMIN_ROUTES = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: AdminDashboard,
    exact: true,
  },
  { path: '/admin/clients', label: 'Clients', icon: Users, component: AdminClients },
  { path: '/admin/review', label: 'Monthly Review', icon: ClipboardCheck, component: AdminReview },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarClock, component: AdminBookings },
  { path: '/admin/content', label: 'Content', icon: LibraryIcon, component: AdminContent },
  { path: '/admin/plans', label: 'Plans', icon: ClipboardList, component: AdminPlans },
  { path: '/admin/nutrition', label: 'Nutrition', icon: Apple, component: AdminNutrition },
  {
    path: '/admin/memberships',
    label: 'Memberships',
    icon: CreditCard,
    component: AdminMemberships,
  },
  { path: '/admin/staff', label: 'Staff', icon: ShieldCheck, component: AdminStaff },
]

/**
 * Match an admin sub-route against the current pathname. Exact entries (the
 * dashboard) only match an identical path; the rest match by prefix so future
 * detail pages (e.g. /admin/clients/:id) inherit the parent nav highlight.
 */
export function matchAdminRoute(pathname) {
  const normalized = (pathname || '/admin').replace(/\/+$/, '').toLowerCase() || '/admin'
  // Prefer the longest matching prefix so /admin/clients beats /admin.
  const sorted = [...ADMIN_ROUTES].sort((a, b) => b.path.length - a.path.length)
  for (const route of sorted) {
    if (route.exact) {
      if (normalized === route.path) return route
    } else if (normalized === route.path || normalized.startsWith(`${route.path}/`)) {
      return route
    }
  }
  return ADMIN_ROUTES[0]
}
