# Troubleshooting

Common issues for this dual-provider (MySQL/MariaDB ↔ PostgreSQL/Neon) setup.

---

## `P1012 … the URL must start with mysql://` (or `postgresql://`)

The Prisma schema provider and your `DATABASE_URL` scheme disagree. Prisma
validates the URL against the provider chosen at generate time.

- Using a `mysql://` URL → generate from `prisma/schema.prisma`:
  `npm run prisma:generate`
- Using a `postgresql://` URL → generate from `prisma/schema.postgresql.prisma`:
  `npm run prisma:generate:postgres`

This is the exact reason two schema files exist — pick the one matching your
`DATABASE_URL`. See [DATABASE.md](DATABASE.md).

---

## Build fails with a DB connection error while prerendering `/`

`app/page.tsx` and `app/sitemap.ts` query the database. The homepage query is
wrapped in `try/catch`, so an unreachable DB logs an error but does **not** fail
the build. If the build truly fails, it is a **type/compile** error — fix that;
connection warnings during static generation are non-fatal.

---

## `Can't reach database server` / connection timeout

- Confirm host/port and that the DB allows connections from the app host.
- Neon requires `?sslmode=require`. Use the **pooled** (`-pooler`) host on
  Vercel/serverless.
- Hostinger: use the hPanel-provided host; do not assume `localhost` in
  production.

---

## `Authentication failed for user`

- Re-check username/password/database name.
- **URL-encode** special characters in the password (`@`→`%40`, `:`→`%3A`,
  `/`→`%2F`, `#`→`%23`, `&`→`%26`).

---

## Search returns nothing (or is case-sensitive) on Postgres

Postgres `contains` is case-**sensitive**. This project handles it centrally in
`lib/db/provider.ts` (`containsInsensitive` adds `mode: 'insensitive'` on
Postgres). If you add a new search field, use `containsInsensitive()` rather
than a raw `{ contains: … }` so it stays consistent across providers.

---

## Uploaded images disappear on Vercel

Vercel's filesystem is ephemeral. Set `BLOB_READ_WRITE_TOKEN` (a Vercel Blob
store) so `lib/storage` switches to the Blob driver automatically. Property
images already stored on disk must be re-uploaded or migrated to Blob.

---

## Too many connections / `remaining connection slots are reserved`

Serverless functions open many connections. Use Neon's **pooled** connection for
`DATABASE_URL`. The app already reuses a single Prisma Client per instance
(`lib/db/client.ts`).

---

## Preview deployments touching production data

Use a **separate Neon branch/database** for the Vercel **Preview** environment's
`DATABASE_URL`. Never point Production and Preview at the same live database.

---

## Login/session issues

- `AUTH_SECRET` must be identical across environments that should share sessions
  and must be a strong value in production.
- Session cookies are `httpOnly`, `secure` in production, and set on path `/`.
- The `/admin` route is guarded by `middleware.ts` (JWT verify) **and** by
  server-side role checks in the API routes — both must pass.
