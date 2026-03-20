'use client'

import { useState } from 'react'
import { Save, CheckCircle, AlertCircle, ExternalLink, Eye, EyeOff, Code, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const PLATFORM_DOCS: Record<string, string> = {
  gtm:        'https://tagmanager.google.com',
  ga4:        'https://analytics.google.com',
  facebook:   'https://www.facebook.com/events/manager',
  tiktok:     'https://ads.tiktok.com/i18n/events_manager',
  snapchat:   'https://ads.snapchat.com',
}

import type { TrackingSettings } from '@/types/cms'

const DEFAULT: TrackingSettings = {
  gtm_id: '', ga4_id: '',
  facebook_pixel_id: '', facebook_pixel_enabled: false,
  tiktok_pixel_id: '',   tiktok_pixel_enabled: false,
  snapchat_pixel_id: '', snapchat_pixel_enabled: false,
  head_scripts: '', body_scripts: '',
}

export function TrackingEditor({ initialSettings }: { initialSettings: any }) {
  const [s, setS] = useState<TrackingSettings>({ ...DEFAULT, ...initialSettings })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof TrackingSettings, val: any) => setS(p => ({ ...p, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'tracking', value: s }),
      })
      if (!res.ok) throw new Error((await res.json()).message)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ value, onChange, label, sub }: any) => (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-sm">{label}</div>
        {sub && <div className="text-text-muted text-xs mt-0.5">{sub}</div>}
      </div>
      <div onClick={onChange} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-green-500' : 'bg-surface border border-white/20'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-4' : 'left-0.5'}`} />
      </div>
    </div>
  )

  const Section = ({ icon, title, color, children }: any) => (
    <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]`} style={{ background: `${color}08` }}>
        <span className="text-2xl">{icon}</span>
        <h2 className="font-syne font-bold text-base">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-5">
      {error  && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2"><AlertCircle size={15}/> {error}</div>}
      {saved  && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center gap-2"><CheckCircle size={15}/> Tersimpan! Tracking aktif di seluruh halaman.</div>}

      {/* Priority recommendation */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-3">
        <Zap size={16} className="text-accent-light shrink-0 mt-0.5" />
        <div className="text-sm text-text-muted">
          <span className="text-accent-light font-semibold">Rekomendasi:</span> Gunakan <strong className="text-[#EEEEFF]">Google Tag Manager (GTM)</strong> sebagai pusat — lalu pasang FB Pixel, TikTok Pixel, dan GA4 dari dalam GTM. Lebih fleksibel dan tidak perlu deploy ulang setiap ganti tracking.
        </div>
      </div>

      {/* ── Google Tag Manager ── */}
      <Section icon="📦" title="Google Tag Manager (GTM)" color="#3B82F6">
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300/80 mb-2">
          GTM adalah container untuk semua tag lainnya. Jika kamu pakai GTM, isi ID di sini dan pasang FB Pixel / TikTok Pixel di dalam dashboard GTM (tidak perlu isi di bawah).
        </div>
        <div className="flex gap-3 items-end">
          <Input label="GTM Container ID" placeholder="GTM-XXXXXXX"
            value={s.gtm_id} onChange={e => set('gtm_id', e.target.value)}
            hint="Format: GTM-XXXXXXX — bisa ditemukan di tagmanager.google.com" />
          <a href={PLATFORM_DOCS.gtm} target="_blank" rel="noopener noreferrer"
            className="mb-0.5 flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-white/[0.07] rounded-xl text-xs text-text-muted hover:text-[#EEEEFF] transition-all shrink-0">
            <ExternalLink size={12}/> Dashboard
          </a>
        </div>
        {s.gtm_id && (
          <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-xl text-xs text-green-400">
            ✓ GTM aktif dengan ID <strong>{s.gtm_id}</strong> — script akan diinjeksi di &lt;head&gt; dan &lt;body&gt;
          </div>
        )}
      </Section>

      {/* ── Google Analytics 4 ── */}
      <Section icon="📊" title="Google Analytics 4 (GA4)" color="#F59E0B">
        <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-yellow-300/80 mb-2">
          Isi ini hanya jika <strong>tidak pakai GTM</strong>. Jika sudah pakai GTM, tambahkan GA4 melalui GTM Tag.
        </div>
        <div className="flex gap-3 items-end">
          <Input label="GA4 Measurement ID" placeholder="G-XXXXXXXXXX"
            value={s.ga4_id} onChange={e => set('ga4_id', e.target.value)}
            hint="Format: G-XXXXXXXXXX — dari Google Analytics → Admin → Data Streams" />
          <a href={PLATFORM_DOCS.ga4} target="_blank" rel="noopener noreferrer"
            className="mb-0.5 flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-white/[0.07] rounded-xl text-xs text-text-muted hover:text-[#EEEEFF] transition-all shrink-0">
            <ExternalLink size={12}/> Analytics
          </a>
        </div>
      </Section>

      {/* ── Facebook Pixel ── */}
      <Section icon="📘" title="Facebook / Meta Pixel" color="#1877F2">
        <Toggle value={s.facebook_pixel_enabled}
          onChange={() => set('facebook_pixel_enabled', !s.facebook_pixel_enabled)}
          label="Aktifkan Facebook Pixel"
          sub="Tracking ViewContent, Purchase, dan Lead di seluruh halaman" />
        {s.facebook_pixel_enabled && (
          <>
            <div className="flex gap-3 items-end">
              <Input label="Facebook Pixel ID" placeholder="123456789012345"
                value={s.facebook_pixel_id} onChange={e => set('facebook_pixel_id', e.target.value)}
                hint="Temukan di Events Manager → Data Sources" />
              <a href={PLATFORM_DOCS.facebook} target="_blank" rel="noopener noreferrer"
                className="mb-0.5 flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-white/[0.07] rounded-xl text-xs text-text-muted hover:text-[#EEEEFF] transition-all shrink-0">
                <ExternalLink size={12}/> Events Manager
              </a>
            </div>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300/80">
              <p className="font-semibold mb-1">Events yang ter-track otomatis:</p>
              <p><strong>PageView</strong> — setiap halaman · <strong>ViewContent</strong> — halaman kursus · <strong>InitiateCheckout</strong> — checkout · <strong>Purchase</strong> — setelah bayar</p>
            </div>
          </>
        )}
      </Section>

      {/* ── TikTok Pixel ── */}
      <Section icon="🎵" title="TikTok Pixel" color="#FF3B5C">
        <Toggle value={s.tiktok_pixel_enabled}
          onChange={() => set('tiktok_pixel_enabled', !s.tiktok_pixel_enabled)}
          label="Aktifkan TikTok Pixel"
          sub="Tracking untuk iklan TikTok Ads — ViewContent, PlaceAnOrder" />
        {s.tiktok_pixel_enabled && (
          <>
            <div className="flex gap-3 items-end">
              <Input label="TikTok Pixel ID" placeholder="C1XXXXXXXXXXXXXXXXX"
                value={s.tiktok_pixel_id} onChange={e => set('tiktok_pixel_id', e.target.value)}
                hint="Temukan di TikTok Ads Manager → Library → Events" />
              <a href={PLATFORM_DOCS.tiktok} target="_blank" rel="noopener noreferrer"
                className="mb-0.5 flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-white/[0.07] rounded-xl text-xs text-text-muted hover:text-[#EEEEFF] transition-all shrink-0">
                <ExternalLink size={12}/> Events Manager
              </a>
            </div>
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-300/80">
              <p className="font-semibold mb-1">Events otomatis:</p>
              <p><strong>PageView</strong> · <strong>ViewContent</strong> — kursus · <strong>InitiateCheckout</strong> · <strong>PlaceAnOrder</strong> — pembelian</p>
            </div>
          </>
        )}
      </Section>

      {/* ── Snapchat Pixel ── */}
      <Section icon="👻" title="Snapchat Pixel" color="#FFFC00">
        <Toggle value={s.snapchat_pixel_enabled}
          onChange={() => set('snapchat_pixel_enabled', !s.snapchat_pixel_enabled)}
          label="Aktifkan Snapchat Pixel"
          sub="Tracking untuk Snapchat Ads" />
        {s.snapchat_pixel_enabled && (
          <div className="flex gap-3 items-end">
            <Input label="Snapchat Pixel ID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={s.snapchat_pixel_id} onChange={e => set('snapchat_pixel_id', e.target.value)} />
            <a href={PLATFORM_DOCS.snapchat} target="_blank" rel="noopener noreferrer"
              className="mb-0.5 flex items-center gap-1.5 px-3 py-2.5 bg-surface border border-white/[0.07] rounded-xl text-xs text-text-muted hover:text-[#EEEEFF] transition-all shrink-0">
              <ExternalLink size={12}/> Snap Ads
            </a>
          </div>
        )}
      </Section>

      {/* ── Custom Scripts ── */}
      <Section icon="💻" title="Skrip Kustom" color="#8B5CF6">
        <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-xs text-purple-300/80 mb-2">
          Untuk tracking tool lain (Hotjar, Crisp, Intercom, dll). Tulis JavaScript langsung tanpa tag &lt;script&gt;.
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <Code size={11} className="inline mr-1" />Skrip di &lt;head&gt; (setelah semua tag lain)
          </label>
          <textarea rows={4}
            className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-xs font-mono outline-none focus:border-accent resize-none"
            placeholder={'// Contoh: Hotjar\n(function(h,o,t,j,a,r){ h.hj = h.hj || function()... })();'}
            value={s.head_scripts}
            onChange={e => set('head_scripts', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <Code size={11} className="inline mr-1" />Skrip tambahan (body)
          </label>
          <textarea rows={3}
            className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-xs font-mono outline-none focus:border-accent resize-none"
            placeholder="// Skrip tambahan di body..."
            value={s.body_scripts}
            onChange={e => set('body_scripts', e.target.value)} />
        </div>
      </Section>

      {/* Status summary */}
      <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
        <h2 className="font-syne font-bold text-base mb-4">Status Tracking</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'GTM',      active: !!s.gtm_id,                       icon: '📦' },
            { label: 'GA4',      active: !!s.ga4_id,                        icon: '📊' },
            { label: 'Facebook', active: s.facebook_pixel_enabled && !!s.facebook_pixel_id, icon: '📘' },
            { label: 'TikTok',   active: s.tiktok_pixel_enabled   && !!s.tiktok_pixel_id,   icon: '🎵' },
          ].map(({ label, active, icon }) => (
            <div key={label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${active ? 'bg-green-500/5 border-green-500/20' : 'bg-surface border-white/[0.06]'}`}>
              <span className="text-lg">{icon}</span>
              <div>
                <div className="font-semibold text-xs">{label}</div>
                <div className={`text-xs ${active ? 'text-green-400' : 'text-text-dim'}`}>{active ? '✓ Aktif' : '○ Nonaktif'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4">
        <Button onClick={handleSave} loading={saving} size="lg" className="w-full shadow-2xl shadow-accent/20">
          <Save size={15}/> Simpan Pengaturan Tracking
        </Button>
      </div>
    </div>
  )
}
