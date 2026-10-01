# Database Architecture

This project runs on **one codebase** that supports two SQL back-ends:

```
Next.js  →  Prisma  →  MySQL / MariaDB   (Hostinger + local dev)   [DEFAULT]
Next.js  →  Prisma  →  PostgreSQL / Neon (Vercel)
```

The application UI and business logic are identical regardless of the database.
All database access goes through a repository layer so no page, component, or
route is coupled to a specific provider.

---

## 1. Why the provider cannot be switched at runtime

Prisma database **providers are a schema / build-time concern**. This is invalid
and intentionally **not** done here:

```prisma
datasource db {
  provider = env("SOME_ENV_VAR")   // ❌ Prisma cannot switch provider at runtime
}
```

Instead we ship two schema files with identical models. Each deployment target
generates the Prisma Client from the schema that matches its `DATABASE_URL`.

| Target                | Schema file                            | Provider     | URL scheme       |
| --------------------- | -------------------------------------- | ------------ | ---------------- |
| Hostinger / local     | `prisma/schema.prisma`                 | `mysql`      | `mysql://`       |
| Vercel / Neon         | `prisma/schema.postgresql.prisma`      | `postgresql` | `postgresql://`  |

> ⚠️ **Current state:** `schema.prisma` (MySQL) is the default. Your local `.env`
> currently points at a **Neon PostgreSQL** database. To develop locally against
> Neon you must (a) keep `DATABASE_URL` as `postgresql://…` **and** (b) generate
> the **PostgreSQL** client:
> ```bash
> npm run prisma:generate:postgres
> ```
> To use the default MySQL target instead, set `DATABASE_URL` to a `mysql://…`
> connection and run `npm run prisma:generate` (or `npm run db:push`).

---

## 2. Layered architecture

```
Client Component
       ↓  fetch / Server Action
Route handler / Server Component (app/api, app/**/page.tsx)
       ↓
Repository (lib/db/repositories/*)     ← business logic talks to these
       ↓
Prisma Client (lib/db/client.ts)       ← singleton, serverless-safe
       ↓
Database (MySQL / PostgreSQL)
```

- **Never** import Prisma into a Client Component.
- Route handlers and server components import from `@/lib/db`, e.g.:
  ```ts
  import { propertyRepository } from '@/lib/db'
  const { properties, pagination } = await propertyRepository.list({ page: 1, limit: 12 })
  ```

### `lib/db`

| File | Purpose |
| ---- | ------- |
| `client.ts` | Singleton `PrismaClient` (safe for Vercel serverless). |
| `provider.ts` | Reads `DATABASE_URL` scheme; exposes `containsInsensitive()`. |
| `repositories/*.repository.ts` | Property, property-image, property-feature, agent, user, inquiry, appointment (visit), favorite. |
| `index.ts` | Barrel export — the only thing app code imports. |

---

## 3. Cross-provider compatibility notes

The models are written to be portable across MySQL and PostgreSQL:

- `@db.Text` → valid on **both** providers.
- `cuid()` ids, `Float`, `Boolean`, `DateTime`, and `enum`s map cleanly to both.
- No raw SQL (`$queryRaw` / `$executeRaw`) is used anywhere.
- The only provider-specific behaviour — **case-insensitive `contains` search** —
  is isolated in `provider.ts`:
  - **MySQL/MariaDB**: `contains` is already case-insensitive; Prisma does **not**
    accept a `mode` argument on MySQL.
  - **PostgreSQL/Neon**: `contains` is case-**sensitive** unless `mode: 'insensitive'`
    is supplied.
  - `containsInsensitive(value)` returns the correct filter for whichever client
    was generated, so search behaves identically on both databases. This is a
    query-option adaptation, **not** a provider switch, and is fully supported.

---

## 4. Commands

```bash
# MySQL / MariaDB (default)
npm run prisma:generate      # generate client from schema.prisma
npm run db:push              # push schema to a MySQL DB (safe, additive)

# PostgreSQL / Neon
npm run prisma:generate:postgres
npm run db:push:postgres

# Seed (existing databases — do NOT reseed production)
npm run db:seed
```

---

## 5. Data safety

- This project uses the **`db push`** workflow (there is no `prisma/migrations`
  directory).
- **Never** run `prisma migrate reset`, `DROP DATABASE`, `TRUNCATE`, or reseed a
  populated database.
- Existing data must be migrated between providers with a data copy (for example
  `pg_dump`/restore for Postgres, or an application-level export/import), not by
  resetting a live database.
