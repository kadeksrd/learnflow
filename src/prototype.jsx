import { useState, useEffect, useRef } from "react";

// ── Icons (inline SVG components) ──────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const Zap = ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const ChevronRight = ({ size, className }) => <Icon d="M9 18l6-6-6-6" size={size} className={className}/>;
const ChevronDown = ({ size, className }) => <Icon d="M6 9l6 6 6-6" size={size} className={className}/>;
const Play = ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Star = ({ size, className, fill }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill={fill||"none"} stroke="currentColor" strokeWidth="2" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Check = ({ size, className }) => <Icon d="M20 6L9 17l-5-5" size={size} className={className}/>;
const Users = ({ size, className }) => <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" size={size} className={className}/>;
const Award = ({ size, className }) => <Icon d="M12 15l-2 5L7 18l-5 3 3-5-3-5 5 2 3-5 3 5 5-2-3 5 3 5-5-3zm0-12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={size} className={className}/>;
const BookOpen = ({ size, className }) => <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" size={size} className={className}/>;
const Search = ({ size, className }) => <Icon d="M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5zm5.5-.5l3.5 3.5" size={size} className={className}/>;
const StickyNote = ({ size, className }) => <Icon d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7l7-7V5a2 2 0 0 0-2-2zM12 19v-6h6" size={size} className={className}/>;
const Link2 = ({ size, className }) => <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={size} className={className}/>;
const Layout = ({ size, className }) => <Icon d="M3 3h18v4H3zM3 11h10v10H3zM15 11h6v4h-6zM15 19h6v2h-6z" size={size} className={className}/>;
const Package = ({ size, className }) => <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM12 22l-7-4v-8l7 4v8zm0-10L5 8l7-4 7 4-7 4z" size={size} className={className}/>;
const Menu = ({ size, className }) => <Icon d="M3 12h18M3 6h18M3 18h18" size={size} className={className}/>;
const X = ({ size, className }) => <Icon d="M18 6L6 18M6 6l12 12" size={size} className={className}/>;
const ArrowLeft = ({ size, className }) => <Icon d="M19 12H5M12 5l-7 7 7 7" size={size} className={className}/>;
const TrendingUp = ({ size, className }) => <Icon d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" size={size} className={className}/>;
const Video = ({ size, className }) => <Icon d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" size={size} className={className}/>;
const Shield = ({ size, className }) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={size} className={className}/>;

// ── Data ────────────────────────────────────────────────────────────────────
const COURSES = [
  { id: 1, title: "TikTok Viral Mastery", category: "Marketing", price: 0, is_free: true, emoji: "📱", modules: 8, lessons: 42, students: 3847, rating: 4.9, slug: "tiktok-viral", color: "#FF3B5C", desc: "Kuasai algoritma TikTok dan buat konten yang viral secara konsisten. Dari nol sampai 100K followers." },
  { id: 2, title: "Next.js Full-Stack Bootcamp", category: "Programming", price: 399000, is_free: false, emoji: "💻", modules: 12, lessons: 68, students: 2134, rating: 4.8, slug: "nextjs-bootcamp", color: "#7C6BFF", desc: "Bangun aplikasi web modern dengan Next.js 14, TypeScript, Prisma, dan deploy ke Vercel." },
  { id: 3, title: "Digital Marketing Masterclass", category: "Marketing", price: 299000, is_free: false, emoji: "🚀", modules: 10, lessons: 55, students: 4521, rating: 4.7, slug: "digimar", color: "#F59E0B", desc: "Strategi digital marketing end-to-end: SEO, paid ads, email marketing, dan social media." },
  { id: 4, title: "UI/UX Design Fundamentals", category: "Design", price: 0, is_free: true, emoji: "🎨", modules: 6, lessons: 34, students: 5123, rating: 4.9, slug: "uiux-design", color: "#10B981", desc: "Pelajari dasar-dasar UI/UX design menggunakan Figma dari nol. Cocok untuk pemula." },
  { id: 5, title: "Business Analytics with Excel", category: "Business", price: 249000, is_free: false, emoji: "📊", modules: 7, lessons: 38, students: 1892, rating: 4.6, slug: "biz-analytics", color: "#3B82F6", desc: "Analisa data bisnis dengan Excel dan Power BI. Buat dashboard interaktif yang impresif." },
  { id: 6, title: "AI Prompt Engineering Pro", category: "Technology", price: 349000, is_free: false, emoji: "🤖", modules: 9, lessons: 47, students: 2987, rating: 4.8, slug: "ai-prompts", color: "#8B5CF6", desc: "Kuasai seni prompt engineering untuk ChatGPT, Claude, dan Midjourney secara profesional." },
];

const LESSONS = [
  { id: 1, title: "Perkenalan & Overview", duration: 480, done: true, video: "https://www.youtube.com/embed/dQw4w9WgXcQ", desc: "Pengenalan kursus dan apa yang akan kamu pelajari.", notes: "• Pastikan sudah install tools yang dibutuhkan\n• Bergabung ke grup Telegram komunitas\n• Download cheat sheet di resource section", suggestions: [{ icon: "🎵", title: "TikTok Creator Portal", url: "#", type: "website" }, { icon: "📊", title: "TikTok Analytics Guide", url: "#", type: "article" }] },
  { id: 2, title: "Memahami Algoritma TikTok", duration: 720, done: true, video: null, desc: "Bagaimana algoritma TikTok bekerja dan cara memanfaatkannya.", notes: "• For You Page (FYP) didorong oleh engagement rate, bukan follower count\n• 3 detik pertama adalah kunci retensi\n• Posting jam 7-9 pagi atau 7-9 malam", suggestions: [{ icon: "🔍", title: "TikTok Algorithm Study 2024", url: "#", type: "article" }] },
  { id: 3, title: "Riset Konten Viral", duration: 600, done: false, video: null, desc: "Teknik riset konten yang berpotensi viral.", notes: null, suggestions: [] },
  { id: 4, title: "Hook Yang Memukau", duration: 540, done: false, video: null, desc: "Cara membuat hook 3 detik pertama yang bikin orang stop scrolling.", notes: null, suggestions: [{ icon: "🎬", title: "100 Hook Templates", url: "#", type: "download" }] },
  { id: 5, title: "Script & Storytelling", duration: 660, done: false, video: null, desc: "Formula storytelling yang terbukti meningkatkan completion rate.", notes: null, suggestions: [] },
];

const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

// ── Shared styles ────────────────────────────────────────────────────────────
const S = {
  bg: "#05050C", surface: "#0C0C1A", card: "#10101F", cardHover: "#151528",
  accent: "#7C6BFF", accentL: "#9F91FF", cta: "#F59E0B", green: "#10B981",
  muted: "#7070A0", dim: "#4A4A70",
};

// ── Main App ─────────────────────────────────────────────────────────────────
export default function LearnFlowPrototype() {
  const [page, setPage] = useState("home");
  const [activeCourse, setActiveCourse] = useState(COURSES[0]);
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [adminTab, setAdminTab] = useState("overview");
  const [lessonTab, setLessonTab] = useState("content");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [expandedModule, setExpandedModule] = useState(1);
  const [priceFilter, setPriceFilter] = useState("all");
  const [search, setSearch] = useState("");

  const nav = (p, course = null, lesson = null) => {
    if (course) setActiveCourse(course);
    if (lesson) setActiveLesson(lesson);
    setPage(p); setMobileMenu(false);
    window.scrollTo(0, 0);
  };

  const filtered = COURSES.filter(c => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase());
    const mp = priceFilter === "all" || (priceFilter === "free" && c.is_free) || (priceFilter === "paid" && !c.is_free);
    return ms && mp;
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: S.bg, color: "#EEEEFF", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${S.bg}; } ::-webkit-scrollbar-thumb { background: ${S.accent}; border-radius: 2px; }
        .syne { font-family: 'Syne', sans-serif; }
        .grad { background: linear-gradient(135deg, #9F91FF, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-btn { background: linear-gradient(135deg, ${S.accent}, ${S.accentL}); }
        .card-hover:hover { border-color: ${S.accent}88 !important; transform: translateY(-2px); transition: all 0.2s; }
        .btn-hover:hover { opacity: 0.88; transform: translateY(-1px); }
        .link-hover:hover { color: ${S.accentL} !important; }
        input, textarea, select { outline: none; }
        input:focus, textarea:focus, select:focus { border-color: ${S.accent} !important; }
        .tab-active { color: #EEEEFF; border-bottom: 2px solid ${S.accent}; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,5,12,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", marginRight: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 15px ${S.accent}40` }}>
              <Zap size={14} className="" />
            </div>
            <span className="syne" style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg, #9F91FF, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnFlow</span>
          </button>

          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {[["home","🏠 Home"],["store","🛒 Store"],["landing","📄 Landing"],["dashboard","📚 Dashboard"],["lesson","🎬 Lesson"],["admin","⚙️ Admin"]].map(([p, label]) => (
              <button key={p} onClick={() => nav(p)} style={{ padding: "6px 12px", borderRadius: 10, background: page === p ? `${S.accent}25` : "none", border: "none", cursor: "pointer", color: page === p ? S.accentL : S.muted, fontSize: 13, fontWeight: 500, transition: "all 0.2s", whiteSpace: "nowrap" }}
                className="link-hover">{label}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => nav("store")} style={{ padding: "7px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: S.muted, fontSize: 13, cursor: "pointer" }}>Masuk</button>
            <button onClick={() => nav("store")} style={{ padding: "7px 16px", borderRadius: 12, background: S.cta, border: "none", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }} className="btn-hover">Daftar Gratis</button>
          </div>
        </div>
      </nav>

      {/* ── PAGES ── */}
      <div style={{ paddingTop: 64 }}>
        {page === "home" && <HomePage nav={nav} />}
        {page === "store" && <StorePage nav={nav} filtered={filtered} search={search} setSearch={setSearch} priceFilter={priceFilter} setPriceFilter={setPriceFilter} />}
        {page === "landing" && <LandingPage nav={nav} course={activeCourse} />}
        {page === "dashboard" && <DashboardPage nav={nav} />}
        {page === "lesson" && <LessonPage nav={nav} lesson={activeLesson} lessonTab={lessonTab} setLessonTab={setLessonTab} expandedModule={expandedModule} setExpandedModule={setExpandedModule} lessons={LESSONS} setActiveLesson={setActiveLesson} />}
        {page === "admin" && <AdminPage nav={nav} adminTab={adminTab} setAdminTab={setAdminTab} />}
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ nav }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 500, height: 500, background: `${S.accent}08`, borderRadius: "50%", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 400, height: 400, background: `${S.cta}06`, borderRadius: "50%", filter: "blur(80px)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${S.accent}15`, border: `1px solid ${S.accent}30`, color: S.accentL, fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
              ✨ Platform Edukasi Digital #1 Indonesia
            </div>
            <h1 className="syne" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}>
              Belajar Skill Baru,<br /><span className="grad">Raih Peluang</span><br />Baru
            </h1>
            <p style={{ color: S.muted, fontSize: 18, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Ratusan kursus dari instruktur terpercaya. Gratis maupun premium. Bersertifikat resmi.
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
              <button onClick={() => nav("store")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 25px ${S.accent}35` }} className="btn-hover">
                Mulai Belajar Gratis <ChevronRight size={16} />
              </button>
              <button onClick={() => nav("landing")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#EEEEFF", fontSize: 15, cursor: "pointer" }}>
                <Play size={14} /> Lihat Demo
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {["#7C6BFF","#F59E0B","#10B981","#EF4444","#3B82F6"].map((c,i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: "2px solid " + S.bg, marginLeft: i ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{["A","B","C","D","E"][i]}</div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s=><Star key={s} size={12} fill="#F59E0B" />)}</div>
                <div style={{ color: S.muted, fontSize: 12, marginTop: 2 }}>Dipercaya <strong style={{ color: "#EEEEFF" }}>10,000+</strong> pelajar</div>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div style={{ position: "relative", height: 460 }}>
            <div style={{ position: "absolute", top: 20, left: 0, right: 0, background: "#10101F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF3B5C, #FF6B6B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📱</div>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>TikTok Viral Mastery</div>
                  <div style={{ color: S.muted, fontSize: 12 }}>Marketing · 8 Modul · 42 Lesson</div>
                </div>
                <span style={{ marginLeft: "auto", background: "#10B981", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>GRATIS</span>
              </div>
              {["Strategi konten viral","Algoritma TikTok 2024","Monetisasi akun","Analitik & growth hacking"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Check size={14} className="" style={{ color: "#10B981" }} />
                  <span style={{ color: S.muted, fontSize: 13 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ height: 6, background: S.surface, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "72%", height: "100%", background: `linear-gradient(90deg, ${S.accent}, ${S.accentL})`, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: S.muted }}>
                  <span>Progress belajar</span><span style={{ color: S.accentL, fontWeight: 700 }}>72%</span>
                </div>
              </div>
            </div>
            {/* Badges */}
            <div style={{ position: "absolute", left: -20, bottom: 80, background: S.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 16px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <Users size={16} className="" style={{ color: S.cta }} /><div><div style={{ fontSize: 14, fontWeight: 700 }}>2,847</div><div style={{ fontSize: 10, color: S.muted }}>Pelajar baru hari ini</div></div>
            </div>
            <div style={{ position: "absolute", right: -10, bottom: 40, background: S.card, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 16px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <Award size={16} className="" style={{ color: "#F59E0B" }} /><div><div style={{ fontSize: 13, fontWeight: 700 }}>Sertifikat Resmi</div><div style={{ fontSize: 10, color: S.muted }}>Diakui industri</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(12,12,26,0.5)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[["10,000+","Pelajar Aktif","#7C6BFF"],["200+","Kursus Tersedia","#F59E0B"],["98%","Tingkat Kepuasan","#10B981"],["50+","Instruktur Ahli","#3B82F6"]].map(([v,l,c]) => (
            <div key={l} style={{ textAlign: "center", padding: "12px 8px" }}>
              <div className="syne" style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
              <div style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured courses */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.accentL, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Marketplace</div>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 800 }}>Kursus Terpopuler</h2>
          </div>
          <button onClick={() => nav("store")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: S.accentL, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Lihat Semua <ChevronRight size={16} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {COURSES.slice(0,3).map(c => <CourseCard key={c.id} course={c} nav={nav} />)}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "rgba(12,12,26,0.4)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "60px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.accentL, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Cara Kerja</div>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Mudah, Cepat, Efektif</h2>
            <p style={{ color: S.muted, maxWidth: 500, margin: "0 auto" }}>Dari daftar sampai dapat sertifikat dalam hitungan menit.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[["01","Pilih Kursus","Browse ratusan kursus dari instruktur terpercaya. Gratis maupun premium.","📚"],["02","Daftar & Akses","Buat akun gratis dalam 30 detik. Langsung akses semua materi.","⚡"],["03","Belajar & Sertifikasi","Tonton video, selesaikan modul, dan raih sertifikat resmi.","🏆"]].map(([num,title,desc,ico]) => (
              <div key={num} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, textAlign: "center" }} className="card-hover">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px", boxShadow: `0 8px 20px ${S.accent}30` }}>{ico}</div>
                <div className="syne" style={{ fontSize: 32, fontWeight: 800, color: `${S.accent}40`, marginBottom: 6 }}>{num}</div>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: S.muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.accentL, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Tentang Kami</div>
          <h2 className="syne" style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Kami hadir untuk<br /><span className="grad">mendemokratisasi</span><br />pendidikan digital
          </h2>
          <p style={{ color: S.muted, lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
            LearnFlow lahir dari keyakinan bahwa setiap orang berhak mendapatkan pendidikan berkualitas — tanpa batasan geografis, waktu, maupun biaya.
          </p>
          <p style={{ color: S.muted, lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
            Kami bekerja sama dengan instruktur terbaik Indonesia untuk menghadirkan konten yang relevan, praktis, dan langsung bisa diterapkan.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["🛡️","Konten Terverifikasi","Dikurasi tim ahli"],["📈","Update Rutin","Selalu terkini"],["👥","Komunitas Aktif","Belajar bersama"],["🏅","Sertifikat Resmi","Diakui industri"]].map(([ic,t,d]) => (
              <div key={t} style={{ padding: 16, background: S.card, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{ic}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{t}</div>
                <div style={{ color: S.muted, fontSize: 12 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["100+","Kursus Gratis","#10B981"],["50+","Kursus Premium","#7C6BFF"],["500+","Jam Konten","#F59E0B"],["15+","Negara","#8B5CF6"]].map(([v,l,c]) => (
              <div key={l} style={{ background: c + "10", borderRadius: 16, padding: 16, textAlign: "center" }}>
                <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ color: S.muted, fontSize: 12, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: S.surface, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>R</div>
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>Rini Wulandari</div><div style={{ color: S.muted, fontSize: 11 }}>Founder & CEO, LearnFlow</div></div>
            </div>
            <p style={{ color: S.muted, fontSize: 13, fontStyle: "italic", lineHeight: 1.7 }}>"Kami percaya bahwa skill yang tepat bisa mengubah nasib seseorang. Itu mengapa kami membuat LearnFlow."</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 28, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 400, height: 150, background: `${S.accent}10`, filter: "blur(60px)" }} />
          <div style={{ position: "relative" }}>
            <h2 className="syne" style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Siap untuk <span className="grad">level up</span>?</h2>
            <p style={{ color: S.muted, fontSize: 17, marginBottom: 32 }}>Bergabung sekarang. Tidak butuh kartu kredit.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => nav("store")} style={{ padding: "16px 36px", borderRadius: 16, background: S.cta, color: "#000", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", boxShadow: `0 10px 30px ${S.cta}35` }} className="btn-hover">Daftar Gratis →</button>
              <button onClick={() => nav("store")} style={{ padding: "16px 28px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#EEEEFF", fontSize: 15, cursor: "pointer" }}>Lihat Kursus</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: S.surface, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={13} /></div>
                <span className="syne" style={{ fontWeight: 800, fontSize: 17, background: "linear-gradient(135deg, #9F91FF, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnFlow</span>
              </div>
              <p style={{ color: S.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 240 }}>Platform kursus digital terbaik untuk belajar skill baru.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["🐦","📸","▶️","📧"].map((ico,i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: 10, background: S.card, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{ico}</div>
                ))}
              </div>
            </div>
            {[["Platform",["Store Kursus","Kursus Gratis","Kursus Premium","Kategori"]],["Akun",["Dashboard","Daftar Gratis","Masuk"]],["Perusahaan",["Tentang Kami","Blog","Karir","Kontak"]]].map(([title, links]) => (
              <div key={title}>
                <div className="syne" style={{ fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: S.muted, marginBottom: 16 }}>{title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {links.map(l => <span key={l} style={{ color: S.muted, fontSize: 13, cursor: "pointer" }} className="link-hover">{l}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: S.dim, fontSize: 12 }}>© 2025 LearnFlow. Hak cipta dilindungi.</span>
            <span style={{ color: S.dim, fontSize: 12 }}>Dibuat dengan ❤️ di Indonesia 🇮🇩</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── CourseCard (shared) ───────────────────────────────────────────────────────
function CourseCard({ course, nav }) {
  return (
    <div onClick={() => nav("landing", course)} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.25s" }} className="card-hover">
      <div style={{ height: 160, background: `linear-gradient(135deg, ${course.color}25, ${course.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
        {course.emoji}
        <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 20, background: course.is_free ? "#10B981" : `linear-gradient(135deg, ${S.accent}, #B794F4)`, color: "#fff", fontSize: 11, fontWeight: 700 }}>{course.is_free ? "GRATIS" : "PREMIUM"}</span>
        <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 20, background: "rgba(0,0,0,0.5)", color: S.muted, fontSize: 11 }}>{course.category}</span>
      </div>
      <div style={{ padding: 20 }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{course.title}</h3>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <span style={{ color: S.muted, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><BookOpen size={11} /> {course.modules} modul</span>
          <span style={{ color: "#F59E0B", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><Star size={11} fill="#F59E0B" /> {course.rating}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="syne" style={{ fontWeight: 800, fontSize: 18, color: course.is_free ? "#10B981" : "#EEEEFF" }}>
            {course.is_free ? "GRATIS" : fmt(course.price)}
          </span>
          <span style={{ padding: "7px 14px", borderRadius: 10, background: course.is_free ? "rgba(16,185,129,0.15)" : S.cta, color: course.is_free ? "#10B981" : "#000", fontSize: 12, fontWeight: 700 }}>
            {course.is_free ? "Ambil Gratis" : "Beli Sekarang"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── STORE PAGE ────────────────────────────────────────────────────────────────
function StorePage({ nav, filtered, search, setSearch, priceFilter, setPriceFilter }) {
  return (
    <div>
      {/* Header */}
      <div style={{ background: "rgba(12,12,26,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "48px 20px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: `${S.accent}15`, border: `1px solid ${S.accent}25`, color: S.accentL, fontSize: 11, fontWeight: 700, marginBottom: 16 }}>✨ Marketplace</div>
          <h1 className="syne" style={{ fontSize: 44, fontWeight: 800, marginBottom: 12 }}>Tingkatkan Skill <span className="grad">Mulai Sekarang</span></h1>
          <p style={{ color: S.muted, fontSize: 16 }}>{COURSES.length} kursus tersedia dari instruktur terpercaya</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: S.dim }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kursus..." style={{ width: "100%", padding: "10px 14px 10px 38px", background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "#EEEEFF", fontSize: 13 }} />
          </div>
          {["all","free","paid"].map(f => (
            <button key={f} onClick={() => setPriceFilter(f)} style={{ padding: "10px 18px", borderRadius: 12, background: priceFilter === f ? `${S.accent}25` : S.card, border: priceFilter === f ? `1px solid ${S.accent}50` : "1px solid rgba(255,255,255,0.07)", color: priceFilter === f ? S.accentL : S.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {f === "all" ? "Semua" : f === "free" ? "🎁 Gratis" : "💎 Premium"}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
          {["Semua","Marketing","Programming","Design","Business","Technology"].map((cat, i) => (
            <button key={cat} style={{ padding: "6px 14px", borderRadius: 20, background: i === 0 ? S.accent : S.card, border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)", color: i === 0 ? "#fff" : S.muted, fontSize: 12, fontWeight: i === 0 ? 700 : 400, cursor: "pointer" }}>{cat}</button>
          ))}
        </div>

        <p style={{ color: S.muted, fontSize: 13, marginBottom: 20 }}><strong style={{ color: "#EEEEFF" }}>{filtered.length}</strong> kursus ditemukan</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {filtered.map(c => <CourseCard key={c.id} course={c} nav={nav} />)}
        </div>
      </div>
    </div>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({ nav, course }) {
  const [expanded, setExpanded] = useState([0]);
  const modules = [
    { title: "Pendahuluan", lessons: ["Kenalan dulu yuk!", "Tools yang dibutuhkan", "Overview kurikulum"] },
    { title: "Riset & Strategi", lessons: ["Memahami algoritma", "Riset konten viral", "Competitor analysis"] },
    { title: "Produksi Konten", lessons: ["Hook yang kuat", "Script formula", "Teknik editing dasar"] },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "60px 20px 80px" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 20% 50%, ${course.color}15, transparent)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: course.color + "20", border: `1px solid ${course.color}40`, color: course.color, fontSize: 11, fontWeight: 700, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: course.color }} />
              {course.category} · Course Online
            </div>
            <h1 className="syne" style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>{course.title}</h1>
            <p style={{ color: S.muted, fontSize: 17, lineHeight: 1.7, marginBottom: 28 }}>{course.desc}</p>

            {!course.is_free && (
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
                <span className="syne" style={{ fontSize: 40, fontWeight: 800 }}>{fmt(course.price)}</span>
                <span style={{ color: S.dim, fontSize: 22, textDecoration: "line-through" }}>{fmt(course.price * 2)}</span>
                <span style={{ padding: "3px 8px", background: "rgba(239,68,68,0.15)", color: "#EF4444", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>-50%</span>
              </div>
            )}

            <button onClick={() => nav("dashboard")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 32px", borderRadius: 16, background: course.is_free ? "#10B981" : S.cta, color: course.is_free ? "#fff" : "#000", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 17, border: "none", cursor: "pointer", width: "100%", maxWidth: 420, boxShadow: `0 10px 30px ${course.is_free ? "#10B98140" : S.cta + "40"}` }} className="btn-hover">
              <span style={{ fontSize: 22 }}>{course.is_free ? "🎁" : "🚀"}</span>
              <span style={{ flex: 1 }}>{course.is_free ? "Ambil Gratis Sekarang" : "Beli Sekarang"}</span>
              <span>→</span>
            </button>

            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              {[["🛡️","Garansi 30 hari"],["🏅","Sertifikat resmi"],["♾️","Akses seumur hidup"]].map(([ic,t]) => (
                <span key={t} style={{ color: S.muted, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>{ic} {t}</span>
              ))}
            </div>
          </div>

          <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ height: 200, background: `linear-gradient(135deg, ${course.color}20, ${course.color}08)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontSize: 60 }}>{course.emoji}</div>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Play size={20} />
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ color: S.muted, fontSize: 12, marginBottom: 12 }}>Yang kamu dapatkan:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                {[[course.modules, "Modul"],[course.lessons, "Lesson"],["∞","Akses"]].map(([v,l],i) => (
                  <div key={l} style={{ padding: 16, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                    <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
                    <div style={{ color: S.muted, fontSize: 11, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "48px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.accentL, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Yang Akan Dipelajari</div>
            <h2 className="syne" style={{ fontSize: 32, fontWeight: 800 }}>Kenapa Harus Kursus Ini?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[["🎯","Strategi Terbukti","Formula konten yang sudah diuji dan terbukti menghasilkan views jutaan."],["📊","Data-Driven","Belajar baca analitik dan gunakan data untuk keputusan konten."],["💰","Monetisasi","Teknik monetisasi akun dari TikTok Shop, brand deal, hingga live."],["🎬","Produksi Pro","Cara produksi video viral dengan hanya pakai smartphone."],["🤝","Komunitas","Bergabung dengan komunitas kreator aktif yang saling support."],["📜","Sertifikat","Dapatkan sertifikat resmi yang diakui oleh brand dan perusahaan."]].map(([ic,t,d]) => (
              <div key={t} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${S.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{ic}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{t}</div>
                <div style={{ color: S.muted, fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "48px 20px", background: "rgba(12,12,26,0.4)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 className="syne" style={{ fontSize: 32, fontWeight: 800 }}>Kata Mereka</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[["Andi P.","Digital Marketer","Omzet naik 3x setelah ikut kursus ini. Materi sangat praktis!","A"],["Siti R.","Freelancer","Dalam 2 bulan follower naik dari 500 ke 50K. Luar biasa!","S"],["Budi S.","Content Creator","Akhirnya paham cara kerja algoritma TikTok. Worth it banget!","B"]].map(([name,role,text,av]) => (
              <div key={name} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>{[1,2,3,4,5].map(s=><Star key={s} size={13} fill="#F59E0B" />)}</div>
                <p style={{ color: S.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14 }}>{av}</div>
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div><div style={{ color: S.muted, fontSize: 11 }}>{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section style={{ padding: "48px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 className="syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Isi Kursus</h2>
            <p style={{ color: S.muted }}>{modules.length} modul · {modules.reduce((s,m) => s + m.lessons.length,0)} lesson</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modules.map((mod, mi) => (
              <div key={mi} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setExpanded(p => p.includes(mi) ? p.filter(x => x !== mi) : [...p, mi])}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", color: "#EEEEFF" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${S.accent}15`, border: `1px solid ${S.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: S.accentL }}>{mi+1}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{mod.title}</div>
                    <div style={{ color: S.muted, fontSize: 12 }}>{mod.lessons.length} lesson</div>
                  </div>
                  <ChevronDown size={16} style={{ color: S.muted, transform: expanded.includes(mi) ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                </button>
                {expanded.includes(mi) && (
                  <div style={{ padding: "0 20px 16px" }}>
                    {mod.lessons.map((l, li) => (
                      <div key={li} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4 }}>
                        {mi === 0 && li === 0 ? <Play size={12} style={{ color: S.accentL }} /> : <div style={{ width: 12, height: 12, borderRadius: "50%", border: `1.5px solid ${S.dim}` }} />}
                        <span style={{ flex: 1, fontSize: 13, color: S.muted }}>{l}</span>
                        {mi === 0 && li === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: S.accentL, background: `${S.accent}15`, padding: "2px 8px", borderRadius: 6 }}>Preview</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(5,5,12,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", zIndex: 99 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{course.title}</div>
            <div style={{ color: S.muted, fontSize: 12 }}>{course.is_free ? "🎁 GRATIS — Akses Seumur Hidup" : `💎 ${fmt(course.price)} — Hemat 50%`}</div>
          </div>
          <button onClick={() => nav("dashboard")} style={{ padding: "12px 24px", borderRadius: 12, background: course.is_free ? "#10B981" : S.cta, color: course.is_free ? "#fff" : "#000", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            {course.is_free ? "Ambil Gratis" : "Beli Sekarang"} →
          </button>
        </div>
      </div>
      <div style={{ height: 70 }} />
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ nav }) {
  const courses = COURSES.slice(0, 4);
  const progresses = [72, 100, 35, 0];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 className="syne" style={{ fontSize: 30, fontWeight: 800, marginBottom: 4 }}>Halo, Budi! 👋</h1>
          <p style={{ color: S.muted }}>Lanjutkan belajar hari ini</p>
        </div>
        <button onClick={() => nav("store")} style={{ padding: "10px 18px", borderRadius: 12, background: S.card, border: "1px solid rgba(255,255,255,0.07)", color: S.muted, fontSize: 13, cursor: "pointer" }}>+ Explore Kursus</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 36 }}>
        {[["📚","4","Kursus Aktif","#7C6BFF"],["✅","28","Lesson Selesai","#F59E0B"],["🏆","1","Sertifikat","#10B981"]].map(([ic,v,l,c]) => (
          <div key={l} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 24px" }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{ic}</div>
            <div className="syne" style={{ fontSize: 30, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div>
            <div style={{ color: S.muted, fontSize: 13 }}>{l}</div>
          </div>
        ))}
      </div>

      <h2 className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Kursus Saya</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {courses.map((c, i) => (
          <div key={c.id} onClick={() => nav("lesson")} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }} className="card-hover">
            <div style={{ height: 120, background: `linear-gradient(135deg, ${c.color}20, ${c.color}08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>
              {c.emoji}
              {progresses[i] === 100 && <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>✓</div>}
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ color: S.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{c.category}</div>
              <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{c.title}</h3>
              <div style={{ height: 5, background: S.surface, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: `${progresses[i]}%`, height: "100%", background: `linear-gradient(90deg, ${S.accent}, ${S.accentL})`, borderRadius: 3, transition: "width 0.8s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: S.muted, fontSize: 12 }}>{progresses[i] === 100 ? "Selesai! 🎉" : `${progresses[i]}% selesai`}</span>
                <span style={{ color: S.accentL, fontSize: 12, fontWeight: 700 }}>{progresses[i]}%</span>
              </div>
              <button style={{ width: "100%", padding: "10px", borderRadius: 10, background: progresses[i] === 100 ? "rgba(245,158,11,0.1)" : `${S.accent}15`, border: progresses[i] === 100 ? "1px solid rgba(245,158,11,0.3)" : `1px solid ${S.accent}30`, color: progresses[i] === 100 ? "#F59E0B" : S.accentL, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {progresses[i] === 100 ? "🏆 Lihat Sertifikat" : progresses[i] > 0 ? "▶ Lanjut Belajar" : "▶ Mulai Belajar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LESSON PAGE ───────────────────────────────────────────────────────────────
function LessonPage({ nav, lesson, lessonTab, setLessonTab, expandedModule, setExpandedModule, lessons, setActiveLesson }) {
  const [completed, setCompleted] = useState(lesson.done);
  const [autoNext, setAutoNext] = useState(true);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside style={{ background: S.surface, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "sticky", top: 64, height: "calc(100vh - 64px)", overflow: "auto" }}>
        <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, lineHeight: 1.4 }}>TikTok Viral Mastery</div>
          <div style={{ height: 5, background: S.bg, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: "40%", height: "100%", background: `linear-gradient(90deg, ${S.accent}, ${S.accentL})`, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: S.muted }}>
            <span>2 dari 5 lesson</span><span style={{ color: S.accentL, fontWeight: 700 }}>40%</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: 8, overflow: "auto" }}>
          {["Pendahuluan (5 lesson)","Riset & Strategi (4 lesson)"].map((mod, mi) => (
            <div key={mi} style={{ marginBottom: 4 }}>
              <button onClick={() => setExpandedModule(expandedModule === mi ? -1 : mi)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "none", border: "none", cursor: "pointer", color: S.muted, fontSize: 12 }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: `${S.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: S.accentL }}>{mi+1}</span>
                <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>{mod}</span>
                <ChevronDown size={12} style={{ transform: expandedModule === mi ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              </button>
              {expandedModule === mi && mi === 0 && (
                <div style={{ paddingLeft: 8 }}>
                  {lessons.map((l, li) => (
                    <button key={l.id} onClick={() => setActiveLesson(l)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, background: lesson.id === l.id ? `${S.accent}15` : "none", border: "none", cursor: "pointer", color: lesson.id === l.id ? S.accentL : S.muted, fontSize: 12, marginBottom: 2 }}>
                      {l.done ? <Check size={12} style={{ color: "#10B981" }} /> : <div style={{ width: 12, height: 12, borderRadius: "50%", border: `1.5px solid ${S.dim}`, flexShrink: 0 }} />}
                      <span style={{ flex: 1, textAlign: "left", lineHeight: 1.3 }}>{l.title}</span>
                      {l.notes && <span title="Ada catatan" style={{ color: "#F59E0B", fontSize: 10 }}>📝</span>}
                      {l.suggestions?.length > 0 && <span title="Ada resource" style={{ color: "#10B981", fontSize: 10 }}>🔗</span>}
                      {l.duration > 0 && <span style={{ color: S.dim, fontSize: 10, whiteSpace: "nowrap" }}>{Math.floor(l.duration/60)}m</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ padding: "24px 32px", overflow: "auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: S.muted, fontSize: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ cursor: "pointer" }} onClick={() => nav("dashboard")}>TikTok Viral Mastery</span>
          <span>/</span><span>Pendahuluan</span>
          <span>/</span><span style={{ color: "#EEEEFF" }}>{lesson.title}</span>
        </div>

        <h1 className="syne" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{lesson.title}</h1>
        <p style={{ color: S.muted, fontSize: 13, marginBottom: 24 }}>⏱ {Math.floor(lesson.duration/60)} menit</p>

        {/* Video */}
        <div style={{ background: "#000", borderRadius: 16, overflow: "hidden", marginBottom: 20, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {lesson.video ? (
            <iframe src={lesson.video} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, background: "linear-gradient(135deg, #0A0015, #1A0A2E)", width: "100%", height: "100%", justifyContent: "center" }}>
              <span style={{ fontSize: 56 }}>🎬</span>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Play size={22} />
              </div>
              <p style={{ color: S.muted, fontSize: 14 }}>Video tersedia setelah enroll</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 6, background: S.surface, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: "40%", height: "100%", background: `linear-gradient(90deg, ${S.accent}, ${S.accentL})`, borderRadius: 3 }} />
          </div>
          <span style={{ color: S.muted, fontSize: 12, fontWeight: 600 }}>40% selesai</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <button onClick={() => setCompleted(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: completed ? "rgba(16,185,129,0.1)" : S.accent, border: completed ? "1px solid rgba(16,185,129,0.3)" : "none", color: completed ? "#10B981" : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Check size={14} /> {completed ? "Lesson Selesai ✓" : "Tandai Selesai"}
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, cursor: "pointer", fontSize: 13, color: S.muted }}>
            <input type="checkbox" checked={autoNext} onChange={e => setAutoNext(e.target.checked)} style={{ accentColor: S.accent }} />
            Auto-lanjut
          </label>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: S.muted, fontSize: 13, cursor: "pointer" }}>
              <ArrowLeft size={14} /> Prev
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", background: S.accent, border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, gap: 4 }}>
          {[["description","📋 Deskripsi"],["notes","📝 Catatan"],["suggestions","🔗 Resources"]].map(([id, label]) => (
            <button key={id} onClick={() => setLessonTab(id)}
              style={{ padding: "10px 16px", background: "none", border: "none", color: lessonTab === id ? "#EEEEFF" : S.muted, fontSize: 13, fontWeight: lessonTab === id ? 600 : 400, cursor: "pointer", borderBottom: lessonTab === id ? `2px solid ${S.accent}` : "2px solid transparent", marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {lessonTab === "description" && lesson.desc && (
          <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
            <h3 className="syne" style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>Tentang Lesson Ini</h3>
            <p style={{ color: S.muted, lineHeight: 1.8, fontSize: 14 }}>{lesson.desc}</p>
          </div>
        )}

        {lessonTab === "notes" && (
          <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StickyNote size={16} style={{ color: "#F59E0B" }} />
              </div>
              <h3 className="syne" style={{ fontWeight: 700, fontSize: 16, color: "#FCD34D" }}>📝 Catatan & Tips</h3>
            </div>
            {lesson.notes ? (
              <pre style={{ color: "rgba(253,211,77,0.75)", fontSize: 14, lineHeight: 1.9, fontFamily: "DM Sans, sans-serif", whiteSpace: "pre-wrap" }}>{lesson.notes}</pre>
            ) : (
              <p style={{ color: S.muted, fontSize: 14, fontStyle: "italic" }}>Belum ada catatan untuk lesson ini.</p>
            )}
          </div>
        )}

        {lessonTab === "suggestions" && (
          <div>
            <h3 className="syne" style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🔗 Tools & Resources</h3>
            {lesson.suggestions?.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {lesson.suggestions.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, cursor: "pointer", transition: "all 0.2s" }} className="card-hover">
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{s.title}</div>
                      <div style={{ color: S.muted, fontSize: 11, textTransform: "capitalize" }}>{s.type}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: S.dim }} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: S.muted, fontSize: 14 }}>Belum ada resource untuk lesson ini.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage({ nav, adminTab, setAdminTab }) {
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonEditTab, setLessonEditTab] = useState("content");
  const [newSugg, setNewSugg] = useState({ title: "", url: "", type: "tool", icon: "" });
  const [savedSuggs, setSavedSuggs] = useState([{ icon: "🎵", title: "TikTok Creator Portal", url: "creator.tiktok.com", type: "website" }]);

  const adminNav = [["overview","📊 Overview"],["products","📦 Products"],["landing","📄 Landing Pages"],["courses","🎓 Courses"],["orders","🛒 Orders"]];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside style={{ background: S.surface, borderRight: "1px solid rgba(255,255,255,0.06)", padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 8px 20px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={12} /></div>
          <span className="syne" style={{ fontWeight: 800, fontSize: 14, background: "linear-gradient(135deg, #9F91FF, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Panel</span>
        </div>
        {adminNav.map(([id, label]) => (
          <button key={id} onClick={() => setAdminTab(id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: adminTab === id ? `${S.accent}15` : "none", border: adminTab === id ? `1px solid ${S.accent}25` : "1px solid transparent", color: adminTab === id ? S.accentL : S.muted, fontSize: 13, fontWeight: adminTab === id ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
            {label}
          </button>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 16 }}>
          <button onClick={() => nav("home")} style={{ width: "100%", padding: "10px 12px", borderRadius: 12, background: "none", border: "none", color: S.muted, fontSize: 12, cursor: "pointer", textAlign: "left" }}>← Kembali ke Site</button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ padding: 28, overflow: "auto" }}>

        {/* ── OVERVIEW ── */}
        {adminTab === "overview" && (
          <div>
            <h1 className="syne" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Overview</h1>
            <p style={{ color: S.muted, fontSize: 14, marginBottom: 28 }}>Ringkasan platform LearnFlow</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
              {[["Rp 18.5M","Total Revenue","#F59E0B"],["47","Paid Orders","#10B981"],["6","Products","#7C6BFF"],["312","Enrolled Users","#8B5CF6"]].map(([v,l,c]) => (
                <div key={l} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                  <div className="syne" style={{ fontSize: 26, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div>
                  <div style={{ color: S.muted, fontSize: 12 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
              <h2 className="syne" style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Order Terbaru</h2>
              {[["Next.js Bootcamp","Midtrans","Rp 399,000","paid"],["Digital Marketing","Xendit","Rp 299,000","paid"],["AI Prompt Eng.","Xendit","Rp 349,000","pending"]].map(([p,g,a,s]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ flex: 2, fontWeight: 500, fontSize: 13 }}>{p}</span>
                  <span style={{ flex: 1, color: S.muted, fontSize: 12 }}>{g}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 13 }}>{a}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, background: s === "paid" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: s === "paid" ? "#10B981" : "#F59E0B", fontSize: 11, fontWeight: 700 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {adminTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Products</h1>
                <p style={{ color: S.muted, fontSize: 13 }}>6 produk terdaftar</p>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, background: S.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Tambah Produk</button>
            </div>
            <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              {COURSES.map((c, i) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px", gap: 12, padding: "14px 20px", borderBottom: i < COURSES.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.color}30, ${c.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                      <div style={{ color: S.muted, fontSize: 11 }}>{c.category}</div>
                    </div>
                  </div>
                  <span style={{ color: S.muted, fontSize: 13 }}>{c.category}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: c.is_free ? "#10B981" : "#EEEEFF" }}>{c.is_free ? "GRATIS" : fmt(c.price)}</span>
                  <span style={{ display: "inline-flex", padding: "4px 10px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981", fontSize: 11, fontWeight: 700, width: "fit-content" }}>Published</span>
                  <button onClick={() => setAdminTab("landing")} style={{ padding: "7px 14px", borderRadius: 10, background: `${S.accent}10`, border: `1px solid ${S.accent}25`, color: S.accentL, fontSize: 12, cursor: "pointer" }}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LANDING PAGE EDITOR ── */}
        {adminTab === "landing" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Landing Page Editor</h1>
              <button onClick={() => nav("landing", COURSES[0])} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: `${S.accent}10`, border: `1px solid ${S.accent}25`, color: S.accentL, fontSize: 12, cursor: "pointer" }}>
                👁 Preview
              </button>
            </div>
            {[["Slug URL","tiktok-viral-mastery","URL: /course/tiktok-viral-mastery"],["Headline","Kuasai TikTok dari Nol Sampai Pro",""],["CTA Button Text","Ambil Gratis Sekarang",""]].map(([label, val, hint]) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{label}</div>
                <input defaultValue={val} style={{ width: "100%", padding: "12px 16px", background: S.surface, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "#EEEEFF", fontSize: 14 }} />
                {hint && <div style={{ color: S.dim, fontSize: 11, marginTop: 5 }}>{hint}</div>}
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Sub-headline</div>
              <textarea defaultValue="Strategi TikTok yang sudah terbukti menghasilkan jutaan views." style={{ width: "100%", padding: "12px 16px", background: S.surface, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "#EEEEFF", fontSize: 14, resize: "none", height: 80 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 2 }}>Benefits</div>
                <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: `${S.accent}10`, border: `1px solid ${S.accent}20`, color: S.accentL, fontSize: 12, cursor: "pointer" }}>+ Tambah</button>
              </div>
              {[["🎯","Strategi Terbukti","Formula konten viral yang sudah diuji"],["📊","Data-Driven","Baca analitik untuk keputusan konten"]].map(([ic,t,d]) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 14, background: S.surface, borderRadius: 12, marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ic}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
                    <div style={{ color: S.muted, fontSize: 12, marginTop: 4 }}>{d}</div>
                  </div>
                  <button style={{ color: S.muted, background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>🗑</button>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "14px", borderRadius: 14, background: `linear-gradient(135deg, ${S.accent}, ${S.accentL})`, border: "none", color: "#fff", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 6px 20px ${S.accent}30` }}>💾 Simpan Perubahan</button>
          </div>
        )}

        {/* ── COURSE BUILDER ── */}
        {adminTab === "courses" && (
          <div style={{ maxWidth: 700 }}>
            <h1 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Course Builder</h1>
            <p style={{ color: S.muted, fontSize: 13, marginBottom: 24 }}>TikTok Viral Mastery</p>

            {[{title:"Pendahuluan",id:1},{title:"Riset & Strategi",id:2}].map((mod,mi) => (
              <div key={mod.id} style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${S.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: S.accentL }}>{mi+1}</div>
                  <input defaultValue={mod.title} style={{ flex: 1, background: "none", border: "none", color: "#EEEEFF", fontSize: 14, fontWeight: 600 }} />
                  <button style={{ background: "none", border: "none", color: S.accentL, cursor: "pointer", fontSize: 18 }}>+</button>
                  <button style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 14 }}>🗑</button>
                  <ChevronDown size={16} style={{ color: S.muted }} />
                </div>

                {mi === 0 && (
                  <div style={{ padding: "0 18px 16px" }}>
                    {LESSONS.slice(0,3).map((l,li) => (
                      <div key={l.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, background: editingLesson === l.id ? `${S.accent}08` : S.surface, marginBottom: 4, transition: "background 0.2s" }}>
                          <span style={{ color: S.dim, fontSize: 11, width: 18 }}>{li+1}</span>
                          <input defaultValue={l.title} style={{ flex: 1, background: "none", border: "none", color: "#EEEEFF", fontSize: 13 }} />
                          {l.notes && <span style={{ color: "#F59E0B", fontSize: 12 }}>📝</span>}
                          <div style={{ display: "flex", gap: 4 }}>
                            {[["🎬","content"],["📝","notes"],["🔗","suggestions"]].map(([ico, tab]) => (
                              <button key={tab} onClick={() => { setEditingLesson(editingLesson === l.id && lessonEditTab === tab ? null : l.id); setLessonEditTab(tab) }}
                                style={{ width: 28, height: 28, borderRadius: 8, background: editingLesson === l.id && lessonEditTab === tab ? `${S.accent}20` : "none", border: editingLesson === l.id && lessonEditTab === tab ? `1px solid ${S.accent}30` : "1px solid transparent", color: editingLesson === l.id && lessonEditTab === tab ? S.accentL : S.muted, cursor: "pointer", fontSize: 13 }}>
                                {ico}
                              </button>
                            ))}
                            <button style={{ width: 28, height: 28, borderRadius: 8, background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 13 }}>🗑</button>
                          </div>
                        </div>

                        {editingLesson === l.id && (
                          <div style={{ marginLeft: 28, marginBottom: 8, background: S.surface, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              {[["content","🎬 Video"],["notes","📝 Catatan"],["suggestions","🔗 Suggestions"]].map(([id,lbl]) => (
                                <button key={id} onClick={() => setLessonEditTab(id)}
                                  style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", color: lessonEditTab === id ? "#EEEEFF" : S.muted, fontSize: 12, fontWeight: lessonEditTab === id ? 600 : 400, cursor: "pointer", borderBottom: lessonEditTab === id ? `2px solid ${S.accent}` : "2px solid transparent" }}>
                                  {lbl}
                                </button>
                              ))}
                            </div>

                            {lessonEditTab === "content" && (
                              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 2 }}>URL Video</div>
                                <input defaultValue={l.video || ""} placeholder="https://youtube.com/watch?v=..." style={{ padding: "10px 14px", background: S.bg, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#EEEEFF", fontSize: 13 }} />
                                <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 2 }}>Deskripsi</div>
                                <textarea defaultValue={l.desc || ""} placeholder="Deskripsi lesson..." style={{ padding: "10px 14px", background: S.bg, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#EEEEFF", fontSize: 13, resize: "none", height: 70 }} />
                                <button style={{ padding: "10px", borderRadius: 10, background: S.accent, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💾 Simpan</button>
                              </div>
                            )}

                            {lessonEditTab === "notes" && (
                              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ padding: 10, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, fontSize: 12, color: "rgba(253,211,77,0.7)" }}>
                                  📝 Catatan ini akan tampil sebagai highlight kuning di halaman lesson.
                                </div>
                                <textarea defaultValue={l.notes || ""} placeholder={"• Poin penting lesson ini\n• Tips & trik\n• Hal yang perlu diingat"} style={{ padding: "12px 14px", background: S.bg, border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, color: "#FCD34D", fontSize: 13, fontFamily: "monospace", resize: "none", height: 120 }} />
                                <button style={{ padding: "10px", borderRadius: 10, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>💾 Simpan Catatan</button>
                              </div>
                            )}

                            {lessonEditTab === "suggestions" && (
                              <div style={{ padding: 16 }}>
                                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                                  {["🛠️ Tool","📄 Artikel","⬇️ Download","🎬 Video","🌐 Website"].map(t => (
                                    <button key={t} style={{ padding: "4px 10px", borderRadius: 8, background: `${S.accent}15`, border: `1px solid ${S.accent}25`, color: S.accentL, fontSize: 11, cursor: "pointer" }}>{t}</button>
                                  ))}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 8, marginBottom: 8 }}>
                                  <input placeholder="🔗" value={newSugg.icon} onChange={e => setNewSugg(p => ({...p, icon: e.target.value}))} style={{ padding: "9px", background: S.bg, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#EEEEFF", fontSize: 16, textAlign: "center" }} />
                                  <input placeholder="Nama tool / resource" value={newSugg.title} onChange={e => setNewSugg(p => ({...p, title: e.target.value}))} style={{ padding: "9px 14px", background: S.bg, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#EEEEFF", fontSize: 13 }} />
                                </div>
                                <input placeholder="https://..." value={newSugg.url} onChange={e => setNewSugg(p => ({...p, url: e.target.value}))} style={{ width: "100%", padding: "9px 14px", background: S.bg, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#EEEEFF", fontSize: 13, marginBottom: 8 }} />
                                <button onClick={() => { if(newSugg.title && newSugg.url) { setSavedSuggs(p => [...p, newSugg]); setNewSugg({title:"",url:"",type:"tool",icon:""}); }}}
                                  style={{ width: "100%", padding: "9px", borderRadius: 10, background: "#10B981", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>+ Tambah Resource</button>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                  {savedSuggs.map((s, si) => (
                                    <div key={si} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: S.bg, borderRadius: 10 }}>
                                      <span style={{ fontSize: 18 }}>{s.icon || "🔗"}</span>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{s.title}</div>
                                        <div style={{ color: S.muted, fontSize: 11 }}>{s.url}</div>
                                      </div>
                                      <button onClick={() => setSavedSuggs(p => p.filter((_,i) => i !== si))} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer" }}>×</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    <button style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)", background: "none", color: S.muted, fontSize: 13, cursor: "pointer" }}>+ Tambah Lesson</button>
                  </div>
                )}
              </div>
            ))}
            <button style={{ width: "100%", padding: "14px", borderRadius: 14, border: `2px dashed ${S.accent}30`, background: "none", color: S.accentL, fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Tambah Modul Baru</button>
          </div>
        )}

        {/* ── ORDERS ── */}
        {adminTab === "orders" && (
          <div>
            <h1 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Orders</h1>
            <div style={{ background: S.card, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              {[["Next.js Bootcamp","Budi S.","Xendit","Rp 399,000","paid","2 menit lalu"],["Digital Marketing","Andi P.","Midtrans","Rp 299,000","paid","1 jam lalu"],["AI Prompt Eng.","Siti R.","Xendit","Rp 349,000","pending","3 jam lalu"],["Biz Analytics","Rio A.","DOKU","Rp 249,000","expired","1 hari lalu"]].map(([p,u,g,a,s,t]) => (
                <div key={p+u} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 12, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>{p}</span>
                  <span style={{ color: S.muted }}>{u}</span>
                  <span style={{ color: S.muted }}>{g}</span>
                  <span style={{ fontWeight: 700 }}>{a}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, background: s === "paid" ? "rgba(16,185,129,0.1)" : s === "pending" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", color: s === "paid" ? "#10B981" : s === "pending" ? "#F59E0B" : "#EF4444", fontSize: 11, fontWeight: 700, width: "fit-content" }}>{s}</span>
                  <span style={{ color: S.muted, fontSize: 11 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
