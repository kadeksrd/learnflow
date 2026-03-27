import { Metadata } from 'next'
import Link from 'next/link'
import { Zap, CheckCircle } from 'lucide-react'
import { RegisterForm } from './RegisterForm'
import { OAuthButtons } from '@/components/ui/OAuthButtons'

export const metadata: Metadata = { title: 'Daftar Gratis | LearnFlow' }

const perks = [
  'Akses ratusan kursus gratis',
  'Sertifikat kelulusan resmi',
  'Belajar kapan saja & di mana saja',
  'Komunitas pelajar aktif',
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cta/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">

        {/* Left: Benefits (hidden on mobile) */}
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-xl shadow-accent/30">
              <Zap size={22} className="text-white" />
            </div>
            <span className="font-syne font-extrabold text-2xl text-gradient">LearnFlow</span>
          </Link>

          <h2 className="font-syne font-extrabold text-4xl leading-tight mb-4">
            Mulai perjalanan<br />
            belajarmu <span className="text-gradient">sekarang.</span>
          </h2>
          <p className="text-text-muted mb-8 leading-relaxed">
            Bergabung dengan ribuan pelajar yang sudah meningkatkan skill dan karir mereka bersama LearnFlow.
          </p>

          <ul className="space-y-4">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle size={13} className="text-green-400" />
                </div>
                <span className="text-sm text-text-muted">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="mt-10 p-5 bg-card border border-slate-200 rounded-2xl">
            <div className="flex -space-x-2 mb-3">
              {['A','B','C','D','E'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold mb-0.5">Bergabung dengan 10,000+ pelajar</p>
            <p className="text-text-muted text-xs">yang sudah meningkatkan skill mereka</p>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          {/* Mobile logo */}
          <div className="text-center mb-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-syne font-extrabold text-xl text-gradient">LearnFlow</span>
            </Link>
          </div>

          <div className="bg-card border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
            <h1 className="font-syne font-bold text-xl mb-1">Buat akun gratis</h1>
            <p className="text-text-muted text-sm mb-6">Gratis selamanya, tidak butuh kartu kredit</p>

            {/* OAuth */}
            <OAuthButtons redirectTo="/dashboard" mode="register" />

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-text-dim font-medium px-2">atau dengan email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Email form */}
            <RegisterForm />
          </div>

          <p className="text-center mt-5 text-sm text-text-muted">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-accent-light font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
