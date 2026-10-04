import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceJobRepository } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get provider profile
    const { prisma } = await import('@/lib/db/client')
    const provider = await prisma.serviceProviderProfile.findUnique({
      where: { userId: user.id },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 403 })
    }

    const jobs = await serviceJobRepository.findByProviderId(provider.id)
    return NextResponse.json({ success: true, jobs })
  } catch (error) {
    console.error('Error fetching provider jobs:', error)
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 })
  }
}
