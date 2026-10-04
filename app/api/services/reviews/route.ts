import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db/client'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, rating, comment } = body

    if (!jobId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'jobId and a rating between 1–5 are required.' },
        { status: 400 }
      )
    }

    // Load job and verify ownership
    const job = await prisma.serviceJob.findUnique({
      where: { id: jobId },
      include: { review: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
    }

    if (job.customerId !== user.id) {
      return NextResponse.json({ error: 'Only the customer can leave a review.' }, { status: 403 })
    }

    if (job.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Job must be completed before leaving a review.' }, { status: 400 })
    }

    if (job.review) {
      return NextResponse.json({ error: 'You have already reviewed this job.' }, { status: 409 })
    }

    // Create the review — requestId is required in schema
    const review = await prisma.providerReview.create({
      data: {
        provider: { connect: { id: job.providerId } },
        customer: { connect: { id: user.id } },
        job: { connect: { id: jobId } },
        request: { connect: { id: job.requestId } },
        rating,
        comment: comment ? comment.trim() : null,
      },
    })

    // Recalculate provider's average rating
    const ratingStats = await prisma.providerReview.aggregate({
      where: { providerId: job.providerId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await prisma.serviceProviderProfile.update({
      where: { id: job.providerId },
      data: {
        rating: ratingStats._avg.rating ?? 0,
        reviewCount: ratingStats._count.rating,
      },
    })

    return NextResponse.json({ success: true, review: { id: review.id } })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 })
  }
}
