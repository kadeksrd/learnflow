'use client'

import { User } from "@supabase/supabase-js"
import { ShieldCheck, Mail, Calendar } from "lucide-react"

export function ProfileHeader({ user }: { user: User }) {
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "User"
  const joinedAt = new Date(user.created_at).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border border-slate-200 rounded-3xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
      
      <div className="w-24 h-24 rounded-3xl bg-gradient-accent flex items-center justify-center text-white text-3xl font-syne font-extrabold shadow-2xl shadow-accent/20">
        {name[0].toUpperCase()}
      </div>

      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-gradient">{name}</h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit mx-auto sm:mx-0">
            <ShieldCheck size={12} className="text-green-400" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Terverifikasi</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-text-dim" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-text-dim" />
            <span>Bergabung {joinedAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
