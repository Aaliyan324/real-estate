import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceOfferRepository, serviceRequestRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'

const PLATFORM_FEE_PERCENT = 10 // 10% default
const DEFAULT_DUE_DAYS = 7

function generateJobNumber() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `JOB-${ts}-${rand}`
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: offerId } = await params

    // Load the offer with its request
    const offer = await serviceOfferRepository.findById(offerId)
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // The customer who owns the request must accept
    if (offer.request.customerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden — only the request owner can accept offers.' }, { status: 403 })
    }

    // Request must be in an acceptable state
    if (!['OPEN', 'OFFER_RECEIVED'].includes(offer.request.status)) {
      return NextResponse.json({ error: 'This request is no longer accepting offers.' }, { status: 400 })
    }

    if (offer.status !== 'PENDING') {
      return NextResponse.json({ error: 'This offer is no longer available.' }, { status: 400 })
    }

    // Get platform fee config
    const feeConfig = await prisma.platformFeeConfig.findUnique({ where: { id: 'default' } })
    const feePercent = feeConfig?.percentage ?? PLATFORM_FEE_PERCENT
    const platformFee = Math.round((offer.proposedPrice * feePercent) / 100)
    const netProviderAmount = offer.proposedPrice - platformFee

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + (feeConfig?.overdueDays ?? DEFAULT_DUE_DAYS))

    const jobNumber = generateJobNumber()

    await prisma.$transaction(async (tx) => {
      // Create the job
      const job = await tx.serviceJob.create({
        data: {
          jobNumber,
          request: { connect: { id: offer.requestId } },
          customer: { connect: { id: offer.request.customerId } },
          provider: { connect: { id: offer.providerId } },
          offer: { connect: { id: offerId } },
          agreedPrice: offer.proposedPrice,
          status: 'ACCEPTED',
          statusHistory: {
            create: {
              status: 'ACCEPTED',
              note: `Customer accepted offer from provider. Agreed price: Rs ${offer.proposedPrice}`,
              createdById: user.id,
            },
          },
        },
      })

      // Create platform fee record using actual schema fields
      await tx.providerFee.create({
        data: {
          provider: { connect: { id: offer.providerId } },
          customer: { connect: { id: offer.request.customerId } },
          job: { connect: { id: job.id } },
          grossAmount: offer.proposedPrice,
          percentageRate: feePercent,
          fixedRate: 0,
          platformFee,
          netProviderAmount,
          status: 'DUE',
          dueDate,
        },
      })

      // Update provider's fee ledger
      await tx.serviceProviderProfile.update({
        where: { id: offer.providerId },
        data: { feesOwed: { increment: platformFee } },
      })

      // Mark this offer as accepted
      await tx.serviceOffer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' },
      })

      // Reject all other offers for this request
      await tx.serviceOffer.updateMany({
        where: { requestId: offer.requestId, id: { not: offerId } },
        data: { status: 'REJECTED' },
      })

      // Update request status to ACCEPTED
      await tx.serviceRequest.update({
        where: { id: offer.requestId },
        data: { status: 'ACCEPTED', selectedProviderId: offer.providerId },
      })
    })

    return NextResponse.json({ success: true, message: 'Offer accepted. Job created.' })
  } catch (error) {
    console.error('Error accepting offer:', error)
    return NextResponse.json({ error: 'Failed to accept offer.' }, { status: 500 })
  }
}
