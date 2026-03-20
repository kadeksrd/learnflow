import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel | LearnFlow' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar layout */}
      <div className="hidden lg:grid lg:grid-cols-[240px_1fr] min-h-screen">
        <AdminSidebar />
        <main className="overflow-auto">{children}</main>
      </div>
      {/* Mobile: top bar + content + bottom nav */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <AdminMobileNav />
        <main className="flex-1 overflow-auto pb-20">{children}</main>
      </div>
    </div>
  )
}
