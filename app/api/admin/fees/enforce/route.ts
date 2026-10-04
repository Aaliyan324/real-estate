import { NextResponse } from 'next/server'
import { checkAdminOrEmployeePermission } from '@/lib/adminAuth'
import { prisma } from '@/lib/db/client'

// Admin-only: run overdue fee checks and auto-block providers
export async function POST() {
  try {
    const authCheck = await checkAdminOrEmployeePermission()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const now = new Date()

    // Find all DUE fees where dueDate has passed, mark them OVERDUE
    const overdueResult = await prisma.providerFee.updateMany({
      where: {
        status: 'DUE',
        dueDate: { lt: now },
      },
      data: { status: 'OVERDUE' },
    })

    // Find providers with 2+ overdue fees and block them
    const overdueGroups = await prisma.providerFee.groupBy({
      by: ['providerId'],
      where: { status: 'OVERDUE' },
      _count: { id: true },
    })

    const providerIdsToBlock = overdueGroups
      .filter((g) => g._count.id >= 2)
      .map((g) => g.providerId)

    let blockedCount = 0
    if (providerIdsToBlock.length > 0) {
      const blockResult = await prisma.serviceProviderProfile.updateMany({
        where: {
          id: { in: providerIdsToBlock },
          isBlocked: false,
        },
        data: { isBlocked: true },
      })
      blockedCount = blockResult.count
    }

    return NextResponse.json({
      success: true,
      markedOverdue: overdueResult.count,
      blocked: blockedCount,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Error running fee enforcement:', error)
    return NextResponse.json({ error: 'Fee enforcement failed' }, { status: 500 })
  }
}
