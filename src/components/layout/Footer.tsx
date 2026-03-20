'use client'

import Link from 'next/link'
import { Zap, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Store Kursus', href: '/store' },
    { label: 'Semua Kategori', href: '/store' },
    { label: 'Kursus Gratis', href: '/store?filter=free' },
    { label: 'Kursus Premium', href: '/store?filter=paid' },
  ],
  Akun: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Daftar Gratis', href: '/register' },
    { label: 'Masuk', href: '/login' },
  ],
  Perusahaan: [
    { label: 'Tentang Kami', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Karir', href: '#' },
    { label: 'Hubungi Kami', href: '#' },
  ],
  Legal: [
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Kebijakan Refund', href: '#' },
  ],
}

const socials = [
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube,   href: '#', label: 'YouTube'   },
  { icon: Mail,      href: '#', label: 'Email'     },
]

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/[0.06] mt-24">
      {/* Top CTA Strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-syne font-extrabold text-xl mb-1">
              Mulai belajar hari ini. <span className="text-gradient">Gratis.</span>
            </h3>
            <p className="text-text-muted text-sm">Bergabung dengan ribuan pelajar yang sudah meningkatkan skill mereka.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/register"
              className="px-5 py-2.5 bg-cta hover:bg-cta-hover text-black font-syne font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5">
              Daftar Gratis →
            </Link>
            <Link href="/store"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#EEEEFF] rounded-xl text-sm transition-all border border-white/[0.07]">
              Lihat Kursus
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-syne font-extrabold text-xl text-gradient">LearnFlow</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              Platform kursus digital terbaik untuk belajar skill baru dan tingkatkan karir kamu.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-card border border-white/[0.07] flex items-center justify-center text-text-muted hover:text-accent-light hover:border-accent/30 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-text-muted mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-text-muted hover:text-[#EEEEFF] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-dim text-xs">
            © {new Date().getFullYear()} LearnFlow. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-text-dim text-xs">Dibuat dengan ❤️ di Indonesia</span>
            <div className="flex gap-1">
              {['🇮🇩'].map(flag => (
                <span key={flag} className="text-base">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
