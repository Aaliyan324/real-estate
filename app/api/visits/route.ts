import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const visits = await prisma.propertyVisit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: { id: true, title: true, slug: true, city: true, address: true },
        },
      },
    })

    return NextResponse.json({ visits })
  } catch (error) {
    console.error('Fetch visits error:', error)
    return NextResponse.json({ error: 'Failed to fetch visit bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { propertyId, name, email, phone, preferredDate, preferredTime, message } = await request.json()

    if (!propertyId || !name || !email || !phone || !preferredDate) {
      return NextResponse.json({ error: 'Missing required visit scheduling fields' }, { status: 400 })
    }

    const session = await getSession()

    const visit = await prisma.propertyVisit.create({
      data: {
        propertyId,
        userId: session?.id || null,
        name,
        email,
        phone,
        preferredDate: new Date(preferredDate),
        preferredTime: preferredTime || '10:00 AM',
        message: message || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, visit })
  } catch (error) {
    console.error('Schedule visit error:', error)
    return NextResponse.json({ error: 'Failed to schedule visit' }, { status: 500 })
  }
}
