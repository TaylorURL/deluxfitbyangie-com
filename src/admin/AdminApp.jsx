import ProtectedRoute from '@/auth/ProtectedRoute'
import AdminShell from './AdminShell'

export default function AdminApp() {
  return (
    <ProtectedRoute allow={['staff']}>
      <AdminShell />
    </ProtectedRoute>
  )
}
