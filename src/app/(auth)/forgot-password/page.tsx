import { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = { title: "Lupa Password | LearnFlow" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12 text-white">
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
            <span className="font-syne font-extrabold text-2xl text-gradient">
              LearnFlow
            </span>
          </Link>
          <h1 className="font-syne font-bold text-2xl mb-2">
            Lupa Password?
          </h1>
        </div>

        {/* Card */}
        <div className="bg-card border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/30">
          <ForgotPasswordForm />
        </div>

        {/* Support link */}
        <p className="text-center mt-8 text-xs text-text-dim">
          Butuh bantuan? <a href="mailto:support@learnflow.com" className="underline hover:text-text-muted">Hubungi tim support kami</a>
        </p>
      </div>
    </div>
  );
}
