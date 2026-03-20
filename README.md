# 🚀 LearnFlow — Panduan Instalasi Lengkap

Platform kursus online full-stack: Next.js 14 + Supabase + Payment Gateway

---

## Prasyarat

Pastikan sudah install:
- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- **Git** → [git-scm.com](https://git-scm.com)
- Akun **Supabase** (gratis) → [supabase.com](https://supabase.com)
- Akun **Xendit** (sandbox) → [xendit.co](https://xendit.co)
- Akun **Vercel** → [vercel.com](https://vercel.com)

---

## STEP 1 — Install Project

```bash
# 1. Extract folder learnflow, lalu masuk ke dalamnya
cd learnflow

# 2. Install semua dependencies
npm install

# 3. Salin file environment
cp .env.local.example .env.local
```

---

## STEP 2 — Setup Supabase

### 2a. Buat Project Baru
1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Isi: Name = `learnflow`, Region = **Singapore**
3. Tunggu ~2 menit

### 2b. Buat Semua Tabel
1. Buka **SQL Editor** di Supabase Dashboard
2. Copy-paste seluruh isi file `supabase/schema.sql`
3. Klik **Run** → pastikan tidak ada error merah

### 2c. Setup OAuth (Opsional tapi direkomendasikan)

**Google OAuth:**
1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URI: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Copy Client ID & Secret ke Supabase → Authentication → Providers → Google

**Supabase URL Config:**
- Buka Authentication → URL Configuration
- Site URL: `http://localhost:3000`
- Redirect URLs: tambahkan `http://localhost:3000/**`

### 2d. Copy API Keys
Buka **Settings → API**, copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 3 — Setup Xendit (Payment)

1. Daftar di [xendit.co](https://xendit.co) (gratis)
2. **Settings → API Keys** → copy Secret Key (mode Development)
3. **Settings → Webhooks** → kita isi nanti setelah deploy

---

## STEP 4 — Isi .env.local

Buka file `.env.local`, isi semua variable:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LearnFlow

XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=buatTokenRahasiaSendiri123
```

---

## STEP 5 — Jalankan Development Server

```bash
npm run dev
```

Buka browser: **http://localhost:3000**

Kamu akan melihat halaman store (masih kosong karena belum ada produk).

---

## STEP 6 — Set Admin User

1. Register akun di http://localhost:3000/register
2. Buka Supabase SQL Editor, jalankan:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'emailkamu@gmail.com';
```
3. Logout dan login ulang
4. Buka http://localhost:3000/admin ✅

---

## STEP 7 — Buat Produk Pertama

1. Buka `/admin/products` → **Tambah Produk**
2. Isi judul, upload thumbnail, set Free/Paid, klik **Published**
3. Buka `/admin/landing-pages` → klik **Edit** di produk tadi
4. Isi headline, subheadline, slug, tambah benefits & testimonials → **Simpan**
5. Buka `/admin/courses` → klik kursus → **Tambah Modul** → **Tambah Lesson**
6. Isi URL video YouTube di setiap lesson

Cek hasilnya di: http://localhost:3000/store 🎉

---

## STEP 8 — Deploy ke Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

Atau:
1. Push ke GitHub
2. Buka vercel.com → New Project → Import repo
3. **Tambahkan semua env vars** di Vercel → Settings → Environment Variables
4. Update `NEXT_PUBLIC_APP_URL` ke URL production: `https://yourapp.vercel.app`
5. Redeploy

---

## STEP 9 — Setup Webhook Production

Setelah deploy, daftarkan webhook URL di Xendit:

1. Buka Xendit Dashboard → Settings → Webhooks
2. Add Webhook URL: `https://yourapp.vercel.app/api/webhook/xendit`
3. Events: **INVOICE PAID**, **INVOICE EXPIRED**
4. Callback Token: isi dengan nilai `XENDIT_WEBHOOK_TOKEN` di .env

Update Supabase URL Config:
- Site URL: `https://yourapp.vercel.app`
- Redirect URLs: tambahkan `https://yourapp.vercel.app/**`

---

## Struktur File Penting

```
learnflow/
├── src/
│   ├── app/
│   │   ├── (auth)/login       → Halaman login
│   │   ├── (auth)/register    → Halaman register
│   │   ├── (main)/store       → Marketplace kursus
│   │   ├── (main)/course/[slug] → Landing page kursus
│   │   ├── (protected)/checkout → Checkout
│   │   ├── (protected)/dashboard → Dashboard user
│   │   ├── (protected)/lesson/[id] → Video player
│   │   ├── (protected)/certificate/[id] → Sertifikat
│   │   ├── admin/             → Admin panel
│   │   └── api/               → API routes
│   ├── components/            → Komponen UI
│   ├── lib/supabase/          → Supabase clients
│   ├── lib/payment/           → Xendit/Midtrans/DOKU
│   └── types/database.ts      → TypeScript types
└── supabase/schema.sql        → SQL untuk buat tabel
```

---

## Troubleshooting

**❌ Error: "supabase is not defined"**
→ Pastikan `.env.local` sudah diisi dan restart `npm run dev`

**❌ Error saat buat tabel di Supabase**
→ Jalankan SQL satu per satu, bukan sekaligus

**❌ Upload thumbnail gagal**
→ Pastikan bucket `thumbnails` sudah dibuat (ada di schema.sql)
→ Cek storage policies sudah aktif

**❌ Webhook tidak diterima**
→ Pastikan URL webhook benar di Xendit dashboard
→ Gunakan ngrok untuk testing lokal: `npx ngrok http 3000`

**❌ Login OAuth tidak bekerja**
→ Cek Redirect URLs di Supabase Authentication → URL Configuration
→ Pastikan domain sudah ditambahkan

**❌ Build error TypeScript**
→ Jalankan `npm run build` untuk lihat detail error
→ Pastikan semua import path benar (gunakan @/ bukan ../)

---

## Kontak & Support

Jika ada pertanyaan atau error, buka issue di repo atau hubungi developer.
