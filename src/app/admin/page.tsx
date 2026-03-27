import { createClient } from '@/lib/supabase/server'
import { TrendingUp, ShoppingBag, BookOpen, Users, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('user_courses').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, products(title, thumbnail)').eq('status', 'paid').order('paid_at', { ascending: false }).limit(5) as any,
  ])
  const { data: revData } = await supabase.from('orders').select('amount').eq('status', 'paid') as any
  const totalRevenue = revData?.reduce((s: number, o: any) => s + (o.amount || 0), 0) || 0

  return (
    <div className="p-4 sm:p-10 space-y-10">
      <div>
        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl mb-2 text-text">Admin Dashboard</h1>
        <p className="text-text-muted text-sm font-medium">Selamat datang kembali! Berikut ringkasan performa platform kamu hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pendapatan', value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(totalRevenue), icon: TrendingUp, color: 'text-cta', bg: 'bg-cta/5' },
          { label: 'Order Berhasil', value: (orderCount || 0).toString(), icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/5' },
          { label: 'Produk Aktif', value: (productCount || 0).toString(), icon: BookOpen, color: 'text-accent-light', bg: 'bg-accent/5' },
          { label: 'Siswa Terdaftar', value: (userCount || 0).toString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/5' },
        ].map(stat => (
          <div key={stat.label} className="group p-6 bg-card border border-slate-200 rounded-[2rem] hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div className={cn("font-syne font-extrabold text-3xl mb-1 tracking-tight", stat.color)}>{stat.value}</div>
            <div className="text-text-muted text-[11px] font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-syne font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-accent" /> Order Terbaru
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-accent hover:text-accent-light flex items-center gap-1 group">
              Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders?.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {(order.products as any)?.thumbnail ? (
                      <img src={(order.products as any).thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent/40"><BookOpen size={20} /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text truncate">{(order.products as any)?.title}</div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                      {order.paid_at ? new Date(order.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 px-2">
                  <div className="text-sm font-extrabold text-green-500">
                    +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                  </div>
                  <div className="text-[10px] font-bold text-green-500/50 uppercase tracking-widest mt-0.5">Paid</div>
                </div>
              </div>
            )) || (
              <div className="text-center py-10 text-text-muted space-y-2">
                <ShoppingBag size={40} className="mx-auto opacity-20" />
                <p className="text-sm font-medium">Belum ada transaksi masuk.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-accent to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-accent/20 overflow-hidden relative group">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
             <h3 className="font-syne font-extrabold text-xl mb-3 relative z-10">Bantu Siswa Belajar?</h3>
             <p className="text-white/80 text-xs mb-8 leading-relaxed relative z-10 font-medium">Kamu bisa menambah materi baru atau mengimpor playlist YouTube langsung ke builder.</p>
             <Link href="/admin/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent rounded-xl text-xs font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all relative z-10">
               Buka Course Builder <Plus size={16} />
             </Link>
          </div>

          <div className="bg-card border border-slate-200 rounded-[2rem] p-6 space-y-4">
            <h3 className="font-syne font-bold text-sm text-text-muted px-2 uppercase tracking-widest">Akses Cepat</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Kelola Produk', href: '/admin/products', icon: ShoppingBag },
                { label: 'Daftar User', href: '/admin/users', icon: Users },
                { label: 'Settings Toko', href: '/admin/store-settings', icon: Clock },
              ].map(item => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-text-muted hover:text-accent group">
                  <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <item.icon size={16} />
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
