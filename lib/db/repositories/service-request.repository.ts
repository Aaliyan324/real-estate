import { Prisma, ServiceRequestStatus } from '@prisma/client'
import { prisma } from '../client'

export interface RequestListFilters {
  customerId?: string
  categoryId?: string
  city?: string
  status?: ServiceRequestStatus
  search?: string
}

export const serviceRequestRepository = {
  findById(id: string) {
    return prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        category: true,
        subcategory: true,
        attachments: true,
        offers: {
          include: {
            provider: {
              include: {
                user: { select: { name: true, avatar: true, phone: true } },
                reviews: { select: { rating: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        job: {
          include: {
            provider: {
              include: {
                user: { select: { name: true, avatar: true, phone: true } },
              },
            },
            review: true,
          },
        },
      },
    })
  },

  findForCustomer(customerId: string) {
    return prisma.serviceRequest.findMany({
      where: { customerId },
      include: {
        category: true,
        subcategory: true,
        _count: { select: { offers: true } },
        job: { select: { id: true, status: true, agreedPrice: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findEligibleForProvider(providerId: string, categoryIds: string[]) {
    return prisma.serviceRequest.findMany({
      where: {
        status: { in: ['OPEN', 'OFFER_RECEIVED'] },
        ...(categoryIds && categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {}),
      },
      include: {
        customer: { select: { name: true, avatar: true } },
        category: true,
        subcategory: true,
        offers: {
          where: { providerId },
          select: { id: true, proposedPrice: true, status: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findAll(filters?: RequestListFilters) {
    const where: Prisma.ServiceRequestWhereInput = {}

    if (filters?.customerId) where.customerId = filters.customerId
    if (filters?.categoryId) where.categoryId = filters.categoryId
    if (filters?.city) where.city = { contains: filters.city }
    if (filters?.status) where.status = filters.status
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { requestNumber: { contains: filters.search } },
        { address: { contains: filters.search } },
      ]
    }

    return prisma.serviceRequest.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        category: true,
        subcategory: true,
        _count: { select: { offers: true } },
        job: { select: { id: true, status: true, agreedPrice: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(data: Prisma.ServiceRequestCreateInput) {
    return prisma.serviceRequest.create({ data })
  },

  updateStatus(id: string, status: ServiceRequestStatus, selectedProviderId?: string) {
    return prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        ...(selectedProviderId ? { selectedProviderId } : {}),
      },
    })
  },
}
