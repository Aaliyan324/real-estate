import { prisma } from '../client'

/**
 * Favorites repository.
 *
 * The current UI keeps favorites in the browser (localStorage) so guests can
 * save listings without an account. This repository persists server-side
 * favorites for signed-in users and is provided so DB-backed favorites can be
 * enabled without touching the rest of the app. It intentionally mirrors the
 * Favorite model's unique (userId, propertyId) constraint.
 */
export const favoriteRepository = {
  listByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { property: { include: { images: true } } },
    })
  },

  isFavorited(userId: string, propertyId: string) {
    return prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    })
  },

  add(userId: string, propertyId: string) {
    return prisma.favorite.upsert({
      where: { userId_propertyId: { userId, propertyId } },
      update: {},
      create: { userId, propertyId },
    })
  },

  remove(userId: string, propertyId: string) {
    return prisma.favorite
      .delete({ where: { userId_propertyId: { userId, propertyId } } })
      .catch(() => null)
  },
}
