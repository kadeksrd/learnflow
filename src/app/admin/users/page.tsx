import { createAdminClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/UsersTable'

export default async function AdminUsersPage() {
  const s = await createAdminClient()
  
  // Fetch users using admin API
  const { data: { users }, error } = await s.auth.admin.listUsers()

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          Gagal mengambil data user: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-1">Users Management</h1>
        <p className="text-text-muted text-sm">Kelola pengguna platform dan atur hak akses role.</p>
      </div>

      <UsersTable initialUsers={users as any[]} />
    </div>
  )
}
