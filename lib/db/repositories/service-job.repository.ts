import { Prisma, ServiceRequestStatus } from '@prisma/client'
import { prisma } from '../client'

export const serviceJobRepository = {
  findById(id: string) {
    return prisma.serviceJob.findUnique({
      where: { id },
      include: {
        request: { include: { category: true, subcategory: true } },
        customer: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        provider: { include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } } } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        fee: true,
        review: true,
      },
    })
  },

  findByRequestId(requestId: string) {
    return prisma.serviceJob.findUnique({
      where: { requestId },
      include: {
        provider: { include: { user: { select: { name: true, phone: true, avatar: true } } } },
        fee: true,
        review: true,
      },
    })
  },

  findByProviderId(providerId: string, status?: ServiceRequestStatus) {
    return prisma.serviceJob.findMany({
      where: {
        providerId,
        ...(status ? { status } : {}),
      },
      include: {
        request: { include: { category: true } },
        customer: { select: { name: true, phone: true } },
        fee: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findByCustomerId(customerId: string) {
    return prisma.serviceJob.findMany({
      where: { customerId },
      include: {
        request: { include: { category: true } },
        provider: { include: { user: { select: { name: true, avatar: true, phone: true } } } },
        fee: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findAllAdmin(filters?: { status?: ServiceRequestStatus; providerId?: string; customerId?: string }) {
    return prisma.serviceJob.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.providerId ? { providerId: filters.providerId } : {}),
        ...(filters?.customerId ? { customerId: filters.customerId } : {}),
      },
      include: {
        request: { include: { category: true } },
        customer: { select: { id: true, name: true, email: true } },
        provider: { include: { user: { select: { id: true, name: true } } } },
        fee: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(data: Prisma.ServiceJobCreateInput) {
    return prisma.serviceJob.create({ data })
  },

  updateStatus(id: string, status: ServiceRequestStatus, note?: string, createdById?: string) {
    const data: Prisma.ServiceJobUpdateInput = {
      status,
      ...(status === 'IN_PROGRESS' ? { startedAt: new Date() } : {}),
      ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      ...(status === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
    }

    return prisma.$transaction([
      prisma.serviceJob.update({ where: { id }, data }),
      prisma.serviceJobStatusHistory.create({
        data: {
          jobId: id,
          status,
          note,
          createdById,
        },
      }),
    ])
  },
}
