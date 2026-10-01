import { InquiryStatus, Prisma } from '@prisma/client'
import { prisma } from '../client'

const listInclude = {
  property: { select: { id: true, title: true, slug: true, price: true, city: true } },
  agent: { select: { id: true, name: true, agency: true } },
} satisfies Prisma.InquiryInclude

export const inquiryRepository = {
  /** Admin sees all; an agent sees only inquiries routed to them. */
  listForSession(opts: { agentId?: string | null }) {
    const where: Prisma.InquiryWhereInput = {}
    if (opts.agentId) where.agentId = opts.agentId
    return prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: listInclude,
    })
  },

  findById(id: string) {
    return prisma.inquiry.findUnique({ where: { id } })
  },

  create(data: {
    propertyId?: string | null
    agentId?: string | null
    name: string
    email: string
    phone: string
    message: string
  }) {
    return prisma.inquiry.create({
      data: {
        propertyId: data.propertyId || null,
        agentId: data.agentId || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: InquiryStatus.NEW,
      },
    })
  },

  updateStatus(id: string, status: InquiryStatus) {
    return prisma.inquiry.update({ where: { id }, data: { status } })
  },
}
