/**
 * Database access layer.
 *
 * Application/business logic (route handlers, server components, server
 * actions) should talk to these repositories instead of importing the raw
 * Prisma client. This keeps all provider-specific concerns (currently only
 * case-insensitive search) isolated in one place, so the rest of the app
 * behaves identically on MySQL/MariaDB and PostgreSQL/Neon.
 */
export { prisma } from './client'
export { getDbProvider, isPostgres, containsInsensitive } from './provider'
export type { DbProvider } from './provider'

export { propertyRepository } from './repositories/property.repository'
export type { PropertyListFilters, CreatePropertyInput } from './repositories/property.repository'
export { propertyImageRepository } from './repositories/property-image.repository'
export { propertyFeatureRepository } from './repositories/property-feature.repository'
export { agentRepository } from './repositories/agent.repository'
export { userRepository } from './repositories/user.repository'
export { inquiryRepository } from './repositories/inquiry.repository'
export { appointmentRepository } from './repositories/appointment.repository'
export { favoriteRepository } from './repositories/favorite.repository'
