import { PropertyStatus, Prisma } from '@prisma/client'
import { prisma } from '../client'
import { containsInsensitive } from '../provider'

const withPropertyCount = {
  _count: { select: { properties: true } },
} satisfies Prisma.AgentInclude

export const agentRepository = {
  /** Public agents directory, verified first. */
  listWithCount() {
    return prisma.agent.findMany({
      orderBy: { isVerified: 'desc' },
      include: withPropertyCount,
    })
  },

  /** Agent search (API shape). */
  search(query?: string | null) {
    const where: Prisma.AgentWhereInput = {}
    if (query) {
      where.OR = [
        { name: containsInsensitive(query) },
        { agency: containsInsensitive(query) },
      ]
    }
    return prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: withPropertyCount,
    })
  },

  getBySlugForMeta(slug: string) {
    return prisma.agent.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
  },

  /** Profile page: agent + published listings with images. */
  getBySlugWithProperties(slug: string) {
    return prisma.agent.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        properties: {
          where: { status: PropertyStatus.PUBLISHED },
          include: { images: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  findBySlug(slug: string) {
    return prisma.agent.findUnique({ where: { slug } })
  },

  create(data: Prisma.AgentUncheckedCreateInput) {
    return prisma.agent.create({ data })
  },

  listForSitemap() {
    return prisma.agent.findMany({ select: { slug: true, updatedAt: true } })
  },
}
