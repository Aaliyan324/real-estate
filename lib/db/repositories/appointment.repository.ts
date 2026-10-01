import { VisitStatus, Prisma } from '@prisma/client'
import { prisma } from '../client'

const listInclude = {
  property: { select: { id: true, title: true, slug: true, city: true, address: true } },
} satisfies Prisma.PropertyVisitInclude

export const appointmentRepository = {
  /**
   * Admin sees all visits; an agent sees visits for properties they own or
   * are assigned to.
   */
  listForSession(opts: { agentId?: string | null; userId: string }) {
    const where: Prisma.PropertyVisitWhereInput = {}
    if (opts.agentId) {
      where.property = {
        OR: [{ agentId: opts.agentId }, { userId: opts.userId }],
      }
    }
    return prisma.propertyVisit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: listInclude,
    })
  },

  findByIdWithProperty(id: string) {
    return prisma.propertyVisit.findUnique({
      where: { id },
      include: { property: { select: { agentId: true, userId: true } } },
    })
  },

  create(data: {
    propertyId: string
    userId?: string | null
    name: string
    email: string
    phone: string
    preferredDate: Date
    preferredTime: string
    message?: string | null
  }) {
    return prisma.propertyVisit.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId ?? null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        message: data.message ?? null,
        status: VisitStatus.PENDING,
      },
    })
  },

  updateStatus(id: string, status: VisitStatus) {
    return prisma.propertyVisit.update({ where: { id }, data: { status } })
  },
}
