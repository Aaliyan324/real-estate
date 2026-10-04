import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = await prisma.serviceProviderProfile.findUnique({
      where: { userId: user.id },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 403 })
    }

    const offers = await prisma.serviceOffer.findMany({
      where: { providerId: provider.id },
      include: {
        request: {
          include: {
            customer: { select: { name: true, avatar: true } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, offers })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 })
  }
}
