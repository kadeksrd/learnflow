# 🚀 LearnFlow — Advanced Online Course & LMS Platform

**LearnFlow** is a modern, full-stack education platform built for high scalability. It features **SEO Pixel Optimization**, a **Multi-Landing Page** system, and intuitive class management.



---

## ✨ Key Features

* **🎯 SEO & Pixel Ready:** Integrated with Meta Pixel and Google Analytics. Features automatic SEO optimization (Dynamic Sitemap & JSON-LD) for every individual course.
* **📑 Custom Landing Page Builder:** Every course has its own exclusive landing page, editable directly via the Admin Panel without touching the code.
* **🏪 Storefront Management:** Real-time store customization to boost conversion rates and branding.
* **📚 Dynamic Course Architecture:** Layered content structure (Modules > Lessons > Video/Quiz) with fast video streaming support.
* **💳 Automated Payment:** Xendit integration for automated payments (E-wallets, Virtual Accounts, Retail Stores) with a robust webhook system.
* **🔐 Secure Auth:** Reliable user authentication via Supabase Auth (Email & Social Login).

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI.
* **Backend:** Supabase (PostgreSQL, Auth, Storage).
* **Payment Gateway:** Xendit.
* **Deployment:** Vercel.

---

## 🚦 Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/username/learnflow.git
cd learnflow
npm install
cp .env.local.example .env.local
```

### 2. Database Configuration (Supabase)
1. Create a new project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** and paste the contents of `supabase/schema.sql` to build tables and Storage Buckets.
3. Retrieve your `URL` and `Anon Key` from **Settings > API**.

### 3. Environment Variables (`.env.local`)
Fill in the following variables to connect core features:
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

### 4. Run Locally
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

---

## 🔑 Admin & SEO Setup

### Set Administrator Role
After registering an account in the app, run this query in the Supabase SQL Editor:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}' 
WHERE email = 'your-email@example.com';
```

### Enable Per-Course SEO
1. Go to **Admin Panel > Landing Pages**.
2. Click **Edit** on your desired course.
3. Enter the **Meta Title, Description, and Slug**.
4. The system will automatically render the necessary SEO tags for Google indexing.

---

## 📂 Core Project Structure

```text
src/
├── app/
│   ├── admin/             # Management Panel (Products, Classes, SEO)
│   ├── (main)/store       # Course Catalog / Storefront
│   ├── (main)/course/[slug] # Dynamic Landing Pages per Course
│   └── (protected)/lesson # Learning Room (Video Player)
├── components/            # UI Kit & SEO Meta Components
├── lib/                   # Xendit & Supabase Helper Integrations
└── supabase/              # Database Schema & Migrations
```

---

## 🛡️ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **SEO tags not appearing** | Ensure the metadata in `layout.tsx` is correctly mapped to the product data. |
| **Video fails to play** | Check the YouTube/Vimeo URL. Ensure there are no special characters in the link. |
| **Xendit Webhook Fail** | Verify the Callback Token in Xendit Dashboard matches `XENDIT_WEBHOOK_TOKEN`. |
| **Image Upload Error** | Ensure the `thumbnails` bucket in Supabase Storage is set to **Public**. |

---

## 🤝 Contributing
Want to add new Pixel features or SEO optimizations? Please open a **Pull Request**!
