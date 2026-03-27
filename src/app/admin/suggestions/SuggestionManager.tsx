'use client'
import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const TYPES = [
  { value: 'tool', label: '🛠️ Tool' }, { value: 'article', label: '📄 Artikel' },
  { value: 'download', label: '⬇️ Download' }, { value: 'video', label: '🎬 Video' }, { value: 'website', label: '🌐 Website' },
]

export function SuggestionManager({ lessons, suggestions: init }: { lessons: any[]; suggestions: any[] }) {
  const [suggestions, setSuggestions] = useState(init)
  const [selectedLesson, setSelectedLesson] = useState('')
  const [form, setForm] = useState({ title: '', url: '', type: 'tool', icon: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filtered = selectedLesson ? suggestions.filter(s => s.lesson_id === selectedLesson) : suggestions

  const getLabel = (l: any) => `${(l.modules as any)?.courses?.products?.title || '?'} / ${(l.modules as any)?.title || '?'} / ${l.title}`

  const handleAdd = async () => {
    if (!selectedLesson) { setError('Pilih lesson dulu'); return }
    if (!form.title.trim() || !form.url.trim()) { setError('Judul dan URL harus diisi'); return }
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/suggestions', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: selectedLesson, ...form, icon: form.icon || null }) })
    const data = await res.json()
    if (res.ok) { setSuggestions(p => [data, ...p]); setForm({ title: '', url: '', type: 'tool', icon: '' }) }
    else setError(data.message || 'Gagal menyimpan')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus?')) return
    const res = await fetch(`/api/admin/suggestions/${id}`, { method: 'DELETE' })
    if (res.ok) setSuggestions(p => p.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-8 lg:grid lg:grid-cols-[380px_1fr] lg:space-y-0 lg:gap-8 items-start">
      <div className="bg-card border border-slate-200 rounded-2xl p-6 space-y-5 lg:sticky lg:top-24">
        <h2 className="font-syne font-bold text-base">Tambah Suggestion</h2>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Pilih Lesson</label>
          <select className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-text text-sm outline-none focus:border-accent" value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)}>
            <option value="">-- Pilih Lesson --</option>
            {lessons.map(l => <option key={l.id} value={l.id}>{getLabel(l)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tipe</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setForm(p => ({ ...p, type: t.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.type === t.value ? 'bg-accent/20 text-accent-light border border-accent/40' : 'bg-surface border border-slate-200 text-text-muted hover:text-text'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <Input label="Emoji Icon (opsional)" placeholder="🔗" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} hint="Satu emoji sebagai ikon" />
        <Input label="Judul" placeholder="Canva — Design Tool Gratis" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <Input label="URL" type="url" placeholder="https://canva.com" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>}
        <Button onClick={handleAdd} loading={saving} className="w-full"><Plus size={14} /> Tambah Suggestion</Button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-text-muted">Filter:</span>
          <button onClick={() => setSelectedLesson('')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!selectedLesson ? 'bg-accent/20 text-accent-light border border-accent/40' : 'bg-card border border-slate-200 text-text-muted'}`}>Semua ({suggestions.length})</button>
        </div>
        <div className="space-y-3">
          {filtered.map(s => {
            const lesson = lessons.find(l => l.id === s.lesson_id)
            return (
              <div key={s.id} className="flex items-start gap-4 p-4 bg-card border border-slate-200 rounded-xl hover:border-accent/20 transition-all">
                <span className="text-2xl shrink-0 mt-0.5">{s.icon || '🔗'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{s.title}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent-light hover:underline mt-0.5 truncate">
                    <ExternalLink size={10} />{s.url}
                  </a>
                  {lesson && <div className="text-text-dim text-xs mt-1.5">📚 {getLabel(lesson)}</div>}
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-surface rounded text-xs text-text-muted capitalize">{TYPES.find(t => t.value === s.type)?.label || s.type}</span>
                </div>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400 transition-all shrink-0"><Trash2 size={14} /></button>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted">
              <LinkIcon size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada suggestion. Tambahkan di form kiri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
