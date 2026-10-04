import { Prisma, ServiceOfferStatus } from '@prisma/client'
import { prisma } from '../client'

export const serviceOfferRepository = {
  findById(id: string) {
    return prisma.serviceOffer.findUnique({
      where: { id },
      include: {
        request: { include: { customer: selectCustomer } },
        provider: { include: { user: selectUser } },
      },
    })
  },

  findByRequestId(requestId: string) {
    return prisma.serviceOffer.findMany({
      where: { requestId },
      include: {
        provider: {
          include: {
            user: { select: { id: true, name: true, avatar: true, phone: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findByProviderId(providerId: string) {
    return prisma.serviceOffer.findMany({
      where: { providerId },
      include: {
        request: {
          include: {
            customer: { select: { name: true, avatar: true } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(data: Prisma.ServiceOfferCreateInput) {
    return prisma.serviceOffer.create({ data })
  },

  updateStatus(id: string, status: ServiceOfferStatus) {
    return prisma.serviceOffer.update({
      where: { id },
      data: { status },
    })
  },
}

const selectCustomer = {
  select: { id: true, name: true, email: true, phone: true, avatar: true },
}

const selectUser = {
  select: { id: true, name: true, email: true, phone: true, avatar: true },
}
