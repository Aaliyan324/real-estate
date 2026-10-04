import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceRequestRepository } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const serviceRequest = await serviceRequestRepository.findById(id)

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Ownership check — customers see their own; admins/employees/providers can read all
    if (
      serviceRequest.customerId !== user.id &&
      user.role !== 'ADMIN' &&
      user.role !== 'EMPLOYEE' &&
      user.role !== 'SERVICE_PROVIDER'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, request: serviceRequest })
  } catch (error) {
    console.error('Error fetching service request:', error)
    return NextResponse.json({ error: 'Failed to load request' }, { status: 500 })
  }
}
