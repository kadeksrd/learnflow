'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, LayoutDashboard, LogOut, Menu, X, Zap, ChevronDown, BookOpen, Star, User as UserIcon, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

const categories = [
  { label: 'Marketing', slug: 'marketing', icon: '📱' },
  { label: 'Programming', slug: 'programming', icon: '💻' },
  { label: 'Business', slug: 'business', icon: '💼' },
  { label: 'Technology', slug: 'technology', icon: '🤖' },
  { label: 'Design', slug: 'design', icon: '🎨' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdowns on route change
  useEffect(() => { setCategoryOpen(false); setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: '/store', label: 'Store', icon: ShoppingBag },
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/profile', label: 'Profil', icon: UserIcon },
    ] : []),
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: BookOpen }] : []),
  ]

  if (pathname.includes('/dashboard/course/')) return null

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200'
          : 'bg-transparent border-b border-transparent'
      )}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-syne font-extrabold text-lg text-gradient hidden sm:block">LearnFlow</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {/* Kategori Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(p => !p)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  categoryOpen ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text hover:bg-slate-100'
                )}
              >
                Kategori <ChevronDown size={13} className={cn('transition-transform', categoryOpen && 'rotate-180')} />
              </button>

              {categoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-52 bg-surface border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-2 z-20">
                    {categories.map(cat => (
                      <Link key={cat.slug} href={`/store?category=${cat.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text hover:bg-slate-50 transition-all">
                        <span className="text-lg">{cat.icon}</span>
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {navLinks.filter(l => l.href !== '/profile').map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  pathname.startsWith(href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-slate-100'
                )}>
                {label}
              </Link>
            ))}
          </div>

           {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-muted hover:text-accent hover:bg-slate-100 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Avatar + name */}
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-text-muted max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                  <LogOut size={13} /> Keluar
                </button>
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-slate-100 transition-all">
                  Masuk
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-all shadow-lg shadow-accent/25">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden ml-auto p-2 rounded-xl text-text-muted hover:bg-slate-100 transition-all" onClick={() => setMobileOpen(p => !p)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-surface/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {/* Theme toggle mobile */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-slate-100 transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {/* Categories */}
            <div className="pb-3 mb-3 border-b border-slate-200">
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest px-3 mb-2">Kategori</p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/store?category=${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-slate-100 transition-all">
                    <span>{cat.icon}</span>{cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith(href) ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-slate-100')}>
                <Icon size={16} />{label}
              </Link>
            ))}

            {!user ? (
              <div className="pt-3 flex flex-col gap-2 border-t border-slate-200">
                <Link href="/login"
                  className="px-4 py-3 rounded-xl text-sm font-medium text-center border border-slate-200 text-text-muted hover:text-text transition-all">
                  Masuk
                </Link>
                <Link href="/register"
                  className="px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-accent to-accent-light text-white">
                  Daftar Gratis
                </Link>
              </div>
            ) : (
              <button onClick={() => { signOut(); setMobileOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-muted hover:bg-slate-100 transition-all border-t border-slate-200 pt-4 mt-2">
                <LogOut size={16} /> Keluar
              </button>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
