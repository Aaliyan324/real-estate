import { NextResponse } from 'next/server'
import { appointmentRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { VisitStatus } from '@prisma/client'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await request.json()

    const existingVisit = await appointmentRepository.findByIdWithProperty(id)

    if (!existingVisit) {
      return NextResponse.json({ error: 'Property visit booking not found' }, { status: 404 })
    }

    if (session.role === 'AGENT') {
      const isAssigned =
        (session.agentId && existingVisit.property.agentId === session.agentId) ||
        existingVisit.property.userId === session.id
      if (!isAssigned) {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this visit' }, { status: 403 })
      }
    }

    const updated = await appointmentRepository.updateStatus(id, status as VisitStatus)

    return NextResponse.json({ success: true, visit: updated })
  } catch (error) {
    console.error('Update visit status error:', error)
    return NextResponse.json({ error: 'Failed to update visit booking status' }, { status: 500 })
  }
}
