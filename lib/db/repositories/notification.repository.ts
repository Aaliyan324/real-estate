import { prisma } from '../client'

export const notificationRepository = {
  findByUserId(userId: string, take = 30) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
    })
  },

  countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    })
  },

  create(userId: string, title: string, message: string, type: string, link?: string) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    })
  },

  markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  },

  markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  },
}
