-- =============================================
-- LearnFlow Database Schema
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO categories (name, slug) VALUES
  ('Marketing', 'marketing'), ('Programming', 'programming'),
  ('Business', 'business'), ('Technology', 'technology'), ('Design', 'design')
ON CONFLICT DO NOTHING;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  price        INTEGER NOT NULL DEFAULT 0,
  is_free      BOOLEAN NOT NULL DEFAULT false,
  thumbnail    TEXT,
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);

-- Landing Pages
CREATE TABLE IF NOT EXISTS landing_pages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL UNIQUE,
  headline      TEXT NOT NULL,
  subheadline   TEXT,
  cta_text      TEXT DEFAULT 'Daftar Sekarang',
  benefits      JSONB DEFAULT '[]',
  testimonials  JSONB DEFAULT '[]',
  theme_color   TEXT DEFAULT '#7C6BFF',
  preview_video TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lp_product ON landing_pages(product_id);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_product ON courses(product_id);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  "order"    INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id   UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  video_url   TEXT,
  duration    INTEGER DEFAULT 0,
  "order"     INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

-- Suggestions
CREATE TABLE IF NOT EXISTS suggestions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id  UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'tool',
  icon       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_suggestions_lesson ON suggestions(lesson_id);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','failed','expired')),
  payment_ref TEXT,
  gateway     TEXT,
  paid_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_ref    ON orders(payment_ref);

-- User Courses
CREATE TABLE IF NOT EXISTS user_courses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_uc_user ON user_courses(user_id);

-- Progress
CREATE TABLE IF NOT EXISTS progress (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started','completed')),
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);

-- Trigger to update updated_at on progress
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_progress_updated_at
    BEFORE UPDATE ON progress
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "cat_pub_read"      ON categories    FOR SELECT USING (true);
CREATE POLICY "prod_pub_read"     ON products      FOR SELECT USING (is_published = true);
CREATE POLICY "lp_pub_read"       ON landing_pages FOR SELECT USING (
  EXISTS (SELECT 1 FROM products WHERE id = landing_pages.product_id AND is_published = true)
);
CREATE POLICY "courses_pub_read"  ON courses       FOR SELECT USING (
  EXISTS (SELECT 1 FROM products WHERE id = courses.product_id AND is_published = true)
);
CREATE POLICY "modules_pub_read"  ON modules       FOR SELECT USING (true);
CREATE POLICY "lessons_pub_read"  ON lessons       FOR SELECT USING (true);
CREATE POLICY "suggest_pub_read"  ON suggestions   FOR SELECT USING (true);

-- Admin all-access
CREATE POLICY "prod_admin"    ON products      FOR ALL USING (auth.jwt()->>'role' = 'admin' OR (auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "lp_admin"      ON landing_pages FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "courses_admin" ON courses       FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "modules_admin" ON modules       FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "lessons_admin" ON lessons       FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "suggest_admin" ON suggestions   FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');
CREATE POLICY "cat_admin"     ON categories    FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- User-owned data
CREATE POLICY "orders_own_read"   ON orders       FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_own_ins"    ON orders       FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "uc_own_read"       ON user_courses  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "progress_own"      ON progress      FOR ALL USING (user_id = auth.uid());

-- =============================================
-- STORAGE BUCKET
-- =============================================
-- Jalankan ini di SQL Editor:

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "thumb_pub_read" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "thumb_admin_ins" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'thumbnails' AND
  (auth.jwt()->'user_metadata'->>'role') = 'admin'
);
CREATE POLICY "thumb_admin_del" ON storage.objects FOR DELETE USING (
  bucket_id = 'thumbnails' AND
  (auth.jwt()->'user_metadata'->>'role') = 'admin'
);

-- =============================================
-- SET ADMIN USER
-- Ganti email dengan email admin kamu
-- =============================================
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
-- WHERE email = 'admin@yourdomain.com';

-- =============================================
-- TAMBAHAN: notes column for lessons
-- Jalankan jika sudah ada database sebelumnya
-- =============================================
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS notes TEXT;

-- =============================================
-- TAMBAHAN: hero_image column di landing_pages
-- Jalankan ini jika database sudah ada
-- =============================================
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS notes TEXT;

-- =============================================
-- REVIEWS TABLE
-- User yang sudah enroll bisa rating & review
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,  -- Admin bisa sembunyikan
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Satu user hanya bisa review satu kali per produk
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product  ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_visible  ON reviews(product_id, is_visible);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Siapapun bisa lihat review yang visible
CREATE POLICY "reviews_pub_read" ON reviews
  FOR SELECT USING (is_visible = true);

-- User yang login bisa lihat review sendiri (termasuk yang disembunyikan)
CREATE POLICY "reviews_own_read" ON reviews
  FOR SELECT USING (user_id = auth.uid());

-- User bisa insert review miliknya
CREATE POLICY "reviews_own_insert" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- User bisa update review miliknya
CREATE POLICY "reviews_own_update" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

-- Admin bisa semua (update is_visible, delete spam, dll)
CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- =============================================
-- SITE SETTINGS — CMS for homepage & store
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT NOT NULL UNIQUE,   -- e.g. 'homepage', 'store'
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Seed defaults
INSERT INTO site_settings (key, value) VALUES
('homepage', '{
  "hero_headline": "Belajar Skill Baru, Raih Peluang Baru",
  "hero_subheadline": "Ratusan kursus dari instruktur terpercaya. Gratis maupun premium. Bersertifikat resmi.",
  "hero_badge": "Platform Edukasi Digital #1 Indonesia",
  "hero_cta_primary": "Mulai Belajar Gratis",
  "hero_cta_secondary": "Lihat Demo",
  "stats": [
    {"value": "10,000+", "label": "Pelajar Aktif"},
    {"value": "200+",    "label": "Kursus Tersedia"},
    {"value": "98%",     "label": "Tingkat Kepuasan"},
    {"value": "50+",     "label": "Instruktur Ahli"}
  ],
  "featured_section_title": "Kursus Terpopuler",
  "featured_section_badge": "Marketplace",
  "featured_product_ids": [],
  "how_it_works": [
    {"num": "01", "title": "Pilih Kursus", "desc": "Browse ratusan kursus dari instruktur terpercaya. Gratis maupun premium.", "icon": "📚"},
    {"num": "02", "title": "Daftar & Akses", "desc": "Buat akun gratis dalam 30 detik. Langsung akses semua materi.", "icon": "⚡"},
    {"num": "03", "title": "Belajar & Sertifikasi", "desc": "Tonton video, selesaikan modul, dan raih sertifikat resmi.", "icon": "🏆"}
  ],
  "about_headline": "Kami hadir untuk mendemokratisasi pendidikan digital",
  "about_body": "LearnFlow lahir dari keyakinan bahwa setiap orang berhak mendapatkan pendidikan berkualitas — tanpa batasan geografis, waktu, maupun biaya. Kami bekerja sama dengan instruktur terbaik Indonesia untuk menghadirkan konten yang relevan, praktis, dan langsung bisa diterapkan dalam karir dan bisnis kamu.",
  "founder_name": "Rini Wulandari",
  "founder_role": "Founder & CEO, LearnFlow",
  "founder_quote": "Kami percaya bahwa skill yang tepat bisa mengubah nasib seseorang. Itu mengapa kami membuat LearnFlow.",
  "testimonials": [
    {"name": "Andi Pratama", "role": "Digital Marketer", "text": "Skill TikTok saya naik drastis setelah ikut kursus di sini. Omzet bisnis naik 3x!", "rating": 5, "avatar": "A"},
    {"name": "Siti Rahayu",  "role": "Freelance Designer", "text": "Kursus desainnya sangat praktis dan langsung bisa diterapkan. Worth banget!", "rating": 5, "avatar": "S"},
    {"name": "Budi Santoso", "role": "Software Engineer", "text": "Materinya up-to-date dan instrukturnya sangat responsif. Highly recommended!", "rating": 5, "avatar": "B"}
  ],
  "cta_headline": "Siap untuk level up skill kamu?",
  "cta_body": "Bergabung sekarang dan akses ratusan kursus gratis. Tidak butuh kartu kredit.",
  "cta_primary": "Daftar Gratis",
  "cta_secondary": "Lihat Semua Kursus"
}'),
('store', '{
  "badge": "Marketplace Kursus",
  "headline": "Tingkatkan Skill Kamu",
  "headline_accent": "Mulai Sekarang",
  "subheadline": "Temukan ratusan kursus digital dari instruktur terpercaya. Belajar kapan saja, di mana saja.",
  "show_stats": true
}')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_pub_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_write" ON site_settings FOR ALL
  USING ((auth.jwt()->'user_metadata'->>'role') = 'admin');

-- Seed payment settings
INSERT INTO site_settings (key, value) VALUES
('payment', '{
  "active_gateways": ["xendit", "midtrans"],
  "default_gateway": "xendit",
  "xendit": {
    "enabled": true,
    "label": "Xendit",
    "methods": ["VA BCA", "VA Mandiri", "VA BNI", "QRIS", "GoPay", "OVO", "Dana"],
    "logo": "💳",
    "is_popular": true
  },
  "midtrans": {
    "enabled": true,
    "label": "Midtrans",
    "methods": ["Kartu Kredit/Debit", "VA BCA", "VA Mandiri", "GoPay"],
    "logo": "🏦",
    "is_popular": false
  },
  "doku": {
    "enabled": false,
    "label": "DOKU",
    "methods": ["DOKU Wallet", "Alfamart", "Indomaret"],
    "logo": "🔐",
    "is_popular": false
  }
}')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- UPDATE: Course mode (with/without chapters)
-- =============================================
ALTER TABLE courses ADD COLUMN IF NOT EXISTS use_chapters BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE modules  ADD COLUMN IF NOT EXISTS description TEXT;

-- =============================================
-- SEO & TRACKING ADDITIONS
-- =============================================

-- SEO columns on landing_pages
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS seo_title        TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS seo_description  TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS seo_keywords     TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS og_title         TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS og_description   TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS og_image         TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS robots           TEXT DEFAULT 'index,follow';
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS canonical_url    TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS schema_markup    TEXT; -- JSON-LD

-- Global tracking (pixels, GTM, analytics) stored in site_settings
INSERT INTO site_settings (key, value) VALUES
('tracking', '{
  "gtm_id": "",
  "ga4_id": "",
  "facebook_pixel_id": "",
  "facebook_pixel_enabled": false,
  "tiktok_pixel_id": "",
  "tiktok_pixel_enabled": false,
  "snapchat_pixel_id": "",
  "snapchat_pixel_enabled": false,
  "head_scripts": "",
  "body_scripts": ""
}'),
('seo_global', '{
  "site_name": "LearnFlow",
  "site_title": "LearnFlow — Platform Kursus Online #1 Indonesia",
  "site_description": "Platform kursus digital terbaik. Belajar skill baru dari instruktur terpercaya. Gratis & berbayar.",
  "site_keywords": "kursus online, belajar online, kursus digital, e-learning indonesia",
  "og_image": "",
  "twitter_handle": "",
  "robots": "index,follow",
  "google_site_verification": "",
  "bing_site_verification": ""
}')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- PER-LANDING PAGE PIXEL OVERRIDE
-- Setiap landing page bisa punya pixel sendiri
-- yang berbeda dari pixel global
-- =============================================
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_override_enabled    BOOLEAN DEFAULT false;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS fb_pixel_id               TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS fb_pixel_enabled          BOOLEAN DEFAULT false;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS tiktok_pixel_id           TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS tiktok_pixel_enabled      BOOLEAN DEFAULT false;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS ga4_id                    TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS ga4_enabled               BOOLEAN DEFAULT false;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS gtm_id                    TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS gtm_enabled               BOOLEAN DEFAULT false;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS custom_head_script        TEXT;

-- =============================================
-- PER LANDING PAGE PIXEL OVERRIDES
-- =============================================
-- Allows each course landing page to have its own
-- pixel IDs that fire IN ADDITION to global pixels.
-- Useful for per-product ad campaign tracking.
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_fb_id       TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_tiktok_id   TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_ga4_id      TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_gtm_id      TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS pixel_custom_head TEXT;
