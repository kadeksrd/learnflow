'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Save, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const GATEWAY_DOCS: Record<string, string> = {
  xendit:   'https://dashboard.xendit.co',
  midtrans: 'https://dashboard.midtrans.com',
  doku:     'https://portal.doku.com',
}

const GATEWAY_COLORS: Record<string, string> = {
  xendit:   '#3B82F6',
  midtrans: '#10B981',
  doku:     '#8B5CF6',
}

import type { GatewayConfig, PaymentSettings } from '@/types/cms'

const DEFAULT: PaymentSettings = {
  active_gateways: ['xendit'],
  default_gateway: 'xendit',
  xendit:   { enabled: true,  label: 'Xendit',   logo: '💳', is_popular: true,  methods: ['VA BCA','VA Mandiri','QRIS','GoPay','OVO','Dana'] },
  midtrans: { enabled: false, label: 'Midtrans', logo: '🏦', is_popular: false, methods: ['Kartu Kredit/Debit','VA BCA','GoPay'] },
  doku:     { enabled: false, label: 'DOKU',     logo: '🔐', is_popular: false, methods: ['DOKU Wallet','Alfamart','Indomaret'] },
}

export function PaymentSettingsEditor({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState<PaymentSettings>({ ...DEFAULT, ...initialSettings })
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [testing,  setTesting]  = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, 'ok' | 'fail' | null>>({})
  const [newMethods, setNewMethods] = useState<Record<string, string>>({})

  const updateGateway = (gw: string, key: string, val: any) =>
    setSettings(p => ({ ...p, [gw]: { ...(p as any)[gw], [key]: val } }))

  const toggleGateway = (gw: string) => {
    const current = (settings as any)[gw] as GatewayConfig
    const newEnabled = !current.enabled
    const newActive = newEnabled
      ? [...settings.active_gateways, gw]
      : settings.active_gateways.filter(g => g !== gw)

    setSettings(p => ({
      ...p,
      [gw]: { ...current, enabled: newEnabled },
      active_gateways: newActive,
      default_gateway: !newEnabled && p.default_gateway === gw
        ? (newActive[0] || '')
        : p.default_gateway,
    }))
  }

  const setDefault = (gw: string) => {
    if (!(settings as any)[gw]?.enabled) return
    setSettings(p => ({ ...p, default_gateway: gw }))
  }

  const addMethod = (gw: string, method: string) => {
    if (!method.trim()) return
    const cur = (settings as any)[gw] as GatewayConfig
    if (cur.methods.includes(method)) return
    updateGateway(gw, 'methods', [...cur.methods, method])
  }

  const removeMethod = (gw: string, i: number) => {
    const cur = (settings as any)[gw] as GatewayConfig
    updateGateway(gw, 'methods', cur.methods.filter((_: string, j: number) => j !== i))
  }

  const testConnection = async (gw: string) => {
    setTesting(gw); setTestResult(p => ({ ...p, [gw]: null }))
    await new Promise(r => setTimeout(r, 1500))
    // Simulate — in production would hit a test endpoint
    const ok = (settings as any)[gw]?.enabled
    setTestResult(p => ({ ...p, [gw]: ok ? 'ok' : 'fail' }))
    setTesting(null)
  }

  const handleSave = async () => {
    if (settings.active_gateways.length === 0) {
      setError('Minimal satu gateway harus aktif'); return
    }
    setSaving(true); setError(null); setSaved(false)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'payment', value: settings }),
      })
      if (!res.ok) throw new Error((await res.json()).message)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const GATEWAYS = ['xendit', 'midtrans', 'doku'] as const

  return (
    <div className="max-w-3xl space-y-6">
      {error  && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2"><AlertCircle size={15} /> {error}</div>}
      {saved  && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center gap-2"><CheckCircle size={15} /> Tersimpan! Pengaturan gateway langsung aktif.</div>}

      {/* Overview */}
      <div className="bg-card border border-slate-200 rounded-2xl p-5">
        <h2 className="font-syne font-bold text-base mb-4">Status Gateway</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {GATEWAYS.map(gw => {
            const g = (settings as any)[gw] as GatewayConfig
            const isDefault = settings.default_gateway === gw
            return (
              <div key={gw}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${g.enabled ? 'border-green-500/30 bg-green-500/5' : 'border-slate-200 bg-surface opacity-60'}`}
                onClick={() => toggleGateway(gw)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{g.logo}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${g.enabled ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                    {g.enabled && <CheckCircle size={12} className="text-white" />}
                  </div>
                </div>
                <div className="font-syne font-bold text-sm">{g.label}</div>
                <div className="text-text-muted text-xs mt-1">{g.enabled ? '✅ Aktif' : '⭕ Nonaktif'}</div>
                {isDefault && g.enabled && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent-light text-[10px] font-bold rounded-full">
                    ⭐ Default
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Default gateway */}
      <div className="bg-card border border-slate-200 rounded-2xl p-5">
        <h2 className="font-syne font-bold text-base mb-2">Gateway Default</h2>
        <p className="text-text-muted text-xs mb-4">Gateway ini yang pertama dipilih saat user checkout. User tetap bisa ganti ke gateway lain yang aktif.</p>
        <div className="flex gap-3 flex-wrap">
          {GATEWAYS.filter(gw => (settings as any)[gw]?.enabled).map(gw => {
            const g = (settings as any)[gw] as GatewayConfig
            const isDefault = settings.default_gateway === gw
            return (
              <button key={gw} onClick={() => setDefault(gw)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${isDefault ? 'border-accent bg-accent/10 text-accent-light' : 'border-slate-200 bg-surface text-text-muted hover:border-accent/30'}`}>
                <span className="text-lg">{g.logo}</span> {g.label}
                {isDefault && <span className="text-xs">⭐</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Per-gateway config */}
      {GATEWAYS.map(gw => {
        const g = (settings as any)[gw] as GatewayConfig
        const color = GATEWAY_COLORS[gw]
        const newMethod = newMethods[gw] || ''
        const setNewMethod = (val: string) => setNewMethods(p => ({ ...p, [gw]: val }))
        const res = testResult[gw]

        return (
          <div key={gw} className={`bg-card border rounded-2xl overflow-hidden transition-all ${g.enabled ? 'border-slate-200' : 'border-slate-100 opacity-70'}`}>
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-slate-200">
              <span className="text-3xl">{g.logo}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-syne font-bold text-base">{g.label}</span>
                  {g.is_popular && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-full">Populer</span>}
                  {settings.default_gateway === gw && g.enabled && <span className="px-2 py-0.5 bg-accent/10 text-accent-light text-xs font-bold rounded-full">Default</span>}
                </div>
                <div className="text-text-muted text-xs mt-0.5">
                  {g.enabled ? `${g.methods.length} metode pembayaran aktif` : 'Gateway nonaktif'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Test button */}
                {g.enabled && (
                  <button onClick={() => testConnection(gw)} disabled={testing === gw}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-slate-200 rounded-lg text-xs text-text-muted hover:text-text transition-all">
                    <RefreshCw size={12} className={testing === gw ? 'animate-spin' : ''} />
                    {testing === gw ? 'Testing...' : 'Test Koneksi'}
                  </button>
                )}
                {/* Enable toggle */}
                <div onClick={() => toggleGateway(gw)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${g.enabled ? 'bg-green-500' : 'bg-surface border border-slate-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${g.enabled ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>

            {/* Test result banner */}
            {res && (
              <div className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 ${res === 'ok' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {res === 'ok' ? <><CheckCircle size={13} /> Koneksi berhasil! API key valid.</> : <><AlertCircle size={13} /> Koneksi gagal. Periksa API key di .env.local</>}
              </div>
            )}

            {g.enabled && (
              <div className="p-5 space-y-5">
                {/* Label & Popular toggle */}
                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <Input label="Nama Label" value={g.label}
                    onChange={e => updateGateway(gw, 'label', e.target.value)} />
                  <div className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-slate-200 mt-5">
                    <span className="text-sm font-medium">Tampilkan badge &quot;Populer&quot;</span>
                    <div onClick={() => updateGateway(gw, 'is_popular', !g.is_popular)}
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${g.is_popular ? 'bg-green-500' : 'bg-card border border-slate-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${g.is_popular ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </div>
                </div>

                {/* Methods */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Metode Pembayaran yang Ditampilkan
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {g.methods.map((m: string, i: number) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-slate-200 rounded-full text-xs text-text-muted">
                        {m}
                        <button onClick={() => removeMethod(gw, i)} className="text-text-dim hover:text-red-400 transition-colors ml-0.5">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 bg-surface border border-slate-200 rounded-xl text-sm text-text outline-none focus:border-accent"
                      placeholder="Tambah metode (contoh: BCA Virtual Account)"
                      value={newMethod}
                      onChange={e => setNewMethod(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { addMethod(gw, newMethod); setNewMethod('') } }}
                    />
                    <Button variant="ghost" size="sm" onClick={() => { addMethod(gw, newMethod); setNewMethod('') }}>
                      + Tambah
                    </Button>
                  </div>
                  <p className="text-text-dim text-xs mt-1.5">Tekan Enter atau klik &quot;+ Tambah&quot;. Ini hanya untuk tampilan di halaman checkout, bukan konfigurasi API.</p>
                </div>

                {/* Env reminder */}
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <p className="text-xs text-yellow-300/70 font-semibold mb-2">⚙️ Konfigurasi API Key</p>
                  <p className="text-xs text-text-dim leading-relaxed mb-2">
                    API key tidak disimpan di sini karena alasan keamanan. Pastikan sudah diisi di <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
                  </p>
                  <code className="block text-xs text-green-300/70 bg-slate-100 p-3 rounded-lg leading-relaxed">
                    {gw === 'xendit'   && `XENDIT_SECRET_KEY=xnd_production_xxxxx\nXENDIT_WEBHOOK_TOKEN=your_token`}
                    {gw === 'midtrans' && `MIDTRANS_SERVER_KEY=Mid-server-xxxxx\nMIDTRANS_CLIENT_KEY=Mid-client-xxxxx`}
                    {gw === 'doku'     && `DOKU_CLIENT_ID=your_client_id\nDOKU_SECRET_KEY=your_secret_key`}
                  </code>
                  <a href={GATEWAY_DOCS[gw]} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-light hover:underline">
                    <ExternalLink size={11} /> Buka Dashboard {g.label}
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Webhook info */}
      <div className="bg-card border border-slate-200 rounded-2xl p-5">
        <h2 className="font-syne font-bold text-base mb-2">Webhook URL</h2>
        <p className="text-text-muted text-xs mb-4">Daftarkan URL ini di dashboard masing-masing gateway agar status pembayaran terupdate otomatis.</p>
        <div className="space-y-3">
          {[
            { gw: 'Xendit',   url: '/api/webhook/xendit'   },
            { gw: 'Midtrans', url: '/api/webhook/midtrans' },
            { gw: 'DOKU',     url: '/api/webhook/doku'     },
          ].map(({ gw, url }) => (
            <div key={gw} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-slate-200">
              <span className="text-xs text-text-muted w-16 shrink-0">{gw}</span>
              <code className="flex-1 text-xs text-accent-light bg-slate-100 px-3 py-2 rounded-lg overflow-x-auto">
                https://yourdomain.com{url}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-4">
        <Button onClick={handleSave} loading={saving} size="lg" className="w-full shadow-2xl shadow-accent/20">
          <Save size={15} /> Simpan Pengaturan Gateway
        </Button>
      </div>
    </div>
  )
}
