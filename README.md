Tentu, ini adalah versi README yang sudah diperbarui dan dioptimalkan untuk menonjolkan fitur unggulan **LearnFlow** seperti SEO Pixel, Custom Landing Pages, dan Manajemen Kelas yang dinamis. 

Format ini dirancang agar terlihat profesional di profil GitHub kamu.

---

# 🚀 LearnFlow — Advanced Online Course & LMS Platform

**LearnFlow** adalah platform edukasi full-stack modern yang dirancang untuk skalabilitas tinggi. Dilengkapi dengan fitur **SEO Pixel Optimized**, sistem **Multi-Landing Page**, dan manajemen kelas yang intuitif.



## ✨ Fitur Unggulan

* **🎯 SEO & Pixel Ready:** Terintegrasi dengan Meta Pixel, Google Analytics, dan optimasi SEO otomatis (Dynamic Sitemap & JSON-LD) untuk setiap kelas.
* **📑 Custom Landing Page Builder:** Setiap kelas memiliki landing page eksklusif yang bisa diedit langsung melalui Admin Panel tanpa menyentuh kode.
* **🏪 Storefront Management:** Edit tampilan toko/store secara real-time untuk meningkatkan konversi penjualan.
* **📚 Dynamic Course Architecture:** Struktur materi berlapis (Modul > Lesson > Video/Quiz) dengan dukungan streaming video yang cepat.
* **💳 Automated Payment:** Integrasi Xendit untuk pembayaran otomatis (E-wallet, VA, Retail Store) dengan sistem webhook.
* **🔐 Secure Auth:** Sistem login menggunakan Supabase Auth (Email & Social Login).

---

## 🛠️ Stack Teknologi

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI.
* **Backend:** Supabase (PostgreSQL, Auth, Storage).
* **Payment Gateway:** Xendit.
* **Deployment:** Vercel.

---

## 🚦 Panduan Instalasi Cepat

### 1. Kloning & Install
```bash
git clone https://github.com/username/learnflow.git
cd learnflow
npm install
cp .env.local.example .env.local
```

### 2. Konfigurasi Database (Supabase)
1. Buat proyek baru di [Supabase](https://supabase.com).
2. Buka **SQL Editor**, lalu tempelkan isi dari file `supabase/schema.sql` untuk membangun tabel dan *Storage Bucket*.
3. Ambil `URL` dan `Anon Key` dari menu **Settings > API**.

### 3. Konfigurasi Environment (`.env.local`)
Isi variabel berikut untuk menghubungkan fitur utama:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role

# Payment Configuration
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=your_secret_token

# SEO & App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PIXEL_ID=your-meta-pixel-id
```

### 4. Jalankan Lokal
```bash
npm run dev
```
Akses di `http://localhost:3000`.

---

## 🔑 Setup Admin & SEO

### Menjadi Administrator
Setelah mendaftar akun di aplikasi, jalankan query ini di Supabase SQL Editor:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' 
WHERE email = 'emailanda@example.com';
```

### Mengaktifkan SEO per Kelas
1. Masuk ke **Admin Panel > Landing Pages**.
2. Klik **Edit** pada kelas yang diinginkan.
3. Masukkan **Meta Title, Description, dan Slug**.
4. Sistem akan otomatis merender tag SEO yang diperlukan agar kelas mudah terindeks Google.

---

## 📂 Struktur Folder Utama

```text
src/
├── app/
│   ├── admin/             # Panel Manajemen (Produk, Kelas, SEO)
│   ├── (main)/store       # Katalog Produk/Kursus
│   ├── (main)/course/[slug] # Landing Page Dinamis per Kelas
│   └── (protected)/lesson # Ruang Belajar (Video Player)
├── components/            # UI Kit & SEO Meta Components
├── lib/                   # Integrasi Xendit & Supabase Helper
└── supabase/              # Database Schema & Migrations
```

---

## 🛡️ Troubleshooting

| Masalah | Solusi |
| :--- | :--- |
| **SEO tidak muncul** | Pastikan metadata di `layout.tsx` sudah terhubung dengan data produk. |
| **Video tidak play** | Cek URL YouTube/Vimeo. Pastikan tidak ada karakter aneh di link. |
| **Xendit Gagal** | Pastikan Callback Token di Dashboard Xendit sama dengan `XENDIT_WEBHOOK_TOKEN`. |
| **Image Upload Error** | Pastikan Bucket `thumbnails` di Supabase Storage sudah diatur ke **Public**. |

---

## 🤝 Kontribusi
Ingin menambahkan fitur Pixel baru atau optimasi SEO? Silakan buat **Pull Request**!

---

**Apakah Anda ingin saya menambahkan bagian teknis spesifik mengenai cara kerja SEO Pixel di dalam kode tersebut?**
