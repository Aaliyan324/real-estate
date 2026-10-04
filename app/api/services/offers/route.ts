import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceOfferRepository, serviceProviderRepository, serviceRequestRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = await serviceProviderRepository.findByUserId(user.id)
    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 403 })
    }
    if (provider.verificationStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'Your account is not approved yet.' }, { status: 403 })
    }
    if (provider.isBlocked) {
      return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 })
    }

    const body = await request.json()
    const { requestId, proposedPrice, estimatedDuration, message } = body

    if (!requestId || !proposedPrice || !estimatedDuration) {
      return NextResponse.json(
        { error: 'requestId, proposedPrice and estimatedDuration are required.' },
        { status: 400 }
      )
    }

    if (proposedPrice <= 0) {
      return NextResponse.json({ error: 'Price must be greater than zero.' }, { status: 400 })
    }

    // Check the request exists and is open
    const serviceRequest = await serviceRequestRepository.findById(requestId)
    if (!serviceRequest) {
      return NextResponse.json({ error: 'Service request not found.' }, { status: 404 })
    }
    if (!['OPEN', 'OFFER_RECEIVED'].includes(serviceRequest.status)) {
      return NextResponse.json({ error: 'This request is no longer accepting offers.' }, { status: 400 })
    }

    // Check provider hasn't already submitted an offer for this request
    const existingOffer = await prisma.serviceOffer.findFirst({
      where: { requestId, providerId: provider.id },
    })
    if (existingOffer) {
      return NextResponse.json(
        { error: 'You have already submitted an offer for this request.' },
        { status: 409 }
      )
    }

    // Category matching check (if provider configured categories)
    if (provider.categories.length > 0) {
      const servesCategory = provider.categories.some(
        (c) => c.categoryId === serviceRequest.categoryId
      )
      if (!servesCategory) {
        return NextResponse.json(
          { error: 'You are not eligible to offer on this request (category mismatch).' },
          { status: 403 }
        )
      }
    }

    const offer = await serviceOfferRepository.create({
      request: { connect: { id: requestId } },
      provider: { connect: { id: provider.id } },
      proposedPrice: parseFloat(proposedPrice),
      estimatedCompletionTime: estimatedDuration.trim(), // schema field name
      message: message ? message.trim() : '',
      status: 'PENDING',
    })

    // Update request status to OFFER_RECEIVED if it's still OPEN
    if (serviceRequest.status === 'OPEN') {
      await serviceRequestRepository.updateStatus(requestId, 'OFFER_RECEIVED')
    }

    return NextResponse.json({ success: true, offer: { id: offer.id } })
  } catch (error) {
    console.error('Error submitting offer:', error)
    return NextResponse.json({ error: 'Failed to submit offer.' }, { status: 500 })
  }
}
