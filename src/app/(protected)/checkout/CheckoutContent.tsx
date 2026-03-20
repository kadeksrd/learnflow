'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Check, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function CheckoutContent({ product, user, enabledGateways, gatewayConfig, defaultGateway }: {
  product: any; user: any; enabledGateways: string[]; gatewayConfig: any; defaultGateway: string
}) {
  const [gateway, setGateway] = useState(defaultGateway)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const adminFee = Math.round(product.price * 0.025)
  const total = product.price + adminFee

  const handlePay = async () => {
    setIsLoading(true); setError(null)
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, gateway }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Terjadi kesalahan'); return }
      if (data.payment_url) window.location.href = data.payment_url
      else setError('Gagal mendapatkan link pembayaran')
    } catch { setError('Koneksi gagal, coba lagi') }
    finally { setIsLoading(false) }
  }

  const Summary = () => (
    <div className="bg-card border border-white/[0.07] rounded-2xl p-5 lg:sticky lg:top-24">
      <h2 className="font-syne font-bold text-sm mb-4">Ringkasan Order</h2>
      <div className="aspect-video rounded-xl overflow-hidden bg-surface mb-4 flex items-center justify-center text-4xl">
        {product.thumbnail ? <img src={product.thumbnail} alt="" className="w-full h-full object-cover"/> : '📚'}
      </div>
      <div className="font-semibold text-sm mb-1">{product.title}</div>
      <div className="text-text-muted text-xs mb-4">{(product.categories as any)?.name} · Akses Seumur Hidup</div>
      <ul className="space-y-2 mb-4">
        {['Akses seumur hidup','Sertifikat kelulusan','Update materi gratis','Garansi 30 hari'].map(item=>(
          <li key={item} className="flex items-center gap-2 text-xs text-text-muted">
            <Check size={12} className="text-green-400 shrink-0"/> {item}
          </li>
        ))}
      </ul>
      <div className="space-y-1.5 pt-3 border-t border-white/[0.07] mb-4">
        <div className="flex justify-between text-xs"><span className="text-text-muted">Harga kursus</span><span className="line-through text-text-dim">{formatPrice(product.price*2)}</span></div>
        <div className="flex justify-between text-xs"><span className="text-text-muted">Diskon 50%</span><span className="text-green-400">-{formatPrice(product.price)}</span></div>
        <div className="flex justify-between text-xs"><span className="text-text-muted">Biaya admin (2.5%)</span><span>{formatPrice(adminFee)}</span></div>
        <div className="flex justify-between font-syne font-extrabold text-base pt-2 border-t border-white/[0.07]">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>
      <Button size="lg" variant="cta" className="w-full font-syne" onClick={handlePay} loading={isLoading}>
        Bayar Sekarang <ChevronRight size={16}/>
      </Button>
      <p className="text-center text-xs text-text-dim mt-3">Dengan membayar, kamu setuju dengan syarat & ketentuan</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="font-syne font-extrabold text-xl sm:text-2xl mb-6 sm:mb-8">Checkout</h1>

        <div className="lg:hidden mb-6"><Summary/></div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-4">
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <h2 className="font-syne font-bold text-sm mb-4">Informasi Pembeli</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Nama Lengkap" defaultValue={user?.user_metadata?.full_name||''} placeholder="John Doe"/>
                <Input label="Email" type="email" defaultValue={user?.email||''} disabled hint="Email tidak bisa diubah"/>
                <Input label="Nomor WhatsApp" type="tel" placeholder="+62 812 xxxx xxxx" className="sm:col-span-2"/>
              </div>
            </div>

            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <h2 className="font-syne font-bold text-sm mb-4">Metode Pembayaran</h2>
              {enabledGateways.length === 0 ? (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-sm text-yellow-300/70">
                  ⚠️ Belum ada payment gateway yang aktif. Hubungi admin.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {enabledGateways.map(gw => {
                    const config = gatewayConfig[gw]
                    if (!config) return null
                    return (
                      <label key={gw} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${gateway===gw?'border-accent bg-accent/5':'border-white/[0.07] hover:border-accent/30'}`}>
                        <input type="radio" name="gateway" value={gw} checked={gateway===gw} onChange={()=>setGateway(gw)} className="sr-only"/>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${gateway===gw?'border-accent':'border-white/30'}`}>
                          {gateway===gw&&<div className="w-2.5 h-2.5 rounded-full bg-accent"/>}
                        </div>
                        <span className="text-xl shrink-0">{config.logo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{config.label}</span>
                            {config.is_popular&&<span className="px-1.5 py-0.5 bg-green-500/15 text-green-400 text-xs font-bold rounded">Populer</span>}
                          </div>
                          <p className="text-text-muted text-xs mt-0.5 truncate">
                            {Array.isArray(config.methods) ? config.methods.slice(0,4).join(', ') : ''}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
              <Shield size={16} className="text-green-400 shrink-0"/>
              <p className="text-xs text-text-muted">Pembayaran dilindungi enkripsi SSL. Akses kursus aktif otomatis setelah dikonfirmasi.</p>
            </div>

            {error&&<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
            <Button size="lg" variant="cta" className="w-full lg:hidden font-syne" onClick={handlePay} loading={isLoading}>
              Bayar Sekarang <ChevronRight size={16}/>
            </Button>
          </div>
          <div className="hidden lg:block"><Summary/></div>
        </div>
      </div>
    </div>
  )
}
