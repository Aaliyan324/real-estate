import { NextResponse } from 'next/server'
import { checkAdminOrEmployeePermission } from '@/lib/adminAuth'
import { serviceProviderRepository, notificationRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'
import { ProviderVerificationStatus } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const auth = await checkAdminOrEmployeePermission('MANAGE_PROVIDERS')
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ProviderVerificationStatus | null
    const search = searchParams.get('search') || undefined

    const providers = await serviceProviderRepository.findAll({
      status: status || undefined,
      search,
    })

    const pendingCount = await prisma.serviceProviderProfile.count({
      where: { verificationStatus: 'PENDING' },
    })

    return NextResponse.json({ success: true, providers, pendingCount })
  } catch (error) {
    console.error('Admin error fetching providers:', error)
    return NextResponse.json({ error: 'Failed to load service providers' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await checkAdminOrEmployeePermission('MANAGE_PROVIDERS')
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { providerId, verificationStatus, verificationNotes, isBlocked } = body

    if (!providerId) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
    }

    const provider = await serviceProviderRepository.findById(providerId)
    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
    }

    if (verificationStatus) {
      await serviceProviderRepository.updateStatus(
        providerId,
        verificationStatus as ProviderVerificationStatus,
        verificationNotes
      )

      // Notify provider of verification status update
      await notificationRepository.create(
        provider.userId,
        `Provider Status Update: ${verificationStatus}`,
        `Your service provider account status is now ${verificationStatus}. ${verificationNotes ? `Notes: ${verificationNotes}` : ''}`,
        'PROVIDER_VERIFICATION',
        '/provider/dashboard'
      )
    }

    if (isBlocked !== undefined) {
      await serviceProviderRepository.updateBlockStatus(providerId, Boolean(isBlocked))

      await notificationRepository.create(
        provider.userId,
        isBlocked ? 'Account Access Restricted' : 'Account Access Restored',
        isBlocked
          ? 'Your provider account has been restricted by platform administration.'
          : 'Your provider account access has been restored.',
        'PROVIDER_VERIFICATION',
        '/provider/dashboard'
      )
    }

    const updated = await serviceProviderRepository.findById(providerId)

    return NextResponse.json({ success: true, provider: updated })
  } catch (error) {
    console.error('Admin error updating provider:', error)
    return NextResponse.json({ error: 'Failed to update provider status' }, { status: 500 })
  }
}
