import ProtectedRoute from '@/auth/ProtectedRoute'
import { ConfirmProvider } from '@/components/ConfirmDialog'
import AdminShell from './AdminShell'

export default function AdminApp() {
  return (
    <ProtectedRoute allow={['staff']}>
      <ConfirmProvider>
        <AdminShell />
      </ConfirmProvider>
    </ProtectedRoute>
  )
}
