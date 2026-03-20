'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, Eye, Save, Search, Share2, Code, Zap, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/ui/ImageUploader'
import type { Benefit, Testimonial } from '@/types/database'

const SECTIONS = [
  { id: 'basic',        icon: '📝', label: 'Teks & Copy'      },
  { id: 'media',        icon: '🖼️', label: 'Gambar & Video'   },
  { id: 'benefits',     icon: '✅', label: 'Benefits'         },
  { id: 'testimonials', icon: '💬', label: 'Testimoni'        },
  { id: 'seo',          icon: '🔍', label: 'SEO & Meta'       },
  { id: 'pixels',       icon: '📡', label: 'Pixel & Tracking' },
] as const
type SectionId = typeof SECTIONS[number]['id']

const Toggle = ({ value, onChange, label, sub }: any) => (
  <div className="flex items-center justify-between p-4 bg-surface border border-white/[0.06] rounded-xl">
    <div>
      <div className="font-semibold text-sm">{label}</div>
      {sub && <div className="text-text-muted text-xs mt-0.5">{sub}</div>}
    </div>
    <div onClick={onChange} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-green-500' : 'bg-card border border-white/20'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-5' : 'left-0.5'}`} />
    </div>
  </div>
)

const PixelCard = ({ icon, title, color, docUrl, docLabel, children }: any) => (
  <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]" style={{ background: `${color}08` }}>
      <span className="text-2xl">{icon}</span>
      <h2 className="font-syne font-bold text-base">{title}</h2>
      {docUrl && (
        <a href={docUrl} target="_blank" rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-text-muted hover:text-[#EEEEFF] transition-colors">
          <ExternalLink size={11} /> {docLabel}
        </a>
      )}
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
)

export function LandingPageEditor({ product, landingPage }: { product: any; landingPage: any }) {
  const router = useRouter()
  const isNew = !landingPage

  const [form, setForm] = useState({
    slug:            landingPage?.slug            || '',
    headline:        landingPage?.headline        || '',
    subheadline:     landingPage?.subheadline     || '',
    cta_text:        landingPage?.cta_text        || (product.is_free ? 'Ambil Gratis Sekarang' : 'Beli Sekarang'),
    theme_color:     landingPage?.theme_color     || '#7C6BFF',
    preview_video:   landingPage?.preview_video   || '',
    hero_image:      landingPage?.hero_image      || '',
    // SEO
    seo_title:        landingPage?.seo_title        || '',
    seo_description:  landingPage?.seo_description  || '',
    seo_keywords:     landingPage?.seo_keywords      || '',
    og_title:         landingPage?.og_title          || '',
    og_description:   landingPage?.og_description    || '',
    og_image:         landingPage?.og_image          || '',
    robots:           landingPage?.robots            || 'index,follow',
    canonical_url:    landingPage?.canonical_url     || '',
    schema_markup:    landingPage?.schema_markup     || '',
    // Pixel override
    pixel_override_enabled: landingPage?.pixel_override_enabled  || false,
    fb_pixel_enabled:       landingPage?.fb_pixel_enabled        || false,
    fb_pixel_id:            landingPage?.fb_pixel_id             || '',
    tiktok_pixel_enabled:   landingPage?.tiktok_pixel_enabled    || false,
    tiktok_pixel_id:        landingPage?.tiktok_pixel_id         || '',
    ga4_enabled:            landingPage?.ga4_enabled             || false,
    ga4_id:                 landingPage?.ga4_id                  || '',
    gtm_enabled:            landingPage?.gtm_enabled             || false,
    gtm_id:                 landingPage?.gtm_id                  || '',
    custom_head_script:     landingPage?.custom_head_script      || '',
  })

  const setF = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }))

  const [benefits, setBenefits]         = useState<Benefit[]>(landingPage?.benefits || [{ icon: '🎯', title: '', description: '' }])
  const [testimonials, setTestimonials] = useState<Testimonial[]>(landingPage?.testimonials || [{ name: '', role: '', text: '', avatar_url: '', rating: 5 }])
  const [section, setSection]           = useState<SectionId>('basic')
  const [saving,  setSaving]            = useState(false)
  const [error,   setError]             = useState<string | null>(null)
  const [success, setSuccess]           = useState(false)

  const handleSave = async () => {
    if (!form.slug)     { setError('Slug URL harus diisi');  return }
    if (!form.headline) { setError('Headline harus diisi');  return }
    setSaving(true); setError(null); setSuccess(false)
    const payload = { ...form, product_id: product.id, benefits, testimonials }
    const res = await fetch(
      isNew ? '/api/admin/landing-pages' : `/api/admin/landing-pages/${landingPage.id}`,
      { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    const data = await res.json()
    if (!res.ok) { setError(data.message || 'Gagal menyimpan'); setSaving(false); return }
    setSuccess(true); setTimeout(() => setSuccess(false), 4000); router.refresh()
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top bar */}
      <div className="flex items-center justify-between py-1">
        <button onClick={() => router.push('/admin/products')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-[#EEEEFF] transition-colors">
          <ArrowLeft size={14} /> Kembali ke Products
        </button>
        {!isNew && form.slug && (
          <a href={`/course/${form.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm text-accent-light hover:underline">
            <Eye size={14} /> Preview
          </a>
        )}
      </div>

      {error   && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center justify-between">
          <span>✅ Berhasil disimpan!</span>
          {form.slug && <a href={`/course/${form.slug}`} target="_blank" className="text-xs text-green-300 hover:underline flex items-center gap-1"><Eye size={11}/> Lihat →</a>}
        </div>
      )}

      {/* Section tabs */}
      <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-1 min-w-max bg-surface p-1 rounded-2xl border border-white/[0.06]">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${section === s.id ? 'bg-card text-[#EEEEFF] shadow-sm' : 'text-text-muted hover:text-[#EEEEFF]'}`}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── BASIC ─── */}
      {section === 'basic' && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <h2 className="font-syne font-bold text-base">📝 Teks & Copy Halaman</h2>
          <Input label="Slug URL *" placeholder="tiktok-viral-mastery"
            hint={`URL halaman: /course/${form.slug || '[slug]'}`}
            value={form.slug} onChange={e => setF('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
          <Input label="Headline *" placeholder="Kuasai TikTok dari Nol Sampai Pro"
            value={form.headline} onChange={e => setF('headline', e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sub-headline</label>
            <textarea className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent resize-none"
              rows={3} value={form.subheadline} onChange={e => setF('subheadline', e.target.value)} placeholder="Deskripsi lebih detail..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Teks Tombol CTA" value={form.cta_text} onChange={e => setF('cta_text', e.target.value)} />
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Warna Tema</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.theme_color} onChange={e => setF('theme_color', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-white/[0.07] bg-surface cursor-pointer p-0.5" />
                <Input value={form.theme_color} onChange={e => setF('theme_color', e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MEDIA ─── */}
      {section === 'media' && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-6">
          <h2 className="font-syne font-bold text-base">🖼️ Gambar & Video</h2>
          <ImageUploader label="Gambar Hero (opsional)"
            value={form.hero_image} onChange={url => setF('hero_image', url)}
            folder="landing-pages" aspect="landscape"
            hint="Gambar utama di hero section. Fallback ke thumbnail produk jika kosong." />
          <Input label="URL Video Preview (YouTube / Vimeo)"
            placeholder="https://youtube.com/watch?v=..."
            value={form.preview_video} onChange={e => setF('preview_video', e.target.value)} />
        </div>
      )}

      {/* ─── BENEFITS ─── */}
      {section === 'benefits' && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-syne font-bold text-base">✅ Benefits</h2>
              <p className="text-text-muted text-xs mt-1">Poin pembelajaran yang tampil sebagai grid card di halaman</p>
            </div>
            <button onClick={() => setBenefits(p => [...p, { icon: '⭐', title: '', description: '' }])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent-light hover:bg-accent/20 transition-all">
              <Plus size={13} /> Tambah
            </button>
          </div>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-3 items-start p-4 bg-surface rounded-xl">
                <input className="w-12 h-10 text-center text-xl bg-card border border-white/[0.07] rounded-lg outline-none focus:border-accent"
                  placeholder="🎯" value={b.icon} maxLength={2}
                  onChange={e => setBenefits(p => p.map((x, j) => j===i ? {...x, icon: e.target.value} : x))} />
                <div className="flex-1 space-y-2">
                  <input className="w-full px-3 py-2.5 bg-card border border-white/[0.07] rounded-xl text-sm text-[#EEEEFF] outline-none focus:border-accent"
                    placeholder="Judul benefit" value={b.title}
                    onChange={e => setBenefits(p => p.map((x, j) => j===i ? {...x, title: e.target.value} : x))} />
                  <input className="w-full px-3 py-2.5 bg-card border border-white/[0.07] rounded-xl text-sm text-[#EEEEFF] outline-none focus:border-accent"
                    placeholder="Deskripsi singkat" value={b.description}
                    onChange={e => setBenefits(p => p.map((x, j) => j===i ? {...x, description: e.target.value} : x))} />
                </div>
                <button onClick={() => setBenefits(p => p.filter((_, j) => j!==i))}
                  className="p-2 text-text-dim hover:text-red-400 transition-colors mt-6"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {section === 'testimonials' && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-syne font-bold text-base">💬 Testimonials</h2>
              <p className="text-text-muted text-xs mt-1">Ulasan manual dari admin (terpisah dari review user)</p>
            </div>
            <button onClick={() => setTestimonials(p => [...p, { name: '', role: '', text: '', avatar_url: '', rating: 5 }])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent-light hover:bg-accent/20 transition-all">
              <Plus size={13} /> Tambah
            </button>
          </div>
          <div className="space-y-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <p className="text-xs text-text-dim mb-1.5 text-center">Foto</p>
                    <ImageUploader value={t.avatar_url || ''} onChange={url => setTestimonials(p => p.map((x, j) => j===i ? {...x, avatar_url: url} : x))}
                      folder="testimonials" aspect="avatar" clearable />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setTestimonials(p => p.map((x, j) => j===i ? {...x, rating: s} : x))}
                          className={`text-2xl transition-all hover:scale-110 ${s <= (t.rating || 5) ? 'text-amber-400' : 'text-text-dim'}`}>★</button>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className="px-3 py-2.5 bg-card border border-white/[0.07] rounded-xl text-sm text-[#EEEEFF] outline-none focus:border-accent"
                        placeholder="Nama lengkap" value={t.name}
                        onChange={e => setTestimonials(p => p.map((x, j) => j===i ? {...x, name: e.target.value} : x))} />
                      <input className="px-3 py-2.5 bg-card border border-white/[0.07] rounded-xl text-sm text-[#EEEEFF] outline-none focus:border-accent"
                        placeholder="Jabatan / Role" value={t.role}
                        onChange={e => setTestimonials(p => p.map((x, j) => j===i ? {...x, role: e.target.value} : x))} />
                    </div>
                  </div>
                  <button onClick={() => setTestimonials(p => p.filter((_, j) => j!==i))}
                    className="text-text-dim hover:text-red-400 p-1 shrink-0"><Trash2 size={16}/></button>
                </div>
                <textarea className="w-full px-4 py-3 bg-card border border-white/[0.07] rounded-xl text-sm text-[#EEEEFF] outline-none focus:border-accent resize-none"
                  rows={2} placeholder="Kalimat testimoni..." value={t.text}
                  onChange={e => setTestimonials(p => p.map((x, j) => j===i ? {...x, text: e.target.value} : x))} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SEO & META ─── */}
      {section === 'seo' && (
        <div className="space-y-5">
          {/* Primary SEO */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-accent-light" />
              <h2 className="font-syne font-bold text-base">SEO — Hasil Pencarian Google</h2>
            </div>
            <p className="text-text-muted text-xs">Mengatur tampilan di Google Search. Kosong = fallback ke headline & sub-headline.</p>

            <Input label="SEO Title (maks 60 karakter)"
              placeholder={form.headline || 'Judul untuk Google Search'}
              value={form.seo_title}
              onChange={e => setF('seo_title', e.target.value.slice(0, 60))}
              hint={`${form.seo_title.length}/60 karakter — optimal 50–60`} />

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">SEO Description (maks 160 karakter)</label>
              <textarea rows={3}
                className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent resize-none"
                placeholder={form.subheadline || 'Deskripsi untuk Google Search (1-2 kalimat)'}
                maxLength={160}
                value={form.seo_description}
                onChange={e => setF('seo_description', e.target.value)} />
              <p className="text-xs text-text-dim mt-1">{form.seo_description.length}/160 — optimal 120–160</p>
            </div>

            <Input label="Keywords (pisahkan koma)"
              placeholder="kursus tiktok, tiktok marketing, cara viral tiktok"
              value={form.seo_keywords}
              onChange={e => setF('seo_keywords', e.target.value)}
              hint="Bantu Google memahami topik halaman." />

            {/* SERP Preview */}
            {(form.headline || form.seo_title) && (
              <div className="p-4 bg-[#1A1A2E] border border-white/[0.05] rounded-xl">
                <p className="text-xs text-text-dim mb-3 font-semibold uppercase tracking-wider">Preview Google Search</p>
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center text-[10px] font-bold text-accent-light">L</div>
                    <div>
                      <div className="text-[#E8EAED] text-xs">LearnFlow</div>
                      <div className="text-[#BDC1C6] text-xs">learnflow.id › course › {form.slug || '...'}</div>
                    </div>
                  </div>
                  <div className="text-[#8AB4F8] text-base hover:underline cursor-pointer leading-snug mb-1">
                    {form.seo_title || form.headline}
                  </div>
                  <div className="text-[#BDC1C6] text-sm leading-relaxed">
                    {form.seo_description || form.subheadline || 'Deskripsi halaman akan tampil di sini...'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Open Graph */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-accent-light" />
              <h2 className="font-syne font-bold text-base">Open Graph — Preview di Sosial Media</h2>
            </div>
            <p className="text-text-muted text-xs">Tampil saat link dibagikan di WhatsApp, Facebook, Twitter, LINE.</p>

            <Input label="OG Title"
              placeholder={form.seo_title || form.headline || 'Judul saat link dibagikan'}
              value={form.og_title} onChange={e => setF('og_title', e.target.value)} />

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">OG Description</label>
              <textarea rows={2}
                className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent resize-none"
                placeholder={form.seo_description || form.subheadline || 'Deskripsi saat link dibagikan'}
                value={form.og_description} onChange={e => setF('og_description', e.target.value)} />
            </div>

            <ImageUploader label="OG Image (ideal: 1200×630px)"
              value={form.og_image} onChange={url => setF('og_image', url)}
              folder="og-images" aspect="landscape"
              hint="Gambar preview saat link dibagikan. Fallback ke hero image jika kosong." />

            {/* OG Preview */}
            <div className="p-4 bg-surface border border-white/[0.05] rounded-xl">
              <p className="text-xs text-text-dim mb-3 font-semibold uppercase tracking-wider">Preview WhatsApp / Facebook</p>
              <div className="border border-white/[0.1] rounded-xl overflow-hidden max-w-sm">
                <div className="aspect-[1200/630] bg-[#1A1A2E] flex items-center justify-center overflow-hidden">
                  {(form.og_image || form.hero_image || product.thumbnail)
                    ? <img src={form.og_image || form.hero_image || product.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <span className="text-4xl">🖼️</span>}
                </div>
                <div className="p-3 bg-[#1A1A2E]">
                  <div className="text-text-dim text-xs mb-1 uppercase tracking-wider">learnflow.id</div>
                  <div className="font-semibold text-sm">{form.og_title || form.seo_title || form.headline || 'Judul halaman'}</div>
                  <div className="text-text-muted text-xs mt-1 line-clamp-2">{form.og_description || form.seo_description || form.subheadline || 'Deskripsi halaman'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-accent-light" />
              <h2 className="font-syne font-bold text-base">Pengaturan Lanjutan</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Robots Directive</label>
              <select className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent"
                value={form.robots} onChange={e => setF('robots', e.target.value)}>
                <option value="index,follow">index, follow — Halaman bisa diindex Google (default)</option>
                <option value="noindex,follow">noindex, follow — Tidak diindex, link tetap diikuti</option>
                <option value="index,nofollow">index, nofollow — Diindex tapi link tidak diikuti</option>
                <option value="noindex,nofollow">noindex, nofollow — Tidak diindex sama sekali</option>
              </select>
              <p className="text-xs text-text-dim mt-1.5">
                Gunakan <code className="bg-black/20 px-1 rounded text-xs">noindex</code> untuk halaman checkout, thank you, atau halaman yang tidak perlu muncul di Google.
              </p>
            </div>

            <Input label="Canonical URL (opsional)"
              placeholder="https://learnflow.id/course/tiktok-viral-mastery"
              value={form.canonical_url} onChange={e => setF('canonical_url', e.target.value)}
              hint="Isi jika halaman ini duplikat dari URL lain" />

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">JSON-LD Schema Markup (opsional)</label>
              <textarea rows={7}
                className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-xs font-mono outline-none focus:border-accent resize-none"
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Course",\n  "name": "TikTok Viral Mastery",\n  "provider": {\n    "@type": "Organization",\n    "name": "LearnFlow"\n  },\n  "offers": {\n    "@type": "Offer",\n    "price": "0",\n    "priceCurrency": "IDR"\n  }\n}'}
                value={form.schema_markup} onChange={e => setF('schema_markup', e.target.value)} />
              <p className="text-xs text-text-dim mt-1.5">
                Untuk rich snippet (bintang, harga) di Google. {' '}
                <a href="https://schema.org/Course" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">Lihat Course schema →</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── PIXELS & TRACKING ─── */}
      {section === 'pixels' && (
        <div className="space-y-5">
          {/* Master toggle */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-5 space-y-3">
            <Toggle
              value={form.pixel_override_enabled}
              onChange={() => setF('pixel_override_enabled', !form.pixel_override_enabled)}
              label="Gunakan Pixel Khusus untuk Halaman Ini"
              sub="Aktifkan untuk override pixel global. Cocok jika kursus ini punya campaign iklan berbeda-beda." />

            {!form.pixel_override_enabled && (
              <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl text-xs text-text-muted flex items-start gap-2">
                <Zap size={13} className="text-accent-light shrink-0 mt-0.5" />
                <span>
                  Saat nonaktif, halaman ini menggunakan pixel dari menu{' '}
                  <strong className="text-accent-light">Pixel & Tracking</strong> (global untuk semua halaman).{' '}
                  Aktifkan di atas untuk set pixel berbeda per kursus — misalnya untuk iklan TikTok produk A dengan pixel berbeda dari produk B.
                </span>
              </div>
            )}
          </div>

          {form.pixel_override_enabled && (
            <>
              {/* Facebook Pixel */}
              <PixelCard icon="📘" title="Facebook / Meta Pixel" color="#1877F2"
                docUrl="https://www.facebook.com/events/manager" docLabel="Events Manager">
                <Toggle value={form.fb_pixel_enabled}
                  onChange={() => setF('fb_pixel_enabled', !form.fb_pixel_enabled)}
                  label="Aktifkan Facebook Pixel" sub="Tracking ViewContent, InitiateCheckout, Purchase di halaman ini" />
                {form.fb_pixel_enabled && (
                  <>
                    <Input label="Facebook Pixel ID" placeholder="123456789012345"
                      value={form.fb_pixel_id} onChange={e => setF('fb_pixel_id', e.target.value)}
                      hint="Temukan di Events Manager → Data Sources → Pixels" />
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300/80 space-y-1">
                      <p className="font-semibold">Events otomatis ter-track:</p>
                      <p>• <strong>PageView</strong> — saat halaman dibuka</p>
                      <p>• <strong>ViewContent</strong> — saat user melihat halaman kursus ini</p>
                      <p>• <strong>InitiateCheckout</strong> — saat klik tombol beli/daftar</p>
                      <p>• <strong>Purchase</strong> — setelah pembayaran berhasil</p>
                    </div>
                  </>
                )}
              </PixelCard>

              {/* TikTok Pixel */}
              <PixelCard icon="🎵" title="TikTok Pixel" color="#FF3B5C"
                docUrl="https://ads.tiktok.com/i18n/events_manager" docLabel="TikTok Ads Manager">
                <Toggle value={form.tiktok_pixel_enabled}
                  onChange={() => setF('tiktok_pixel_enabled', !form.tiktok_pixel_enabled)}
                  label="Aktifkan TikTok Pixel" sub="Tracking untuk TikTok Ads — ViewContent, PlaceAnOrder" />
                {form.tiktok_pixel_enabled && (
                  <>
                    <Input label="TikTok Pixel ID" placeholder="C1XXXXXXXXXXXXXXXXX"
                      value={form.tiktok_pixel_id} onChange={e => setF('tiktok_pixel_id', e.target.value)}
                      hint="Temukan di TikTok Ads Manager → Library → Events → Web Events" />
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-300/80 space-y-1">
                      <p className="font-semibold">Events otomatis:</p>
                      <p>• <strong>PageView</strong> · <strong>ViewContent</strong> · <strong>InitiateCheckout</strong> · <strong>PlaceAnOrder</strong></p>
                    </div>
                  </>
                )}
              </PixelCard>

              {/* GA4 */}
              <PixelCard icon="📊" title="Google Analytics 4 (GA4)" color="#F59E0B"
                docUrl="https://analytics.google.com" docLabel="Google Analytics">
                <Toggle value={form.ga4_enabled}
                  onChange={() => setF('ga4_enabled', !form.ga4_enabled)}
                  label="Aktifkan GA4 Terpisah"
                  sub="Hanya isi jika kursus ini tracking ke property GA4 yang berbeda dari global" />
                {form.ga4_enabled && (
                  <Input label="GA4 Measurement ID" placeholder="G-XXXXXXXXXX"
                    value={form.ga4_id} onChange={e => setF('ga4_id', e.target.value)}
                    hint="Format: G-XXXXXXXXXX — dari Google Analytics → Admin → Data Streams" />
                )}
              </PixelCard>

              {/* GTM */}
              <PixelCard icon="📦" title="Google Tag Manager (GTM)" color="#3B82F6"
                docUrl="https://tagmanager.google.com" docLabel="Tag Manager">
                <Toggle value={form.gtm_enabled}
                  onChange={() => setF('gtm_enabled', !form.gtm_enabled)}
                  label="Aktifkan GTM Terpisah"
                  sub="Gunakan container GTM berbeda untuk kursus ini — misalnya campaign berbeda" />
                {form.gtm_enabled && (
                  <>
                    <Input label="GTM Container ID" placeholder="GTM-XXXXXXX"
                      value={form.gtm_id} onChange={e => setF('gtm_id', e.target.value)}
                      hint="Format: GTM-XXXXXXX — dari tagmanager.google.com" />
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300/80">
                      Jika GTM aktif di halaman ini, semua tag bisa dikelola dari dashboard GTM container ini tanpa deploy ulang.
                    </div>
                  </>
                )}
              </PixelCard>

              {/* Custom Script */}
              <PixelCard icon="💻" title="Skrip Kustom (Head)" color="#8B5CF6">
                <p className="text-text-muted text-xs">Skrip tambahan khusus halaman kursus ini — misalnya retargeting pixel lain, live chat khusus, atau tracking konversi custom.</p>
                <textarea rows={5}
                  className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-xs font-mono outline-none focus:border-accent resize-none"
                  placeholder={'// Contoh:\nconsole.log("user on landing page");'}
                  value={form.custom_head_script} onChange={e => setF('custom_head_script', e.target.value)} />
                <p className="text-xs text-text-dim">Tulis kode JavaScript langsung — jangan pakai tag &lt;script&gt;</p>
              </PixelCard>

              {/* Status summary */}
              <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
                <h3 className="font-syne font-bold text-sm mb-4">Status Pixel Halaman Ini</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'GTM',      active: form.gtm_enabled          && !!form.gtm_id,          icon: '📦', id: form.gtm_id },
                    { label: 'GA4',      active: form.ga4_enabled          && !!form.ga4_id,          icon: '📊', id: form.ga4_id },
                    { label: 'Facebook', active: form.fb_pixel_enabled     && !!form.fb_pixel_id,     icon: '📘', id: form.fb_pixel_id },
                    { label: 'TikTok',   active: form.tiktok_pixel_enabled && !!form.tiktok_pixel_id, icon: '🎵', id: form.tiktok_pixel_id },
                  ].map(({ label, active, icon, id }) => (
                    <div key={label} className={`p-3 rounded-xl border ${active ? 'bg-green-500/5 border-green-500/20' : 'bg-surface border-white/[0.06]'}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{icon}</span>
                        <div className={`text-xs font-semibold ${active ? 'text-green-400' : 'text-text-dim'}`}>{active ? '✓ Aktif' : '○ Off'}</div>
                      </div>
                      <div className="text-xs font-medium">{label}</div>
                      {active && id && <div className="text-text-dim text-[10px] mt-0.5 truncate font-mono">{id}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}


            {/* Sticky save */}
      <div className="flex gap-3 sticky bottom-4 z-10 pt-2">
        <Button onClick={handleSave} loading={saving} size="lg" className="flex-1 shadow-2xl shadow-accent/20">
          <Save size={15} /> {isNew ? 'Buat Landing Page' : 'Simpan Semua Perubahan'}
        </Button>
        {!isNew && form.slug && (
          <a href={`/course/${form.slug}`} target="_blank"
            className="flex items-center gap-2 px-5 rounded-xl text-sm text-text-muted bg-card border border-white/[0.07] hover:text-[#EEEEFF] transition-all">
            <Eye size={15} /> Preview
          </a>
        )}
      </div>
    </div>
  )
}
