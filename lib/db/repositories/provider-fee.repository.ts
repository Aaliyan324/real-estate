import { FeeStatus, Prisma } from '@prisma/client'
import { prisma } from '../client'

export const providerFeeRepository = {
  getFeeConfig() {
    return prisma.platformFeeConfig.findUnique({
      where: { id: 'default' },
    })
  },

  upsertFeeConfig(data: Prisma.PlatformFeeConfigCreateInput) {
    return prisma.platformFeeConfig.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    })
  },

  findByProviderId(providerId: string) {
    return prisma.providerFee.findMany({
      where: { providerId },
      include: {
        job: { include: { request: { select: { title: true, category: { select: { name: true } } } } } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findOverdueForProvider(providerId: string) {
    const now = new Date()
    return prisma.providerFee.findMany({
      where: {
        providerId,
        status: { in: ['DUE', 'OVERDUE'] },
        dueDate: { lt: now },
      },
    })
  },

  findAllAdmin(filters?: { status?: FeeStatus; providerId?: string }) {
    return prisma.providerFee.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.providerId ? { providerId: filters.providerId } : {}),
      },
      include: {
        provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
        customer: { select: { name: true } },
        job: { select: { jobNumber: true, agreedPrice: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  createFee(data: Prisma.ProviderFeeCreateInput) {
    return prisma.providerFee.create({ data })
  },

  updateStatus(id: string, status: FeeStatus, paymentReference?: string, notes?: string) {
    return prisma.providerFee.update({
      where: { id },
      data: {
        status,
        ...(status === 'PAID' ? { paidDate: new Date() } : {}),
        ...(paymentReference ? { paymentReference } : {}),
        ...(notes ? { notes } : {}),
      },
    })
  },

  recordPayment(data: { feeId: string; providerId: string; amount: number; paymentReference?: string; paymentMethod?: string; notes?: string; verifiedById?: string }) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.providerFeePayment.create({
        data: {
          feeId: data.feeId,
          providerId: data.providerId,
          amount: data.amount,
          paymentReference: data.paymentReference,
          paymentMethod: data.paymentMethod || 'BANK_TRANSFER',
          notes: data.notes,
          verifiedById: data.verifiedById,
          verifiedAt: data.verifiedById ? new Date() : null,
        },
      })

      const fee = await tx.providerFee.findUnique({
        where: { id: data.feeId },
        include: { payments: true },
      })

      if (fee) {
        const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0)
        if (totalPaid >= fee.platformFee) {
          await tx.providerFee.update({
            where: { id: fee.id },
            data: { status: 'PAID', paidDate: new Date() },
          })

          await tx.serviceProviderProfile.update({
            where: { id: fee.providerId },
            data: {
              feesPaid: { increment: fee.platformFee },
              feesOwed: { decrement: fee.platformFee },
            },
          })
        }
      }

      return payment
    })
  },
}
