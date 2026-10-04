import { NextResponse } from 'next/server'
import { serviceJobRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'
import { checkAdminOrEmployeePermission } from '@/lib/adminAuth'

export async function GET(request: Request) {
  try {
    const authCheck = await checkAdminOrEmployeePermission('VIEW_REPORTS')
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const providerId = searchParams.get('providerId') || undefined
    const customerId = searchParams.get('customerId') || undefined

    const jobs = await serviceJobRepository.findAllAdmin({ status, providerId, customerId })

    // Get aggregate stats
    const stats = await prisma.serviceJob.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { agreedPrice: true },
    })

    const feeStats = await prisma.providerFee.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { platformFee: true },
    })

    return NextResponse.json({ success: true, jobs, stats, feeStats })
  } catch (error) {
    console.error('Error fetching admin jobs:', error)
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 })
  }
}
