'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FileText, GraduationCap, ShoppingCart, Zap, Star, Menu, X, Store, Link as LinkIcon, CreditCard, Search, Radio, Users } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const ALL_ITEMS = [
  { href: '/admin',                  icon: LayoutDashboard, label: 'Overview',          exact: true  },
  { href: '/admin/store-settings',   icon: Store,           label: 'Web Store CMS',     section: 'Marketing' },
  { href: '/admin/seo',              icon: Search,          label: 'SEO Global',         section: 'Marketing' },
  { href: '/admin/tracking',         icon: Radio,           label: 'Pixel & Tracking',   section: 'Marketing' },
  { href: '/admin/products',         icon: Package,         label: 'Products',           section: 'Konten'    },
  { href: '/admin/landing-pages',    icon: FileText,        label: 'Landing Pages',      section: 'Konten'    },
  { href: '/admin/courses',          icon: GraduationCap,   label: 'Course Builder',     section: 'Konten'    },
  { href: '/admin/suggestions',      icon: LinkIcon,        label: 'Suggestions',        section: 'Konten'    },
  { href: '/admin/payment-settings', icon: CreditCard,      label: 'Payment Gateway',    section: 'Bisnis'    },
  { href: '/admin/reviews',          icon: Star,            label: 'Reviews',            section: 'Bisnis'    },
  { href: '/admin/orders',           icon: ShoppingCart,    label: 'Orders',             section: 'Bisnis'    },
  { href: '/admin/users',            icon: Users,           label: 'Users',              section: 'Bisnis'    },
]

const BOTTOM_TABS = [
  { href: '/admin',                icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/store-settings', icon: Store,           label: 'CMS'                  },
  { href: '/admin/seo',            icon: Search,          label: 'SEO'                  },
  { href: '/admin/tracking',       icon: Radio,           label: 'Pixel'                },
  { href: '/admin/orders',         icon: ShoppingCart,    label: 'Orders'               },
]

export function AdminMobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const current = ALL_ITEMS.find(i => i.exact ? pathname === i.href : pathname.startsWith(i.href))

  const grouped = ALL_ITEMS.reduce((acc: any, item) => {
    const key = item.section || '_top'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-white/[0.07] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <div>
            <span className="font-syne font-bold text-sm text-gradient">Admin</span>
            {current && <span className="text-text-muted text-xs ml-2">/ {current.label}</span>}
          </div>
        </div>
        <button onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl bg-card border border-white/[0.07] text-text-muted">
          <Menu size={18} />
        </button>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-surface border-l border-white/[0.07] z-50 flex flex-col">
            <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center"><Zap size={13} className="text-white" /></div>
                <span className="font-syne font-bold text-sm text-gradient">LearnFlow Admin</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted"><X size={18} /></button>
            </div>
            <nav className="flex-1 p-3 overflow-auto">
              {/* Overview first */}
              {grouped['_top']?.map((item: any) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}
                    className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-0.5', isActive ? 'bg-accent/15 text-accent-light font-semibold' : 'text-text-muted hover:text-[#EEEEFF] hover:bg-white/5')}>
                    <Icon size={16} />{item.label}
                  </Link>
                )
              })}
              {/* Sections */}
              {['Marketing', 'Konten', 'Bisnis'].map(section => grouped[section] && (
                <div key={section}>
                  <div className="px-4 pt-4 pb-1 text-[10px] font-bold text-text-dim uppercase tracking-widest">{section}</div>
                  {grouped[section].map((item: any) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}
                        className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-0.5', isActive ? 'bg-accent/15 text-accent-light font-semibold' : 'text-text-muted hover:text-[#EEEEFF] hover:bg-white/5')}>
                        <Icon size={16} />{item.label}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-white/[0.07]">
              <Link href="/store" onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
                ← Lihat Website
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-white/[0.07] flex">
        {BOTTOM_TABS.map(({ href, icon: Icon, label, exact }: any) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium transition-all', isActive ? 'text-accent-light' : 'text-text-dim')}>
              <Icon size={18} />{label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
