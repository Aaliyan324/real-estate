/**
 * Backwards-compatible re-export.
 *
 * The canonical Prisma singleton now lives in `lib/db/client.ts`. Business
 * logic should prefer the repository layer in `lib/db` over importing the raw
 * client. This shim exists so existing `@/lib/prisma` imports keep resolving.
 */
export { prisma } from './db/client'
