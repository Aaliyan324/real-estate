# Local Development Setup Guide — PakHaven Real Estate

Follow these instructions to run the PakHaven Real Estate platform on your local machine with MariaDB or MySQL.

---

## Prerequisites

1. **Node.js**: v18+ or v20+ installed.
2. **MariaDB or MySQL**: Local service running on port `3306`.
3. **Git**: Version control installed.

---

## Step 1 — Clone Repository & Install Dependencies

```bash
cd real-estate
npm install
```

---

## Step 2 — Configure Environment Variables

Create `.env` file in the project root:

```env
DATABASE_URL="mysql://root:password@localhost:3306/real_estate_db"
AUTH_SECRET="dev-secret-key-real-estate-pakistan-2026-secure"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

---

## Step 3 — Initialize Local MariaDB / MySQL Database

Create local database in MariaDB/MySQL CLI or phpMyAdmin:

```sql
CREATE DATABASE real_estate_db;
```

---

## Step 4 — Run Prisma Migrations & Client Generation

```bash
npx prisma generate
npx prisma db push
```

---

## Step 5 — Seed Initial Pakistani Real Estate Sample Data

```bash
npx prisma db seed
```

This seeds:
- Admin Account: `admin@pakhaven.pk` / `AdminPass123!`
- Agent Accounts: `aaliyan@pakhaven.pk` & `zainab.khan@pakhaven.pk`
- Sample residential & commercial properties in Lahore, Islamabad, Karachi.

---

## Step 6 — Start Next.js Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 7 — Test Admin Dashboard

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login).
2. Login with Admin credentials:
   - **Email**: `admin@pakhaven.pk`
   - **Password**: `AdminPass123!`
3. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Step 8 — Test Production Build

```bash
npm run build
npm start
```
