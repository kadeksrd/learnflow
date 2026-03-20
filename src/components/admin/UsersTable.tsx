'use client'
import { useState } from 'react'
import { Search, Trash2, UserCog, Shield, ShieldCheck, Mail, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email: string
  user_metadata: {
    role?: string
    full_name?: string
  }
  created_at: string
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [editingEmail, setEditingEmail] = useState<{ id: string, email: string } | null>(null)

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.user_metadata?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Ubah role user ini menjadi ${newRole}?`)) return
    
    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      if (!res.ok) throw new Error('Gagal update role')
      
      setUsers(users.map(u => u.id === userId ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } } : u))
      alert('Role berhasil diperbarui')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  const handleUpdateEmail = async () => {
    if (!editingEmail) return
    if (!confirm(`Ubah email user menjadi ${editingEmail.email}?`)) return
    
    setLoading(editingEmail.id)
    try {
      const res = await fetch(`/api/admin/users/${editingEmail.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: editingEmail.email })
      })
      
      if (!res.ok) throw new Error('Gagal update email')
      
      setUsers(users.map(u => u.id === editingEmail.id ? { ...u, email: editingEmail.email } : u))
      alert('Email berhasil diperbarui')
      setEditingEmail(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Hapus user ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) return
    
    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus user')
      
      setUsers(users.filter(u => u.id !== userId))
      alert('User berhasil dihapus')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
          <Input 
            placeholder="Cari email atau nama..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden space-y-3">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-card border border-white/[0.07] rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <div className="font-bold text-[#EEEEFF] truncate">
                  {user.user_metadata?.full_name || 'No Name'}
                </div>
                {editingEmail?.id === user.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      className="bg-surface border border-accent/50 rounded-lg text-[10px] px-2 py-1 outline-none w-full"
                      value={editingEmail.email}
                      onChange={(e) => setEditingEmail({ ...editingEmail, email: e.target.value })}
                      autoFocus
                    />
                    <button onClick={handleUpdateEmail} className="text-accent-light hover:text-white transition-colors">
                      <ShieldCheck size={12} />
                    </button>
                    <button onClick={() => setEditingEmail(null)} className="text-text-dim hover:text-white transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="text-text-muted text-xs flex items-center gap-1 mt-0.5 group">
                    <Mail size={12} /> {user.email}
                    <button onClick={() => setEditingEmail({ id: user.id, email: user.email })} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-accent-light px-1">
                      <UserCog size={10} />
                    </button>
                  </div>
                )}
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                user.user_metadata?.role === 'admin' ? "bg-cta/20 text-cta" : "bg-white/5 text-text-muted"
              )}>
                {user.user_metadata?.role || 'user'}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <select 
                  className="bg-surface border border-white/[0.1] rounded-lg text-xs px-2 py-1 outline-none"
                  value={user.user_metadata?.role || 'user'}
                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  disabled={!!loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button 
                variant="danger" 
                size="sm" 
                className="h-8 w-8 !p-0"
                onClick={() => handleDeleteUser(user.id)}
                loading={loading === user.id}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1.5fr_100px] gap-4 px-5 py-3 bg-surface text-xs font-bold text-text-muted uppercase tracking-wider">
          <span>User</span>
          <span>Role</span>
          <span>Joined At</span>
          <span className="text-right">Aksi</span>
        </div>
        
        <div className="divide-y divide-white/[0.05]">
          {filteredUsers.map(user => (
            <div key={user.id} className="grid grid-cols-[2fr_1fr_1.5fr_100px] gap-4 px-5 py-4 items-center hover:bg-card-hover transition-colors">
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[#EEEEFF] truncate">
                  {user.user_metadata?.full_name || 'No Name'}
                </div>
                {editingEmail?.id === user.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      className="bg-surface border border-accent/50 rounded-lg text-xs px-2 py-1 outline-none w-full"
                      value={editingEmail.email}
                      onChange={(e) => setEditingEmail({ ...editingEmail, email: e.target.value })}
                      autoFocus
                    />
                    <button onClick={handleUpdateEmail} className="text-accent-light hover:text-white transition-colors">
                      <ShieldCheck size={14} />
                    </button>
                    <button onClick={() => setEditingEmail(null)} className="text-text-dim hover:text-white transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-text-muted text-xs truncate flex items-center gap-1.5 group">
                    {user.email}
                    <button onClick={() => setEditingEmail({ id: user.id, email: user.email })} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-accent-light">
                      <UserCog size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <select 
                  className={cn(
                    "bg-surface border border-white/[0.1] rounded-lg text-xs px-3 py-1.5 outline-none transition-all focus:border-accent/50",
                    user.user_metadata?.role === 'admin' ? "text-cta font-bold" : "text-text-muted"
                  )}
                  value={user.user_metadata?.role || 'user'}
                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  disabled={!!loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="text-text-muted text-xs flex items-center gap-1.5">
                <Calendar size={14} className="text-text-dim" />
                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              
              <div className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 !p-0 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDeleteUser(user.id)}
                  loading={loading === user.id}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-text-muted text-sm">
              Tidak ada user ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
