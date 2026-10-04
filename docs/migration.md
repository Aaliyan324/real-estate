# Home Services Marketplace Migration & Deployment Guide

## Prerequisites & Requirements
- Node.js 18+
- MySQL / MariaDB 10.4+
- Next.js 14+ App Router

## Step 1: Database Migration
The database schema changes for the Home Services Marketplace module are non-destructive and preserve existing real estate listings, users, and leads.

To apply schema changes to your database without resetting existing data:

```bash
# Push schema updates to MySQL/MariaDB
npx prisma db push
```

> **IMPORTANT**: Do NOT run `npx prisma migrate reset` in production as this will destroy existing data.

## Step 2: Seed Pakistan Locations & Service Categories
To populate the database with Pakistan administrative hierarchy (Provinces, Districts, Cities, Areas) and default service categories (Plumbing, Electrical, Painting, HVAC, etc.):

```bash
# Execute seed script
npx tsx prisma/seed.ts
```

This will safely seed missing Pakistan location entries and initial service categories without affecting existing user accounts or real estate listings.

## Step 3: Deployment on Hostinger (or Node.js VPS)

1. **Environment Variables**:
   Ensure `.env` or Hostinger environment configuration includes:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/dbname"
   JWT_SECRET="your-secure-jwt-secret-key"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

2. **Build Verification**:
   ```bash
   npm run build
   ```

3. **Cron Job Configuration (Fee Enforcement & Overdue Auto-Blocking)**:
   Set up a daily cron job calling the fee enforcement endpoint with an admin API secret or admin credentials:
   ```bash
   0 0 * * * curl -X POST https://yourdomain.com/api/admin/fees/enforce
   ```
