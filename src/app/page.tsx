import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course/CourseCard";
import {
  Zap,
  BookOpen,
  Award,
  Users,
  Star,
  ChevronRight,
  Play,
  ArrowRight,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

async function getSiteData() {
  const supabase = await createClient();

  const results = await Promise.all([
    supabase.from("site_settings").select("key, value").in("key", ["homepage"]),
    supabase
      .from("products")
      .select(
        "*, categories(id,name,slug), landing_pages(slug), courses(id, modules(id, lessons(id)))",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  const settingsRows = results[0].data as any[] | null;
  const allProds = (results[1].data as any[]) || [];

  const hp: any = settingsRows?.find((r) => r.key === "homepage")?.value || {};

  // Featured: use selected IDs if available, else take latest 6
  let featured = allProds;
  if (hp.featured_product_ids?.length > 0) {
    const ids: string[] = hp.featured_product_ids;
    featured = ids
      .map((id: string) => allProds.find((p: any) => p.id === id)) // Tambah (p: any) di sini
      .filter(Boolean);
  } else {
    featured = allProds.slice(0, 6);
  }

  return { hp, featured };
}

export default async function HomePage() {
  const { hp, featured } = await getSiteData();

  // Fallback defaults
  const hero_badge = hp.hero_badge || "Platform Edukasi Digital #1 Indonesia";
  const hero_headline =
    hp.hero_headline || "Belajar Skill Baru, Raih Peluang Baru";
  const hero_subheadline =
    hp.hero_subheadline ||
    "Ratusan kursus dari instruktur terpercaya. Gratis maupun premium. Bersertifikat resmi.";
  const hero_cta_primary = hp.hero_cta_primary || "Mulai Belajar Gratis";
  const hero_cta_secondary = hp.hero_cta_secondary || "Lihat Demo";

  const stats =
    hp.stats?.length > 0
      ? hp.stats
      : [
          { value: "10,000+", label: "Pelajar Aktif" },
          { value: "200+", label: "Kursus Tersedia" },
          { value: "98%", label: "Tingkat Kepuasan" },
          { value: "50+", label: "Instruktur Ahli" },
        ];

  const featured_title = hp.featured_section_title || "Kursus Terpopuler";
  const featured_badge = hp.featured_section_badge || "Marketplace";

  const steps =
    hp.how_it_works?.length > 0
      ? hp.how_it_works
      : [
          {
            num: "01",
            title: "Pilih Kursus",
            desc: "Browse ratusan kursus dari instruktur terpercaya. Gratis maupun premium.",
            icon: "📚",
          },
          {
            num: "02",
            title: "Daftar & Akses",
            desc: "Buat akun gratis dalam 30 detik. Langsung akses semua materi.",
            icon: "⚡",
          },
          {
            num: "03",
            title: "Belajar & Sertifikasi",
            desc: "Tonton video, selesaikan modul, dan raih sertifikat resmi.",
            icon: "🏆",
          },
        ];

  const about_headline =
    hp.about_headline || "Kami hadir untuk mendemokratisasi pendidikan digital";
  const about_body =
    hp.about_body ||
    "LearnFlow lahir dari keyakinan bahwa setiap orang berhak mendapatkan pendidikan berkualitas — tanpa batasan geografis, waktu, maupun biaya.";
  const founder_name = hp.founder_name || "Rini Wulandari";
  const founder_role = hp.founder_role || "Founder & CEO, LearnFlow";
  const founder_quote =
    hp.founder_quote ||
    "Kami percaya bahwa skill yang tepat bisa mengubah nasib seseorang. Itu mengapa kami membuat LearnFlow.";

  const testimonials =
    hp.testimonials?.length > 0
      ? hp.testimonials
      : [
          {
            name: "Andi Pratama",
            role: "Digital Marketer",
            text: "Skill TikTok saya naik drastis setelah ikut kursus di sini. Omzet bisnis naik 3x!",
            rating: 5,
            avatar: "A",
          },
          {
            name: "Siti Rahayu",
            role: "Freelance Designer",
            text: "Kursus desainnya sangat praktis dan langsung bisa diterapkan. Worth banget!",
            rating: 5,
            avatar: "S",
          },
          {
            name: "Budi Santoso",
            role: "Software Engineer",
            text: "Materinya up-to-date dan instrukturnya sangat responsif. Highly recommended!",
            rating: 5,
            avatar: "B",
          },
        ];

  const cta_headline = hp.cta_headline || "Siap untuk level up skill kamu?";
  const cta_body =
    hp.cta_body ||
    "Bergabung sekarang dan akses ratusan kursus gratis. Tidak butuh kartu kredit.";
  const cta_primary = hp.cta_primary || "Daftar Gratis";
  const cta_secondary = hp.cta_secondary || "Lihat Semua Kursus";

  return (
    <div className="bg-bg">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cta/6 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(124,107,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,107,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent-light text-xs font-bold mb-7">
              ✨ {hero_badge}
            </div>
            <h1 className="font-syne font-extrabold text-5xl sm:text-6xl leading-[1.05] tracking-tight mb-6">
              {hero_headline.split(",").map((part: string, i: number) => (
                <span key={i}>
                  {i > 0 && ","}
                  {i === 1 ? (
                    <span className="text-gradient">{part}</span>
                  ) : (
                    part
                  )}
                </span>
              ))}
            </h1>
            <p className="text-text-muted text-xl leading-relaxed mb-10 max-w-lg">
              {hero_subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/store"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-white font-syne font-bold text-base rounded-2xl hover:opacity-90 transition-all hover:-translate-y-1 shadow-xl shadow-accent/30"
              >
                {hero_cta_primary} <ArrowRight size={18} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/5 border border-white/10 text-[#EEEEFF] font-semibold text-base rounded-2xl hover:bg-white/10 transition-all"
              >
                <Play size={16} className="text-accent-light" />{" "}
                {hero_cta_secondary}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D", "E"].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-bg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `hsl(${250 + i * 30}, 70%, 55%)` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill="#F59E0B"
                      className="text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-text-muted text-xs">
                  Dipercaya{" "}
                  <span className="text-[#EEEEFF] font-semibold">10,000+</span>{" "}
                  pelajar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-white/[0.05] bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s: any) => (
              <div key={s.label} className="text-center">
                <div className="font-syne font-extrabold text-3xl mb-1 text-gradient">
                  {s.value}
                </div>
                <div className="text-text-muted text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      {featured.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-2">
                  {featured_badge}
                </p>
                <h2 className="font-syne font-extrabold text-4xl">
                  {featured_title}
                </h2>
              </div>
              <Link
                href="/store"
                className="hidden sm:flex items-center gap-1.5 text-sm text-accent-light hover:underline font-semibold"
              >
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((p) => (
                <CourseCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        className="py-12 sm:py-20 bg-surface/30 border-y border-white/[0.05]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">
              Cara Kerja
            </p>
            <h2 className="font-syne font-extrabold text-4xl mb-4">
              Mudah, Cepat, Efektif
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Dari daftar sampai dapat sertifikat, semua bisa dilakukan dalam
              hitungan menit.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((step: any) => (
              <div
                key={step.num}
                className="bg-card border border-white/[0.07] rounded-2xl p-7 text-center hover:border-accent/30 transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/25 text-3xl">
                  {step.icon}
                </div>
                <div className="font-syne font-extrabold text-3xl text-accent/30 mb-2">
                  {step.num}
                </div>
                <h3 className="font-syne font-bold text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">
                Tentang Kami
              </p>
              <h2 className="font-syne font-extrabold text-4xl mb-6 leading-tight">
                <span className="text-gradient">{about_headline}</span>
              </h2>
              <p className="text-text-muted leading-relaxed mb-8 text-base">
                {about_body}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Konten Terverifikasi",
                    desc: "Semua materi dikurasi oleh tim ahli",
                  },
                  {
                    icon: Award,
                    title: "Update Rutin",
                    desc: "Materi selalu diperbarui sesuai tren",
                  },
                  {
                    icon: Users,
                    title: "Komunitas Aktif",
                    desc: "Belajar bersama ribuan pelajar",
                  },
                  {
                    icon: Globe,
                    title: "Sertifikat Resmi",
                    desc: "Diakui oleh ratusan perusahaan",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-4 bg-card border border-white/[0.07] rounded-xl"
                  >
                    <Icon size={18} className="text-accent-light mb-2" />
                    <div className="font-semibold text-sm mb-1">{title}</div>
                    <div className="text-text-muted text-xs">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-cta/5 rounded-3xl blur-2xl" />
              <div className="relative bg-card border border-white/[0.08] rounded-3xl p-5 sm:p-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    {
                      label: "Kursus Gratis",
                      color: "text-green-400",
                      bg: "bg-green-500/10",
                      default_val: "100+",
                    },
                    {
                      label: "Kursus Premium",
                      color: "text-accent-light",
                      bg: "bg-accent/10",
                      default_val: "50+",
                    },
                    {
                      label: "Jam Konten",
                      color: "text-cta",
                      bg: "bg-cta/10",
                      default_val: "500+",
                    },
                    {
                      label: "Negara",
                      color: "text-purple-400",
                      bg: "bg-purple-500/10",
                      default_val: "15+",
                    },
                  ].map((s, i) => {
                    const keys = [
                      "about_stat1",
                      "about_stat2",
                      "about_stat3",
                      "about_stat4",
                    ];
                    const val = hp[keys[i] + "_value"] || s.default_val;
                    const lbl = hp[keys[i] + "_label"] || s.label;
                    return (
                      <div
                        key={i}
                        className={`${s.bg} rounded-2xl p-5 text-center`}
                      >
                        <div
                          className={`font-syne font-extrabold text-2xl ${s.color} mb-1`}
                        >
                          {val}
                        </div>
                        <div className="text-text-muted text-xs">{lbl}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-surface rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
                      {founder_name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {founder_name}
                      </div>
                      <div className="text-text-muted text-xs">
                        {founder_role}
                      </div>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm italic leading-relaxed">
                    "{founder_quote}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-12 sm:py-20 bg-surface/30 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-accent-light uppercase tracking-widest mb-3">
              Testimoni
            </p>
            <h2 className="font-syne font-extrabold text-4xl">Kata Mereka</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t: any, i: number) => (
              <div
                key={i}
                className="bg-card border border-white/[0.07] rounded-2xl p-7 hover:border-accent/25 transition-all hover:-translate-y-1"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= (t.rating || 5) ? "#F59E0B" : "none"}
                      className={
                        s <= (t.rating || 5)
                          ? "text-amber-400"
                          : "text-text-dim"
                      }
                    />
                  ))}
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center font-bold text-white shrink-0">
                    {t.avatar || t.name?.[0] || "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-12 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative bg-card border border-white/[0.08] rounded-3xl p-6 sm:p-14 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-bold mb-6">
                <Zap size={12} /> Mulai Gratis Sekarang
              </div>
              <h2 className="font-syne font-extrabold text-4xl sm:text-5xl mb-5 leading-tight">
                {cta_headline}
              </h2>
              <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
                {cta_body}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-cta hover:bg-cta-hover text-black font-syne font-extrabold text-lg rounded-2xl transition-all hover:-translate-y-1 shadow-2xl shadow-cta/30"
                >
                  {cta_primary} →
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white/5 border border-white/10 text-[#EEEEFF] font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
                >
                  {cta_secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
