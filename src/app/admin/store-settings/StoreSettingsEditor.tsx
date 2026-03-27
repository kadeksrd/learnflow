'use client'

import { useState } from 'react'
import type { HomepageSettings, StoreSettings, CMSStat, CMSStep, CMSTestimonial } from '@/types/cms'
import { Plus, Trash2, GripVertical, Save, Eye, Globe, ShoppingBag, Star, Users, MessageSquare, Zap, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { formatPrice } from '@/lib/utils'

interface Product {
  id:         string
  title:      string
  thumbnail:  string | null
  is_free:    boolean
  price:      number
  categories: { name: string } | null
}

interface Props {
  initialHomepage: Partial<HomepageSettings>
  initialStore:    Partial<StoreSettings>
  products:        Product[]
}

const SECTION_TABS = [
  { id: 'hero',       icon: Zap,          label: 'Hero Section'     },
  { id: 'stats',      icon: Star,         label: 'Stats'            },
  { id: 'featured',   icon: ShoppingBag,  label: 'Kursus Pilihan'   },
  { id: 'howitworks', icon: CheckCircle,  label: 'Cara Kerja'       },
  { id: 'about',      icon: Users,        label: 'Tentang Kami'     },
  { id: 'testimoni',  icon: MessageSquare,label: 'Testimoni'        },
  { id: 'cta',        icon: Globe,        label: 'CTA Section'      },
  { id: 'store',      icon: ShoppingBag,  label: 'Halaman Store'    },
] as const

type Tab = typeof SECTION_TABS[number]['id']

export function StoreSettingsEditor({ initialHomepage, initialStore, products }: Props) {
  const [tab, setTab] = useState<Tab>('hero')
  const [hp, setHp] = useState<Partial<HomepageSettings>>({ ...initialHomepage })
  const [store, setStore] = useState<Partial<StoreSettings>>({ ...initialStore })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper: update homepage field
  const hpSet = <K extends keyof HomepageSettings>(key: K, val: HomepageSettings[K]) =>
    setHp(p => ({ ...p, [key]: val } as HomepageSettings))
  const storeSet = <K extends keyof StoreSettings>(key: K, val: StoreSettings[K]) =>
    setStore(p => ({ ...p, [key]: val } as StoreSettings))

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false)
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/admin/site-settings', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'homepage', value: hp }),
        }),
        fetch('/api/admin/site-settings', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'store', value: store }),
        }),
      ])
      if (!r1.ok || !r2.ok) throw new Error('Gagal menyimpan')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // Stats helpers
  const stats: any[] = hp.stats || []
  const updateStat = (i: number, key: string, val: string) =>
    hpSet('stats', stats.map((s: any, j: number) => j === i ? { ...s, [key]: val } : s))

  // How it works helpers
  const steps: any[] = hp.how_it_works || []
  const updateStep = (i: number, key: string, val: string) =>
    hpSet('how_it_works', steps.map((s: any, j: number) => j === i ? { ...s, [key]: val } : s))
  const moveStep = (i: number, dir: number) => {
    const arr = [...steps]
    const ni = i + dir
    if (ni < 0 || ni >= arr.length) return
    ;[arr[i], arr[ni]] = [arr[ni], arr[i]]
    hpSet('how_it_works', arr)
  }

  // Testimonials helpers
  const testimonials: any[] = hp.testimonials || []
  const updateTestimonial = (i: number, key: string, val: any) =>
    hpSet('testimonials', testimonials.map((t: any, j: number) => j === i ? { ...t, [key]: val } : t))

  // Featured courses
  const featuredIds: string[] = hp.featured_product_ids || []
  const toggleFeatured = (id: string) => {
    if (featuredIds.includes(id)) {
      hpSet('featured_product_ids', featuredIds.filter((f: string) => f !== id))
    } else if (featuredIds.length < 6) {
      hpSet('featured_product_ids', [...featuredIds, id])
    }
  }

  const SectionCard = ({ children, title, hint }: any) => (
    <div className="bg-card border border-slate-200 rounded-2xl p-5 sm:p-6">
      {title && (
        <div className="mb-5">
          <h2 className="font-syne font-bold text-base">{title}</h2>
          {hint && <p className="text-text-muted text-xs mt-1">{hint}</p>}
        </div>
      )}
      {children}
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      {/* Alerts */}
      {error  && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      {saved  && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center gap-2"><CheckCircle size={15} /> Tersimpan! Perubahan langsung aktif di website.</div>}

      {/* Tab navigation — scrollable */}
      <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-1 min-w-max bg-surface p-1 rounded-2xl border border-slate-200">
          {SECTION_TABS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                tab === id ? 'bg-card text-text shadow-sm' : 'text-text-muted hover:text-text'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      {tab === 'hero' && (
        <SectionCard title="Hero Section" hint="Bagian paling atas halaman utama yang pertama dilihat pengunjung">
          <div className="space-y-4">
            <Input label="Badge / Label kecil di atas headline"
              value={hp.hero_badge || ''} onChange={e => hpSet('hero_badge', e.target.value)}
              hint='Contoh: "Platform Edukasi Digital #1 Indonesia"' />
            <Input label="Headline utama (baris 1)"
              value={hp.hero_headline || ''} onChange={e => hpSet('hero_headline', e.target.value)}
              hint="Kalimat utama besar di hero. Bisa 1-2 baris." />
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sub-headline</label>
              <textarea rows={3}
                className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none transition-all"
                value={hp.hero_subheadline || ''} onChange={e => hpSet('hero_subheadline', e.target.value)}
                placeholder="Kalimat deskripsi di bawah headline..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Teks tombol CTA utama (kiri)"
                value={hp.hero_cta_primary || ''} onChange={e => hpSet('hero_cta_primary', e.target.value)}
                hint='Contoh: "Mulai Belajar Gratis"' />
              <Input label="Teks tombol CTA sekunder (kanan)"
                value={hp.hero_cta_secondary || ''} onChange={e => hpSet('hero_cta_secondary', e.target.value)}
                hint='Contoh: "Lihat Demo"' />
            </div>

            {/* Preview */}
            <div className="mt-2 p-4 bg-bg border border-slate-200 rounded-xl">
              <p className="text-xs text-text-dim mb-3">Preview:</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-bold mb-3">
                ✨ {hp.hero_badge || '...'}
              </div>
              <h3 className="font-syne font-extrabold text-2xl mb-2">{hp.hero_headline || '...'}</h3>
              <p className="text-text-muted text-sm mb-4">{hp.hero_subheadline || '...'}</p>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl text-sm font-bold">{hp.hero_cta_primary || 'CTA Utama'}</span>
                <span className="px-4 py-2 bg-slate-50 border border-slate-200 text-text rounded-xl text-sm">{hp.hero_cta_secondary || 'CTA Sekunder'}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <SectionCard title="Stats / Angka Statistik" hint="4 angka yang tampil di bawah hero — tampilkan pencapaian platform">
          <div className="space-y-3">
            {stats.map((s: any, i: number) => (
              <div key={i} className="flex gap-3 items-center p-3 bg-surface rounded-xl">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input label={i === 0 ? "Angka / Value" : undefined} placeholder="10,000+"
                    value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                  <Input label={i === 0 ? "Label" : undefined} placeholder="Pelajar Aktif"
                    value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} />
                </div>
                <button onClick={() => hpSet('stats', stats.filter((_: any, j: number) => j !== i))}
                  className="text-text-dim hover:text-red-400 transition-colors p-1 mt-auto mb-1 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {stats.length < 6 && (
              <button onClick={() => hpSet('stats', [...stats, { value: '', label: '' }])}
                className="flex items-center gap-2 text-sm text-accent-light hover:text-accent transition-colors">
                <Plus size={14} /> Tambah Stat
              </button>
            )}

            {/* Preview */}
            <div className="mt-2 p-4 bg-bg border border-slate-200 rounded-xl">
              <p className="text-xs text-text-dim mb-3">Preview:</p>
              <div className={`grid grid-cols-${Math.min(stats.length, 4)} gap-4`}>
                {stats.slice(0, 4).map((s: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="font-syne font-extrabold text-2xl text-accent-light">{s.value || '...'}</div>
                    <div className="text-text-muted text-xs mt-1">{s.label || '...'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── FEATURED COURSES ── */}
      {tab === 'featured' && (
        <SectionCard title="Kursus Pilihan di Homepage" hint="Pilih maksimal 6 kursus yang ditampilkan di section 'Kursus Terpopuler' homepage">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Judul section"
                value={hp.featured_section_title || ''} onChange={e => hpSet('featured_section_title', e.target.value)}
                placeholder="Kursus Terpopuler" />
              <Input label="Badge section"
                value={hp.featured_section_badge || ''} onChange={e => hpSet('featured_section_badge', e.target.value)}
                placeholder="Marketplace" />
            </div>

            <div>
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Pilih Kursus ({featuredIds.length}/6)
              </div>
              <div className="space-y-2">
                {products.map(p => {
                  const selected = featuredIds.includes(p.id)
                  return (
                    <div key={p.id}
                      onClick={() => toggleFeatured(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                        selected
                          ? 'bg-accent/10 border-accent/40'
                          : 'bg-surface border-slate-200 hover:border-slate-300'
                      }`}>
                      {/* Thumbnail */}
                      <div className="w-12 h-9 rounded-lg bg-card flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{p.title}</div>
                        <div className="text-text-muted text-xs">{(p.categories as any)?.name} · {p.is_free ? 'Gratis' : formatPrice(p.price)}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected ? 'border-accent bg-accent' : 'border-slate-300'
                      }`}>
                        {selected && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>

              {featuredIds.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-yellow-300/70">
                  ⚠️ Jika tidak ada kursus yang dipilih, homepage akan menampilkan 6 kursus terbaru secara otomatis.
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── HOW IT WORKS ── */}
      {tab === 'howitworks' && (
        <SectionCard title="Section 'Cara Kerja'" hint="3 langkah yang menjelaskan alur belajar di platform">
          <div className="space-y-3">
            {steps.map((s: any, i: number) => (
              <div key={i} className="p-4 bg-surface rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-sm text-accent-light">Langkah {s.num || i + 1}</span>
                  <div className="flex gap-2">
                    <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-slate-50 text-text-dim disabled:opacity-30"><ArrowUp size={13} /></button>
                    <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="p-1.5 rounded-lg hover:bg-slate-50 text-text-dim disabled:opacity-30"><ArrowDown size={13} /></button>
                    <button onClick={() => hpSet('how_it_works', steps.filter((_: any, j: number) => j !== i))} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[60px_60px_1fr] gap-3">
                  <Input label="Nomor" value={s.num} onChange={e => updateStep(i, 'num', e.target.value)} placeholder="01" />
                  <Input label="Ikon" value={s.icon} onChange={e => updateStep(i, 'icon', e.target.value)} placeholder="📚" />
                  <Input label="Judul" value={s.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="Pilih Kursus" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Deskripsi</label>
                  <textarea rows={2}
                    className="w-full px-4 py-3 bg-card border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
                    value={s.desc} onChange={e => updateStep(i, 'desc', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => hpSet('how_it_works', [...steps, { num: `0${steps.length + 1}`, title: '', desc: '', icon: '⭐' }])}
              className="flex items-center gap-2 text-sm text-accent-light hover:text-accent transition-colors">
              <Plus size={14} /> Tambah Langkah
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── ABOUT ── */}
      {tab === 'about' && (
        <SectionCard title="Section 'Tentang Kami'" hint="Cerita dan misi perusahaan yang tampil di homepage">
          <div className="space-y-4">
            <Input label="Headline Tentang Kami"
              value={hp.about_headline || ''} onChange={e => hpSet('about_headline', e.target.value)} />
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Paragraf Tentang Kami</label>
              <textarea rows={5}
                className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
                value={hp.about_body || ''} onChange={e => hpSet('about_body', e.target.value)}
                placeholder="Cerita singkat tentang platform..." />
            </div>

            <div className="bg-surface rounded-2xl p-5 space-y-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Quote Founder</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nama Founder"
                  value={hp.founder_name || ''} onChange={e => hpSet('founder_name', e.target.value)} placeholder="Rini Wulandari" />
                <Input label="Jabatan Founder"
                  value={hp.founder_role || ''} onChange={e => hpSet('founder_role', e.target.value)} placeholder="Founder & CEO" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Kalimat Quote</label>
                <textarea rows={3}
                  className="w-full px-4 py-3 bg-card border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none italic"
                  value={hp.founder_quote || ''} onChange={e => hpSet('founder_quote', e.target.value)}
                  placeholder='"Kami percaya bahwa skill yang tepat bisa mengubah nasib seseorang..."' />
              </div>
            </div>

            {/* About key points */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Angka Statistik About</label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'about_stat1', label: 'Stat 1', defaultVal: '100+', defaultLabel: 'Kursus Gratis' },
                  { key: 'about_stat2', label: 'Stat 2', defaultVal: '50+', defaultLabel: 'Kursus Premium' },
                  { key: 'about_stat3', label: 'Stat 3', defaultVal: '500+', defaultLabel: 'Jam Konten' },
                  { key: 'about_stat4', label: 'Stat 4', defaultVal: '15+', defaultLabel: 'Negara' },
                ].map(s => (
                  <div key={s.key} className="p-3 bg-surface rounded-xl space-y-2">
                    <input
                      className="w-full bg-card border border-slate-200 px-2 py-1.5 rounded-lg text-sm font-bold text-accent-light outline-none focus:border-accent"
                      placeholder={s.defaultVal}
                      value={hp[s.key + '_value'] || ''}
                      onChange={e => hpSet(s.key + '_value', e.target.value)} />
                    <input
                      className="w-full bg-card border border-slate-200 px-2 py-1.5 rounded-lg text-xs text-text-muted outline-none focus:border-accent"
                      placeholder={s.defaultLabel}
                      value={hp[s.key + '_label'] || ''}
                      onChange={e => hpSet(s.key + '_label', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── TESTIMONIALS ── */}
      {tab === 'testimoni' && (
        <SectionCard title="Testimoni Homepage" hint="Ulasan yang tampil di section testimoni halaman utama">
          <div className="space-y-4">
            {testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-surface rounded-2xl p-5 space-y-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button"
                        onClick={() => updateTestimonial(i, 'rating', s)}
                        className={`text-2xl transition-transform hover:scale-110 ${s <= (t.rating || 5) ? 'text-amber-400' : 'text-text-dim'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                  <button onClick={() => hpSet('testimonials', testimonials.filter((_: any, j: number) => j !== i))}
                    className="text-text-dim hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-[80px_1fr_1fr] gap-3 items-end">
                  <div>
                    <label className="block text-xs text-text-dim mb-1.5">Avatar</label>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center font-bold text-white text-lg">
                      {t.name?.[0] || '?'}
                    </div>
                    <input placeholder="Initial" maxLength={2}
                      className="mt-2 w-12 text-center px-2 py-1 bg-card border border-slate-200 rounded-lg text-sm outline-none focus:border-accent text-text"
                      value={t.avatar || ''} onChange={e => updateTestimonial(i, 'avatar', e.target.value)} />
                  </div>
                  <Input label="Nama Lengkap" placeholder="Andi Pratama"
                    value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} />
                  <Input label="Jabatan / Role" placeholder="Digital Marketer"
                    value={t.role} onChange={e => updateTestimonial(i, 'role', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Kalimat Testimoni</label>
                  <textarea rows={2}
                    className="w-full px-4 py-3 bg-card border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none italic"
                    placeholder="Kalimat testimoni yang jujur..."
                    value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => hpSet('testimonials', [...testimonials, { name: '', role: '', text: '', avatar: '', rating: 5 }])}
              className="flex items-center gap-2 text-sm text-accent-light hover:text-accent transition-colors">
              <Plus size={14} /> Tambah Testimoni
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── CTA SECTION ── */}
      {tab === 'cta' && (
        <SectionCard title="CTA Section (Bagian Bawah Homepage)" hint="Section ajakan bertindak di bagian paling bawah halaman utama">
          <div className="space-y-4">
            <Input label="Headline CTA"
              value={hp.cta_headline || ''} onChange={e => hpSet('cta_headline', e.target.value)}
              placeholder="Siap untuk level up skill kamu?" />
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Deskripsi CTA</label>
              <textarea rows={2}
                className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
                value={hp.cta_body || ''} onChange={e => hpSet('cta_body', e.target.value)}
                placeholder="Bergabung sekarang. Tidak butuh kartu kredit." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Teks Tombol Utama (kuning)"
                value={hp.cta_primary || ''} onChange={e => hpSet('cta_primary', e.target.value)}
                placeholder="Daftar Gratis" />
              <Input label="Teks Tombol Sekunder"
                value={hp.cta_secondary || ''} onChange={e => hpSet('cta_secondary', e.target.value)}
                placeholder="Lihat Semua Kursus" />
            </div>

            {/* Preview */}
            <div className="p-5 bg-bg border border-slate-200 rounded-xl text-center">
              <p className="text-xs text-text-dim mb-3">Preview:</p>
              <h3 className="font-syne font-extrabold text-2xl mb-3">
                {hp.cta_headline || 'Headline CTA...'}
              </h3>
              <p className="text-text-muted text-sm mb-5">{hp.cta_body || '...'}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <span className="px-6 py-3 bg-cta text-black font-syne font-bold rounded-xl text-sm">{hp.cta_primary || 'CTA'} →</span>
                <span className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-text">{hp.cta_secondary || 'Secondary'}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── STORE PAGE ── */}
      {tab === 'store' && (
        <SectionCard title="Halaman Store" hint="Edit header dan konten yang tampil di halaman /store">
          <div className="space-y-4">
            <Input label="Badge (label kecil di atas headline)"
              value={store.badge || ''} onChange={e => storeSet('badge', e.target.value)}
              placeholder="Marketplace Kursus" />
            <Input label="Headline Utama"
              value={store.headline || ''} onChange={e => storeSet('headline', e.target.value)}
              placeholder="Tingkatkan Skill Kamu" />
            <Input label="Headline Accent (kata yang diberi warna gradient)"
              value={store.headline_accent || ''} onChange={e => storeSet('headline_accent', e.target.value)}
              hint="Kata ini akan tampil dengan warna gradient setelah headline utama"
              placeholder="Mulai Sekarang" />
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sub-headline Store</label>
              <textarea rows={2}
                className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent resize-none"
                value={store.subheadline || ''} onChange={e => storeSet('subheadline', e.target.value)}
                placeholder="Temukan ratusan kursus digital..." />
            </div>

            <div className="flex items-center justify-between p-4 bg-surface border border-slate-200 rounded-xl">
              <div>
                <div className="font-semibold text-sm">Tampilkan Stats di Store</div>
                <div className="text-text-muted text-xs mt-0.5">Jumlah kursus, gratis, premium di header store</div>
              </div>
              <div onClick={() => storeSet('show_stats', !store.show_stats)}
                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${store.show_stats !== false ? 'bg-green-500' : 'bg-surface border border-slate-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${store.show_stats !== false ? 'left-4' : 'left-0.5'}`} />
              </div>
            </div>

            {/* Preview */}
            <div className="p-5 bg-bg border border-slate-200 rounded-xl">
              <p className="text-xs text-text-dim mb-3">Preview header store:</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-bold mb-3">
                ✨ {store.badge || 'Badge'}
              </div>
              <h3 className="font-syne font-extrabold text-3xl mb-2">
                {store.headline || 'Headline'}{' '}
                <span className="text-gradient">{store.headline_accent || 'Accent'}</span>
              </h3>
              <p className="text-text-muted text-sm">{store.subheadline || '...'}</p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Sticky Save */}
      <div className="flex gap-3 sticky bottom-4 z-10 pt-2">
        <Button onClick={handleSave} loading={saving} size="lg" className="flex-1 shadow-2xl shadow-accent/20">
          <Save size={15} /> Simpan Semua Perubahan
        </Button>
        <a href="/" target="_blank"
          className="flex items-center gap-2 px-5 rounded-xl text-sm text-text-muted bg-card border border-slate-200 hover:text-text transition-all">
          <Eye size={15} /> Preview
        </a>
      </div>
    </div>
  )
}
