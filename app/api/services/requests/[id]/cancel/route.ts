import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceRequestRepository } from '@/lib/db'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Only the customer who owns this request can cancel it
    if (serviceRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only open/offer_received requests can be cancelled
    if (!['OPEN', 'OFFER_RECEIVED'].includes(serviceRequest.status)) {
      return NextResponse.json(
        { error: 'Only open requests can be cancelled.' },
        { status: 400 }
      )
    }

    await serviceRequestRepository.updateStatus(id, 'CANCELLED')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling request:', error)
    return NextResponse.json({ error: 'Failed to cancel request' }, { status: 500 })
  }
}
