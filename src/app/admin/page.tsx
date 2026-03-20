import { createClient } from '@/lib/supabase/server'

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
    supabase.from('orders').select('*, products(title)').eq('status', 'paid').order('paid_at', { ascending: false }).limit(5),
  ])
  const { data: revData } = await supabase.from('orders').select('amount').eq('status', 'paid')
  const totalRevenue = revData?.reduce((s, o) => s + o.amount, 0) || 0

  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-1">Overview</h1>
      <p className="text-text-muted text-sm mb-6">Ringkasan platform LearnFlow</p>

      {/* Stats - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Revenue', value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(totalRevenue), color: 'text-cta' },
          { label: 'Paid Orders', value: (orderCount || 0).toString(), color: 'text-green-400' },
          { label: 'Active Products', value: (productCount || 0).toString(), color: 'text-accent-light' },
          { label: 'Enrolled Users', value: (userCount || 0).toString(), color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-white/[0.07] rounded-2xl p-4">
            <div className={`font-syne font-extrabold text-2xl ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-text-muted text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-white/[0.07] rounded-2xl p-4 sm:p-6">
        <h2 className="font-syne font-bold text-base mb-4">Order Terbaru</h2>
        <div className="space-y-3">
          {recentOrders?.map(order => (
            <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0 gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{(order.products as any)?.title}</div>
                <div className="text-text-muted text-xs">{order.paid_at ? new Date(order.paid_at).toLocaleDateString('id-ID') : '-'}</div>
              </div>
              <span className="text-sm font-bold text-green-400 shrink-0">
                +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(order.amount)}
              </span>
            </div>
          )) || <p className="text-text-muted text-sm">Belum ada order</p>}
        </div>
      </div>
    </div>
  )
}
