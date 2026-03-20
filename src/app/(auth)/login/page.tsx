import { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { OAuthButtons } from '@/components/ui/OAuthButtons'

export const metadata: Metadata = { title: 'Masuk — LearnFlow' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-cta/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-xl shadow-accent/30">
              <Zap size={22} className="text-white" />
            </div>
            <span className="font-syne font-extrabold text-2xl text-gradient">LearnFlow</span>
          </Link>
          <h1 className="font-syne font-bold text-2xl mb-2">Selamat datang kembali!</h1>
          <p className="text-text-muted text-sm">Masuk untuk melanjutkan belajar</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/30">

          {/* OAuth Buttons */}
          <OAuthButtons redirectTo="/dashboard" mode="login" />

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-text-dim font-medium px-2">atau dengan email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Email form */}
          <LoginForm />

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <Link href="#" className="text-xs text-text-muted hover:text-accent-light transition-colors">
              Lupa password?
            </Link>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-text-muted">
          Belum punya akun?{' '}
          <Link href="/register" className="text-accent-light font-semibold hover:underline">
            Daftar gratis sekarang
          </Link>
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {['🔒 SSL Terenkripsi', '🛡️ Data Aman', '✅ Terpercaya'].map(badge => (
            <span key={badge} className="text-xs text-text-dim">{badge}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
