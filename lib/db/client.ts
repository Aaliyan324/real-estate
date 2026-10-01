import { PrismaClient } from '@prisma/client'

/**
 * Singleton Prisma Client.
 *
 * Serverless platforms (Vercel) can spin up many short-lived function
 * instances, each of which would otherwise open its own connection pool and
 * exhaust the database connection limit. We therefore:
 *   1. Reuse a single client per warm instance via `globalThis` (helps in dev
 *      and against Next.js hot-reload connection leaks).
 *   2. Rely on a *pooled* DATABASE_URL (Neon's `-pooler` host) for serverless
 *      traffic so connections are multiplexed. See .env.example / DATABASE.md.
 *
 * This module is server-only. Never import it from a Client Component.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
