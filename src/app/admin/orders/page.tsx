import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase.from('orders')
    .select('*, products(title)').order('created_at', { ascending: false }).limit(100)

  const statusColor: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-400', pending: 'bg-yellow-500/10 text-yellow-400',
    failed: 'bg-red-500/10 text-red-400', expired: 'bg-slate-50 text-text-muted',
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-1">Orders</h1>
      <p className="text-text-muted text-sm mb-6">{orders?.length || 0} order terbaru</p>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {orders?.map(o => (
          <div key={o.id} className="bg-card border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{(o.products as any)?.title}</div>
                <div className="text-text-dim text-xs font-mono mt-0.5">{o.id.slice(0,8).toUpperCase()}</div>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${statusColor[o.status] || 'bg-slate-50 text-text-muted'}`}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted capitalize">{o.gateway || '-'}</span>
              <span className="font-bold">{formatPrice(o.amount)}</span>
            </div>
            <div className="text-text-dim text-xs mt-1">{new Date(o.created_at).toLocaleDateString('id-ID')}</div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-surface text-xs font-bold text-text-muted uppercase tracking-wider">
          <span>Produk</span><span>Gateway</span><span>Amount</span><span>Status</span><span>Tanggal</span>
        </div>
        {orders?.map(o => (
          <div key={o.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-t border-slate-200 hover:bg-card-hover transition-colors items-center">
            <div>
              <div className="font-medium text-sm truncate">{(o.products as any)?.title}</div>
              <div className="text-text-dim text-xs font-mono">{o.id.slice(0,8).toUpperCase()}</div>
            </div>
            <span className="text-sm text-text-muted capitalize">{o.gateway || '-'}</span>
            <span className="font-semibold text-sm">{formatPrice(o.amount)}</span>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold w-fit ${statusColor[o.status] || 'bg-slate-50 text-text-muted'}`}>{o.status}</span>
            <span className="text-text-muted text-xs">{new Date(o.created_at).toLocaleDateString('id-ID')}</span>
          </div>
        ))}
        {!orders?.length && <div className="text-center py-12 text-text-muted text-sm">Belum ada order</div>}
      </div>
    </div>
  )
}
