import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceRequestRepository, serviceProviderRepository } from '@/lib/db'

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

    // Authorization checks:
    // 1. Customer who created the request, or Admin/Employee
    const isOwner = serviceRequest.customerId === user.id
    const isAdminOrEmployee = user.role === 'ADMIN' || user.role === 'EMPLOYEE'

    if (isOwner || isAdminOrEmployee) {
      return NextResponse.json({ success: true, request: serviceRequest })
    }

    // 2. Service Provider checking eligible open requests
    if (user.role === 'SERVICE_PROVIDER') {
      const provider = await serviceProviderRepository.findByUserId(user.id)
      if (
        provider &&
        provider.verificationStatus === 'APPROVED' &&
        !provider.isBlocked
      ) {
        return NextResponse.json({ success: true, request: serviceRequest })
      }
      return NextResponse.json({ error: 'Forbidden: Provider account not approved or suspended.' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Forbidden: Access denied to this service request.' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching service request:', error)
    return NextResponse.json({ error: 'Failed to load request' }, { status: 500 })
  }
}
