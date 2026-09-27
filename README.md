# PakHaven Real Estate Platform — Pakistan

A full-stack, production-ready **Real Estate Listing Platform** built specifically for the Pakistani property market.

Designed for high performance, accessibility, SEO optimization, and seamless Hostinger MariaDB/MySQL deployment.

---

## 🌟 Key Features

* **Pakistani Property Organization**: Built-in support for Marla, Kanal, Sq. Ft., PKR pricing (Crore / Lakh), DHA, Bahria Town, and CDA sectors.
* **Property Search & Multi-Filters**: Filter by Purpose (Buy/Rent), Property Type (House, Apartment, Plot, Commercial, Office, Shop, Farm House), City, Price Range, Bedrooms, Bathrooms, and Verified status.
* **Interactive Maps**: Google Maps integration with graceful neighborhood card fallback.
* **PDF Property Brochure Generator**: One-click printable brochure generator.
* **Direct Agent WhatsApp & Contact**: Dynamic WhatsApp link creation ("Hello, I am interested in [Title]. Property ID: [ID]").
* **Property Visit Scheduling**: Instant appointment booking system with admin management.
* **Pakistani Home Financing Calculator**: Loan installment calculator with KIBOR breakdown.
* **Hostinger Compatible Image Manager**: Zero Vercel Blob / AWS dependency; saves uploads to local static storage.
* **Role-Based Authentication**: Custom HttpOnly JWT cookie session management (`ADMIN`, `AGENT`, `USER`).
* **Admin Control Panel**: Comprehensive metrics, property CRUD, inquiry status manager, and visit booking calendar.
* **SEO Optimization**: Dynamic OpenGraph tags, sitemap.xml, robots.txt, semantic HTML, and fast loading.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **Database**: MariaDB / MySQL with Prisma ORM
* **Authentication**: `jose` JWT + `bcryptjs`
* **Icons**: `lucide-react`
* **Deployment target**: Hostinger Node.js Web Hosting / VPS

---

## 🚀 Quick Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment File**:
   Configure `.env`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/real_estate_db"
   AUTH_SECRET="dev-secret-key-real-estate-pakistan-2026-secure"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
   ```
3. **Database Migration & Seed**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. **Run Server**:
   ```bash
   npm run dev
   ```

---

## 🔐 Default Admin Account

* **Email**: `admin@pakhaven.pk`
* **Password**: `AdminPass123!`

---

## 📄 Documentation

* [LOCAL_SETUP.md](LOCAL_SETUP.md) — Detailed local environment guide.
* [deployment.md](deployment.md) — Hostinger production deployment & MariaDB backup instructions.
