import { NextResponse } from 'next/server'
import { inquiryRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const inquiries = await inquiryRepository.listForSession({
      agentId: session.role === 'AGENT' ? session.agentId : null,
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

    const inquiry = await inquiryRepository.create({
      propertyId: propertyId || null,
      agentId: agentId || null,
      name,
      email,
      phone,
      message,
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Create inquiry error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
