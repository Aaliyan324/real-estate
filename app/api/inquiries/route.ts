import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const where: any = {}
    if (session.role === 'AGENT' && session.agentId) {
      where.agentId = session.agentId
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: { id: true, title: true, slug: true, price: true, city: true },
        },
        agent: {
          select: { id: true, name: true, agency: true },
        },
      },
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Fetch inquiries error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { propertyId, agentId, name, email, phone, message } = await request.json()

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Name, email, phone, and message are required' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId: propertyId || null,
        agentId: agentId || null,
        name,
        email,
        phone,
        message,
        status: 'NEW',
      },
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Create inquiry error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
