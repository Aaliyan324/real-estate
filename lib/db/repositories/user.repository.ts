import { Prisma } from '@prisma/client'
import { prisma } from '../client'

const withAgentId = {
  agent: { select: { id: true } },
} satisfies Prisma.UserInclude

export const userRepository = {
  /** Login: full user + agent id. Password is selected by default. */
  findByEmailWithAgent(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: withAgentId,
    })
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  /** Session refresh: safe subset (no password). */
  findSessionUser(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        agent: { select: { id: true } },
      },
    })
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({ data })
  },
}
