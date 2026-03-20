'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FileText, GraduationCap, Link as LinkIcon, ShoppingCart, Zap, Star, Store, CreditCard, Search, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',                  icon: LayoutDashboard, label: 'Overview',         exact: true },
  // --- Marketing ---
  { href: '/admin/store-settings',   icon: Store,           label: 'Web Store CMS',    badge: 'CMS',  divider: 'Marketing' },
  { href: '/admin/seo',              icon: Search,          label: 'SEO Global',        badge: '🔍' },
  { href: '/admin/tracking',         icon: Radio,           label: 'Pixel & Tracking',  badge: '📡' },
  // --- Konten ---
  { href: '/admin/products',         icon: Package,         label: 'Products',          divider: 'Konten' },
  { href: '/admin/landing-pages',    icon: FileText,        label: 'Landing Pages' },
  { href: '/admin/courses',          icon: GraduationCap,   label: 'Course Builder' },
  { href: '/admin/suggestions',      icon: LinkIcon,        label: 'Suggestions' },
  // --- Bisnis ---
  { href: '/admin/payment-settings', icon: CreditCard,      label: 'Payment Gateway',   divider: 'Bisnis' },
  { href: '/admin/reviews',          icon: Star,            label: 'Reviews' },
  { href: '/admin/orders',           icon: ShoppingCart,    label: 'Orders' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="bg-surface border-r border-white/[0.07] sticky top-0 h-screen flex flex-col">
      <div className="p-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-syne font-bold text-sm text-gradient">LearnFlow Admin</span>
        </div>
      </div>
      <nav className="flex-1 p-3 overflow-auto">
        {NAV.map(({ href, icon: Icon, label, exact, badge, divider }: any) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <div key={href}>
              {divider && (
                <div className="px-3 pt-4 pb-1.5">
                  <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{divider}</div>
                </div>
              )}
              <Link href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border mb-0.5',
                  isActive
                    ? 'bg-accent/10 text-accent-light border-accent/20 font-semibold'
                    : 'text-text-muted hover:text-[#EEEEFF] hover:bg-white/5 border-transparent'
                )}>
                <Icon size={16} />
                {label}
                {badge && (
                  <span className="ml-auto px-1.5 py-0.5 bg-cta/20 text-cta text-[10px] font-bold rounded">
                    {badge}
                  </span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.07]">
        <Link href="/store" className="flex items-center gap-2 text-xs text-text-muted hover:text-[#EEEEFF] px-3 py-2 transition-colors">
          ← Lihat Website
        </Link>
      </div>
    </aside>
  )
}
