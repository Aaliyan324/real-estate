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
* [DATABASE.md](DATABASE.md) — Dual-database (MySQL/MariaDB ↔ PostgreSQL/Neon) architecture.
* [DEPLOYMENT-VERCEL.md](DEPLOYMENT-VERCEL.md) — Deploy to Vercel + Neon.
* [DEPLOYMENT-HOSTINGER.md](DEPLOYMENT-HOSTINGER.md) — Deploy to Hostinger + MySQL/MariaDB.
* [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Common issues across both targets.

---

## ☁️ Vercel Deployment

* **Database:** Neon PostgreSQL
* **Hosting:** Vercel
* **Steps:**
  1. Create a Neon database (use the pooled `-pooler` URL for runtime).
  2. Set `DATABASE_URL` (postgresql://) plus `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, and `BLOB_READ_WRITE_TOKEN`.
  3. Generate the Prisma client from `prisma/schema.postgresql.prisma` (`npm run prisma:generate:postgres`).
  4. Apply the schema safely with `npm run db:push:postgres` (never reset a populated DB).
  5. Push the project to GitHub.
  6. Import the repository into Vercel.
  7. Add the environment variables above.
  8. Build command `npm run vercel-build`, then deploy.
  9. Test production (search, property details, uploads, admin).

Full guide: [DEPLOYMENT-VERCEL.md](DEPLOYMENT-VERCEL.md).

---

## 🖥️ Hostinger Deployment

* **Database:** MySQL / MariaDB (project default)
* **Hosting:** Hostinger
* **Steps:**
  1. Create a MySQL database in hPanel.
  2. Create a database user and grant privileges.
  3. Configure `DATABASE_URL` (mysql://) using the hPanel host — do not assume `localhost` in production.
  4. Generate the Prisma client (`npm run prisma:generate`).
  5. Apply the schema with `npm run db:push` (additive, preserves data).
  6. Build Next.js (`npm run build`) and deploy on a Node/VPS plan.
  7. Configure the domain and SSL.
  8. Set `NEXT_PUBLIC_SITE_URL` to the public origin.
  9. Test production.

Full guide: [DEPLOYMENT-HOSTINGER.md](DEPLOYMENT-HOSTINGER.md).
