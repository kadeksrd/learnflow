"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Search,
  Share2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "@/components/ui/ImageUploader";

import type { SEOGlobalSettings as SEOSettings } from "@/types/cms";

const DEFAULT: SEOSettings = {
  site_name: "LearnFlow",
  site_title: "LearnFlow — Platform Kursus Online #1 Indonesia",
  site_description:
    "Platform kursus digital terbaik. Belajar skill baru dari instruktur terpercaya.",
  site_keywords:
    "kursus online, belajar online, kursus digital, e-learning indonesia",
  og_image: "",
  twitter_handle: "",
  robots: "index,follow",
  google_site_verification: "",
  bing_site_verification: "",
};

export function GlobalSEOEditor({ initialSettings }: { initialSettings: any }) {
  const [s, setS] = useState<SEOSettings>({ ...DEFAULT, ...initialSettings });
  const [tab, setTab] = useState<"basic" | "social" | "technical">("basic");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof SEOSettings, val: string) =>
    setS((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "seo_global", value: s }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "basic", icon: Search, label: "SEO Dasar" },
    { id: "social", icon: Share2, label: "Social Meta" },
    { id: "technical", icon: ShieldCheck, label: "Teknikal" },
  ] as const;

  return (
    <div className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10   border border-red-500/20   rounded-xl text-sm text-red-400   flex items-center gap-2">
          <AlertCircle size={15} /> {error}
        </div>
      )}
      {saved && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center gap-2">
          <CheckCircle size={15} /> Tersimpan! SEO global aktif di seluruh
          halaman.
        </div>
      )}

      {/* Info box */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-3">
        <Globe size={16} className="text-accent-light shrink-0 mt-0.5" />
        <div className="text-sm text-text-muted">
          <span className="text-accent-light font-semibold">Cara kerja:</span>{" "}
          Setting ini berlaku untuk{" "}
          <strong className="text-[#EEEEFF]">semua halaman</strong> sebagai
          default. Setiap landing page kursus bisa override dengan setting
          SEO-nya masing-masing di tab{" "}
          <span className="text-accent-light">🔍 SEO & Meta</span> editor
          landing page.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-2xl border border-white/[0.06]">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === id ? "bg-card text-[#EEEEFF] shadow-sm" : "text-text-muted hover:text-[#EEEEFF]"}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── BASIC ── */}
      {tab === "basic" && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <h2 className="font-syne font-bold text-base flex items-center gap-2">
            <Search size={16} className="text-accent-light" /> SEO Dasar
          </h2>

          <Input
            label="Nama Situs"
            placeholder="LearnFlow"
            value={s.site_name}
            onChange={(e) => set("site_name", e.target.value)}
            hint="Nama yang muncul di tab browser dan hasil Google"
          />

          <Input
            label="Site Title (maks 60 karakter)"
            placeholder="LearnFlow — Platform Kursus Online #1 Indonesia"
            value={s.site_title}
            onChange={(e) => set("site_title", e.target.value.slice(0, 60))}
            hint={`${s.site_title.length}/60 · Dipakai di homepage dan halaman tanpa SEO title sendiri`}
          />

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Site Description (maks 160 karakter)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent resize-none transition-all"
              maxLength={160}
              placeholder="Platform kursus digital terbaik..."
              value={s.site_description}
              onChange={(e) => set("site_description", e.target.value)}
            />
            <p className="text-xs text-text-dim mt-1">
              {s.site_description.length}/160 karakter
            </p>
          </div>

          <Input
            label="Keywords (pisahkan dengan koma)"
            placeholder="kursus online, belajar online, kursus digital"
            value={s.site_keywords}
            onChange={(e) => set("site_keywords", e.target.value)}
            hint="Tidak terlalu krusial untuk Google, tapi berguna untuk referensi internal"
          />

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Default Robots Directive
            </label>
            <select
              className="w-full px-4 py-3 bg-surface border border-white/[0.07] rounded-xl text-[#EEEEFF] text-sm outline-none focus:border-accent"
              value={s.robots}
              onChange={(e) => set("robots", e.target.value)}
            >
              <option value="index,follow">
                index, follow — semua halaman bisa diindex (recommended)
              </option>
              <option value="noindex,follow">
                noindex, follow — tidak ada halaman yang diindex
              </option>
            </select>
          </div>

          {/* SERP Preview */}
          <div className="p-4 bg-bg border border-white/[0.05] rounded-xl">
            <p className="text-xs text-text-dim mb-3 font-semibold">
              🔍 Preview di Google Search:
            </p>
            <div className="max-w-md">
              <div
                style={{ color: "#202124", fontSize: 12, marginBottom: 2 }}
                className="text-text-dim text-xs"
              >
                learnflow.id
              </div>
              <div
                style={{ color: "#1a73e8" }}
                className="text-base hover:underline cursor-pointer leading-tight mb-1"
              >
                {s.site_title || "Judul Website"}
              </div>
              <div className="text-sm text-text-muted leading-relaxed">
                {s.site_description ||
                  "Deskripsi website akan tampil di sini..."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SOCIAL ── */}
      {tab === "social" && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <h2 className="font-syne font-bold text-base flex items-center gap-2">
            <Share2 size={16} className="text-accent-light" /> Open Graph &
            Social
          </h2>
          <p className="text-text-muted text-sm -mt-2">
            Tampil saat link dibagikan di WhatsApp, Telegram, Facebook,
            Twitter/X, dll.
          </p>

          <ImageUploader
            label="Default OG Image (1200×630px disarankan)"
            value={s.og_image}
            onChange={(url) => set("og_image", url)}
            folder="og-images"
            aspect="landscape"
            hint="Gambar yang muncul saat link website dibagikan. Setiap landing page kursus bisa punya OG Image sendiri."
          />

          <Input
            label="Twitter/X Handle"
            placeholder="@learnflow_id"
            value={s.twitter_handle}
            onChange={(e) => set("twitter_handle", e.target.value)}
            hint="Format: @username — dipakai untuk Twitter Card"
          />

          {/* Social Preview */}
          <div className="p-4 bg-bg border border-white/[0.05] rounded-xl">
            <p className="text-xs text-text-dim mb-3 font-semibold">
              💬 Preview saat dibagikan:
            </p>
            <div className="border border-white/[0.1] rounded-xl overflow-hidden max-w-sm">
              <div className="aspect-[1200/630] bg-surface flex items-center justify-center overflow-hidden">
                {s.og_image ? (
                  <img
                    src={s.og_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-text-dim">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-xs">OG Image belum diset</div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-card">
                <div className="text-text-dim text-xs mb-1">learnflow.id</div>
                <div className="font-semibold text-sm">
                  {s.site_title || "Judul Website"}
                </div>
                <div className="text-text-muted text-xs mt-1 line-clamp-2">
                  {s.site_description || "Deskripsi website"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TECHNICAL ── */}
      {tab === "technical" && (
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <h2 className="font-syne font-bold text-base flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent-light" /> Verifikasi &
            Teknikal
          </h2>

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300/80">
            <p className="font-semibold mb-2">📋 Cara verifikasi Google:</p>
            <ol className="space-y-1 list-decimal ml-4">
              <li>
                Buka{" "}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-light hover:underline"
                >
                  Google Search Console
                </a>
              </li>
              <li>Pilih &quot;Add property&quot; → masukkan URL website</li>
              <li>Pilih metode &quot;HTML tag&quot; → copy kode verifikasi</li>
              <li>
                Paste di kolom di bawah → Simpan → klik &quot;Verify&quot; di Search
                Console
              </li>
            </ol>
          </div>

          <Input
            label="Google Search Console — Verification Code"
            placeholder="Hanya kode-nya saja, contoh: abc123XYZ..."
            value={s.google_site_verification}
            onChange={(e) => set("google_site_verification", e.target.value)}
            hint={`Dari: <meta name="google-site-verification" content="[KODE-INI]">`}
          />

          <Input
            label="Bing Webmaster Tools — Verification Code"
            placeholder="Kode verifikasi Bing"
            value={s.bing_site_verification}
            onChange={(e) => set("bing_site_verification", e.target.value)}
            hint={`Dari: <meta name="msvalidate.01" content="[KODE-INI]">`}
          />
          {/* Status summary */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              {
                label: "Google Search Console",
                active: !!s.google_site_verification,
                icon: "🔍",
              },
              {
                label: "Bing Webmaster",
                active: !!s.bing_site_verification,
                icon: "🌐",
              },
              { label: "OG Image Global", active: !!s.og_image, icon: "🖼️" },
              { label: "Twitter Card", active: !!s.twitter_handle, icon: "𝕏" },
            ].map(({ label, active, icon }) => (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-xl border ${active ? "bg-green-500/5 border-green-500/20" : "bg-surface border-white/[0.06]"}`}
              >
                <span className="text-lg">{icon}</span>
                <div>
                  <div className="font-semibold text-xs">{label}</div>
                  <div
                    className={`text-xs ${active ? "text-green-400" : "text-text-dim"}`}
                  >
                    {active ? "✓ Terpasang" : "○ Belum diset"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="sticky bottom-4">
        <Button
          onClick={handleSave}
          loading={saving}
          size="lg"
          className="w-full shadow-2xl shadow-accent/20"
        >
          <Save size={15} /> Simpan SEO Global
        </Button>
      </div>
    </div>
  );
}
