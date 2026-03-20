# 🚀 LearnFlow — Enterprise LMS & Marketing-Driven Platform

**LearnFlow** is a high-performance, full-stack Learning Management System (LMS) built with **Next.js 14**, **Supabase**, and a **Multi-Gateway Payment** architecture. This platform is specifically designed for course creators who prioritize conversion, featuring a built-in **Landing Page Builder**, **Custom Storefront Editor**, and a full **Marketing Tech Stack**.

---

## ✨ Core Features

* **💳 Multi-Payment Gateway:** Support for **Xendit**, **Midtrans**, and **DOKU**. Easily switch providers or scale based on your business requirements.
* **📑 Dynamic Landing Page Builder:** Create and customize unique landing pages for *every single class* directly from the Admin Panel.
* **🎨 Storefront Customizer:** Edit your homepage, manage banners, and curate featured courses in real-time without touching the code.
* **📈 Advanced Marketing Suite:**
    * **Native Tracking:** Easy integration for **Google Tag Manager (GTM)**.
    * **Conversion Pixels:** One-click setup for **Facebook (Meta) Pixel** and **TikTok Pixel**.
    * **SEO Engine:** Full control over Meta Titles, Descriptions, JSON-LD, and Slugs for every page.
* **📚 Robust Learning Experience:** Managed Modules & Lessons (Video/PDF), student dashboards, and progress tracking.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI.
* **Backend:** Supabase (Postgres, Auth, Edge Functions, Storage).
* **Payments:** Xendit / Midtrans / DOKU.
* **Tracking:** GTM, Meta Pixel, TikTok Pixel.
* **Deployment:** Vercel.

---

## 🚦 Quick Start Guide

### STEP 1 — Clone & Install
```bash
git clone https://github.com/yourusername/learnflow.git
cd learnflow
npm install
cp .env.local.example .env.local
```

### STEP 2 — Database Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL script found in `supabase/schema.sql` inside the **SQL Editor**.
3. Ensure public buckets named `thumbnails` and `course-assets` are created.

### STEP 3 — Environment Variables
Choose your preferred payment gateway and fill the credentials in `.env.local`:
```env
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Marketing & Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXX

# Payment Providers (Configure as needed)
PAYMENT_PROVIDER=xendit # Choose: xendit, midtrans, or doku
XENDIT_SECRET_KEY=...
MIDTRANS_SERVER_KEY=...
DOKU_SECRET_KEY=...
```

### STEP 4 — Run Local Server
```bash
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---

## 🔑 Admin Privileges

To access the Admin Panel (`/admin`), update your user role in the Supabase SQL Editor:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' 
WHERE email = 'your-email@example.com';
```

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── admin/             # SEO, Pixel, & Page Management
│   ├── (main)/store       # Dynamic Catalog & Storefront
│   ├── (main)/course/[slug] # Individual Landing Pages
│   └── api/webhook        # Unified Webhook Handlers (Xendit/Midtrans/DOKU)
├── components/marketing/  # Pixel & GTM Injection Logic
├── lib/payments/          # Provider-specific Logic (Xendit/Midtrans/DOKU)
└── supabase/              # Database Schema & Policies
```

---

## 🛡️ Troubleshooting

* **❌ Tracking Not Working:** Ensure the Pixel IDs are correctly set in the Admin Panel and check for Ad-blockers.
* **❌ Webhook Failures:** Verify that your production URL is correctly whitelisted in your Payment Provider's dashboard.
* **❌ Image Upload:** Ensure the Supabase Storage Bucket policy is set to **Public**.

---

## 🤝 Support
For any questions regarding the setup or to contribute new payment provider integrations, please open an **Issue** or contact the maintainer.
