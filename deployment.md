# Hostinger Production Deployment Guide — PakHaven Real Estate

This guide provides step-by-step instructions for deploying the **PakHaven Real Estate Platform** on **Hostinger** (Node.js Web Hosting or VPS) with **MariaDB / MySQL**.

---

## Step 1 — Prepare Project & Environment

Ensure all dependencies are up to date and test the local production build before uploading:

```bash
npm run build
```

Verify there are no TypeScript or ESLint compilation errors.

---

## Step 2 — Create MariaDB / MySQL Database in Hostinger

1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** > **MySQL Databases**.
3. Create a new database:
   - **Database Name**: `u123456789_realestate`
   - **MySQL Username**: `u123456789_estateuser`
   - **Password**: Create a strong password.
4. Note your database connection details:
   - Host: `localhost` (or Hostinger internal DB hostname e.g. `sql123.hostinger.com`)
   - Port: `3306`
   - Database Name: `u123456789_realestate`
   - Username: `u123456789_estateuser`

---

## Step 3 — Configure `DATABASE_URL`

Formulate your production `DATABASE_URL` string:

```env
DATABASE_URL="mysql://u123456789_estateuser:YOUR_SECURE_PASSWORD@localhost:3306/u123456789_realestate"
```

---

## Step 4 — Upload Project to Hostinger

Depending on your Hostinger plan:

### Option A: Git Deployment (Recommended)
1. In hPanel, go to **Advanced** > **Git**.
2. Link your Git repository and deploy to your root or app directory (e.g. `/public_html` or `/domains/yourdomain.com/app`).

### Option B: SSH / File Manager
1. Zip your project repository (excluding `node_modules`, `.next`, and `.env`).
2. Upload via Hostinger File Manager or SFTP.
3. Extract in your Node.js application directory.

---

## Step 5 — Install Dependencies on Server

Connect via SSH or use Hostinger Node.js Terminal:

```bash
cd /path/to/your/app
npm install --production=false
```

---

## Step 6 — Run Prisma Database Migrations

Generate the Prisma Client and deploy migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

> [!CAUTION]
> **NEVER run `npx prisma migrate reset` or `npx prisma db push --force-reset` on production.** This will erase existing production data.

---

## Step 7 — Set Production Environment Variables

In Hostinger hPanel Node.js app configuration or `.env`:

```env
DATABASE_URL="mysql://u123456789_estateuser:YOUR_PASSWORD@localhost:3306/u123456789_realestate"
AUTH_SECRET="a-very-long-random-secret-key-at-least-32-characters"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_PRODUCTION_GOOGLE_MAPS_KEY"
NODE_ENV="production"
```

---

## Step 8 — Build Production Application

```bash
npm run build
```

---

## Step 9 — Start Node.js Application

In Hostinger hPanel **Node.js Web Applications**:

- **Node.js Version**: `20.x` or `22.x`
- **Application Root**: `app` or relative path
- **Startup File**: `node_modules/next/dist/bin/next` or npm script `start`
- **Application Mode**: `Production`

Click **Restart Application**.

---

## Step 10 — Connect Domain & SSL

1. In hPanel, assign your domain (e.g., `pakhaven.pk` or `property.example.com`).
2. Navigate to **Security** > **SSL**.
3. Install free **Let's Encrypt SSL Certificate**.
4. Enable **Force HTTPS**.

---

## Step 11 — MariaDB Database Backup & Restore Procedure

### Creating Manual & Scheduled Backups
1. In Hostinger hPanel, go to **Databases** > **phpMyAdmin**.
2. Select database `u123456789_realestate`.
3. Click **Export** > **Quick** > **Format: SQL** > **Go**.
4. Store the `.sql` backup safely before running schema updates.

### Restoring Database Backup
1. Open **phpMyAdmin**.
2. Select target database.
3. Click **Import** > Choose `.sql` file > **Go**.

---

## Step 12 — Production Acceptance Verification Checklist

- [x] Homepage loads without console errors
- [x] MariaDB database connection verified
- [x] Property search and multi-filtering functional
- [x] Image uploads working and stored in `/public/uploads/properties/`
- [x] Property details page rendering dynamic metadata
- [x] Printable PDF brochure generation works
- [x] WhatsApp direct agent link working
- [x] Visit booking modal submitting to MariaDB
- [x] Admin Dashboard (`/admin`) accessible for role `ADMIN`
- [x] Responsive layout verified on Mobile, Tablet & Desktop viewports
