import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceRequestRepository, serviceProviderRepository } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Must be a provider
    const provider = await serviceProviderRepository.findByUserId(user.id)
    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 403 })
    }

    if (provider.verificationStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Your account is pending approval. You will be notified when approved.' },
        { status: 403 }
      )
    }

    if (provider.isBlocked) {
      return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 })
    }

    // Get provider's served categories
    const categoryIds = provider.categories.map((c) => c.categoryId)

    // Location restriction removed as per requirements — all open requests visible to approved providers
    const requests = await serviceRequestRepository.findEligibleForProvider(
      provider.id,
      categoryIds
    )

    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error('Error loading marketplace:', error)
    return NextResponse.json({ error: 'Failed to load marketplace' }, { status: 500 })
  }
}

