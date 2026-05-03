import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('ocm_admin')?.value
  const secret = process.env.ADMIN_SECRET

  if (!secret || !session || session !== secret) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
