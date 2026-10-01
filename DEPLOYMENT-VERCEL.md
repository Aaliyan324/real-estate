# Deploying to Vercel (with Neon PostgreSQL)

Target architecture:

```
Next.js → Prisma → PostgreSQL / Neon → Vercel
```

For the database/provider rules behind this, read [DATABASE.md](DATABASE.md)
first.

---

## Step 0 — Prerequisites

- A GitHub repository containing this project (`.env` must **not** be committed;
  `.gitignore` already excludes it).
- A [Vercel](https://vercel.com) account.
- A [Neon](https://neon.tech) account (serverless PostgreSQL).

---

## Step 1 — Push the project to GitHub

```bash
git add .
git commit -m "Prepare project for Vercel + Neon deployment"
git push
```

Verify `.env` is **not** tracked:

```bash
git status --ignored   # .env should appear under ignored
```

---

## Step 2 — Create a Neon PostgreSQL database

1. Create a Neon **project** and note the default database.
2. Copy the **Pooled connection string** (host contains `-pooler`). Use it for
   runtime traffic.
3. Optionally copy the **Direct connection string** for Prisma CLI DDL
   (`db push` / migrations).

Neon is PostgreSQL, so the Prisma datasource **must** be `provider = "postgresql"`
— which is what `prisma/schema.postgresql.prisma` already uses.

---

## Step 3 — Test Neon locally (against the Postgres schema)

```env
# .env  (local only — never committed)
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.….neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.….neon.tech/neondb?sslmode=require"   # optional
AUTH_SECRET="<a strong secret>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="<vercel blob token, or leave unset>"
```

Generate the Postgres client and push the schema **safely**:

```bash
npm run prisma:generate:postgres
npm run db:push:postgres
```

> Do **not** run `db push` or seed against a populated production database.
> To move existing data from MySQL → Postgres, copy the data (application-level
> export/import or a dump/restore) rather than resetting either database.

If your `DIRECT_URL` is set and you added a `directUrl = env("DIRECT_URL")` line
to the Postgres schema (optional advanced setup), run DDL with the direct
connection and use the pooled URL for app traffic.

---

## Step 4 — Test the production build locally

```bash
npm run build
```

Fix all TypeScript, Prisma, Next.js, and missing-environment-variable errors
**before** deploying. The repository layer keeps search working on Postgres via
`mode: 'insensitive'` automatically.

---

## Step 5 — Create the Vercel project

1. Vercel → **Add New → Project** → import your GitHub repo.
2. Framework preset: **Next.js**.
3. Build command: `npm run vercel-build` (already added to `package.json`; it
   runs `prisma generate --schema=prisma/schema.postgresql.prisma && next build`).
4. Install command: default (`npm install` — its `postinstall` also runs
   `prisma generate`, which `vercel-build` then overrides with the Postgres
   client).

---

## Step 6 — Add Vercel environment variables

Configure these in **Production**, **Preview**, and **Development**:

| Variable | Notes |
| -------- | ----- |
| `DATABASE_URL` | Neon **pooled** `postgresql://…` URL. |
| `AUTH_SECRET` | Strong secret; same value across envs you want to share sessions on. |
| `NEXT_PUBLIC_SITE_URL` | Your public site URL. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | If using maps. |
| `BLOB_READ_WRITE_TOKEN` | **Required on Vercel** for image uploads (see Step 9). |

> ⚠️ Never expose database credentials or the Blob token as `NEXT_PUBLIC_*`.
> Only `NEXT_PUBLIC_SITE_URL` and the Maps key are client-safe.

### Preview vs Production databases

Vercel/Prisma warn that using the **same** `DATABASE_URL` for Preview and
Production lets preview builds mutate production data. For real isolation,
create a **separate Neon branch/database** for Preview and set its URL on the
Preview environment. This project uses `db push` (no build-time migrations), so
Preview builds do **not** run DDL — but runtime writes from preview pages would
still hit the shared database, which is why a separate Preview DB is recommended.

---

## Step 7 — Deploy & verify

After deploy, test:

```
/
/properties
/properties/[slug]
/agents
/agents/[slug]
/favorites
/contact
/admin
/api/properties        (search + filters)
/api/locations         (autocomplete)
/api/auth/login        /api/auth/register
```

Confirm:

- Search is **case-insensitive** (e.g. `lahore` finds `Lahore`).
- Property galleries render and never crash with zero images.
- Login/register and the admin panel work.

---

## Step 8 — Serverless connection pooling

Vercel runs many short-lived function instances. This project already:

- Reuses a **single** `PrismaClient` per warm instance (`lib/db/client.ts`).
- Recommends the Neon **pooled** (`-pooler`) host for `DATABASE_URL` so
  connections are multiplexed and the connection limit isn't exhausted.

---

## Step 9 — Image uploads (ephemeral filesystem)

Vercel's filesystem is **ephemeral** — do not save uploads to disk. The upload
route (`app/api/upload/route.ts`) uses `lib/storage`, which automatically
selects the **Vercel Blob** driver when `BLOB_READ_WRITE_TOKEN` is set (and the
local driver otherwise). To enable:

1. Vercel → Storage → **Create Blob store**, or run `vercel blob create`.
2. Copy the read/write token into `BLOB_READ_WRITE_TOKEN` (server env).

No code changes are required — the storage abstraction switches automatically.
