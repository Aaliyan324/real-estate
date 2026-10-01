import { Prisma } from '@prisma/client'

/**
 * Database provider detection.
 *
 * The Prisma *schema* provider is fixed at build/generate time (see
 * `prisma/schema.prisma` for MySQL/MariaDB and `prisma/schema.postgresql.prisma`
 * for PostgreSQL/Neon). We must never try to switch that provider at runtime.
 *
 * What we CAN do at runtime is adapt individual query options that behave
 * differently between connectors. The most important one for this app is
 * case-insensitive `contains` search: MySQL is case-insensitive by default,
 * while PostgreSQL `contains` is case-sensitive unless `mode: 'insensitive'`
 * is supplied. These helpers read the DATABASE_URL scheme so the correct
 * option is applied for whichever client was generated for the target.
 */
export type DbProvider = 'mysql' | 'postgresql'

export function getDbProvider(): DbProvider {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgresql'
  }
  return 'mysql'
}

export function isPostgres(): boolean {
  return getDbProvider() === 'postgresql'
}

/**
 * Build a Prisma string filter for a case-insensitive substring match that
 * behaves identically on MySQL/MariaDB and PostgreSQL/Neon.
 *
 * On PostgreSQL we add `mode: 'insensitive'`; on MySQL the default collation
 * already matches case-insensitively, and `mode` is not a supported argument,
 * so it is intentionally omitted.
 */
export function containsInsensitive(value: string): Prisma.StringFilter {
  if (isPostgres()) {
    // Cast through unknown: the MySQL-generated client's StringFilter type does
    // not declare `mode`, but the value is only ever emitted on PostgreSQL.
    return { contains: value, mode: 'insensitive' } as unknown as Prisma.StringFilter
  }
  return { contains: value }
}
