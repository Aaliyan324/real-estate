import { NextResponse } from 'next/server'
import { appointmentRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const visits = await appointmentRepository.listForSession({
      agentId: session.role === 'AGENT' ? session.agentId : null,
      userId: session.id,
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

    const visit = await appointmentRepository.create({
      propertyId,
      userId: session?.id || null,
      name,
      email,
      phone,
      preferredDate: new Date(preferredDate),
      preferredTime: preferredTime || '10:00 AM',
      message: message || null,
    })

    return NextResponse.json({ success: true, visit })
  } catch (error) {
    console.error('Schedule visit error:', error)
    return NextResponse.json({ error: 'Failed to schedule visit' }, { status: 500 })
  }
}
